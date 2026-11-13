# Email enquiry fallback verification

## Webmail draft update

At the owner's request, the primary actions now open HTTPS Gmail and Outlook compose links in a new tab, with a separate Microsoft 365 option for work/school accounts. The visitor chooses the sending account, reviews the recipient, subject and body, and clicks Send inside their provider. No website-side send or success claim exists. The default email application is an optional disclosure; Copy enquiry text and the visible recipient remain available.

Real-script checks verify each provider's encoded recipient, subject and multiline body (including special characters), stale-link reset behavior and honest draft-request messaging. Gmail reached its sign-in screen with the compose destination preserved. Signed-out Outlook redirected to Microsoft's Outlook landing page with its deeplink preserved. Authenticated compose rendering and sending were not tested: no mailbox login or Send action was performed. If a provider loses the draft after sign-in, the page explicitly instructs visitors to copy the prepared text into a new message.

The prior native-protocol test limitation below still applies; it was not retried or bypassed.

Reviewed 7 November 2026. The contact page does not have a form-delivery backend. It prepares an email locally for the visitor to review and send.

## Implementation findings

The existing button was an ordinary `mailto:` anchor with a fixed recipient and separately encoded subject/body values. It did not submit an email. A protocol-handler permission alone does not demonstrate that a usable handler is registered on the visitor's device. The page cannot confirm whether an external compose application opened, and it cannot confirm delivery.

The revision preserves native mailto behavior, normalizes message line breaks to CRLF, and adds:

- Copy enquiry text, using the clipboard API with a legacy copy attempt and explicit manual-selection fallback.
- A visible recipient address next to the compose/copy actions.
- Instructions for putting the recipient, subject and body into a new email manually.
- Separate status messages for an open request and copying. Copying is reported as successful only when an API reports success; failure leaves the prepared text selected with manual-copy instructions.
- Prepared/copy/open state is cleared when enquiry input or category changes. No email-sent state is introduced.

## Tests actually performed

1. In-browser preparation with `&`, `+`, `%`, `?`, `#`, accented text, rupee symbol, quotes and a multiline challenge. The generated URL decoded to the exact recipient `info@leanovaopexsolutions.com`, the Digital & AI subject, selected LLM service and intended message values. `%26`, `%2B` and `%0D%0A` encoding was observed; no bare LF remained in the decoded mailto body.
2. The browser copy button was clicked. The clipboard was read back and matched the prepared enquiry text exactly. The status said copied, not sent.
3. Clicking the native email link was attempted. Browser Use rejected the external-protocol navigation under its security policy. No workaround or alternative browser/OS launch was attempted. An external compose window could therefore not be verified in this environment. This must not be reported as a successful compose launch or email delivery.
4. `node scripts/check_enquiry.cjs` exercises the real enquiry script: URI recipient/subject/body and CRLF, clipboard success, denied/missing clipboard, successful legacy copy, failed-copy manual selection and honest open-request status. All pass.
5. Existing nine-page static link/asset/anchor checks, JavaScript syntax and whitespace checks pass. The site remains buildless.
6. The prepared message/copy controls and visible recipient were checked at 1440, 768, 375 and 320px without horizontal overflow. Editing the enquiry hid the stale draft and cleared copy status; an invalid email prevented preparation. No console warnings/errors appeared during these fallback checks.

No email was sent, account accessed, key entered or credential placed in a URL. The reliable route when a mail handler cannot open is copying the text into the visitor's usual email/webmail and sending it manually. This does not replace a verified backend delivery service.
