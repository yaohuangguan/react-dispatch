import React, { useState, useEffect } from "react";
import { UPDATE, ONCE_UPDATE_COUNT, MSG_EVENT } from "./Constant";
import { dispatcher } from "react-dispatch";

const BrotherComponent = () => {
  const [count, setCount] = useState(0);
  const [onceCount, setOnceCount] = useState(0);
  const [latestMsg, setLatestMsg] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(true);

  useEffect(() => {
    if (isSubscribed) {
      dispatcher.on(UPDATE, (data) => {
        setCount((prev) => prev + data);
      });

      dispatcher.once(ONCE_UPDATE_COUNT, (data) => {
        setOnceCount((prev) => prev + data);
      });

      dispatcher.on(MSG_EVENT, (data) => {
        setLatestMsg(data);
      });
    }

    return () => {
      // Clean up subscriptions for this component on unmount or unsubscribe
      dispatcher.off([UPDATE, ONCE_UPDATE_COUNT, MSG_EVENT]);
    };
  }, [isSubscribed]);

  const toggleSubscription = () => {
    setIsSubscribed((prev) => !prev);
  };

  const resetValues = () => {
    setCount(0);
    setOnceCount(0);
    setLatestMsg("");
  };

  return (
    <section className="glass-panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title receiver">Component B (Receiver)</h2>
          <p className="panel-subtitle">Subscribes and updates on events</p>
        </div>
        <span className={`status-badge ${isSubscribed ? 'active' : 'inactive'}`}>
          <span className="status-dot" style={{
            display: "inline-block", 
            width: "6px", 
            height: "6px", 
            borderRadius: "50%", 
            background: isSubscribed ? "var(--color-success)" : "#ef4444"
          }}></span>
          {isSubscribed ? "Subscribed" : "Unsubscribed"}
        </span>
      </div>

      {/* Received Counter Status */}
      <div className="display-card">
        <span className="display-label">Counter Value (UPDATE)</span>
        <span className="display-value">{count}</span>
        <span className="display-meta">Increments with each dispatch click</span>
      </div>

      {/* Received Once Counter Status */}
      <div className="display-card">
        <span className="display-label">Once Counter (ONCE_UPDATE_COUNT)</span>
        <span className="display-value">{onceCount}</span>
        <span className="display-meta">Receives only the first dispatch; then auto-unsubscribes</span>
      </div>

      {/* Received Message String */}
      <div className="display-card">
        <span className="display-label">Latest String Event (MSG_EVENT)</span>
        <span className="display-value code-font">
          {latestMsg ? `"${latestMsg}"` : "(No messages received yet)"}
        </span>
        <span className="display-meta">Custom text payload passed between components</span>
      </div>

      {/* Connection Management Actions */}
      <div className="btn-group" style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
        <button 
          onClick={toggleSubscription} 
          className={`btn ${isSubscribed ? 'btn-danger' : 'btn-primary'}`}
          style={{ flex: 2 }}
        >
          {isSubscribed ? "Unsubscribe Component" : "Subscribe Component"}
        </button>
        <button 
          onClick={resetValues} 
          className="btn btn-outline"
          style={{ flex: 1 }}
        >
          Clear Values
        </button>
      </div>
    </section>
  );
};

export default BrotherComponent;
