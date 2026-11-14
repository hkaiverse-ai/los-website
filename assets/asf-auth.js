// Microsoft Entra External ID sign-in for the ASF workspace (MSAL Browser 4.30.0).
//
// Popup interaction is used deliberately: the only registered redirect URI is the
// site root, and MSAL 4 completes a popup by reading the response from the
// same-origin popup window, so no script is needed on index.html.
// Tokens are cached in sessionStorage (cleared when the tab closes), never logged,
// and never written to the page.
import { ASF_CONFIG } from './asf-config.js';

const msal = window.msal;
// MSAL refreshes silently when a cached token is within this many seconds of expiry.
const RENEWAL_OFFSET_SECONDS = 300;

let app = null;
let renewalTimer = null;
let renewalListener = () => {};

export class AuthUnavailableError extends Error {}
export class SignInRequiredError extends Error {}

export function isSupportedOrigin() {
  return ASF_CONFIG.allowedOrigins.includes(window.location.origin);
}

export async function initAuth() {
  if (!msal || typeof msal.PublicClientApplication !== 'function') {
    throw new AuthUnavailableError('The Microsoft sign-in library did not load.');
  }
  if (!isSupportedOrigin()) {
    throw new AuthUnavailableError('Sign-in is not configured for this address.');
  }
  app = new msal.PublicClientApplication({
    auth: {
      clientId: ASF_CONFIG.auth.clientId,
      authority: ASF_CONFIG.auth.authority,
      knownAuthorities: [...ASF_CONFIG.auth.knownAuthorities],
      redirectUri: ASF_CONFIG.auth.redirectUri,
      postLogoutRedirectUri: ASF_CONFIG.auth.redirectUri,
    },
    cache: { cacheLocation: msal.BrowserCacheLocation.SessionStorage },
    system: {
      tokenRenewalOffsetSeconds: RENEWAL_OFFSET_SECONDS,
      loggerOptions: {
        piiLoggingEnabled: false,
        logLevel: msal.LogLevel.Warning,
        loggerCallback(level, message, containsPii) {
          if (containsPii) return;
          if (level === msal.LogLevel.Error) console.error(message);
          else if (level === msal.LogLevel.Warning) console.warn(message);
        },
      },
    },
  });
  await app.initialize();
  const [account] = app.getAllAccounts();
  if (account) app.setActiveAccount(account);
  return getAccount();
}

export function getAccount() {
  return app ? app.getActiveAccount() : null;
}

export async function signIn() {
  const result = await app.loginPopup({ scopes: [...ASF_CONFIG.scopes], prompt: 'select_account' });
  app.setActiveAccount(result.account);
  scheduleRenewal(result);
  return result.account;
}

export async function signOut() {
  clearRenewal();
  const account = getAccount();
  await app.logoutPopup({ account, postLogoutRedirectUri: ASF_CONFIG.auth.redirectUri });
  app.setActiveAccount(null);
}

async function acquire({ interactive, forceRefresh = false }) {
  const account = getAccount();
  if (!account) throw new SignInRequiredError('Sign in to continue.');
  const request = { scopes: [...ASF_CONFIG.scopes], account };
  try {
    if (forceRefresh) {
      const result = await app.acquireTokenSilent({ ...request, forceRefresh: true });
      scheduleRenewal(result);
      return result;
    }
    const result = await app.acquireTokenSilent(request);
    scheduleRenewal(result);
    return result;
  } catch (error) {
    if (interactive && error instanceof msal.InteractionRequiredAuthError) {
      const result = await app.acquireTokenPopup(request);
      app.setActiveAccount(result.account);
      scheduleRenewal(result);
      return result;
    }
    throw error;
  }
}

// The API client calls this immediately before each request rather than storing
// the token. Returns the bearer token string only. forceRefresh is used once
// after a 401 in case the gateway rejected a token MSAL still considered valid.
export async function getAccessToken({ interactive = true, forceRefresh = false } = {}) {
  return (await acquire({ interactive, forceRefresh })).accessToken;
}

// Connection check for the interface: proves a token for the ASF scope can be
// obtained without exposing the token itself.
export async function getTokenStatus({ interactive = true } = {}) {
  const result = await acquire({ interactive });
  return { expiresOn: result.expiresOn, scopes: result.scopes, fromCache: result.fromCache };
}

// Keep the session warm: shortly before expiry, renew silently. If Entra needs the
// user again, report it instead of opening an unexpected popup.
export function onRenewal(listener) {
  renewalListener = listener;
}

function scheduleRenewal(result) {
  clearRenewal();
  if (!result || !result.expiresOn) return;
  const due = result.expiresOn.getTime() - (RENEWAL_OFFSET_SECONDS - 60) * 1000 - Date.now();
  renewalTimer = window.setTimeout(async () => {
    try {
      const status = await getTokenStatus({ interactive: false });
      renewalListener({ ok: true, status });
    } catch (error) {
      renewalListener({ ok: false, error });
    }
  }, Math.max(due, 30 * 1000));
}

function clearRenewal() {
  if (renewalTimer) window.clearTimeout(renewalTimer);
  renewalTimer = null;
}

export function isInteractionRequired(error) {
  return Boolean(msal) && error instanceof msal.InteractionRequiredAuthError;
}

// Plain-language messages; error details stay in the console without tokens.
export function describeAuthError(error) {
  const code = error && error.errorCode;
  const messages = {
    popup_window_error: 'The sign-in window was blocked. Allow pop-ups for this site and try again.',
    empty_window_error: 'The sign-in window could not open. Allow pop-ups for this site and try again.',
    user_cancelled: 'Sign-in was cancelled.',
    interaction_in_progress: 'A sign-in window is already open. Finish or close it, then try again.',
    monitor_window_timeout: 'The sign-in window timed out. Try again.',
    no_network_connectivity: 'No network connection. Check your connection and try again.',
  };
  if (code && messages[code]) return messages[code];
  if (error instanceof SignInRequiredError || error instanceof AuthUnavailableError) return error.message;
  if (isInteractionRequired(error)) return 'Your session needs to be confirmed. Sign in again.';
  return 'Microsoft sign-in did not complete. Try again, or contact Leanova if it continues.';
}
