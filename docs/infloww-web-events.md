## Infloww Web Integration: Theme & Language Events (v1)

This document describes how third‑party websites can integrate with Infloww by listening to window events to synchronize theme mode and language with the Infloww platform. The goal is to provide users with a consistent experience across Infloww and embedded/connected sites.

### Overview

- **Transport**: Browser `window` events (`CustomEvent`)
- **Version**: `v1`
- **Events**:
  - `Infloww:v1:set-theme-mode`
  - `Infloww:v1:set-language`

Infloww will dispatch these events whenever the platform state is available or changes. Your website should listen for them as soon as possible (ideally before your app mounts).

> Add these listeners in your project, then open the Infloww Chrome extension and wait for incoming events

```
  window.addEventListener("Infloww:v1:set-theme-mode", handleTheme);
  window.addEventListener("Infloww:v1:set-language", handleLanguage);
```

### Event Contract

All Infloww events are standard `CustomEvent` objects with a `detail` payload:

```ts
type ThemeMode = "light" | "dark";

interface InflowwEventDetail<TData> {
  data: TData;
  // Optional acknowledgement callback.
  /* If you acknowledge with callback({ success: true }), Infloww will hide the
  corresponding language/theme UI. The scope of hidden UI is determined by
  the exported Access-Control-Manager config: Infloww locates the item whose
  Project Name is "Language" or "Theme" and applies its CSS-based restrictions. */
  callback?: (response: InflowwCallbackResponse<T>) => void;
}

// Event names
enum InflowwEvent {
  SET_THEME_MODE = "Infloww:v1:set-theme-mode",
  SET_LANGUAGE = "Infloww:v1:set-language",
}

// Payloads
interface SetThemeModePayload {
  // Theme mode options are exactly: "light" | "dark".
  mode: ThemeMode;
}
interface SetLanguagePayload {
  // NOTE (Infloww): Language sync scope: en-US, fr-FR, de-DE, es-ES. if unsupported, fallback to English; if English is unsupported, use site's own language
  language: "en-US" | "fr-FR" | "de-DE" | "es-ES";
}
```

### Infloww‑added Root Attribute (for Infloww use) & CSS Variables

In addition to dispatching events, Infloww proactively updates the document root for its own styling/runtime needs:

- Infloww sets an attribute on `document.documentElement` indicating the current theme mode. This attribute is for Infloww’s internal usage (e.g., style scoping, runtime checks).

  ```js
  document.documentElement.setAttribute("Infloww-theme-mode", mode); // mode: "light" | "dark"
  ```

- Infloww also injects CSS Custom Properties (variables) it uses internally. These variables are scoped per mode using the same attribute selector.

Notes:

- Do not remove or override the `Infloww-theme-mode` attribute. If you maintain your own theming attribute/class, keep it in sync with the received event.
- Do not rely on or consume these internal attributes/variables; they are not part of the public integration contract and may change without notice.

### Minimal TypeScript Example

```ts
type ThemeMode = "light" | "dark";

interface InflowwCallbackResponse<T> {
  success: boolean;
  data?: T;
  error?: unknown;
}

interface InflowwEventDetail<T> {
  data: T;
  callback?: (response: InflowwCallbackResponse<T>) => void;
}

interface SetThemeModePayload {
  mode: ThemeMode;
}
interface SetLanguagePayload {
  language: "en-US" | "fr-FR" | "de-DE" | "es-ES";
}

function handleTheme(
  event: CustomEvent<InflowwEventDetail<SetThemeModePayload>>
) {
  const { data, callback } =
    event.detail || ({} as InflowwEventDetail<SetThemeModePayload>);
  try {
    const { mode } = data || {};
    console.log("Infloww theme mode:", mode);
    callback?.({ success: true, data });
  } catch (error) {
    callback?.({ success: false, data, error });
  }
}

function handleLanguage(
  event: CustomEvent<InflowwEventDetail<SetLanguagePayload>>
) {
  const { data, callback } =
    event.detail || ({} as InflowwEventDetail<SetLanguagePayload>);
  try {
    const { language } = data || {};
    console.log("Infloww language:", language);
    callback?.({ success: true, data });
  } catch (error) {
    callback?.({ success: false, data, error });
  }
}

window.addEventListener(
  "Infloww:v1:set-theme-mode",
  handleTheme as EventListener
);
window.addEventListener(
  "Infloww:v1:set-language",
  handleLanguage as EventListener
);
```

### Testing Locally

You can simulate Infloww events from your browser console on any page to verify your integration:

```js
// Test theme: switch to dark
window.dispatchEvent(
  new CustomEvent("Infloww:v1:set-theme-mode", {
    detail: {
      data: { mode: "dark" },
      callback: (res) => console.log("theme callback:", res),
    },
  })
);

// Test language: request French (if unsupported, fallback to English; if English is unsupported, use site's own language)
window.dispatchEvent(
  new CustomEvent("Infloww:v1:set-language", {
    detail: {
      data: { language: "fr-FR" },
      callback: (res) => console.log("language callback:", res),
    },
  })
);
```

### Implementation Guidance

- **Idempotency**: Applying the same theme/language repeatedly should be safe.
- **Persistence**: You may persist the applied theme/language to your own storage to keep state across reloads.
- **Performance**: Do not block the UI thread inside the event handler. Apply changes quickly.
- **Compatibility**: Treat unknown fields in `data` as forward‑compatible; ignore what you don’t understand.

### Versioning

This spec is for **v1** events. Future versions may introduce new events or additional fields. Your handler should:

- Ignore unknown fields in `detail.data`.
- Continue to acknowledge via `detail.callback` when present.

### Security Considerations

- These are in‑page events. If you also use custom events internally, consider namespacing to avoid collisions.
- If needed, you can implement additional checks (e.g., feature flags) before applying changes.

### Support and Questions

- If something doesn’t work as expected, please open an issue in this repository and include a minimal reproduction.
