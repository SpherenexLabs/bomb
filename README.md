Bomb Shell Monitoring Dashboard
===============================

Tech stack:
- Backend: Python, Flask
- Frontend: React, Vite
- Data source: Firebase Realtime Database (`/Bomb_Shell` node)

Project structure
-----------------

- `backend/`
  - `app.py`          : Flask API server that reads from Firebase RTDB
  - `requirements.txt`: Python dependencies
  - `README.md`       : Backend usage instructions

- `frontend/`
  - `package.json`    : React/Vite project config
  - `vite.config.mjs` : Vite dev server + API proxy
  - `index.html`      : Entry HTML
  - `src/`
      - `main.jsx`    : React entry file
      - `App.jsx`     : Dashboard layout
      - `components/BombShellCard.jsx`: Card UI for the metrics
      - `styles.css`  : Styling

How to run everything
---------------------

1. Start the backend (Python + Flask)
   ----------------------------------

   ```bash
   cd backend
   python -m venv venv        # optional
   source venv/bin/activate   # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```

   The backend will run on: `http://localhost:5000`

2. Start the frontend (React)
   --------------------------

   Open a new terminal:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   The frontend will run on: `http://localhost:5173`

   Vite is configured so every request starting with `/api` is automatically
   sent to the Python backend on port 5000.

Firebase path used
------------------

The backend reads from:

- `https://intel-gesture-default-rtdb.firebaseio.com/Bomb_Shell`

with the child keys:

- `Air_Pressure`
- `Sound`
- `Vibration`

Whatever your ESP8266 writes to that path will be shown in the dashboard.
