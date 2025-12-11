Backend (Python + Flask)
========================

This is a very small API server that reads data from your Firebase
Realtime Database and exposes it to the React dashboard.

Endpoints
---------

- `GET /api/health`  
  Returns `{ "status": "ok" }` if the backend is running.

- `GET /api/bomb-shell`  
  Returns the current values from the `/Bomb_Shell` node:

  ```json
  {
    "air_pressure": "<value>",
    "raw": {
      "sound": "0 or 1 or ''",
      "vibration": "0 or 1 or ''"
    },
    "status": {
      "sound": "DETECTED | NO_ACTIVITY | UNKNOWN",
      "vibration": "DETECTED | NO_ACTIVITY | UNKNOWN"
    }
  }
  ```

How to run
----------

1. Create a virtual environment (optional but recommended):

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Start the backend server:

   ```bash
   python app.py
   ```

   By default, it runs on `http://localhost:5000`.

Environment variables
---------------------

- `FIREBASE_DB_URL` (optional)  
  Defaults to `https://intel-gesture-default-rtdb.firebaseio.com`.
