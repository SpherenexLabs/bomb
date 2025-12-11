Bomb Shell React-Only Dashboard
===============================

Tech stack:
- React + Vite
- Firebase Realtime Database (web SDK)
- Chart.js + react-chartjs-2

This project directly connects to your Firebase RTDB from the browser.
No Python / backend is required.

Firebase path used
------------------

It listens to the node:

- `/Bomb_Shell`

with children:

- `Air_Pressure`
- `Sound`
- `Vibration`

Whatever your ESP8266 writes there will appear in the dashboard and graphs.

How to run
----------

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Open the URL shown in the terminal (usually `http://localhost:5173`).

Make sure your Firebase Realtime Database rules allow read access from
your browser for the `/Bomb_Shell` node.
