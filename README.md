# Holdout Website

Marketing, support, and legal website for **Holdout** — the proof-based habit arena where rivals can also complete and win together.

Live domain: **holdout.hamitcf.info**

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Waitlist-first landing page with Co-Win rules, current features, and release posture |
| `support.html` | Support center / FAQ — App Store **Support URL** |
| `privacy.html` | Privacy Policy — App Store requirement |
| `terms.html` | Terms of Service (incl. auto-renewable subscription disclosure) |
| `delete-account.html` | Public account-deletion instructions |
| `i/index.html` | Duel invite fallback |
| `referral/index.html` | Referral universal-link fallback |
| `.well-known/apple-app-site-association` | iOS universal-link verification |
| `styles.css` | Design system (colors, typography, components) |
| `app.js` | Bilingual toggle, FAQ accordion, pricing toggle, animations |
| `og-home-20260723.png` | 1200×630 landing-page social preview |
| `og-duel-20260723.png` | 1200×630 duel-invite social preview |
| `og-referral-20260723.png` | 1200×630 referral social preview |

## Features

- **Bilingual** EN / TR — language toggle in the nav, preference saved in `localStorage`
- Fully static — no build step, no dependencies
- Responsive, dark "competitive energy" design
- Fonts: Bebas Neue + Plus Jakarta Sans
- Store badges remain disabled and marked Coming soon until official listings exist

## Verify

```bash
node scripts/verify-site.mjs
```

The verifier checks product claims, EN/TR Co-Win and reward rules, waitlist/store posture, internal links/assets, accessibility hooks, metadata, and invite/referral fallback contracts.

## Run locally

```bash
python -m http.server 4321
# then open http://localhost:4321/index.html
```

## Deploy (GitHub Pages)

Production is served from the separate public `hamitcf1/holdout` repository's `waitlist` branch. Sync this folder to that branch to deploy.

The custom domain is configured through `CNAME` and GitHub Pages settings.

## Sync contract

`holdout-app-original/desktop-website` is the canonical website snapshot kept with the app release. Before deploying the public website, sync that directory into this repository and review the resulting diff:

```bash
rsync -av --exclude .DS_Store ../holdout-app-original/desktop-website/ ./
git diff --check
```

When app features, pricing, legal disclosures, deep links, or social metadata change, update the canonical snapshot and this public repository in the same release.

## Before App Store submission

Add official App Store / Google Play links once the listings are approved. Have the legal pages reviewed by a professional before launch.

---

Apple and App Store are trademarks of Apple Inc. Google Play is a trademark of Google LLC. Holdout is not affiliated with either.
