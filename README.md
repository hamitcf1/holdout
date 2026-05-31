# 🔥 Holdout — Website

Marketing, support, and legal website for **Holdout** — the habit tracker that turns discipline into a duel. Challenge a friend, check in every day, and whoever breaks the streak first loses.

🌐 Intended domain: **holdout.site**

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Landing page (hero, features, how it works, pricing, download) |
| `support.html` | Support center / FAQ — App Store **Support URL** |
| `privacy.html` | Privacy Policy — App Store requirement |
| `terms.html` | Terms of Service (incl. auto-renewable subscription disclosure) |
| `styles.css` | Design system (colors, typography, components) |
| `app.js` | Bilingual toggle, FAQ accordion, pricing toggle, animations |

## Features

- **Bilingual** 🇬🇧 / 🇹🇷 — language toggle in the nav, preference saved in `localStorage`
- Fully static — no build step, no dependencies
- Responsive, dark "competitive energy" design
- Fonts: Bebas Neue + Plus Jakarta Sans

## Run locally

```bash
python -m http.server 4321
# then open http://localhost:4321/index.html
```

## Deploy (GitHub Pages)

This repo is served via GitHub Pages from the `main` branch (root). Pushing to `main` redeploys automatically.

To attach the custom domain `holdout.site` later:
1. Add a `CNAME` file containing `holdout.site`
2. Configure DNS at your registrar (4× `A` records to GitHub Pages IPs, or a `CNAME` to `hamitcf1.github.io`)
3. Set the custom domain under **Settings → Pages**

## Before App Store submission

Replace placeholders: contact emails (`@holdout.site`), legal entity name and jurisdiction in `privacy.html` / `terms.html`, official App Store / Google Play badges, and real store download links. Have the legal pages reviewed by a professional.

---

Apple and App Store are trademarks of Apple Inc. Google Play is a trademark of Google LLC. Holdout is not affiliated with either.
