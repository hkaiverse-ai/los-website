// Public ASF workspace configuration. These are identifiers, not secrets:
// a single-page application authenticates users with Microsoft Entra External ID
// and never holds a client secret or API key. Do not add keys to this file.

// Sign-in is offered only on these origins. Each maps to the redirect URI
// registered for it on the Entra app "asf-web" (exact match required), and
// each must also be an allowed origin on the API gateway's CORS policy.
// Both are configured for these two as of 14 Nov 2026.
const REDIRECT_URIS = Object.freeze({
  'http://localhost:5173': 'http://localhost:5173', // local development
  'https://leanovaopexsolutions.com': 'https://leanovaopexsolutions.com', // live site
});

const origin = typeof window === 'undefined' ? '' : window.location.origin;

export const ASF_CONFIG = Object.freeze({
  // ASF development gateway (Azure API Management).
  gatewayBaseUrl: 'https://apim-leanova-asf-dev-sin-6a46c.azure-api.net/asf',

  auth: Object.freeze({
    clientId: '5b7d950b-679b-405f-9e67-fdfe2e443161',
    authority: 'https://leanovaasf.ciamlogin.com/dd74dd90-f3cc-466a-b118-231e63c4a4d3',
    knownAuthorities: Object.freeze(['leanovaasf.ciamlogin.com']),
    // The pop-up returns here; it must match a registered redirect URI exactly.
    redirectUri: REDIRECT_URIS[origin] || '',
  }),

  scopes: Object.freeze(['api://25671e0b-b40e-43c5-8c3c-1658d420dfbf/asf.access']),

  allowedOrigins: Object.freeze(Object.keys(REDIRECT_URIS)),
});
