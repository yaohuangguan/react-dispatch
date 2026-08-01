# react-dispatch

A lightweight, extremely fast, and type-safe event dispatcher for React and JavaScript applications. It allows easy, decoupled communication between sibling or nested components without the overhead of Redux or React Context API.

[![license](https://img.shields.io/npm/l/react-dispatch.svg)](https://github.com/yaohuangguan/react-dispatch/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/react-dispatch.svg)](https://www.npmjs.com/package/react-dispatch)
[![bundle size](https://img.shields.io/bundlephobia/min/react-dispatch.svg)](https://bundlephobia.com/package/react-dispatch)

## Features

- **Decoupled Sibling Communication**: Communicate between components at any depth in your tree.
- **Ultra-lightweight**: Tiny bundle footprint with zero runtime dependencies.
- **Type Safe**: First-class support for TypeScript generics so you get autocomplete and compile-time checks on your event payloads.
- **Simple API**: Just 4 methods: `on`, `once`, `off`, `dispatch`.

## Installation

Install using your preferred package manager:

```bash
# npm
npm install react-dispatch

# yarn
yarn add react-dispatch

# pnpm
pnpm add react-dispatch
```

## Quick Start

### 1. Dispatching Events
From any component, trigger an event and pass data:

```tsx
import React from 'react';
import { dispatcher } from 'react-dispatch';

export const ActionButton = () => {
  const handleUpdate = () => {
    // Send a numeric value to subscribers
    dispatcher.dispatch('counter:update', 1);
  };

  return <button onClick={handleUpdate}>Add 1</button>;
};
```

### 2. Subscribing to Events
Listen to the event in another component and update state. Remember to clean up on unmount!

```tsx
import React, { useState, useEffect } from 'react';
import { dispatcher } from 'react-dispatch';

export const DisplayCounter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Subscribe to event
    dispatcher.on<number>('counter:update', (value) => {
      setCount((prev) => prev + value);
    });

    // Unsubscribe when component unmounts to prevent memory leaks
    return () => {
      dispatcher.off('counter:update');
    };
  }, []);

  return <div>Count: {count}</div>;
};
```

---

## TypeScript Support

`react-dispatch` supports generic types to enforce payload types:

```typescript
import { dispatcher } from 'react-dispatch';

interface UserPayload {
  id: string;
  name: string;
}

// 1. Subscribe with type safety
dispatcher.on<UserPayload>('user:login', (user) => {
  console.log(user.name); // Typed as string
});

// 2. Dispatch with type safety
dispatcher.dispatch<UserPayload>('user:login', {
  id: 'usr_123',
  name: 'Sam Yao'
});
```

---

## API Reference

### `dispatcher.on<T = any>(event: string, callback: (data: T) => unknown): void`
Subscribes to an event. The callback will trigger every time the event is dispatched.

- **`event`**: Unique event key.
- **`callback`**: Function to run when the event is triggered, receiving the dispatched payload.

### `dispatcher.once<T = any>(event: string, callback: (data: T) => unknown): void`
Subscribes to an event once. The callback will trigger the next time the event is dispatched and then automatically unsubscribe.

### `dispatcher.off(event: string | string[]): boolean | void`
Unsubscribes the callbacks for the specified event(s). Always clean up your subscriptions on component unmount or destructor cycles.

- Pass a `string` to unsubscribe a single event key.
- Pass an `string[]` array to unsubscribe multiple event keys at once.

### `dispatcher.dispatch<T = any>(event: string, data?: T): void`
Fires an event and notifies all active subscribers with the provided data.

- **`event`**: Unique event key matching the subscriber.
- **`data`**: Optional payload sent to the event listeners.

---

## License

[ISC](LICENSE)