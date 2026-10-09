
# SITE TESTING REPORT — Removal Inspector V2 + Instant Download

Date: 2026-01-13
Tested Files: /mnt/data/removal-inspector-github/index.html + download.html

## 1. PayFast Links — Correct Order (Rightful Place Fixed)
- R297 Starter (Kit 1): https://payf.st/alu9y — FOUND 3x (KITS + grid + compare) ✅
- R347 Prescribed (Kit 2): https://payf.st/w2pna — FOUND 3x ✅
- R397 Adverse (Kit 3): https://payf.st/21qvd — FOUND 3x ✅
- R497 Debt Review Exit Edu (Kit 4) MOST POPULAR — https://payf.st/d037g — FOUND 3x ✅ (previously swapped, now fixed)
- R547 Judgement Review Pathway (Kit 5) — https://payf.st/45p36 — FOUND 3x ✅ (previously swapped, now fixed)
- R597 Full Shield Bundle (Kit 6) BEST VALUE — https://payf.st/i1wd9 — FOUND 3x ✅

Total PayFast links: 18 (6 in KITS JS + 6 grid + 6 compare) — PASS

## 2. Buy Buttons — No Dead Links
- Before fix: 12 buttons with href="#delivery" — FAIL
- After fix: 0 buttons with href="#delivery" for Buy — PASS
- All Buy buttons now have target="_blank" + data-kit + onclick localStorage — PASS
- Preview buttons still go to #delivery (intentional) — PASS

## 3. Instant Download Mechanism
- download.html checks ?kit=xxx&paid=1 — YES
- Auto-unlock in localStorage ri_purchases with 48h expiry (48*60*60*1000) — YES
- Auto-download after 1.5s via setTimeout + dynamic <a> click — YES
- Ultimate (R597) unlocks all 6 kits — YES
- Ref unlock fallback (input + button) — YES
- my-downloads.html portal — EXISTS

Test simulation:
- URL: download.html?kit=debt-review&paid=1&ref=PF12345
- Expected: unlock debt-review, show Download RI-DebtReview-R497-Kit.zip, auto-start
- Actual: JS unlockKit('debt-review') → localStorage → expiry set → main-dl href = kits/RI-DebtReview-R497-Kit.zip — PASS

- URL: download.html?kit=ultimate&paid=1
- Expected: unlock all 6 kits
- Actual: unlockKit('ultimate') loops Object.keys(KITS) → all unlocked — PASS

## 4. Product ZIPs — All Present
- kits/RI-Starter-R297-Kit.zip 2568 bytes — OK
- kits/RI-Prescribed-R347-Kit.zip 2548 bytes — OK
- kits/RI-Adverse-R397-Kit.zip 2536 bytes — OK
- kits/RI-DebtReview-R497-Kit.zip 2531 bytes — OK (rightful place)
- kits/RI-Judgment-R547-Kit.zip 2535 bytes — OK (rightful place)
- kits/ULTIMATE_BUNDLE_R597_KIT6.zip 2540 bytes — OK

All ZIPs contain: 00_README, Templates/, Bureau_Contacts/, Tracker/, Disclaimer — PASS

## 5. Checker (Situation Engine)
- situ-card buttons 10 options — PRESENT
- match-panel with confidence bar — PRESENT
- KITS mapping: collections→k2, arrears→k3, judgement→k5 (now R547), debtReview→k4 (now R497), garnishee→k6 — CORRECT
- Bundle upsell when >1 selected — PRESENT
- mrBuy stores ri_pending_kit + opens PayFast — PASS

## 6. Compliance & SEO
- Educational only, Form 19 only from DC/court, Bureaus decide Sec71(5), POPIA mask ID — FOUND
- Title present — YES
- Meta description — YES
- H1 hero-title — YES
- Mobile hamburger + mobileMenu — PRESENT
- Footer: support@, WhatsApp, PayFast Secure — PRESENT

## 7. Known Issues Fixed
- Debt Review and Judgement were swapped — FIXED: R497=d037g Debt Review, R547=45p36 Judgement
- Buy buttons were dead #delivery — FIXED: now PayFast
- No instant download — FIXED: download.html auto-download + 48h localStorage + my-downloads portal

## 8. PayFast Dashboard Setup Required (for instant flow)
For each payf.st link, set:
- return_url: https://removalinspector.co.za/download.html?kit=debt-review&paid=1 (change per kit)
- cancel_url: https://removalinspector.co.za/index.html#kits
- notify_url: Cloudflare Worker from payfast-itn-worker.js (optional for email backup)

## 9. GitHub Pages Deploy
- Files: index.html, download.html, my-downloads.html, assets/logo.jpg, kits/*.zip, payfast-itn-worker.js, README.md, .nojekyll
- Zip: removal-inspector-github-site.zip — READY

## CONCLUSION: PASS — Ready for GitHub upload and live PayFast testing
