# Removal Inspector — secure PayFast digital delivery

## Current setup status (19 October 2026)
- Private Cloudflare R2 bucket `removal-inspector-private-kits` exists; public access remains disabled.
- D1 database `removal-inspector-delivery` exists (ID: `beb02757-e335-4594-9bf5-4d88f3bf5a44`) and the `payments` table is present.
- Cloudflare Worker `removal-inspector-delivery` has been deployed with D1 and private R2 bindings and the merchant ID secret.
- Six educational ZIPs have been uploaded to private R2 under the product keys listed below. These are initial text-based self-help packs; review them for completeness and accuracy before advertising them as comprehensive legal/document kits.
- The Worker does not yet have a configured email-provider API key or verified sender. PayFast ITN settings and the production `/api/*` route have not been verified end-to-end.
- **Automatic delivery is not live.** Keep the customer-facing page clear that support manually confirms payment and arranges delivery until email credentials, ITN settings, routing and all end-to-end tests are complete.
## What was found in the old delivery flow
The older ITN example skips PayFast signature/ITN validation, defaults unrecognised payments to the R597 bundle, and contains a TODO instead of sending email. The previous browser-storage download flow is not payment verification. Do not deploy `payfast-itn-worker_1.js` or unlock files from `?paid=1`.

## Secure product mapping
| Price | Product | R2 object key | PayFast payment link |
|---:|---|---|---|
| R297 | Starter Kit | `kits/starter.zip` | https://payf.st/nkq21 |
| R347 | Prescribed Debt Kit | `kits/prescribed.zip` | https://payf.st/wruhd |
| R397 | Arrears Correction Educational Kit | `kits/adverse.zip` | https://payf.st/obtch |
| R497 | Debt Review Exit Educational Kit | `kits/complete.zip` | https://payf.st/xcztv |
| R547 | Judgement Review Pathway | `kits/judgment.zip` | https://payf.st/sq6ow |
| R597 | Complete DIY Bundle | `kits/ultimate.zip` | https://payf.st/rwxl4 |

The backend uses the verified gross payment amount as its product key because PayFast payment links may not expose custom fields. Each amount is unique. If prices or payment links change, update `PRODUCT_MAP` and test every product. The Worker rejects unknown amounts; it must never default an unknown payment to the Ultimate Bundle.

## Upload the six ZIPs to private R2
Use the ZIPs generated for this project. Do not place paid product ZIPs in this public GitHub repository.

Install Wrangler and authenticate from a trusted computer, then run these commands from the folder containing the six ZIP files:

```bash
npx wrangler login
npx wrangler r2 object put removal-inspector-private-kits/kits/starter.zip --file ./starter.zip
npx wrangler r2 object put removal-inspector-private-kits/kits/prescribed.zip --file ./prescribed.zip
npx wrangler r2 object put removal-inspector-private-kits/kits/adverse.zip --file ./adverse.zip
npx wrangler r2 object put removal-inspector-private-kits/kits/complete.zip --file ./complete.zip
npx wrangler r2 object put removal-inspector-private-kits/kits/judgment.zip --file ./judgment.zip
npx wrangler r2 object put removal-inspector-private-kits/kits/ultimate.zip --file ./ultimate.zip
```

Confirm the six object keys exist in the Cloudflare dashboard. Do not enable public access.

## Worker bindings and secrets
Copy `wrangler.toml.example` to `wrangler.toml` and set the D1 ID shown above. Required bindings:
- D1 binding: `DB` → `removal-inspector-delivery`
- R2 binding: `KITS_BUCKET` → `removal-inspector-private-kits`

Set secrets only through Wrangler or the Cloudflare dashboard, never in GitHub or website JavaScript:

```bash
npx wrangler secret put PAYFAST_MERCHANT_ID
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put DELIVERY_FROM
npx wrangler secret put DELIVERY_ADMIN_KEY
```

Use a sender identity verified with Resend for `DELIVERY_FROM`, for example `Removal Inspector <support@removalinspector.co.za>`. Use a long random value for `DELIVERY_ADMIN_KEY`. Keep credentials private. The Worker also needs the non-secret vars `PUBLIC_ORIGIN=https://removalinspector.co.za` and `PAYFAST_MODE=live`.

Deploy `payfast-delivery-worker.js` only after the R2 objects and secrets are ready. Configure the production route `removalinspector.co.za/api/*` only after staging tests pass.

## PayFast configuration
In the PayFast merchant/payment-link settings, set the ITN/notify URL to:

`https://removalinspector.co.za/api/payfast-itn`

The merchant ID must match the live account. Configure each payment link's return URL to a neutral confirmation page; a return redirect must never unlock a file. Delivery happens only after PayFast's server-to-server ITN validation, a completed status, recognised amount, and a stored D1 payment record.

## Customer experience and recovery
The email link is valid for 48 hours. The download token is a bearer link: customers should not forward it. If delivery fails, the payment remains recorded. After verifying the customer and PayFast reference, an authorised operator can mint a fresh 48-hour link using the admin-only `POST /api/reissue` endpoint with `Authorization: Bearer <DELIVERY_ADMIN_KEY>` and JSON body `{"pf_payment_id":"..."}`. Never expose this key in browser code. Do not ask customers to send card numbers, passwords, or identity documents over WhatsApp. Refunds should mark a payment revoked when appropriate.

## Mandatory test checklist
Before launch, test:
1. Valid completed payment for each of the six exact amounts.
2. Wrong amount, invalid ITN, pending payment and unknown amount.
3. Duplicate ITN notification does not send duplicate delivery.
4. Missing email, failed email provider, missing R2 object and D1 outage.
5. Expired token, tampered token, refunded/revoked payment and repeated download.
6. A controlled low-risk live purchase after sandbox tests pass.

Do not claim instant delivery is live until all tests pass. A successful return page alone is not evidence of payment.

## Product-content note
The generated kits are educational self-help templates based on the supplied Ultimate Bundle content. Legal references and case-specific grounds must be checked before use; customers should remove any ground that does not apply and seek qualified advice for complex prescription, judgment, debt-review or court issues. No removal or correction is guaranteed.
