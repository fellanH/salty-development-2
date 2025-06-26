// =============================================================================
// CONFIGURATION MODULE
// =============================================================================

export const Config = {
  // Map Configuration
  MAP: {
    ACCESS_TOKEN:
      "pk.eyJ1IjoiZmVsaXhoZWxsc3Ryb20iLCJhIjoiY20zaXhucjcwMDVwdTJqcG83ZjMxemJlciJ9._TipZd1k8nMEslWbCDg6Eg",
    STYLE: "mapbox://styles/felixhellstrom/cmc0qhn8p00gs01s921jm5bkv",
    DEFAULT_ZOOM: 2,
    DESKTOP_START_POSITION: [-123.046253, 33.837038],
    MOBILE_START_POSITION: [-140.3628729, 33.900661],
    START_PITCH: 0,
    DETAIL_ZOOM: 15,
    MOBILE_BREAKPOINT: 768,
  },

  // Navigation and Event Action Configuration
  EVENT_ACTIONS: {
    // Defines what happens when a user selects an entity (map or list)
    selectState: {
      description: "Action when a state is clicked.",
      actions: [
        { type: "FLY_TO", zoomLevel: 5, speed: 1.2 },
        { type: "UPDATE_APP_STATE" },
        { type: "SHOW_SIDEBAR", sidebar: "list" },
      ],
    },
    selectRegion: {
      description: "Action when a region/city cluster is clicked.",
      actions: [
        { type: "FLY_TO", zoomLevel: 9, speed: 1.4 },
        { type: "UPDATE_APP_STATE" },
        { type: "SHOW_SIDEBAR", sidebar: "list" },
      ],
    },
    selectBeach: {
      description:
        "Actions for selecting a beach, contextual to source and device.",
      bySource: {
        "map-marker": {
          default: [
            { type: "UPDATE_APP_STATE" },
            { type: "SHOW_POPUP", delay: 100 },
          ],
          mobile: [
            { type: "UPDATE_APP_STATE" },
            { type: "SHOW_SIDEBAR", sidebar: "detail" },
            { type: "SHOW_POPUP", delay: 100 },
          ],
        },
        "sidebar-list-item": {
          default: [
            { type: "UPDATE_APP_STATE" },
            { type: "FLY_TO", zoomLevel: 15, speed: 1.2 },
            { type: "SHOW_SIDEBAR", sidebar: "detail" },
          ],
          mobile: [
            { type: "UPDATE_APP_STATE" },
            { type: "SHOW_SIDEBAR", sidebar: "detail" },
            { type: "SHOW_POPUP", delay: 100 },
          ],
        },
        popup: {
          default: [
            { type: "UPDATE_APP_STATE" },
            { type: "SHOW_SIDEBAR", sidebar: "detail" },
          ],
          mobile: [
            { type: "UPDATE_APP_STATE" },
            { type: "FLY_TO", zoomLevel: 14, speed: 1.2 },
            { type: "SHOW_SIDEBAR", sidebar: "detail" },
          ],
        },
      },
    },

    // Defines actions for static UI buttons
    navigateHome: {
      description: "Action for buttons navigating to the home screen.",
      actions: [{ type: "SHOW_SIDEBAR", sidebar: "home" }],
    },
    navigateToList: {
      description: "Action for buttons that should open the list view.",
      actions: [{ type: "SHOW_SIDEBAR", sidebar: "list" }],
    },
    closeDetailAndReset: {
      description:
        "Action for the close button in the detail view to reset the map.",
      actions: [
        { type: "SHOW_SIDEBAR", sidebar: "list" },
        { type: "FLY_TO_DEFAULT_POSITION" },
      ],
    },
    backToList: {
      description:
        "Action for the back button in detail view to return to the list, close popups, and zoom out.",
      actions: [
        { type: "SHOW_SIDEBAR", sidebar: "list" },
        { type: "CLOSE_ALL_POPUPS" },
        { type: "ZOOM_TO", zoomLevel: 9, speed: 1.4 },
      ],
    },
    toggleFullscreen: {
      description: "Action for the fullscreen toggle button.",
      actions: [{ type: "TOGGLE_FULLSCREEN" }],
    },
  },

  // API Configuration
  API: {
    BASE_URL: "", // Will use mock for now
    WEATHER_PROXY_URL: "", // Will use mock for now
  },

  // Webflow Configuration
  WEBFLOW: {
    SITE_ID: "677e87dd7e4a4c73cbae4e0e",
    BEACHES_COLLECTION_ID: "6786e26d4438e40d5e56c085",
    POIS_COLLECTION_ID: "6786de91c5b6dbbb511c16df",
  },

  // DOM Selectors - Using semantic data attributes instead of Webflow IDs
  SELECTORS: {
    MAP_CONTAINER: "#map-container",
    DETAIL_SIDEBAR: "#detail-sidebar",
    DETAIL_SIDEBAR_CONTENT: "#detail-sidebar-content",
    BEACH_LIST_ITEMS: ".beach-list-item",

    // Sidebar Elements
    SIDEBAR_WRAPPER: '[sidebar="wrapper"]',
    SIDEBAR_HOME: '[sidebar="home"]',
    SIDEBAR_BEACH_LIST: '[sidebar="beach-list"]',
    SIDEBAR_BEACH: '[sidebar="beach"]',
    BEACH_LIST_CONTAINER: ".beach-list_list",
    BEACH_LIST_ITEM_TEMPLATE: "#beach-list-item-template",

    // Beach List Item Template Elements
    TEMPLATE_BEACH_LINK: ".beach-info-small_wrapper",
    TEMPLATE_BEACH_IMAGE: '[beach-list-item="image"]',
    TEMPLATE_BEACH_TITLE: '[beach-list-item="title"]',
    TEMPLATE_BEACH_LOCATION_WRAPPER: '[beach-list-item="location-wrapper"]',
    TEMPLATE_BEACH_CLUSTER: '[beach-list-item="location-cluster"]',
    TEMPLATE_BEACH_STATE: '[beach-list-item="state"]',
    TEMPLATE_BEACH_DELIMITER: ".delimiter",

    // Beach Detail Page Elements
    BEACH_DETAIL_IMAGE: '[beach-data="image"]',
    BEACH_DETAIL_TITLE: '[beach-data="title"]',
    BEACH_DETAIL_ADDRESS_LINK: '[beach-data="address-link"]',
    BEACH_DETAIL_ADDRESS_TEXT: '[beach-data="address-text"]',
    BEACH_DETAIL_WEBSITE_LINK: '[beach-data="website-link"]',
    BEACH_DETAIL_WEBSITE_TEXT: '[beach-data="website-text"]',

    // Amenity Details
    BEACH_DETAIL_RESTROOMS: '[beach-data="restrooms"]',
    BEACH_DETAIL_SHOWERS: '[beach-data="showers"]',
    BEACH_DETAIL_PETS: '[beach-data="pets"]',
    BEACH_DETAIL_PARKING: '[beach-data="parking"]',
    BEACH_DETAIL_CAMPING: '[beach-data="camping"]',

    // Weather Details
    WEATHER_AIR_TEMP: '[beach-data="air-temp"]',
    WEATHER_FEELS_LIKE: '[beach-data="feels-like"]',
    WEATHER_HUMIDITY: '[beach-data="humidity"]',
    WEATHER_WIND: '[beach-data="wind"]',
    WEATHER_WIND_DIRECTION: '[beach-data="wind-direction"]',
    WEATHER_AQI: '[beach-data="aqi"]',
    WEATHER_RAINFALL: '[beach-data="rainfall"]',
    WEATHER_PRESSURE: '[beach-data="pressure"]',
    WEATHER_PM25: '[beach-data="pm25"]',
    WEATHER_PM10: '[beach-data="pm10"]',
    WEATHER_WATER_TEMP: '[beach-data="water-temp"]',
    WEATHER_WAVE_HEIGHT: '[beach-data="wave-height"]',
    WEATHER_OCEAN_CURRENT: '[beach-data="ocean-current"]',
    WEATHER_UV_INDEX: '[beach-data="uv-index"]',
    WEATHER_CLOUD_COVER: '[beach-data="cloud-cover"]',
    WEATHER_SUNSET: '[beach-data="sunset"]',

    // Navigation Buttons
    BEACH_DETAIL_BACK_BUTTON: ".modal_back-button",
    BEACH_DETAIL_CLOSE_BUTTON: ".modal_close-button",
  },

  // Animation and UI Settings
  UI: {
    MAP_FLY_SPEED: 1.5,
    RENDER_DELAY: 150,
    POPUP_OFFSET: 32,
    LIST_ITEM_HEIGHT: 80,
  },

  // Configuration for different feature types
  FEATURE_CONFIG: {
    state: {
      templateId: "#state-list-item-template",
      actionName: "selectState",
      dataMapping: {
        '[state-list-item="image"]': {
          type: "image",
          source: (p) =>
            p["IMAGE"] ||
            "https://cdn.prod.website-files.com/677e87dd7e4a4c73cbae4e0e/677e87dd7e4a4c73cbae4ee3_placeholder-image.svg",
        },
        '[state-list-item="title"]': {
          type: "text",
          source: (p) => p.NAME || "Unnamed State",
        },
        '[state-list-item="count"]': {
          type: "text",
          source: (p) =>
            `${p.point_count_abbreviated || p.point_count || 1} beaches`,
        },
      },
    },
    region: {
      templateId: "#city-list-item-template",
      actionName: "selectRegion",
      dataMapping: {
        '[city-list-item="title"]': {
          type: "text",
          source: (p) => p["name"] || "Unnamed Region",
        },
        '[city-list-item="count"]': {
          type: "text",
          source: (p) =>
            `${p.point_count_abbreviated || p.point_count || 1} beaches`,
        },
      },
    },
    beach: {
      templateId: "#beach-list-item-template",
      actionName: "selectBeach",
      dataMapping: {
        '[beach-list-item="image"]': {
          type: "image",
          source: (p) =>
            p["Main Image"] ||
            "https://cdn.prod.website-files.com/677e87dd7e4a4c73cbae4e0e/677e87dd7e4a4c73cbae4ee3_placeholder-image.svg",
        },
        '[beach-list-item="title"]': {
          type: "text",
          source: (p) => p.Name || "Beach Title",
        },
        '[beach-list-item="location-cluster"]': {
          type: "text",
          source: (p) => p["Location Cluster"],
        },
        '[beach-list-item="state"]': { type: "text", source: (p) => p.State },
        '[beach-list-item="delimiter"]': {
          type: "style",
          style: { display: "inline" },
        }, // Ensure delimiter is visible
      },
    },
  },
};
