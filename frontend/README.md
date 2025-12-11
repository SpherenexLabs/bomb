Frontend (React + Vite)
=======================

This is a simple React dashboard that talks to the Python backend
and shows the `/Bomb_Shell` values.

How to run
----------

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

   By default it runs on `http://localhost:5173`.

The Vite dev server is configured to proxy `/api/*` requests to
`http://localhost:5000`, so make sure the Python backend is also
running.
