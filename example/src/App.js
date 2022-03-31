import React from "react";
import "./App.css";

import Component from "./Component";
import BrotherComponent from "./BrotherComponent";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrotherComponent />
        <Component />
      </header>
    </div>
  );
}

export default App;
