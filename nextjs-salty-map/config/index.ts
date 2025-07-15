// =============================================================================
// CONFIGURATION MODULE
// =============================================================================

export const mapConfig = {
  ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "pk.eyJ1IjoiZmVsaXhoZWxsc3Ryb20iLCJhIjoiY20zaXhucjcwMDVwdTJqcG83ZjMxemJlciJ9._TipZd1k8nMEslWbCDg6Eg",
  STYLE: "mapbox://styles/felixhellstrom/cmc0qhn8p00gs01s921jm5bkv",
  DEFAULT_ZOOM: 2,
  DESKTOP_START_POSITION: [-123.046253, 33.837038] as [number, number],
  MOBILE_START_POSITION: [-140.3628729, 33.900661] as [number, number],
  START_PITCH: 0,
  DETAIL_ZOOM: 15,
  MOBILE_BREAKPOINT: 768,
};

export const apiConfig = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://salty-development-2.vercel.app",
  WEATHER_PROXY_URL: "", // Will use mock for now
};

export const webflowConfig = {
  SITE_ID: process.env.NEXT_PUBLIC_WEBFLOW_SITE_ID || "677e87dd7e4a4c73cbae4e0e",
  BEACHES_COLLECTION_ID: process.env.NEXT_PUBLIC_WEBFLOW_BEACHES_COLLECTION_ID || "6786e26d4438e40d5e56c085",
  POI_COLLECTION_ID: process.env.NEXT_PUBLIC_WEBFLOW_POI_COLLECTION_ID || "6786de91c5b6dbbb511c16df",
};

export const selectorsConfig = {
  MAP_CONTAINER: "map-container",
  DETAIL_SIDEBAR: "detail-sidebar",
  DETAIL_SIDEBAR_CONTENT: "detail-sidebar-content",
  BEACH_LIST_ITEMS: "beach-list-item",
};

export const uiConfig = {
  MAP_FLY_SPEED: 1.5,
  RENDER_DELAY: 150,
  POPUP_OFFSET: 32,
  LIST_ITEM_HEIGHT: 80,
};

export const layerIds = {
  STATES: "salty-state",
  CALIFORNIA: "California",
  HAWAII: "Hawaii", 
  REGIONS: "salty-city",
  BEACHES: "salty-beaches",
  POIS: "salty-pois",
};

export const Config = {
  MAP: mapConfig,
  API: apiConfig,
  WEBFLOW: webflowConfig,
  SELECTORS: selectorsConfig,
  UI: uiConfig,
  LAYER_IDS: layerIds,
};