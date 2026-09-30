# Changelog

## 2.0.0

### Added
- Strongly typed event maps through `createDispatcher<EventMap>()`.
- Unsubscribe functions returned by `on()` and `once()`.
- Selective callback removal with `off(event, callback)`.
- `listenerCount()` and `clear()` utilities.
- ESM and CommonJS exports, TypeScript declarations, and source maps.

### Changed
- Modernized the 2026 toolchain to TypeScript 7, Vitest 5, and esbuild.
- Updated npm publishing metadata and package exports.
- Reworked internals around `Map` and `Set` while preserving the classic singleton API.

### Compatibility
- Existing `dispatcher.on<T>()`, `once<T>()`, `dispatch<T>()`, and `off()` usage remains supported.
- React remains optional and there are no runtime dependencies.
