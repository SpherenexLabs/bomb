import React, { useEffect } from "react";

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === "danger" && "🚨"}
        {type === "warning" && "⚠️"}
        {type === "info" && "ℹ️"}
      </div>
      <div className="toast-content">
        <div className="toast-message">{message}</div>
      </div>
      <button className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
}
