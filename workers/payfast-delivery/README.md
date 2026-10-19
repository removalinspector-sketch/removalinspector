# Secure PayFast download delivery

This Worker does not trust a return URL or browser query string as proof of payment. It asks PayFast to validate the ITN, checks the merchant ID, requires COMPLETE status, maps the exact gross amount to one product, stores a verified purchase, and issues a 48-hour signed download token. Kit files are served from the private R2 bucket binding and must not be placed in the public website directory.

## Required setup
1. Set Worker secrets `PAYFAST_MERCHANT_ID` and `DOWNLOAD_TOKEN_SECRET` (random 32+ byte secret).
2. In each PayFast payment link, configure the ITN/notify URL to `https://ri-payment-delivery.removalinspector.workers.dev/api/payfast-itn`.
3. Configure the return URL to `https://removalinspector.co.za/download.html?kit=<product-id>`. The return URL is only a user experience; it does not verify payment.
4. Upload these ZIPs into the private R2 bucket `removal-inspector` using exactly these object keys:
   - `RI-ListingClarity-R297-Kit.zip`
   - `RI-Collections-R347-Kit.zip`
   - `RI-Arrears-R397-Kit.zip`
   - `RI-DebtReview-R497-Kit.zip`
   - `RI-Judgement-R547-Kit.zip`
   - `RI-FullShield-R597-Bundle.zip`
5. Use `GET /api/payment-status?pf_payment_id=<PayFast payment ID>` after redirect. A verified result includes a short-lived `download_url`.
6. Run test payments (including cancelled, failed, duplicate ITN, wrong amount, and delayed ITN) before enabling production delivery.

## API
- `POST /api/payfast-itn`: PayFast server notification endpoint.
- `GET /api/payment-status?pf_payment_id=...`: returns pending until verified; never unlocks based on `paid=1`.
- `GET /api/download?token=...`: streams the paid ZIP from private R2; token expires after 48 hours.
- `GET /health`: service health.

## Important
- PayFast payment links may need their return and ITN URLs configured in the PayFast dashboard. Do not assume these URLs are configured.
- Price-to-product matching assumes each of the six products has a unique exact price (R297/R347/R397/R497/R547/R597). Keep prices in sync if they change.
- This implementation provides browser-return delivery. Email delivery and a customer purchase-recovery portal are not yet configured.
- The R2 bucket currently needs the six actual ZIP files. Do not store kit files in the public repository or public website directory.
- Never use localStorage, a user-entered reference alone, or a `paid=1` query parameter as proof of payment.
