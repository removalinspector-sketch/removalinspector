# Removal Inspector — Website and Secure Digital Delivery

Production website: https://removalinspector.co.za/

This repository contains the public educational website and the source for a separate Cloudflare Worker intended to deliver paid digital kits after server-verified PayFast payments.

## Customer-facing product catalogue

| Product | Price | PayFast checkout |
|---|---:|---|
| Listing Clarity Starter | R297 | https://payf.st/nkq21 |
| Collections & Prescription Path | R347 | https://payf.st/wruhd |
| Arrears Correction Educational Kit | R397 | https://payf.st/obtch |
| Debt Review Exit Educational Kit | R497 | https://payf.st/xcztv |
| Judgement Review Pathway | R547 | https://payf.st/sq6ow |
| Complete DIY Bundle | R597 | https://payf.st/rwxl4 |

The materials are general educational self-help resources. Removal Inspector is not a law firm or debt counsellor, does not lodge disputes on customers' behalf, and cannot guarantee removal, correction, score improvement, or a particular outcome. Customers must check that a template applies to their facts and follow the relevant official process.

## Payment and delivery status

**Do not treat a PayFast return/thank-you page, a query parameter, browser storage, or a payment reference entered by a customer as proof of payment.** The old localStorage-based download flow is not payment verification and must not be restored.

The secure backend source is `payfast-delivery-worker.js`. It is designed to:
1. validate PayFast server-to-server ITN notifications;
2. require a completed payment from the configured merchant;
3. map only the six recognised gross amounts to a product;
4. record payment IDs in D1 to prevent duplicate fulfilment;
5. create time-limited bearer links for private R2 objects; and
6. email download links using a configured delivery provider.

**Automated delivery is not live until all six kit ZIPs are uploaded to private R2, email sender/API credentials are configured, PayFast ITN settings are saved, the Worker is deployed and routed, and end-to-end tests pass.** Until then, the website must continue to state that delivery is arranged manually after support verifies the payment.

## Cloudflare resources

- Worker: `removal-inspector-delivery`
- D1 database: `removal-inspector-delivery`
- Private R2 bucket: `removal-inspector-private-kits`
- Worker source: `payfast-delivery-worker.js`
- Database schema: `schema.sql`
- Setup runbook: `DIGITAL_DELIVERY_SETUP.md`

Never put API keys, merchant secrets, paid ZIP files, or customer data in this public repository. Keep the R2 bucket private.

## Launch checklist

- [ ] Review the actual contents of all six kits; descriptions must match what is delivered.
- [ ] Upload all six ZIPs to the private R2 keys documented in `DIGITAL_DELIVERY_SETUP.md`.
- [ ] Configure the verified delivery email sender and provider API key as Worker secrets.
- [ ] Configure PayFast ITN/notify URL to `https://removalinspector.co.za/api/payfast-itn`.
- [ ] Set each payment link's return URL to a neutral confirmation/support page; never unlock based on return URL parameters.
- [ ] Deploy and test the Worker, D1 and R2 bindings.
- [ ] Confirm the `/api/*` route does not disrupt the existing Pages website.
- [ ] Test all six valid payments, wrong amounts, invalid notifications, pending payments, duplicate notifications, email failure, missing objects, expired links and revoked/refunded payments.
- [ ] Make a controlled low-value live test before advertising automatic delivery.
- [ ] Update website copy to say “automatic download” only after the above tests pass.

## SEO and customer trust

- Keep the sitemap limited to public pages that load successfully.
- Do not publish paid kits or download tokens in the sitemap.
- Do not add fake reviews, unsupported popularity labels, guaranteed results, or invented response-time promises.
- Use clear product contents, prices, limitations, contact details, refund terms and privacy disclosures.
