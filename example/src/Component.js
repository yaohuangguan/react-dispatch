import React, { useState } from "react";
import { dispatcher } from "react-dispatch";
import { UPDATE, ONCE_UPDATE_COUNT, MSG_EVENT } from "./Constant";

const Component = () => {
  const [msgText, setMsgText] = useState("");

  const onIncrement = (val) => {
    dispatcher.dispatch(UPDATE, val);
  };

  const onIncrementOnce = () => {
    dispatcher.dispatch(ONCE_UPDATE_COUNT, 1);
  };

  const onSendMessage = (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    
    // Dispatching a text string payload
    dispatcher.dispatch(MSG_EVENT, msgText);
    setMsgText("");
  };

  return (
    <section className="glass-panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title sender">Component A (Sender)</h2>
          <p className="panel-subtitle">Dispatches events out to the system</p>
        </div>
        <span className="status-badge active" style={{ background: "rgba(139, 92, 246, 0.1)", color: "var(--color-primary)", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
          Active
        </span>
      </div>

      {/* Increment Actions */}
      <div className="form-group">
        <label className="form-label">Increment Counter Event (UPDATE)</label>
        <div className="btn-group">
          <button className="btn btn-primary" onClick={() => onIncrement(1)}>
            Add 1
          </button>
          <button className="btn btn-primary" onClick={() => onIncrement(5)}>
            Add 5
          </button>
        </div>
      </div>

      {/* Once Trigger Actions */}
      <div className="form-group">
        <label className="form-label">Once-Only Event (ONCE_UPDATE_COUNT)</label>
        <button className="btn btn-secondary" onClick={onIncrementOnce}>
          Increment Once
        </button>
      </div>

      {/* String Payload Message Action */}
      <form onSubmit={onSendMessage} className="form-group">
        <label className="form-label" htmlFor="msg-input">Send Text Event (MSG_EVENT)</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            id="msg-input"
            type="text"
            className="text-input"
            placeholder="Type a message..."
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
          />
          <button type="submit" className="btn btn-outline" style={{ width: "auto" }}>
            Send
          </button>
        </div>
      </form>
    </section>
  );
};

export default Component;
