# SEO for Chivana Real Estate — Overview (For Client)

A short, non-technical overview of what SEO is doing for your site and what you need to know.

---

## What is SEO?

SEO (Search Engine Optimization) helps your website appear in search results (e.g. Google) when people look for things like “viviendas Viso de San Juan” or “casas Madrid Toledo”. The better the SEO, the more likely your site shows up in a good position.

---

## What We Did for Your Site

1. **Search-friendly titles and descriptions**  
   Every important page has a clear title and short description. Search engines use these in the results so users see what the page is about.

2. **Correct links for sharing**  
   When someone shares your site or a project on social media (Facebook, Twitter, LinkedIn, WhatsApp), the right image and text are shown. We set this up for the homepage and for each project and blog post.

3. **Sitemap**  
   A sitemap is a list of all the main pages of your site. We generate it automatically. Search engines use it to discover and index your content. You can see it at: `your-domain.com/sitemap.xml`.

4. **Protection of private areas**  
   Search engines are told not to index the admin and login pages. Only the public pages (projects, blog, contact, etc.) are meant to appear in search.

5. **Structured information (rich results)**  
   We added structured data so search engines understand that Chivana is a real estate agent, what each project is, and what each blog article is. This can help your listings and articles look better in search (e.g. with extra details or images).

6. **One “official” address per page (canonical URL)**  
   Each page has one canonical URL so search engines don’t get confused between different versions of the same page (e.g. with or without `www` or extra parameters).

---

## What You Need to Do

- **Set your real website address in production**  
   Your team or developer must set the variable `NEXT_PUBLIC_SITE_URL` to your real domain (e.g. `https://www.chivana-realestate.com`) in the production environment. This makes sure all links in search and on social networks point to the correct site.

- **Content**  
   Keep project and blog content up to date and relevant. Good, clear text and good-quality images help both users and search engines.

- **Optional: Submit sitemap in Google**  
   In [Google Search Console](https://search.google.com/search-console), you can add your site and submit the sitemap URL: `https://your-domain.com/sitemap.xml`. This helps Google discover your pages faster.

---

## Summary

| Topic | What it means for you |
|-------|------------------------|
| Titles & descriptions | Your pages look clear and professional in search results. |
| Social sharing | Shared links show the right image and text. |
| Sitemap | Search engines can find all your important pages. |
| Private areas | Admin and login are not shown in search. |
| Structured data | Your brand and listings can be shown in a richer way in search. |
| One URL per page | Avoids duplicate or wrong URLs in search. |

If you need more detail, your development team can use the technical document in the same folder (`TECHNICAL.md`).
