# Holdout Website

Marketing, support, and legal website for **Holdout** — the habit tracker that turns discipline into a duel. Challenge a friend, check in every day, and whoever breaks the streak first loses.

Live domain: **holdout.hamitcf.info**

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

- **Bilingual** EN / TR — language toggle in the nav, preference saved in `localStorage`
- Fully static — no build step, no dependencies
- Responsive, dark "competitive energy" design
- Fonts: Bebas Neue + Plus Jakarta Sans

## Run locally

```bash
python -m http.server 4321
# then open http://localhost:4321/index.html
```

## Deploy (GitHub Pages)

Production is served from the separate public `hamitcf1/holdout` repository's `waitlist` branch. Sync this folder to that branch to deploy.

The custom domain is configured through `CNAME` and GitHub Pages settings.

## Before App Store submission

Add official App Store / Google Play links once the listings are approved. Have the legal pages reviewed by a professional before launch.

---

Apple and App Store are trademarks of Apple Inc. Google Play is a trademark of Google LLC. Holdout is not affiliated with either.
