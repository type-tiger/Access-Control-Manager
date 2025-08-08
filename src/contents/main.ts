import type { PlasmoCSConfig } from "plasmo";
import { InflowwEvent } from "../types/InflowwEvent";
import type {
  InflowwCallbackResponse,
  InflowwEventDetail,
  SetThemeModePayload,
  EventPayloadMap,
  CallEventResponse,
} from "../types/InflowwEvent";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_start",
  all_frames: true,
  world: "MAIN",
};

const callThirdPartyEvent = <E extends InflowwEvent>(
  eventName: E,
  eventData: EventPayloadMap[E]
) => {
  const event = new CustomEvent(eventName, {
    detail: {
      data: eventData,
      requestId: `event-${Date.now()}`,
      callback: (response: InflowwCallbackResponse<EventPayloadMap[E]>) => {
        window.dispatchEvent(
          new CustomEvent(`Infloww:v1:call-event-response`, {
            detail: {
              eventName,
              ...response,
            } as CallEventResponse<E>,
          })
        );
      },
    } as InflowwEventDetail<EventPayloadMap[E]> & { requestId: string },
  });

  // Dispatch event
  window.dispatchEvent(event);

  if (eventName === InflowwEvent.SET_THEME_MODE) {
    const payload =
      eventData as EventPayloadMap[typeof InflowwEvent.SET_THEME_MODE];
    if ((payload as SetThemeModePayload)?.mode) {
      // Set theme mode attribute on the document element
      document.documentElement.setAttribute(
        "Infloww-theme-mode",
        (payload as SetThemeModePayload).mode
      );
    }
  }
};

window.addEventListener("message", (event: MessageEvent) => {
  const { data } = event || {};
  const { type, eventName, eventData } = data as {
    type: "Infloww:v1:call-event";
    eventName: InflowwEvent;
    eventData: EventPayloadMap[InflowwEvent];
  };

  if (type === "Infloww:v1:call-event" && eventName) {
    callThirdPartyEvent(
      eventName,
      eventData as EventPayloadMap[typeof eventName]
    );
  }
});

console.log("🔍 world window loaded", window);
