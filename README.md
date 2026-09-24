# GuardianSync Client

React/Vite dashboard for GuardianSync.

## Deploy on Vercel

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- `VITE_API_URL`: deployed server URL ending in `/api`
- `VITE_SOCKET_URL`: deployed server origin
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID

See `vercel.json` for the SPA route rewrite. Never commit `.env` files.
