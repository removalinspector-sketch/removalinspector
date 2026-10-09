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
