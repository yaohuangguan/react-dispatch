import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { dispatcher } from 'react-dispatch';
import './style.css';

function Counter() {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    return dispatcher.on('counter:update', (value) => {
      setCount((current) => current + value);
    });
  }, []);

  return (
    <main>
      <p className="eyebrow">react-dispatch 2.0</p>
      <h1>Decoupled events, tiny API.</h1>
      <p className="count">Count: {count}</p>
      <button onClick={() => dispatcher.dispatch('counter:update', 1)}>
        Dispatch +1
      </button>
    </main>
  );
}

import React from 'react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Counter />
  </StrictMode>,
);
