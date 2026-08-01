import React, { useState, useEffect } from "react";
import "./App.css";
import Component from "./Component";
import BrotherComponent from "./BrotherComponent";
import { dispatcher } from "react-dispatch";
import { UPDATE, ONCE_UPDATE_COUNT, MSG_EVENT } from "./Constant";

function App() {
  const [logs, setLogs] = useState([]);
  const [flashType, setFlashType] = useState(null);

  useEffect(() => {
    const handleLog = (type, data) => {
      const timestamp = new Date().toLocaleTimeString();
      setLogs((prev) => [
        {
          id: Math.random().toString(),
          time: timestamp,
          type: type,
          payload: data !== undefined ? (typeof data === 'object' ? JSON.stringify(data) : String(data)) : "undefined",
        },
        ...prev,
      ].slice(0, 15)); // Keep last 15 logs

      // Trigger visual flash in the event channel
      setFlashType(type);
      const timer = setTimeout(() => setFlashType(null), 500);
      return () => clearTimeout(timer);
    };

    // Subscribing the logging system
    dispatcher.on(UPDATE, (data) => handleLog("UPDATE", data));
    dispatcher.on(ONCE_UPDATE_COUNT, (data) => handleLog("ONCE_UPDATE_COUNT", data));
    dispatcher.on(MSG_EVENT, (data) => handleLog("MSG_EVENT", data));

    return () => {
      dispatcher.off([UPDATE, ONCE_UPDATE_COUNT, MSG_EVENT]);
    };
  }, []);

  const getBadgeClass = (type) => {
    if (type === "UPDATE") return "log-badge update";
    if (type === "ONCE_UPDATE_COUNT") return "log-badge once";
    return "log-badge message";
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <span className="app-title-badge">React Event Bus</span>
        <h1 className="app-title">React Dispatcher Demo</h1>
        <p className="app-description">
          A visual demonstration of sibling component communication using custom event dispatching and subscribing. Completely decoupled and type-safe.
        </p>
      </header>

      {/* Main Interactive Demo */}
      <main className="demo-grid">
        {/* Component A - Sender */}
        <Component />

        {/* Central Event Channel Visualizer */}
        <section className={`glass-panel ${flashType ? 'highlight-active' : ''}`}>
          <div className="panel-header">
            <div>
              <h2 className="panel-title channel">Event Channel</h2>
              <p className="panel-subtitle">Live events transmission logs</p>
            </div>
            {logs.length > 0 && (
              <button onClick={() => setLogs([])} className="status-badge" style={{ cursor: "pointer", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                Clear
              </button>
            )}
          </div>
          
          <div className="log-container">
            {logs.length === 0 ? (
              <div className="log-muted log-empty">
                <div className="pulse-circle"></div>
                <span>Listening for events...</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Click buttons in Sender Component to dispatch events</span>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className={`log-item ${flashType === log.type ? 'flash-trigger' : ''}`}>
                  <div className="log-meta">
                    <span className={getBadgeClass(log.type)}>{log.type}</span>
                    <span className="log-time">{log.time}</span>
                  </div>
                  <div className="log-content">
                    payload: <span style={{ color: "var(--color-accent)" }}>{log.payload}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Component B - Receiver */}
        <BrotherComponent />
      </main>

      {/* Code Explanations Section */}
      <section className="explain-section">
        <div className="explain-card">
          <h3 className="explain-title" style={{ color: "var(--color-primary)" }}>How Component A Dispatches</h3>
          <p className="panel-subtitle" style={{ marginBottom: "0.5rem" }}>Trigger events by calling dispatch with an identifier and payload:</p>
          <div className="explain-code">
{`<span className="code-keyword">import</span> { dispatcher } <span className="code-keyword">from</span> <span className="code-string">"react-dispatch"</span>;

<span className="code-comment">// 1. Regular dispatch (updates counter)</span>
dispatcher.<span className="code-function">dispatch</span>(<span className="code-string">"UPDATE"</span>, <span className="code-number">1</span>);

<span className="code-comment">// 2. Single-use dispatch (triggers once)</span>
dispatcher.<span className="code-function">dispatch</span>(<span className="code-string">"ONCE_UPDATE_COUNT"</span>, <span className="code-number">1</span>);

<span className="code-comment">// 3. Dispatching custom message object</span>
dispatcher.<span className="code-function">dispatch</span>(<span className="code-string">"MSG_EVENT"</span>, { text: <span className="code-string">"Hello!"</span> });`}
          </div>
        </div>

        <div className="explain-card">
          <h3 className="explain-title" style={{ color: "var(--color-success)" }}>How Component B Subscribes</h3>
          <p className="panel-subtitle" style={{ marginBottom: "0.5rem" }}>Subscribe to events in useEffect, and unsubscribe on cleanup:</p>
          <div className="explain-code">
{`<span className="code-keyword">import</span> { useEffect } <span className="code-keyword">from</span> <span className="code-string">"react"</span>;
<span className="code-keyword">import</span> { dispatcher } <span className="code-keyword">from</span> <span className="code-string">"react-dispatch"</span>;

<span className="code-function">useEffect</span>(() => {
  <span className="code-comment">// Subscribe to state updates</span>
  dispatcher.<span className="code-function">on</span>(<span className="code-string">"UPDATE"</span>, (<span className="code-type">data</span>) => {
    <span className="code-function">setCount</span>((<span className="code-type">prev</span>) => prev + data);
  });

  <span className="code-comment">// Unsubscribe when components unmount</span>
  <span className="code-keyword">return</span> () => {
    dispatcher.<span className="code-function">off</span>(<span className="code-string">"UPDATE"</span>);
  };
}, []);`}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
