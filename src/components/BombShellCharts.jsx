import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function BombShellCharts({ history }) {
  if (!history || history.length === 0) {
    return (
      <section className="card">
        <h2>Live Graphs</h2>
        <p className="card-description">Waiting for readings...</p>
      </section>
    );
  }

  const labels = history.map((h) =>
    new Date(h.timestamp).toLocaleTimeString()
  );

  const airPressureData = {
    labels,
    datasets: [
      {
        label: "Air Pressure",
        data: history.map((h) =>
          h.air_pressure === null || Number.isNaN(h.air_pressure)
            ? null
            : h.air_pressure
        ),
        tension: 0.3
      }
    ]
  };

  const binaryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        ticks: { color: "#9ca3af" },
        grid: { color: "#111827" }
      },
      y: {
        min: -0.1,
        max: 1.1,
        ticks: {
          stepSize: 1,
          color: "#9ca3af",
          callback: (value) => (value === 1 ? "Detected" : "No Activity")
        },
        grid: { color: "#111827" }
      }
    }
  };

  const soundData = {
    labels,
    datasets: [
      {
        label: "Sound",
        data: history.map((h) => (h.sound === null ? null : h.sound)),
        stepped: true
      }
    ]
  };

  const vibrationData = {
    labels,
    datasets: [
      {
        label: "Vibration",
        data: history.map((h) =>
          h.vibration === null ? null : h.vibration
        ),
        stepped: true
      }
    ]
  };

  const airOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        ticks: { color: "#9ca3af" },
        grid: { color: "#111827" }
      },
      y: {
        ticks: { color: "#9ca3af" },
        grid: { color: "#111827" }
      }
    }
  };

  return (
    <section className="card">
      <h2>Live Graphs</h2>

      <div className="chart-grid">
        <div className="chart-wrapper">
          <h3>Air Pressure</h3>
          <div className="chart-inner">
            <Line options={airOptions} data={airPressureData} />
          </div>
        </div>

        <div className="chart-wrapper">
          <h3>Sound (Noise)</h3>
          <div className="chart-inner">
            <Line options={binaryOptions} data={soundData} />
          </div>
        </div>

        <div className="chart-wrapper">
          <h3>Vibration</h3>
          <div className="chart-inner">
            <Line options={binaryOptions} data={vibrationData} />
          </div>
        </div>
      </div>
    </section>
  );
}
