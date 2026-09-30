# react-dispatch

A tiny, dependency-free, type-safe event dispatcher for React and JavaScript applications.

[![npm version](https://img.shields.io/npm/v/react-dispatch.svg)](https://www.npmjs.com/package/react-dispatch)
[![license](https://img.shields.io/npm/l/react-dispatch.svg)](https://github.com/yaohuangguan/react-dispatch/blob/master/LICENSE)

## Highlights

- Zero runtime dependencies
- ESM and CommonJS builds
- Built and tested with the 2026 toolchain: TypeScript 7, Vitest 5, esbuild
- Legacy generic API remains supported
- Strongly typed event maps via `createDispatcher`
- `on()` / `once()` return unsubscribe functions
- Remove one callback or all listeners for an event
- `listenerCount()` and `clear()` utilities
- React is optional; the package works in vanilla JavaScript and Node.js too

## Install

```bash
npm install react-dispatch
```

## Quick start

```ts
import { dispatcher } from 'react-dispatch';

const unsubscribe = dispatcher.on<number>('counter:update', (value) => {
  console.log(value);
});

dispatcher.dispatch<number>('counter:update', 1);
unsubscribe();
```

## Typed event maps

```ts
import { createDispatcher } from 'react-dispatch';

type AppEvents = {
  'user:login': { userId: string; name: string };
  'cart:count': number;
};

const appEvents = createDispatcher<AppEvents>();

appEvents.on('user:login', (user) => {
  console.log(user.name);
});

appEvents.dispatch('user:login', {
  userId: 'usr_123',
  name: 'Sam',
});
```

Invalid event names and payload shapes are rejected by TypeScript.

## React example

```tsx
import { useEffect, useState } from 'react';
import { dispatcher } from 'react-dispatch';

export function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    return dispatcher.on<number>('counter:update', (value) => {
      setCount((current) => current + value);
    });
  }, []);

  return <div>{count}</div>;
}
```

## API

### `dispatcher.on<T>(event, callback)`

Registers a persistent listener and returns an unsubscribe function.

### `dispatcher.once<T>(event, callback)`

Registers a one-time listener and returns an unsubscribe function.

### `dispatcher.off(event, callback?)`

Removes a specific callback when provided. Without a callback, removes all listeners for the event. Arrays of event names are supported.

### `dispatcher.dispatch<T>(event, data?)`

Dispatches an event to all current listeners.

### `dispatcher.listenerCount(event)`

Returns the number of persistent and one-time listeners for an event.

### `dispatcher.clear()`

Removes every listener.

### `createDispatcher<EventMap>()`

Creates an isolated dispatcher with compile-time event-name and payload validation.

## Package output

- ESM: `dist/index.js`
- CommonJS: `dist/index.cjs`
- Types: `dist/index.d.ts`
- Source maps included
- `sideEffects: false` for tree-shaking

## Compatibility

- Node.js 18+
- Modern browsers
- React 18 / 19+ (React is not a dependency)
- TypeScript consumers supported; built and validated with TypeScript 7

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
npm run pack:check
```

## License

ISC
