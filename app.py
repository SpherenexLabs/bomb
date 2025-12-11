from flask import Flask, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

# Firebase Realtime Database URL (no trailing slash)
FIREBASE_DB_URL = os.environ.get(
    "FIREBASE_DB_URL",
    "https://intel-gesture-default-rtdb.firebaseio.com"
)

@app.route("/api/health", methods=["GET"])
def health():
    """Simple endpoint to check if backend is running."""
    return jsonify({"status": "ok"})

@app.route("/api/bomb-shell", methods=["GET"])
def get_bomb_shell_status():
    """Fetch current Bomb_Shell node from Firebase RTDB."""
    try:
        url = f"{FIREBASE_DB_URL}/Bomb_Shell.json"
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json() or {}

        # Normalize values
        air_pressure = data.get("Air_Pressure", "")
        sound = str(data.get("Sound", "")).strip()
        vibration = str(data.get("Vibration", "")).strip()

        def interpret_binary(value):
            if value == "1":
                return "DETECTED"
            if value == "0":
                return "NO_ACTIVITY"
            return "UNKNOWN"

        return jsonify({
            "air_pressure": air_pressure,
            "raw": {
                "sound": sound,
                "vibration": vibration,
            },
            "status": {
                "sound": interpret_binary(sound),
                "vibration": interpret_binary(vibration),
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
