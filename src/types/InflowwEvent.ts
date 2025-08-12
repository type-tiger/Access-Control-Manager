export interface InflowwEventDetail<TData> {
  data: TData;
  // Optional callback for your acknowledgements
  callback?: (response: {
    success: boolean;
    data?: TData;
    error?: unknown;
  }) => void;
}

export enum InflowwEvent {
  SET_THEME_MODE = "Infloww:v1:set-theme-mode",
  SET_LANGUAGE = "Infloww:v1:set-language",
}

export enum ThemeMode {
  LIGHT = "light",
  DARK = "dark",
}

// Payloads
export interface SetThemeModePayload {
  mode: ThemeMode; // aligns with Infloww event data shape
}

export interface SetLanguagePayload {
  language: string /* BCP 47, e.g. 'en', 'en-US', 'fr-FR' */;
}

// Helper types
export type InflowwCallbackResponse<T> = {
  success: boolean;
  data?: T;
  error?: unknown;
};

export type EventPayloadMap = {
  [InflowwEvent.SET_THEME_MODE]: SetThemeModePayload;
  [InflowwEvent.SET_LANGUAGE]: SetLanguagePayload;
};

export type CallEventResponse<E extends InflowwEvent> = {
  eventName: E;
} & InflowwCallbackResponse<EventPayloadMap[E]>;
