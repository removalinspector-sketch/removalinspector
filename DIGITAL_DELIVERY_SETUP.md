# Removal Inspector — Secure digital delivery setup

## What was found
The existing repository's older ITN example explicitly skips PayFast signature/ITN validation, defaults unrecognised payments to the R597 bundle, and contains a TODO instead of sending email. The previous browser-storage download flow is not payment verification. Do not deploy that old worker or unlock files from `?paid=1`.

This replacement requires PayFast server-to-server validation, strict amount mapping, unique payment IDs, a server-side D1 payment record, a 48-hour token stored only as a SHA-256 hash, private ZIP files in R2, and an email containing the one-time-secret download URL. Tokens are bearer links: customers should not forward them.

## Product mapping (confirm payment-link settings before go-live)
- R297 Starter Kit → `kits/starter.zip`
- R347 Prescribed Debt Kit → `kits/prescribed.zip`
- R397 Adverse Information Kit → `kits/adverse.zip`
- R497 Complete Kit → `kits/complete.zip`
- R547 Judgment Kit → `kits/judgment.zip`
- R597 Ultimate Bundle → `kits/ultimate.zip`

The payment amount is the mapping key because PayFast payment links do not always expose custom fields. Each price is unique. Do not change prices without updating the worker and testing each product. If a payment link charges a different amount, it will be rejected rather than accidentally delivering another product.

## Deployment
1. Create a private R2 bucket named `removal-inspector-private-kits`. Do not enable public access or custom public domains.
2. Upload the six real, final customer ZIPs using the exact keys above. **The current GitHub repository does not contain these six ZIPs**, so delivery will return a safe support error until the actual product files are uploaded.
3. Create a D1 database named `removal-inspector-delivery`, then run `schema.sql`.
4. Copy `wrangler.toml.example` to `wrangler.toml`, insert the actual D1 database ID, and install Wrangler.
5. Add secrets with `wrangler secret put PAYFAST_MERCHANT_ID`, `wrangler secret put RESEND_API_KEY`, `wrangler secret put DELIVERY_FROM`, and `wrangler secret put DELIVERY_ADMIN_KEY`. Use a long random value for `DELIVERY_ADMIN_KEY`; never put credentials in GitHub. Use a sender address verified by Resend. Never put credentials in GitHub.
6. Deploy the Worker and test `/api/health`. Add a production route such as `removalinspector.co.za/api/*` only after staging tests pass.
7. In the PayFast merchant/payment-link settings, set the ITN/notify URL to `https://removalinspector.co.za/api/payfast-itn`. Ensure the merchant ID and passphrase match the live PayFast account. Do not change return URLs as a substitute for ITN verification.
8. Configure each PayFast return URL to a neutral confirmation page. It must not unlock a download. The actual download arrives by email only after server-side ITN validation.
9. Test sandbox first: valid payment, wrong amount, invalid ITN, pending payment, duplicate ITN, missing email, missing R2 object, expired token, and token tampering. Then make one controlled low-risk live purchase before promoting the flow.

## Customer experience and recovery
The email link is valid for 48 hours. If delivery fails, the payment remains recorded. After verifying the customer and PayFast reference, an authorised operator can mint a fresh 48-hour link using the admin-only `POST /api/reissue` endpoint with `Authorization: Bearer <DELIVERY_ADMIN_KEY>` and JSON body `{"pf_payment_id":"..."}`. Keep this key secret and call the endpoint only from a trusted admin environment; never expose it in website JavaScript. Do not ask customers to send card numbers, passwords, or ID documents over WhatsApp. Refunds should mark a payment revoked when appropriate.

## Important implementation boundary
This repository change creates the secure backend source and schema; it does not itself create Cloudflare resources, configure PayFast account settings, upload missing customer ZIPs, or deploy production. Those steps require the connected Cloudflare account, PayFast dashboard access, verified sender setup, and the final product files.
