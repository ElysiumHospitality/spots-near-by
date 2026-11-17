# Spots Near By

A React guest guide to 14 attractions around Homestead, Florida. Includes estimated drive times, directions, swipeable photo galleries, and responsive sections.

## Local development

Run npm ci, then npm run dev. Open http://localhost:5174/.

## Google photos and key visibility

The local browser key lives in .env.local, which Git ignores. Never commit it or the generated dist directory. .env.example contains only a placeholder.

Google Maps JavaScript requires a browser API key. Vite embeds VITE_ variables in the generated JavaScript, so neither .env files nor GitHub Actions secrets can hide a key from visitors to a deployed website. Restrict any browser key to the site's exact allowed origins and the required APIs in Google Cloud.

The included GitHub Pages workflow reads the GOOGLE_MAPS_API_KEY repository Actions secret at build time. This keeps the key out of source control, but it remains visible in the deployed browser JavaScript. If the secret is missing or Google rejects access, licensed backup photos remain available. Keeping a Google key truly secret requires a separate backend; GitHub Pages does not run one. Google photo requests currently return PERMISSION_DENIED in local testing.

## GitHub Pages

Under repository Settings > Pages, choose GitHub Actions. Add the restricted browser key under Settings > Secrets and variables > Actions as GOOGLE_MAPS_API_KEY. Allow the actual GitHub Pages origin in the key website restrictions, and allow Maps JavaScript API and Places API (New). Run the Deploy to Pages workflow manually. Relative asset paths support repository subpaths.

## Photos

Backup photo source and license records are in src/photo-credits.json. Some images are illustrative; the expandable credits identify them. Preserve these credits and licenses when reusing images.

## Commands

- npm run dev: local development
- npm run build: production build
- npm run preview: preview production output

Drive times are planning estimates; follow current directions before travel.
