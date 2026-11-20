<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="robots" content="noindex"/>
<title>XML sitemap - Redbarn Ventures</title>
<style>
:root{--ink:#0B0B0C;--mute:#5C5C5C;--line:#E7E7E7;--red:#A3101C}
*{box-sizing:border-box}body{margin:0;font:16px/1.5 'Inter Tight',ui-sans-serif,system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif;color:var(--ink);background:#fff}
.w{max-width:1100px;margin:0 auto;padding:48px 16px}
.mark{display:inline-flex;gap:3px;margin-right:10px;vertical-align:middle}.mark i{width:5px;height:18px;background:var(--red);transform:skewX(-16deg);border-radius:1px}
.top{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;border-bottom:1px solid var(--line);padding-bottom:20px}
.brand{font-weight:600;letter-spacing:-.02em;font-size:18px}.brand span{color:var(--mute);font-weight:400}
h1{font-weight:400;font-size:clamp(32px,5vw,52px);letter-spacing:-.04em;line-height:1.05;margin:36px 0 8px}h1 b{font-weight:600}
p{color:var(--mute);margin:0 0 28px;max-width:60ch}
a{color:var(--ink);text-decoration:none}a:hover{color:var(--red)}
.pill{display:inline-flex;align-items:center;height:32px;padding:0 12px;border:1px solid var(--line);border-radius:999px;font-size:13px;color:var(--mute)}
table{width:100%;border-collapse:collapse;font-size:14.5px}
th{text-align:left;font-weight:400;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);padding:10px 12px;border-bottom:1px solid var(--ink)}
td{padding:14px 12px;border-bottom:1px solid var(--line);vertical-align:top}
tr:hover td{background:#FAFAFA}
td.n{color:var(--mute);width:48px;font-variant-numeric:tabular-nums}
td.d{color:var(--mute);white-space:nowrap;font-variant-numeric:tabular-nums}
@media (max-width:640px){.hide{display:none}}
</style></head><body><div class="w">
<div class="top"><a class="brand" href="/"><span class="mark"><i></i><i></i><i></i></span>Redbarn <span>Ventures</span></a><a class="pill" href="/sitemap/">Readable sitemap</a></div>
<h1>XML <b>sitemap.</b></h1>
<p>This file helps search engines find every page. <xsl:value-of select="count(s:urlset/s:url)"/> pages listed.</p>
<table><thead><tr><th>#</th><th>Page</th><th class="hide">Updated</th><th class="hide">Priority</th></tr></thead><tbody>
<xsl:for-each select="s:urlset/s:url"><tr>
<td class="n"><xsl:value-of select="position()"/></td>
<td><a href="{s:loc}"><xsl:value-of select="substring-after(s:loc,'https://redbarn.ventures')"/></a></td>
<td class="d hide"><xsl:value-of select="s:lastmod"/></td>
<td class="d hide"><xsl:value-of select="s:priority"/></td>
</tr></xsl:for-each>
</tbody></table></div></body></html>
</xsl:template></xsl:stylesheet>
