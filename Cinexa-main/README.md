# Cinexa

A React + Vite movie discovery app powered by TMDB.

## Run locally

1. Install Node.js 20+.
2. Open this folder in VS Code.
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the project root:

```env
VITE_API_KEY=your_tmdb_api_key
```

5. Start the development server:

```bash
npm run dev
```

6. Open the local URL shown by Vite (normally `http://localhost:5173`).

## Production check

```bash
npm run build
npm run preview
```

## Features

- TMDB-powered movie categories
- Movie search across the main movie page
- Rating filters
- Movie detail pages
- YouTube trailer playback when a trailer is available
- English/Hindi UI text
- Responsive movie grids
- Loading, offline and API error states

## Environment variable

`VITE_API_KEY` is required. Because this is a browser application, a Vite environment variable is bundled into client-side JavaScript and should be treated as public. Restrict the TMDB key to the appropriate domains/usage in the TMDB developer dashboard rather than treating it as a private server secret.
