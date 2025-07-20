export const eventActionsConfig = {
  selectState: {
    actions: [
      { type: "FLY_TO", zoomLevel: 5, speedMultiplier: 2 },
    ],
  },
  selectRegion: {
    actions: [
      { type: "FLY_TO", zoomLevel: 9, speedMultiplier: 2 },
      { type: "UPDATE_APP_STATE" },
      { type: "SHOW_SIDEBAR", sidebar: "beach-list" },
    ],
  },
  selectBeachFromMap: {
    actions: [
      {
        type: "FLY_TO",
        zoomLevel: 14.5,
        speedMultiplier: 2,
      },
      { type: "SHOW_POPUP", delayInMs: 100 },
      {
        type: "FLY_TO",
        when: { context: "isMobile" },
      },
      {
        type: "UPDATE_APP_STATE",
        when: { context: "isMobile" },
      },
    ],
  },
  selectBeachFromList: {
    actions: [
      { type: "FLY_TO", zoomLevel: 14.5, speedMultiplier: 2 },
      { type: "SHOW_POPUP", delayInMs: 100, when: { context: "isDesktop" } },
    ],
  },
  selectBeachFromPopup: {
    actions: [
      {
        type: "FLY_TO",
        zoomLevel: 14,
        speedMultiplier: 1.2,
      },
      { type: "UPDATE_APP_STATE" },
      { type: "SHOW_SIDEBAR", sidebar: "beach" },
      {
        type: "SHOW_SIDEBAR",
        sidebar: "beach",
        when: { context: "isMobile" },
      },
    ],
  },
  selectPOIFromMap: {
    actions: [
      {
        type: "FLY_TO",
        zoomLevel: 16,
        speedMultiplier: 2,
      },
      { type: "SHOW_POPUP", delayInMs: 100 },
      {
        type: "FLY_TO",
        when: { context: "isMobile" },
      },
      {
        type: "UPDATE_APP_STATE",
        when: { context: "isMobile" },
      },
    ],
  },
  selectPOIFromList: {
    actions: [
      { type: "FLY_TO", zoomLevel: 16, speedMultiplier: 2 },
      { type: "SHOW_POPUP", delayInMs: 100, when: { context: "isDesktop" } },
    ],
  },
  selectPOIFromPopup: {
    actions: [
      {
        type: "FLY_TO",
        zoomLevel: 16,
        speedMultiplier: 1.2,
      },
      { type: "UPDATE_APP_STATE" },
      { type: "SHOW_SIDEBAR", sidebar: "beach" },
      {
        type: "SHOW_SIDEBAR",
        sidebar: "beach",
        when: { context: "isMobile" },
      },
    ],
  },
  navigateHome: {
    actions: [{ type: "FLY_TO_DEFAULT_POSITION" }, { type: "SHOW_SIDEBAR", sidebar: "home" }],
  },
  navigateToList: {
    actions: [{ type: "SHOW_SIDEBAR", sidebar: "beach-list" }],
  },
  closeDetailAndReset: {
    actions: [
      { type: "FLY_TO_DEFAULT_POSITION" },
      { type: "UPDATE_APP_STATE", payload: { id: null, type: null, feature: null } },
      { type: "SHOW_SIDEBAR", sidebar: "home" },
    ],
  },
  backToList: {
    actions: [
      { type: "UPDATE_APP_STATE", payload: { id: null, type: null, feature: null } },
      { type: "SHOW_SIDEBAR", sidebar: "beach-list" },
    ],
  },
  toggleFullscreen: {
    actions: [{ type: "TOGGLE_FULLSCREEN" }],
  },
};
