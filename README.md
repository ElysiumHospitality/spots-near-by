# Spots Near By — Elysium Hospitality

A mobile-friendly Homestead guest guide with 14 attractions, drive estimates, map directions, and swipeable local photo galleries.

## Run locally

Run npm ci, then npm run dev. The local address is http://localhost:5174/.

## Publish to GitHub Pages

Select GitHub Actions under Settings > Pages. The deployment workflow builds and publishes on pushes to main, or can be run manually. Relative paths support repository Pages URLs.

## Photos and privacy

Photos are served with the website. No Google photo API, API key, billing account, or repository secret is needed. Photographer credits and licenses appear in each gallery and in src/photo-credits.json. Some photos are illustrative, as identified in the credits.

Directions links open Google Maps with the property's starting address and the attraction destination when selected. Drive times are estimates; check live directions before travel.

## Commands

- npm run dev: development
- npm run build: production output in dist
- npm run preview: preview production output

Local environment files and generated builds are excluded from Git.
