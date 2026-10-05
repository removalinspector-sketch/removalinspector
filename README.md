# Removal Inspector - removalinspector.co.za

Furniture removal inspection & compliance reporting - South Africa.

**Live:** https://removalinspector.co.za

## Deployment
- Host: Cloudflare Pages
- Source: GitHub `main` branch - auto deploys on every commit
- Custom domains: removalinspector.co.za + www (301 to non-www)

## SEO Fixed
- `robots.txt` → allows all, points to sitemap
- `sitemap.xml` → submitted to Google Search Console
- `_redirects` → www to non-www 301
- Files in both `/` and `/public/` for compatibility

## Structure
- index.html - main site
- robots.txt, sitemap.xml, _redirects - SEO
- public/ - duplicate for Pages output

## Update Site
Edit index.html in GitHub → Commit → Live in 30s

Contact: removalinspector@gmail.com
