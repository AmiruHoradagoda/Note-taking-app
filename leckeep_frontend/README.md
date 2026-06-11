# Note-taking App Frontend

React frontend for a note-taking app. Users can authenticate, create notes, tag notes, search notes, edit notes, and delete notes through the backend API.

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- react-select
- lucide-react

## Environment

Vite only exposes client environment variables prefixed with `VITE_`.

```env
VITE_API_URL=https://app.amiru-web.xyz/api/v1
```

If `VITE_API_URL` is not set, the app falls back to `/api/v1`.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

- `npm run dev` starts the Vite development server.
- `npm run build` creates a production build in `dist/`.
- `npm run preview` serves the production build locally.

## Docker

The Dockerfile builds the Vite app and serves `dist/` with Nginx.
