import React, { useEffect, useState } from "react";
import BombShellCard from "./components/BombShellCard";
import BombShellCharts from "./components/BombShellCharts";

const REFRESH_INTERVAL_MS = 2000; // 2 seconds
const MAX_HISTORY = 60; // keep last 60 samples

export default function App() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  async function fetchData() {
    try {
      const res = await fetch("/api/bomb-shell");
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
      setError(null);

      const now = Date.now();

      const air = json.air_pressure;
      const airNumeric =
        air === null || air === undefined || air === "" ? null : Number(air);

      const soundRaw = json.raw?.sound ?? "";
      const vibrationRaw = json.raw?.vibration ?? "";

      const soundVal =
        soundRaw === "1" ? 1 : soundRaw === "0" ? 0 : null;
      const vibrationVal =
        vibrationRaw === "1" ? 1 : vibrationRaw === "0" ? 0 : null;

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
    } catch (err) {
      console.error(err);
      setError(err.message || "Error fetching data");
    }
  }

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
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
