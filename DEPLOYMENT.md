# Vercel deployment

## Current status

The complete project is available in the public GitHub repository https://github.com/danielwangbnds/gfssm-structure-lab. All 49 uploaded files were fetched and verified against the local Git tree with identical contents. The local main branch tracks origin/main.

Vercel deployment is pending account-owner sign-in. There is no verified public deployment URL yet. Do not treat local build success as online acceptance.

No lesson text, model geometry, or teaching flow was changed for deployment.

## Settings committed in this project

- Framework: Vite (React + TypeScript retained).
- Node.js: 24.x (`package.json` and `.nvmrc`).
- Package manager: pnpm 11.25.0, with the existing lockfile.
- Install command: `npx --yes pnpm@11.25.0 install --frozen-lockfile`.
- Build command: `npx --yes pnpm@11.25.0 run build`.
- Output directory: `dist`.
- No application environment variables are required.
- `vercel.json` specifies the framework, install/build commands, output, and explicit MIME types for WASM, GLB, and TTF.
- `.vercel/` and `.env*` are excluded from Git. No Vercel tokens should be committed.

The explicit versioned npx commands avoid relying on the oldest pnpm version selected by a plain install-command override. Node 24 is supported by Vercel and matches the runtime used for the local build.

## Account and import steps

1. Sign in at https://github.com/login and https://vercel.com/login. Complete any two-factor prompt personally.
2. Use the existing public GitHub repository `danielwangbnds/gfssm-structure-lab`, as requested by the owner. Its `main` branch contains the complete project, with `package.json` and `vercel.json` at the root.
3. In Vercel, select **Add New → Project** (https://vercel.com/new), choose the GitHub account, and import that repository.
4. If prompted to install the Vercel GitHub app, grant access to this repository only. Any authorization or terms that require the account owner must be completed by the user.
5. Keep Root Directory as the repository root. If using an existing parent repository instead, select its `gfssm-structure-lab` folder.
6. Confirm Vite / Node 24 / the checked-in install and build settings / `dist`, then click **Deploy**.
7. Wait for **Ready**. Record the actual production HTTPS domain reported by Vercel; never invent a `.vercel.app` URL.
8. Verify the public production domain without a Vercel login. If a deployment-protection prompt appears, inspect the project's intended audience before changing access settings.

## Verification

Run `pnpm test` and `pnpm build`, then:

```bash
node scripts/verify-deployment.mjs
node scripts/verify-deployment.mjs https://ACTUAL-DEPLOYED-DOMAIN
```

Replace the example with the actual deployment domain; it is not a site URL. The script checks the homepage, actual HTTP responses, WASM MIME type, and SHA-256 equality for the NASA GLB, Draco decoder files, IBM font, credits, notices, and entry scripts/styles. It rejects HTML login or 404 pages masquerading as assets.

Then use the deployed page in a browser to test:

- Introduction Sketch → Extrude.
- Mission 01: seven steps, Length / Width / Height, reset and all camera presets.
- Mission 02: base, support, Cut, Fillet, all sliders.
- Mission 03: solid → blind cavity → hatch; Diameter / Length and section analysis.
- Orbit, pan, zoom; model dimensions, grid and axes toggles.
- Course navigation, progress save/refresh, instructor mode and challenge checklist.
- NASA reference: GLB loads, auto-orbit/reset work, no failed local decoder or font requests.
- Console errors and public access without account authentication.

Record production checks separately from previous localhost checks in `TESTING.md`.

## Automatic updates

Use Vercel's native GitHub integration. Once connected, pushes to the production branch (`main` by default) trigger production builds; pull requests can get preview deployments. Additional lessons only need their data/model changes committed and pushed. No long-lived deployment token is needed in the repository and no duplicate GitHub Actions deploy workflow is required.

Official references:

- https://vercel.com/docs/git/vercel-for-github
- https://vercel.com/docs/package-managers
- https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
