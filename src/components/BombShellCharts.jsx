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

export default function BombShellCharts({ history, peakHistory }) {
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
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
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
        ticks: { color: "#64748b" },
        grid: { color: "#e2e8f0" }
      },
      y: {
        min: -0.1,
        max: 1.1,
        ticks: {
          stepSize: 1,
          color: "#64748b",
          callback: (value) => (value === 1 ? "Detected" : "No Activity")
        },
        grid: { color: "#e2e8f0" }
      }
    }
  };

  const soundData = {
    labels,
    datasets: [
      {
        label: "Sound",
        data: history.map((h) => (h.sound === null ? null : h.sound)),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
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
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
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
        ticks: { color: "#64748b" },
        grid: { color: "#e2e8f0" }
      },
      y: {
        ticks: { color: "#64748b" },
        grid: { color: "#e2e8f0" }
      }
    }
  };

  // Peak dB data
  const peakLabels = peakHistory && peakHistory.length > 0 
    ? peakHistory.map((h) => new Date(h.timestamp).toLocaleTimeString())
    : [];

  const peakDbData = {
    labels: peakLabels,
    datasets: [
      {
        label: "Peak dB",
        data: peakHistory ? peakHistory.map((h) => h.peakDb || null) : [],
        borderColor: "#dc2626",
        backgroundColor: "rgba(220, 38, 38, 0.1)",
        tension: 0.3,
        fill: true
      }
    ]
  };

  const peakDbOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        ticks: { color: "#64748b" },
        grid: { color: "#e2e8f0" }
      },
      y: {
        min: 0,
        max: 120,
        ticks: { 
          color: "#64748b",
          stepSize: 20
        },
        grid: { color: "#e2e8f0" }
      }
    }
  };

  // Peak Vibration data
  const peakVibrationData = {
    labels: peakLabels,
    datasets: [
      {
        label: "Peak Vibration (RMS)",
        data: peakHistory ? peakHistory.map((h) => h.peakVibration || null) : [],
        borderColor: "#ea580c",
        backgroundColor: "rgba(234, 88, 12, 0.1)",
        tension: 0.3,
        fill: true
      }
    ]
  };

  const peakVibrationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        ticks: { color: "#64748b" },
        grid: { color: "#e2e8f0" }
      },
      y: {
        min: 0,
        ticks: { 
          color: "#64748b"
        },
        grid: { color: "#e2e8f0" }
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

        <div className="chart-wrapper">
          <h3>Peak dB Level</h3>
          <div className="chart-inner">
            <Line options={peakDbOptions} data={peakDbData} />
          </div>
        </div>

        <div className="chart-wrapper">
          <h3>Peak Vibration (RMS)</h3>
          <div className="chart-inner">
            <Line options={peakVibrationOptions} data={peakVibrationData} />
          </div>
        </div>
      </div>
    </section>
  );
}
