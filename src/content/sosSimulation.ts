export const sosSimulation = {
  holdDurationMs: 3_000,
  instruction: "Press and hold SOS for 3 seconds",
  holding: "Keep holding",
  received: "SOS alert received",
  popup: {
    eyebrow: "Incoming SOS · Simulation",
    title: "Someone needs help",
    description: "Verify the report promptly and coordinate the appropriate response.",
    locationLabel: "Sample report location",
    submitted: "Submitted just now",
    status: "Pending authorized review",
    dismissLabel: "Dismiss simulation",
    soundNote: "Notification sound plays when permitted by your browser.",
  },
} as const;
