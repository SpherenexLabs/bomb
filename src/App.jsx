import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";
import BombShellCard from "./components/BombShellCard";
import BombShellCharts from "./components/BombShellCharts";

const MAX_HISTORY = 60; // keep last 60 points

export default function App() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const bombRef = ref(db, "Bomb_Shell");

    const unsubscribe = onValue(
      bombRef,
      (snapshot) => {
        const val = snapshot.val() || {};
        const air = val.Air_Pressure ?? "";
        const sound = val.Sound ?? "";
        const vibration = val.Vibration ?? "";

        const parsed = {
          air_pressure: air,
          raw: {
            sound: String(sound).trim(),
            vibration: String(vibration).trim()
          }
        };

        setData(parsed);
        setLastUpdated(new Date());
        setError(null);

        const now = Date.now();
        const airNumeric =
          air === null || air === undefined || air === "" ? null : Number(air);

        const soundVal =
          parsed.raw.sound === "1"
            ? 1
            : parsed.raw.sound === "0"
            ? 0
            : null;
        const vibrationVal =
          parsed.raw.vibration === "1"
            ? 1
            : parsed.raw.vibration === "0"
            ? 0
            : null;

        setHistory((prev) => {
          const next = [
            ...prev,
            {
              timestamp: now,
              air_pressure: airNumeric,
              sound: soundVal,
              vibration: vibrationVal
            }
          ];
          if (next.length > MAX_HISTORY) {
            next.splice(0, next.length - MAX_HISTORY);
          }
          return next;
        });
      },
      (err) => {
        console.error(err);
        setError(err.message || "Error reading from Firebase");
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Bomb Shell Monitoring</h1>
        </div>
        <div className="meta">
          <div className="pill pill-online">LIVE</div>
          {lastUpdated && (
            <p className="timestamp">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </header>

      <main className="content">
        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
          </div>
        )}
        <BombShellCard data={data} />
        <BombShellCharts history={history} />
      </main>

      <footer className="footer">
      </footer>
    </div>
  );
}
