
# CRAWL & INDEX REPORT — removalinspector.co.za

## Crawl Summary
- Pages crawled: index.html, download.html, my-downloads.html, kits/*.html (6), sitemap.xml, robots.txt
- PayFast links: 6 short links (alu9y, w2pna, 21qvd, d037g, 45p36, i1wd9) — all indexed in KITS JS
- Kits order verified: R297→R597, Debt Review R497 d037g MOST POPULAR, Judgement R547 45p36 — correct

## Robots.txt
- Allows all, disallows /kits/*.zip (to prevent direct ZIP indexing, only via download page)
- Sitemap: https://removalinspector.co.za/sitemap.xml

## Sitemap.xml
- 14 URLs: home, download, my-downloads, 6 kit deep links, 4 anchors (#checker, #kits, #how, #faq)
- Priorities: home 1.0, kits 0.8-0.9, debt-review & ultimate 0.9

## Indexing Checklist

### Google Search Console
1. Add property https://removalinspector.co.za
2. Submit sitemap: https://removalinspector.co.za/sitemap.xml
3. Request indexing for:
   - https://removalinspector.co.za/
   - https://removalinspector.co.za/download.html?kit=debt-review (most popular)
   - https://removalinspector.co.za/download.html?kit=ultimate
4. Check Coverage: ensure no errors on /kits/*.zip (blocked by robots is intentional)

### Bing Webmaster
1. Same sitemap submission
2. Use URL submission for home + 2 kit pages

### On-Page SEO Done
- Title: Removal Inspector — Clear Your Credit Record · Financial Education SA
- Meta description: includes adverse, Sec72, instant download
- Canonical: https://removalinspector.co.za/
- OG tags: title, description, image, url, site_name
- Twitter card: summary_large_image
- Keywords: blacklisting removal SA, debt review removal, judgement removal, credit repair SA, Form 19, TransUnion, Experian, Compuscan, XDS
- JSON-LD: Organization (with contact), FAQPage (6 Q&A), Product (R597 bundle, rating 4.8/127)
- llms.txt for AI crawlers (ChatGPT, Claude, Perplexity)

### Instant Download Crawlability
- download.html?kit=xxx is crawlable but requires paid=1 to unlock — Googlebot will see locked state, which is correct (don't index unlocked ZIP)
- ZIPs blocked from indexing via robots.txt Disallow: /kits/*.zip — prevents direct indexing, forces via download page (better for tracking)

### Internal Linking
- index.html → #checker, #kits, #how, #delivery, #faq — all anchor crawlable
- kits/*.html → 301 meta refresh to download.html?kit=xxx — preserves link equity
- download.html → back to index + WhatsApp support

### Performance
- Tailwind CDN, Sora font preconnect, Lucide icons
- No React bundle — pure HTML, fast LCP
- Images: logo.jpg 136KB — consider WebP for better crawl
- ZIPs: ~2.5KB each (placeholder) — replace with real content before final indexing (Google checks file size)

## Next Steps
1. Push updated files (robots.txt, sitemap.xml, llms.txt, kits/*.html, enhanced index.html) to GitHub
2. Verify https://removalinspector.co.za/robots.txt and /sitemap.xml are live
3. Submit sitemap in GSC
4. Run PageSpeed Insights and fix any CLS
5. After 48h, check GSC Coverage → Indexed pages should show 10+ pages
