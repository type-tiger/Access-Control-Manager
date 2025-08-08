import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_start",
  all_frames: true,
  world: "MAIN",
};

const callThirdPartyEvent = (eventName: string, eventData: any) => {
  const event = new CustomEvent(eventName, {
    detail: {
      data: eventData,
      requestId: `event-${Date.now()}`,
      callback: (response: any) => {
        console.log(
          "🔍 main world script received webview call event response:",
          response
        );

        window.dispatchEvent(
          new CustomEvent(`Infloww:v1:call-event-response`, {
            detail: {
              eventName,
              ...response,
            },
          })
        );
      },
    },
  });

  // Dispatch event
  window.dispatchEvent(event);
};

window.addEventListener("message", (event) => {
  const { data } = event;
  const { type, eventName, eventData } = data;
  if (type === "Infloww:v1:call-event") {
    callThirdPartyEvent(eventName, eventData);
  }
});

console.log("🔍 world window loaded", window);
