import React from "react";

function statusLabel(value) {
  if (!value || value === "UNKNOWN") return "Unknown";
  if (value === "DETECTED") return "Detected";
  if (value === "NO_ACTIVITY") return "No Activity";
  return value;
}

function statusClass(value) {
  if (value === "DETECTED") return "badge badge-danger";
  if (value === "NO_ACTIVITY") return "badge badge-safe";
  return "badge badge-unknown";
}

function threatLevelClass(level) {
  if (level === "High") return "badge badge-danger";
  if (level === "Suspicious") return "badge badge-warning";
  return "badge badge-safe";
}

export default function BombShellCard({ 
  data, 
  threatLevel = "Normal", 
  confidence = 0, 
  lastEventTime = null, 
  peakValues = { peakDb: 0, peakVibration: 0, maxPressureDelta: 0 },
  autoStatusReason = "System monitoring"
}) {
  if (!data) {
    return (
      <section className="card">
        <h2>Current Status</h2>
        <p>Waiting for data...</p>
      </section>
    );
  }

  const airPressure = data.air_pressure ?? "";
  const soundRaw = data.raw?.sound ?? "";
  const vibrationRaw = data.raw?.vibration ?? "";

  const soundStatus =
    soundRaw === "1" ? "DETECTED" : soundRaw === "0" ? "NO_ACTIVITY" : "UNKNOWN";
  const vibrationStatus =
    vibrationRaw === "1"
      ? "DETECTED"
      : vibrationRaw === "0"
      ? "NO_ACTIVITY"
      : "UNKNOWN";

  return (
    <>
      <section className="card">
        <h2>🛡️ Threat Detection</h2>
        
        <div className="grid">
          <div className="metric">
            <div className="metric-header">
              <span className="metric-icon">⚠️</span>
              <h3>Threat Level</h3>
            </div>
            <p className="metric-value">
              <span className={threatLevelClass(threatLevel)}>
                {threatLevel}
              </span>
            </p>
          </div>

          <div className="metric">
            <div className="metric-header">
              <span className="metric-icon">📊</span>
              <h3>Confidence</h3>
            </div>
            <p className="metric-value">
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {confidence}%
              </span>
            </p>
          </div>

          <div className="metric">
            <div className="metric-header">
              <span className="metric-icon">🕐</span>
              <h3>Last Event</h3>
            </div>
            <p className="metric-value" style={{ fontSize: '1rem' }}>
              {lastEventTime 
                ? lastEventTime.toLocaleTimeString() 
                : "No events detected"}
            </p>
          </div>
        </div>

        <div className="metric" style={{ marginTop: '1rem' }}>
          <div className="metric-header">
            <span className="metric-icon">💬</span>
            <h3>Status Reason</h3>
          </div>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem' }}>
            {autoStatusReason}
          </p>
        </div>

        <div className="grid" style={{ marginTop: '1.5rem' }}>
          <div className="metric">
            <div className="metric-header">
              <span className="metric-icon">🔊</span>
              <h3>Peak dB</h3>
            </div>
            <p className="metric-value">{(peakValues?.peakDb || 0).toFixed(1)}</p>
          </div>

          <div className="metric">
            <div className="metric-header">
              <span className="metric-icon">📳</span>
              <h3>Peak Vibration</h3>
            </div>
            <p className="metric-value">{(peakValues?.peakVibration || 0).toFixed(2)}</p>
          </div>

          <div className="metric">
            <div className="metric-header">
              <span className="metric-icon">🌡️</span>
              <h3>Max Pressure Δ</h3>
            </div>
            <p className="metric-value">{(peakValues?.maxPressureDelta || 0).toFixed(2)}</p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>📡 Current Sensor Status</h2>

        <div className="grid">
          <div className="metric">
            <div className="metric-header">
              <span className="metric-icon">🌪️</span>
              <h3>Air Pressure</h3>
            </div>
            <p className="metric-value">
              {airPressure !== "" ? airPressure : "--"}
            </p>
          </div>

          <div className="metric">
            <div className="metric-header">
              <span className="metric-icon">🔉</span>
              <h3>Sound</h3>
            </div>
            <p className="metric-value">
              <span className={statusClass(soundStatus)}>
                {statusLabel(soundStatus)}
              </span>
            </p>
          </div>

          <div className="metric">
            <div className="metric-header">
              <span className="metric-icon">〰️</span>
              <h3>Vibration</h3>
            </div>
            <p className="metric-value">
              <span className={statusClass(vibrationStatus)}>
                {statusLabel(vibrationStatus)}
              </span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
