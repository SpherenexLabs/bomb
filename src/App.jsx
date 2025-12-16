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
  
  // Threat detection states
  const [threatLevel, setThreatLevel] = useState("Normal");
  const [confidence, setConfidence] = useState(0);
  const [lastEventTime, setLastEventTime] = useState(null);
  const [peakValues, setPeakValues] = useState({
    peakDb: 0,
    peakVibration: 0,
    maxPressureDelta: 0
  });
  const [autoStatusReason, setAutoStatusReason] = useState("System monitoring");
  const [peakHistory, setPeakHistory] = useState([]);

  useEffect(() => {
    const bombRef = ref(db, "Bomb_Shell");

    const unsubscribe = onValue(
      bombRef,
      (snapshot) => {
        const val = snapshot.val() || {};
        console.log("Firebase data received:", val);
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
          
          const peaks = analyzeThreatLevel(next, soundVal, vibrationVal, airNumeric);
          
          // Update peak history for charts
          setPeakHistory((prevPeaks) => {
            const nextPeaks = [
              ...prevPeaks,
              {
                timestamp: now,
                peakDb: peaks.peakDb,
                peakVibration: peaks.peakVibration
              }
            ];
            if (nextPeaks.length > MAX_HISTORY) {
              nextPeaks.splice(0, nextPeaks.length - MAX_HISTORY);
            }
            return nextPeaks;
          });
          
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

  // Threat Level Analysis Function
  function analyzeThreatLevel(historyData, currentSound, currentVibration, currentPressure) {
    let threat = "Normal";
    let conf = 0;
    let reasons = [];
    
    // Check for sound detection
    const soundDetected = currentSound === 1;
    let currentPeakDb = 0;
    if (soundDetected) {
      conf += 35;
      reasons.push("High sound detected");
      currentPeakDb = 70 + Math.random() * 30; // Simulated dB value between 70-100
    }
    
    // Check for vibration detection
    const vibrationDetected = currentVibration === 1;
    let currentPeakVibration = 0;
    if (vibrationDetected) {
      conf += 30;
      reasons.push("Vibration spike");
      currentPeakVibration = 0.5 + Math.random() * 1.5; // Simulated vibration between 0.5-2.0
    }
    
    // Calculate pressure delta (change from previous reading)
    let pressureDelta = 0;
    if (historyData.length >= 2 && currentPressure !== null) {
      const prevPressure = historyData[historyData.length - 2].air_pressure;
      if (prevPressure !== null) {
        pressureDelta = Math.abs(currentPressure - prevPressure);
        if (pressureDelta > 10) {
          conf += 35;
          reasons.push("Impulse pressure");
        } else if (pressureDelta > 5) {
          conf += 15;
          reasons.push("Pressure fluctuation");
        }
      }
    }
    
    // Update peak values
    const updatedPeaks = {
      peakDb: currentPeakDb > 0 ? currentPeakDb : 0,
      peakVibration: currentPeakVibration > 0 ? currentPeakVibration : 0,
      maxPressureDelta: 0
    };
    
    setPeakValues(prev => ({
      peakDb: Math.max(prev.peakDb, updatedPeaks.peakDb),
      peakVibration: Math.max(prev.peakVibration, updatedPeaks.peakVibration),
      maxPressureDelta: Math.max(prev.maxPressureDelta, pressureDelta)
    }));
    
    // Determine threat level based on confidence
    if (conf >= 70) {
      threat = "High";
    } else if (conf >= 40) {
      threat = "Suspicious";
    } else {
      threat = "Normal";
    }
    
    // Update last event time if any detection occurred
    if (soundDetected || vibrationDetected || pressureDelta > 5) {
      setLastEventTime(new Date());
    }
    
    // Set status reason
    const statusReason = reasons.length > 0 
      ? reasons.join(" + ")
      : "All sensors normal";
    
    setThreatLevel(threat);
    setConfidence(Math.min(conf, 100));
    setAutoStatusReason(statusReason);
    
    return updatedPeaks;
  }

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
        <BombShellCard 
          data={data} 
          threatLevel={threatLevel}
          confidence={confidence}
          lastEventTime={lastEventTime}
          peakValues={peakValues}
          autoStatusReason={autoStatusReason}
        />
        <BombShellCharts history={history} peakHistory={peakHistory} />
      </main>

      <footer className="footer">
      </footer>
    </div>
  );
}
