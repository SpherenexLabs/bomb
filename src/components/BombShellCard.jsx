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

export default function BombShellCard({ data }) {
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
    <section className="card">
      <h2>Current Status</h2>

      <div className="grid">
        <div className="metric">
          <h3>Air Pressure</h3>
          <p className="metric-value">
            {airPressure !== "" ? airPressure : "--"}
          </p>
        </div>

        <div className="metric">
          <h3>Sound</h3>
          <p className="metric-value">
            <span className={statusClass(soundStatus)}>
              {statusLabel(soundStatus)}
            </span>
          </p>
        </div>

        <div className="metric">
          <h3>Vibration</h3>
          <p className="metric-value">
            <span className={statusClass(vibrationStatus)}>
              {statusLabel(vibrationStatus)}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
