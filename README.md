# AERO / 01 — Cinematic Scroll-Scrub Product Landing Page

A standalone Vite + React + TypeScript experience using React Three Fiber, Drei and GSAP ScrollTrigger.

## Run

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## GLB workflow (non-destructive)

The supplied attachment for this build was `Sneaker_rotating_in_circle_20260923235849.mp4` rather than a `.glb` model. The page therefore ships with a reversible, frame-scrubbed cinematic video fallback and a complete R3F/GLB rendering path.

Place the original model at:

`public/model/sneaker-source.glb`

Then run:

```bash
npm run optimize:model
```

This writes `public/model/sneaker-optimized.glb` and leaves the source file unchanged. The app detects the optimized model automatically on load.

## Experience

Seven reversible scenes: arrival, profile, upper macro, outsole/traction, structure, velocity, and a final 360° presentation. Includes atmospheric lighting, contact shadows, grain, progress HUD, responsive layouts, reduced-motion handling, loading state and media error fallback.


## GitHub Pages deployment (fixed)

This copy is configured for GitHub project pages. Do **not** publish the raw source folder from `main` as a plain static site. Vite/React/TypeScript must be built first.

1. Upload/replace the project files in the repository, including `.github/workflows/deploy.yml`.
2. In GitHub open **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push/commit to `main`. The included workflow installs dependencies, runs `npm run build`, and deploys `dist`.
5. Open the repository **Actions** tab and make sure **Deploy Vite site to GitHub Pages** finishes successfully.

The Vite `base` is `./` and media/model URLs use `import.meta.env.BASE_URL`, so the site works under `https://USERNAME.github.io/REPOSITORY/` without editing the repository name into the source.
