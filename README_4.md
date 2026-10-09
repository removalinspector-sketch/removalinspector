# Removal Inspector — GitHub Pages Site

Static site, no React, no build step. Ready for GitHub Pages.

## Files
- index.html — main site (checker + kits + FAQ + SEO)
- assets/logo.jpg — logo
- kits/ — delivery pages (optional)

## PayFast Links (in order, fixed swap)
- R297 Starter: https://payf.st/alu9y
- R347 Prescribed: https://payf.st/w2pna
- R397 Adverse: https://payf.st/21qvd
- R497 Debt Review Exit Edu (MOST POPULAR): https://payf.st/d037g
- R547 Judgement Review Pathway: https://payf.st/45p36
- R597 Full Shield Bundle: https://payf.st/i1wd9

## Deploy to GitHub Pages
1. Create new repo: removalinspector (or removalinspector.co.za)
2. Upload all files in this folder to repo root (drag & drop)
3. Go to Settings > Pages
4. Source: Deploy from a branch > main > / (root) > Save
5. Your site will be live at https://YOURUSERNAME.github.io/removalinspector/
6. For custom domain removalinspector.co.za: Settings > Pages > Custom domain > add removalinspector.co.za > add CNAME file (already included if needed) and set DNS A records to GitHub Pages IPs.

## PayFast ITN Setup (smooth download)
In PayFast dashboard for each product:
- return_url: https://removalinspector.co.za/download.html?kit=starter (or prescribed, adverse, debt-review, judgement, ultimate)
- cancel_url: https://removalinspector.co.za/#checker
- notify_url: https://removalinspector.co.za/api/payfast-itn.php (implement email sending)

After payment, customer lands on download page with ZIP:
- RI-Starter-R297-Kit.zip
- RI-Prescribed-R347-Kit.zip
- RI-Adverse-R397-Kit.zip
- RI-DebtReview-R497-Kit.zip
- RI-Judgment-R547-Kit.zip
- ULTIMATE_BUNDLE_R597_KIT6.zip

Link expires 48h, re-send within 7 days via support@removalinspector.co.za

## SEO
- Single H1, proper H2/H3 hierarchy
- Meta title/description optimized for "blacklisted" + compliant wording
- FAQPage, Organization, HowTo, Product JSON-LD included
- Open Graph + canonical
- Mobile-first, fast (Tailwind CDN, no React)


## Instant Download Mechanism — How it Works After Payment

This static site has a full instant download flow that works on GitHub Pages (no server needed) + optional PayFast ITN for email backup.

### Customer Flow
1. Customer clicks BUY on index.html → we store `ri_pending_kit` in localStorage + open PayFast link `https://payf.st/alu9y` etc in new tab
2. PayFast payment → PayFast redirects to `download.html?kit=debt-review&paid=1&ref=PFxxxx` (configure return_url in PayFast dashboard per product)
3. `download.html` on load:
   - Reads `kit` param (starter, prescribed, adverse, debt-review, judgement, ultimate)
   - If `paid=1` present OR `kit` param present, auto-unlocks that kit in localStorage with 48h expiry
   - If kit is `ultimate` (R597), unlocks ALL 6 kits
   - Auto-starts ZIP download after 1.5 seconds
   - Shows portal of all kits: unlocked = Download ZIP, locked = Buy button
4. `my-downloads.html` portal reads localStorage `ri_purchases` and shows all unlocked kits for 48h
5. If customer closed tab before redirect, they can enter PayFast reference on download.html to unlock (matches short code alu9y, w2pna, etc)

### Files
- `index.html` — checker + kits grid with PayFast links + pending storage
- `download.html` — instant download logic, auto-download, 48h expiry, all kits portal
- `my-downloads.html` — portal of purchases from this browser
- `kits/*.zip` — actual product ZIPs (6 files) that download instantly
- `payfast-itn-worker.js` — Cloudflare Worker example for real PayFast ITN verification + emailing download link (for production)

### PayFast Dashboard Setup (do for each of 6 short links)
In PayFast → My Account → Payment Links → Edit each payf.st link:
- return_url: `https://removalinspector.co.za/download.html?kit=debt-review&paid=1` (change kit per product)
  - starter: `...?kit=starter&paid=1`
  - prescribed: `...?kit=prescribed&paid=1`
  - adverse: `...?kit=adverse&paid=1`
  - debt-review: `...?kit=debt-review&paid=1` (R497 d037g MOST POPULAR — rightful place)
  - judgement: `...?kit=judgement&paid=1` (R547 45p36 — rightful place)
  - ultimate: `...?kit=ultimate&paid=1`
- cancel_url: `https://removalinspector.co.za/index.html#kits`
- notify_url: `https://your-worker.workers.dev/payfast-itn` (deploy payfast-itn-worker.js to Cloudflare)

### LocalStorage Keys
- `ri_pending_kit` — kit user clicked before PayFast
- `ri_purchases` — JSON object: { "debt-review": {time, expiry, ref, unlocked:true}, ... }

### Expiry
48 hours from payment. After expiry, customer can re-unlock via reference or contact support@removalinspector.co.za for re-send within 7 days.

### Security Note
For GitHub Pages, client-side unlock is for instant UX. For true verification, deploy the Cloudflare Worker (payfast-itn-worker.js) that verifies ITN signature with PayFast and emails the ZIP link. That way even if localStorage cleared, customer has email backup.
