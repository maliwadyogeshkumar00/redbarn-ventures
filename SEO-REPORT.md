# Redbarn Ventures - SEO, AEO and performance report (20 Nov 2026)

All numbers below come from runs on the built site (`npm run build`), served locally with `astro preview`, plus live checks against https://redbarn.ventures. Lighthouse 12.8.2, mobile emulation, simulated throttling. PageSpeed Insights was not run (the changes are not deployed yet).

## H. Measured results

Automated audit (`npm run seo:audit`, 59 routes, 6 noindex):

| | High | Medium | Low |
|---|---|---|---|
| Before | 0 | 0 | 69 |
| After | 0 | 0 | 20 |

Remaining Low items: 19 unsized logo images on the internal, noindexed /brand/ tool pages; 1 article title at 66 characters.

Lighthouse (Performance / Accessibility / Best practices / SEO):

| Page | Before | After |
|---|---|---|
| / | 99 / 93 / 100 / 100 | 99 / 100 / 100 / 100 (LCP 1.7 s, CLS 0.006, TBT 0 ms) |
| /services/seo/ | 99 / 100 / 100 / 100 | 98 / 100 / 100 / 100 |
| /insights/the-trust-stack/ | 99 / 100 / 100 / 100 | 99 / 100 / 100 / 100 |
| /contact/ | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| /about/ | not run | 99 / 100 / 100 / 100 |

Live checks: http to https 301, www to apex 301, /about to /about/ 308, unknown URL returns 404, HSTS present, sitemap.xml and robots.txt return 200. JSON-LD on every page parses; sitemap.xml and rss.xml are valid XML.

## A. Technical SEO completed
- Titles: brand suffix dropped automatically when it would push a title past 65 characters (fixed 19 truncating article titles).
- Meta descriptions trimmed or expanded to 120-160 characters on 7 pages.
- Twitter title/description/image, og:image alt/size, og:locale and article:published_time/section tags added.
- noindex pages now `noindex, follow` and carry no structured data.
- Old-site 301 redirects now point straight at final trailing-slash URLs (removed a 301-then-308 chain).
- Sitemap lastmod now comes from each page's git history instead of one hard-coded date; changefreq/priority removed (Google ignores them).
- RSS feed for Insights at /rss.xml, linked from every page head.
- 24 unused legacy images from the old site removed (kept in git history).

## B. Content SEO
Copy, headings and brand messaging left as written - the pages already have one H1, sequential headings and 500+ words. Only the meta descriptions listed above changed.

## C. AI search readiness
- /llms.txt generated at build from services and articles (optional resource; not a ranking factor).
- Connected schema graph: Organization (#org) and WebSite (#website) referenced by every page's WebPage/AboutPage/ContactPage/CollectionPage node.
- BreadcrumbList on every inner page; articles upgraded from Article to BlogPosting with section, canonical URL and publisher link; Service nodes link to the Organization.

## D. Performance
- Hashed assets in /_astro/ now get one-year immutable caching (the old rule targeted /assets/, which Astro does not use).
- Remaining Lighthouse hint: render-blocking CSS (est. 300-600 ms on throttled mobile). Inlining the 53 KB base stylesheet would add it to every HTML page, so it was left as is.

## E. Accessibility
- Homepage tech/platform marquee: removed prohibited aria-label on a plain div; screen readers now get one sentence per row; scrolling track hidden from assistive tech.
- Marquee text colour changed from #B4B4B4 (2.0:1) to the site's --faint #707070 (4.9:1) to meet WCAG AA.
- Unsized logo image given width/height.

## F. Security
- Added Cross-Origin-Opener-Policy and a 1-year HSTS header in _headers (Cloudflare already sent a 6-month HSTS).
- No API keys or secrets found in frontend code. Search Console and Bing verification tags are public by design.
- GA4 already loads only after consent.

## G. Needs your access or approval
1. Deploy: changes are committed on branch relative-proto, not deployed.
2. Submit https://redbarn.ventures/sitemap.xml in Search Console and Bing Webmaster Tools.
3. Instagram URL is still a placeholder in site.json (not linked anywhere yet).
4. Google Business Profile: not applicable while the site lists no address.

## I. Google Search Console
The google-site-verification meta tag is already on every page. In Search Console: open the redbarn.ventures property (or add a Domain property via a DNS TXT record in Cloudflare), go to Sitemaps, submit `sitemap.xml`, then use URL Inspection on the home page and one article and click Request indexing. Link GA4 (G-QSVG9MT6Q9) under GA4 Admin > Product links > Search Console.

## J. Next priorities for organic growth
1. Put a named author (Yogesh Maliwad) with a short bio on articles - stronger E-E-A-T than an organisation byline.
2. Add real, attributable case studies or outcomes when clients approve them.
3. Earn mentions from industry directories and partners (Clutch, LinkedIn articles, event listings).
4. Watch Search Console queries monthly; expand the articles ranking in positions 8-20.
