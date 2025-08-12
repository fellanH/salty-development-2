const O = {
  ACCESS_TOKEN: "pk.eyJ1IjoiZmVsaXhoZWxsc3Ryb20iLCJhIjoiY20zaXhucjcwMDVwdTJqcG83ZjMxemJlciJ9._TipZd1k8nMEslWbCDg6Eg",
  STYLE: "mapbox://styles/felixhellstrom/cmc0qhn8p00gs01s921jm5bkv",
  DEFAULT_ZOOM: 2,
  DESKTOP_START_POSITION: [-123.046253, 33.837038],
  MOBILE_START_POSITION: [-140.3628729, 33.900661],
  START_PITCH: 0,
  DETAIL_ZOOM: 15,
  MOBILE_BREAKPOINT: 768
}, M = {
  selectState: {
    description: "Action when a state is clicked on the map or in the list.",
    actions: [
      { type: "FLY_TO", zoomLevel: 5, speed: 2 },
      { type: "UPDATE_APP_STATE" },
      { type: "SHOW_SIDEBAR", sidebar: "list" }
    ]
  },
  selectRegion: {
    description: "Action when a region/city cluster is clicked.",
    actions: [
      { type: "FLY_TO", zoomLevel: 9, speed: 2 },
      { type: "UPDATE_APP_STATE" },
      { type: "SHOW_SIDEBAR", sidebar: "list" }
    ]
  },
  selectBeachFromMap: {
    description: "Action when a beach is selected directly from the map.",
    actions: [
      { type: "UPDATE_APP_STATE" },
      {
        type: "FLY_TO",
        zoomLevel: 14.5,
        speed: 2,
        when: { context: "isMobile" }
      },
      { type: "SHOW_POPUP", delay: 100 },
      {
        type: "SHOW_SIDEBAR",
        sidebar: "detail",
        when: { context: "isMobile" }
      }
    ]
  },
  selectBeachFromList: {
    description: "Action when a beach is selected from a sidebar list.",
    actions: [
      { type: "UPDATE_APP_STATE" },
      { type: "SHOW_SIDEBAR", sidebar: "detail" },
      { type: "FLY_TO", zoomLevel: 14.5, speed: 2 },
      { type: "SHOW_POPUP", delay: 100, when: { context: "isDesktop" } }
    ]
  },
  selectBeachFromPopup: {
    description: "Action when a beach popup is clicked.",
    actions: [
      { type: "UPDATE_APP_STATE" },
      { type: "SHOW_SIDEBAR", sidebar: "detail" },
      {
        type: "FLY_TO",
        zoomLevel: 14,
        speed: 1.2,
        when: { context: "isMobile" }
      }
    ]
  },
  selectPOIFromMap: {
    description: "Action when a POI marker is clicked directly from the map.",
    actions: [
      { type: "UPDATE_APP_STATE" },
      {
        type: "FLY_TO",
        zoomLevel: 16,
        speed: 2,
        when: { context: "isMobile" }
      },
      { type: "SHOW_POPUP", delay: 100 },
      {
        type: "SHOW_SIDEBAR",
        sidebar: "detail",
        when: { context: "isMobile" }
      }
    ]
  },
  selectPOIFromList: {
    description: "Action when a POI is selected from a sidebar list.",
    actions: [
      { type: "UPDATE_APP_STATE" },
      { type: "SHOW_SIDEBAR", sidebar: "detail" },
      { type: "FLY_TO", zoomLevel: 16, speed: 2 },
      { type: "SHOW_POPUP", delay: 100, when: { context: "isDesktop" } }
    ]
  },
  selectPOIFromPopup: {
    description: "Action when a POI popup is clicked.",
    actions: [
      { type: "UPDATE_APP_STATE" },
      { type: "SHOW_SIDEBAR", sidebar: "detail" },
      {
        type: "FLY_TO",
        zoomLevel: 16,
        speed: 1.2,
        when: { context: "isMobile" }
      }
    ]
  },
  // Defines actions for static UI buttons
  navigateHome: {
    description: "Action for buttons navigating to the home screen.",
    actions: [{ type: "SHOW_SIDEBAR", sidebar: "home" }]
  },
  navigateToList: {
    description: "Action for buttons that should open the list view.",
    actions: [{ type: "SHOW_SIDEBAR", sidebar: "list" }]
  },
  closeDetailAndReset: {
    description: "Action for the close button in the detail view to reset the map.",
    actions: [
      { type: "SHOW_SIDEBAR", sidebar: "list" },
      { type: "FLY_TO_DEFAULT_POSITION" }
    ]
  },
  backToList: {
    description: "Action for the back button in detail view to return to the list, close popups, and zoom out.",
    actions: [
      { type: "SHOW_SIDEBAR", sidebar: "list" },
      { type: "CLOSE_ALL_POPUPS" }
    ]
  },
  toggleFullscreen: {
    description: "Action for the fullscreen toggle button.",
    actions: [{ type: "TOGGLE_FULLSCREEN" }]
  }
}, I = {
  BASE_URL: "https://salty-development-2.vercel.app",
  WEATHER_PROXY_URL: ""
  // Will use mock for now
}, v = {
  SITE_ID: "677e87dd7e4a4c73cbae4e0e",
  BEACHES_COLLECTION_ID: "6786e26d4438e40d5e56c085",
  POI_COLLECTION_ID: "6786de91c5b6dbbb511c16df"
}, N = {
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
  BEACH_DETAIL_CLOSE_BUTTON: ".modal_close-button"
}, R = {
  MAP_FLY_SPEED: 1.2,
  RENDER_DELAY: 150,
  POPUP_OFFSET: [0, -30],
  HOVER_POPUP_DELAY: 300,
  LIST_ITEM_HEIGHT: 80
}, U = {
  state: {
    templateId: "#state-list-item-template",
    actionName: "selectState",
    dataMapping: {
      '[state-list-item="image"]': {
        type: "image",
        source: (e) => e.IMAGE || "https://cdn.prod.website-files.com/677e87dd7e4a4c73cbae4e0e/677e87dd7e4a4c73cbae4ee3_placeholder-image.svg"
      },
      '[state-list-item="title"]': {
        type: "text",
        source: (e) => e.NAME || "Unnamed State"
      }
    }
  },
  region: {
    templateId: "#city-list-item-template",
    actionName: "selectRegion",
    dataMapping: {
      '[city-list-item="image"]': {
        type: "image",
        source: (e) => e.Image || "https://cdn.prod.website-files.com/677e87dd7e4a4c73cbae4e0e/677e87dd7e4a4c73cbae4ee3_placeholder-image.svg"
      },
      '[city-list-item="title"]': {
        type: "text",
        source: (e) => e.name || "Unnamed Region"
      }
    }
  },
  beach: {
    templateId: "#beach-list-item-template",
    actionName: "selectBeachFromList",
    dataMapping: {
      '[beach-list-item="image"]': {
        type: "image",
        source: (e) => e["Main Image"] || "https://cdn.prod.website-files.com/677e87dd7e4a4c73cbae4e0e/677e87dd7e4a4c73cbae4ee3_placeholder-image.svg"
      },
      '[beach-list-item="title"]': {
        type: "text",
        source: (e) => e.Name || "Beach Title"
      },
      '[beach-list-item="location-cluster"]': {
        type: "text",
        source: (e) => e["Location Cluster"]
      },
      '[beach-list-item="state"]': { type: "text", source: (e) => e.State },
      '[beach-list-item="delimiter"]': {
        type: "style",
        style: { display: "inline" }
      }
      // Ensure delimiter is visible
    }
  },
  poi: {
    templateId: "#beach-list-item-template",
    // Reuse beach template for now
    actionName: "selectPOIFromList",
    dataMapping: {
      '[beach-list-item="image"]': {
        type: "image",
        source: (e) => e.mainImageUrl || e["Main Image"] || e.imageUrl || "https://cdn.prod.website-files.com/677e87dd7e4a4c73cbae4e0e/677e87dd7e4a4c73cbae4ee3_placeholder-image.svg"
      },
      '[beach-list-item="title"]': {
        type: "text",
        source: (e) => e.name || e.Name || "Point of Interest"
      },
      '[beach-list-item="location-cluster"]': {
        type: "text",
        source: (e) => e.categoryName || e.category || e.type || "POI"
      },
      '[beach-list-item="state"]': {
        type: "text",
        source: (e) => e.customIconName || e["Custom Icon"] || e.State || e.state || ""
      },
      '[beach-list-item="delimiter"]': {
        type: "style",
        style: { display: "inline" }
      }
    }
  }
}, d = {
  MAP: O,
  EVENT_ACTIONS: M,
  API: I,
  WEBFLOW: v,
  SELECTORS: N,
  UI: R,
  FEATURE_CONFIG: U
}, f = /* @__PURE__ */ new Map(), p = {
  /**
   * Subscribe to an event.
   * @param {string} eventName - The name of the event.
   * @param {Function} callback - The function to call when the event is published.
   * @returns {object} An object with an `unsubscribe` method.
   */
  subscribe(e, t) {
    f.has(e) || f.set(e, []);
    const i = f.get(e);
    return i.push(t), console.log(`[EventBus] Subscribed to "${e}"`), {
      unsubscribe() {
        const a = i.indexOf(t);
        a > -1 && i.splice(a, 1);
      }
    };
  },
  /**
   * Publish an event.
   * @param {string} eventName - The name of the event.
   * @param {*} data - The data to pass to subscribers.
   */
  publish(e, t) {
    f.has(e) && (console.log(`[EventBus] Publishing "${e}"`, t), f.get(e).forEach((i) => i(t)));
  }
};
let h = {
  map: null,
  currentSelection: {
    id: null,
    type: null,
    feature: null
  },
  cache: {
    weatherData: /* @__PURE__ */ new Map(),
    visibleFeatures: /* @__PURE__ */ new Map(),
    beachData: /* @__PURE__ */ new Map(),
    // Cache for all beach details
    poiData: /* @__PURE__ */ new Map()
    // Cache for all POI details
  },
  ui: {
    currentSidebar: "home",
    isMobile: !1,
    isLoading: !1,
    elements: {},
    openPopups: []
  }
};
function B(e, t) {
  switch (t.type) {
    case "SET_MAP_INSTANCE":
      return { ...e, map: t.payload };
    case "SET_SELECTION":
      return console.log("[DEBUG] SET_SELECTION payload:", t.payload), e.currentSelection.id === t.payload.id && e.currentSelection.type === t.payload.type ? e : { ...e, currentSelection: t.payload };
    case "CLEAR_SELECTION":
      return {
        ...e,
        currentSelection: { id: null, type: null, feature: null }
      };
    case "SET_VISIBLE_FEATURES":
      const i = /* @__PURE__ */ new Map();
      return t.payload.forEach((n) => {
        const m = n.properties["Item ID"] || n.properties.NAME || n.properties.Name || n.id;
        m && i.set(String(m), n);
      }), { ...e, cache: { ...e.cache, visibleFeatures: i } };
    case "CLEAR_VISIBLE_FEATURES":
      return { ...e, cache: { ...e.cache, visibleFeatures: /* @__PURE__ */ new Map() } };
    case "SET_UI_STATE":
      return { ...e, ui: { ...e.ui, ...t.payload } };
    case "SET_WEATHER_DATA":
      const a = new Map(e.cache.weatherData);
      return a.set(t.payload.id, t.payload.data), { ...e, cache: { ...e.cache, weatherData: a } };
    case "DELETE_WEATHER_DATA":
      const s = new Map(e.cache.weatherData);
      return s.delete(t.payload.id), { ...e, cache: { ...e.cache, weatherData: s } };
    case "ADD_OPEN_POPUP":
      return { ...e, ui: { ...e.ui, openPopups: [...e.ui.openPopups, t.payload] } };
    case "REMOVE_OPEN_POPUP":
      return { ...e, ui: { ...e.ui, openPopups: e.ui.openPopups.filter((n) => n !== t.payload) } };
    case "CLEAR_OPEN_POPUPS":
      return { ...e, ui: { ...e.ui, openPopups: [] } };
    case "SET_ALL_BEACH_DATA":
      const r = /* @__PURE__ */ new Map();
      return t.payload.forEach((n) => r.set(n.id, n)), { ...e, cache: { ...e.cache, beachData: r } };
    case "SET_ALL_POI_DATA":
      const c = /* @__PURE__ */ new Map();
      return t.payload.forEach((n) => c.set(n.id, n)), { ...e, cache: { ...e.cache, poiData: c } };
    default:
      return e;
  }
}
const o = {
  /**
   * Dispatches an action to update the state.
   * @param {object} action - The action to dispatch (e.g., { type: 'SET_SELECTION', payload: ... }).
   */
  dispatch(e) {
    const t = h;
    h = B(h, e), console.log(`[AppState] Action Dispatched: ${e.type}`, e.payload), p.publish("state:changed", {
      newState: h,
      oldState: t,
      action: e
    }), e.type === "SET_SELECTION" && p.publish("state:selectionChanged", h.currentSelection);
  },
  /**
   * Gets the current state.
   * @returns {object} The current application state.
   */
  getState() {
    return h;
  },
  // Example of specific getters for convenience
  getMap() {
    return h.map;
  },
  getCurrentSelection() {
    return { ...h.currentSelection };
  },
  getUICachedElement(e) {
    return h.ui.elements[e];
  },
  getVisibleFeatures() {
    return h.cache.visibleFeatures;
  },
  getOpenPopups() {
    return h.ui.openPopups;
  },
  getBeachById(e) {
    return h.cache.beachData.get(e);
  },
  getPOIById(e) {
    return h.cache.poiData.get(e);
  }
}, T = {
  /**
   * Check if current view is mobile
   * @returns {boolean} True if mobile view
   */
  isMobileView() {
    return window.innerWidth <= d.MAP.MOBILE_BREAKPOINT;
  },
  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(e, t) {
    let i;
    return function(...s) {
      const r = () => {
        clearTimeout(i), e(...s);
      };
      clearTimeout(i), i = setTimeout(r, t);
    };
  },
  /**
   * Show loading state
   * @param {HTMLElement} element - Element to show loading in
   */
  showLoading(e) {
    e.innerHTML = '<div class="loader" style="display: flex; justify-content: center; padding: 20px;">Loading...</div>';
  },
  /**
   * Show error message
   * @param {HTMLElement} element - Element to show error in
   * @param {string} message - Error message
   */
  showError(e, t) {
    e.innerHTML = `<div class="error" style="padding: 20px; text-align: center; color: #d32f2f;">${t}</div>`;
  },
  /**
   * Gets a unique and consistent ID from a feature's properties.
   * @param {object} feature - The GeoJSON feature.
   * @returns {string|number|null} The unique ID of the feature.
   */
  getFeatureEntityId(e) {
    if (!e) return null;
    const t = e.properties || {};
    return t["Item ID"] || t["Location Cluster"] || t.NAME || t.Name || e.id;
  },
  /**
   * Updates a DOM element with a value, supporting various update types.
   * @param {object} mapping - The mapping object.
   * @param {HTMLElement} mapping.element - The DOM element to update.
   * @param {*} mapping.value - The value to apply.
   * @param {string} [mapping.type='text'] - 'text', 'href', 'src', 'html'.
   * @param {string} [mapping.defaultValue='N/A'] - Fallback value.
   * @param {function(value): *} [mapping.transform] - A function to transform the value before setting.
   */
  updateElement({
    element: e,
    value: t,
    type: i = "text",
    defaultValue: a = "N/A",
    transform: s
  }) {
    if (!e) return;
    let r = t ?? a;
    switch (s && (r = s(r)), i) {
      case "href":
        e.href = r;
        break;
      case "src":
        e.src = r;
        break;
      case "html":
        e.innerHTML = r;
        break;
      default:
        e.textContent = r;
    }
  },
  /**
   * Populates elements in a container with data from an object.
   * It looks for elements with a `data-bind` attribute and uses the attribute's
   * value to look up the corresponding key in the data object.
   * @param {HTMLElement} container - The parent element containing elements to populate.
   * @param {object} data - The data object.
   */
  renderView(e, t) {
    !e || !t || e.querySelectorAll("[data-bind]").forEach((i) => {
      const a = i.dataset.bind, s = t[a];
      s != null ? i.tagName === "A" ? i.href = s : i.tagName === "IMG" ? i.src = s : i.textContent = s : i.textContent = "";
    });
  }
}, _ = {
  /**
   * Executes a named action sequence.
   * @param {string} actionName - The key from Config.EVENT_ACTIONS.
   * @param {object} context - Contextual data (e.g., feature, target).
   */
  execute(e, t = {}) {
    const i = d.EVENT_ACTIONS[e];
    if (!i) {
      console.warn(
        `[ActionController] No action configured for '${e}'.`
      );
      return;
    }
    if (!t.feature && t.target) {
      const { entityType: a, featureId: s } = t.target.dataset;
      a && s && (t.feature = o.getState().cache.visibleFeatures.get(s), t.entityType = a);
    }
    console.log(
      `[ActionController] Executing action: '${e}'`,
      t
    ), i.actions.forEach((a) => {
      if (a.when) {
        const s = Object.keys(a.when)[0], r = a.when[s];
        let c = !1;
        if (s === "context" && (r === "isMobile" && (c = T.isMobileView()), r === "isDesktop" && (c = !T.isMobileView())), !c) return;
      }
      this.runAction(a, t);
    });
  },
  /**
   * Runs a single action.
   * @param {object} action - The action object from the config.
   * @param {object} context - The context for this execution.
   */
  runAction(e, t) {
    const { feature: i, entityType: a } = t;
    switch (e.type) {
      case "FLY_TO":
        i && i.geometry && p.publish("map:flyTo", {
          coordinates: i.geometry.coordinates,
          zoom: e.zoomLevel,
          speed: e.speed
        });
        break;
      case "FLY_TO_DEFAULT_POSITION":
        const s = T.isMobileView() ? d.MAP.MOBILE_START_POSITION : d.MAP.DESKTOP_START_POSITION, r = d.MAP.DEFAULT_ZOOM;
        p.publish("map:flyTo", { coordinates: s, zoom: r });
        break;
      case "UPDATE_APP_STATE":
        if (i && a) {
          const c = i.properties["Item ID"] || i.id;
          o.dispatch({
            type: "SET_SELECTION",
            payload: { type: a, id: c, feature: i }
          });
        }
        break;
      case "SHOW_SIDEBAR":
        p.publish("ui:sidebarRequested", { sidebar: e.sidebar });
        break;
      case "SHOW_POPUP":
        if (i) {
          const c = i.properties["Item ID"] || i.id;
          let n;
          a === "poi" ? n = o.getPOIById(c) : n = o.getBeachById(c), p.publish("map:showPopup", {
            feature: i,
            details: n,
            delay: e.delay,
            entityType: a
          });
        }
        break;
      case "CLOSE_ALL_POPUPS":
        p.publish("map:closeAllPopups");
        break;
      case "ZOOM_TO":
        p.publish("map:zoomTo", {
          zoom: e.zoomLevel,
          speed: e.speed
        });
        break;
      case "TOGGLE_FULLSCREEN":
        p.publish("ui:fullscreenToggled");
        break;
      default:
        console.warn(
          `[ActionController] Unknown action type: '${e.type}'`
        );
    }
  }
}, P = {
  init() {
  },
  /**
   * Render a list of features (beaches, regions, states) in the sidebar
   * @param {Array} features - An array of GeoJSON features
   * @param {string} type - The type of feature ('beach', 'region', 'state')
   */
  renderFeatureList(e = [], t = "beach") {
    console.log(`[FeatureListView] renderFeatureList for type: ${t}`, e);
    const i = o.getUICachedElement("BEACH_LIST_CONTAINER");
    if (!i) {
      console.error(
        "Beach list container not found. Check config selector: BEACH_LIST_CONTAINER"
      );
      return;
    }
    if (i.innerHTML = "", e.length === 0) {
      i.innerHTML = '<p style="padding: 20px; text-align: center;">No items in view. Pan or zoom the map to find some.</p>';
      return;
    }
    const a = (c) => c.Name || c.State || c["Location Cluster"] || "";
    e.sort(
      (c, n) => a(c.properties).localeCompare(a(n.properties))
    );
    const s = /* @__PURE__ */ new Set(), r = [];
    e.forEach((c) => {
      if (t === "beach") {
        const n = c.properties["Item ID"];
        n && !s.has(n) && (s.add(n), r.push(c));
      } else
        r.push(c);
    }), o.dispatch({ type: "SET_VISIBLE_FEATURES", payload: r }), r.forEach((c) => {
      const n = this.createListItem(c, t);
      i.appendChild(n);
    });
  },
  /**
   * Create a list item by cloning and populating a dedicated template.
   * @param {Object} feature - GeoJSON feature
   * @param {string} type - The type of feature ('beach', 'region', 'state')
   * @returns {HTMLElement} List item element
   */
  createListItem(e, t) {
    const i = d.FEATURE_CONFIG[t];
    if (!i)
      return console.error(`No template configuration found for type: ${t}`), document.createElement("div");
    const a = document.querySelector(i.templateId);
    if (!a)
      return console.error(`Template element not found for ID: ${i.templateId}`), document.createElement("div");
    const r = a.content.cloneNode(!0).firstElementChild, c = e.properties, n = T.getFeatureEntityId(e);
    o.getVisibleFeatures().get(String(n)) || console.warn(`[UIController] Feature with ID ${n} not found in cache. List item may not work correctly.`), r.dataset.entityType = t, r.dataset.featureId = n, r.setAttribute("action-trigger", i.actionName);
    for (const u in i.dataMapping) {
      const E = r.querySelector(u), b = i.dataMapping[u];
      if (E)
        switch (b.type) {
          case "text":
            E.textContent = b.source(c) || "";
            break;
          case "image":
            E.src = b.source(c), E.alt = c.Name || "List item image";
            break;
          case "style":
            Object.assign(E.style, b.style);
            break;
        }
      else
        console.warn(
          `[FeatureListView] Element for selector "${u}" not found in template "${i.templateId}"`
        );
    }
    return r;
  }
}, F = {
  init() {
  },
  /**
   * Update detail sidebar with current selection using a declarative rendering pattern.
   */
  async updateDetailSidebar() {
    const { id: e, type: t } = o.getCurrentSelection(), i = o.getUICachedElement("SIDEBAR_BEACH");
    if (console.log(`[DEBUG-DetailView] Updating sidebar for ID: ${e}, type: ${t}`), !e || !i)
      return;
    let a;
    if (t === "poi") {
      a = o.getPOIById(e);
      const n = o.getState().cache.poiData;
      if (console.log(`[DEBUG-DetailView] POI Cache has ${n.size} items. Cache keys:`, Array.from(n.keys())), !a) {
        console.error(`[DetailView] Could not find POI with ID ${e} in cache.`);
        return;
      }
    } else {
      a = o.getBeachById(e);
      const n = o.getState().cache.beachData;
      if (console.log(`[DEBUG-DetailView] Beach Cache has ${n.size} items. Cache keys:`, Array.from(n.keys())), !a) {
        console.error(`[DetailView] Could not find beach with ID ${e} in cache.`);
        return;
      }
    }
    console.log("[DEBUG-DetailView] Details object from cache:", a);
    let s;
    t === "poi" ? s = {
      imageUrl: a.mainImageUrl || a["main-image"]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
      name: a.name || a.Name || "Point of Interest",
      googleMapsUrl: a["google-maps-link"] || a.googleMapsUrl || "#",
      address: a.address || a["formatted-address"] || a["formatted-adress"] || "Address not available",
      websiteUrl: a.website || a["website-url"],
      websiteHost: (a.website || a["website-url"]) && (a.website || a["website-url"]).startsWith("http") ? new URL(a.website || a["website-url"]).hostname : "",
      phone: a.phone || "N/A",
      // POI-specific fields using the new structure
      restrooms: "N/A",
      // POIs don't typically have amenity details
      showers: "N/A",
      pets: "N/A",
      parking: "N/A",
      parkingHours: "N/A",
      camping: "N/A",
      bonfire: "N/A",
      fishing: "N/A",
      pier: "N/A",
      picnic: "N/A",
      surfing: "N/A",
      recreation: a.categoryName || a.category || a.type || "Point of Interest",
      // Weather data (POIs typically don't have weather data, so set to N/A)
      airTemp: "N/A",
      feelsLike: "N/A",
      humidity: "N/A",
      wind: "N/A",
      windDirection: "N/A",
      aqi: "N/A",
      rainfall: "N/A",
      pressure: "N/A",
      pm25: "N/A",
      pm10: "N/A",
      waterTemp: "N/A",
      waveHeight: "N/A",
      oceanCurrent: "N/A",
      uvIndex: "N/A",
      cloudCover: "N/A",
      sunset: "N/A"
    } : s = {
      imageUrl: a["main-image"]?.url || "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300",
      name: a.name || "Beach Name",
      googleMapsUrl: a["google-maps-link"] || "#",
      address: a["formatted-address"] || a["formatted-adress"] || "Google Maps Link",
      websiteUrl: a["beach-website"],
      websiteHost: a["beach-website"] && a["beach-website"].startsWith("http") ? new URL(a["beach-website"]).hostname : "",
      phone: a.phone || "N/A",
      restrooms: a.restrooms || "N/A",
      showers: a.showers || "N/A",
      pets: a["pets-allowed"] || "N/A",
      parking: a["parking-lot-nearby"] || "N/A",
      parkingHours: a["parking-hours"] || "N/A",
      camping: a["camping-offered"] || "N/A",
      bonfire: a["bonfire-availabiliity"] || "N/A",
      fishing: a.fishing || "N/A",
      pier: a.pier || "N/A",
      picnic: a["picnic-area-rentals"] || "N/A",
      surfing: a["surfing-beach"] || "N/A",
      recreation: a["recreation-activities"] || "N/A",
      airTemp: a.temperature ? `${Math.round(a.temperature)}` : "",
      feelsLike: a.feels_like ? `${Math.round(a.feels_like)}°F` : "N/A",
      humidity: a.humidity ? `${a.humidity}%` : "N/A",
      wind: a.windSpeed ? `${a.windSpeed} mph` : "N/A",
      windDirection: a.windDirection ? `${a.windDirection}°` : "N/A",
      aqi: a.aqi ?? "N/A",
      rainfall: a.rainfall ? `${a.rainfall} in` : "N/A",
      pressure: a.pressure ? `${a.pressure} inHg` : "N/A",
      pm25: a.pm25 ? `${a.pm25} µg/m³` : "N/A",
      pm10: a.pm10 ? `${a.pm10} µg/m³` : "N/A",
      waterTemp: a.water_temp ? `${Math.round(a.water_temp)}°F` : "N/A",
      waveHeight: a.wave_height ? `${a.wave_height} ft` : "N/A",
      oceanCurrent: a.ocean_current ?? "N/A",
      uvIndex: a.uv_index ?? "N/A",
      cloudCover: a.cloud_cover ? `${a.cloud_cover}%` : "N/A",
      sunset: a.sunset ? new Date(a.sunset).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"
    };
    const r = {
      imageUrl: "image",
      name: "title",
      googleMapsUrl: "address-link",
      address: "address-text",
      websiteUrl: "website-link",
      websiteHost: "website-text",
      phone: "phone",
      restrooms: "restrooms",
      showers: "showers",
      pets: "pets",
      parking: "parking",
      parkingHours: "parking-hours",
      camping: "camping",
      bonfire: "bonfire",
      fishing: "fishing",
      pier: "pier",
      picnic: "picnic",
      surfing: "surfing",
      recreation: "recreation",
      airTemp: "air-temp",
      feelsLike: "feels-like",
      humidity: "humidity",
      wind: "wind",
      windDirection: "wind-direction",
      aqi: "aqi",
      rainfall: "rainfall",
      pressure: "pressure",
      pm25: "pm25",
      pm10: "pm10",
      waterTemp: "water-temp",
      waveHeight: "wave-height",
      oceanCurrent: "ocean-current",
      uvIndex: "uv-index",
      cloudCover: "cloud-cover",
      sunset: "sunset"
    };
    for (const n in r)
      if (Object.prototype.hasOwnProperty.call(s, n)) {
        const m = r[n], l = i.querySelector(`[beach-data="${m}"]`), u = s[n];
        l && (l.tagName === "A" ? l.href = u : l.tagName === "IMG" ? (l.src = u, l.alt = s.name) : l.textContent = u);
      }
    const c = i.querySelector('[data-bind-parent="websiteUrl"]');
    c && (c.style.display = s.websiteUrl ? "flex" : "none");
  },
  /**
   * Fetch weather data with caching
   * @param {string} locationId - Location ID
   * @returns {Promise} Weather data
   */
  async fetchWeatherData(e) {
    const t = o.getState().cache.weatherData.get(e);
    if (t)
      return console.log("[DetailView] fetchWeatherData cache hit", e), t;
    try {
      const i = await fetch(`${I.BASE_URL}/api/weather/${e}`);
      if (!i.ok)
        throw new Error("Weather data not available");
      const a = await i.json();
      return console.log("[DetailView] fetchWeatherData fetched", a), o.dispatch({ type: "SET_WEATHER_DATA", payload: { id: e, data: a } }), setTimeout(() => {
        o.dispatch({ type: "DELETE_WEATHER_DATA", payload: { id: e } });
      }, 300 * 1e3), a;
    } catch (i) {
      return console.error("[DetailView] Error fetching weather data:", i), null;
    }
  }
}, H = {
  init() {
    console.log("[ResponsiveService] init"), this.updateLayout(), window.addEventListener(
      "resize",
      T.debounce(() => {
        this.updateLayout();
      }, 250)
    );
  },
  updateLayout() {
    const e = T.isMobileView(), t = o.getState().ui.isMobile;
    e !== t && (console.log(`[ResponsiveService] View changed to ${e ? "mobile" : "desktop"}`), o.dispatch({ type: "SET_UI_STATE", payload: { isMobile: e } }), p.publish("ui:viewChanged", { isMobile: e }));
  }
}, A = {
  /**
   * Initialize UI controller and cache DOM elements
   */
  init() {
    console.log("[UIController] init as coordinator"), this.cacheElements(), this.setupEventListeners(), this.setupBusSubscriptions(), P.init(), H.init();
  },
  /**
   * Cache frequently used DOM elements
   */
  cacheElements() {
    console.log("[UIController] cacheElements");
    const e = {};
    Object.entries(d.SELECTORS).forEach(([t, i]) => {
      const a = document.querySelector(i);
      a ? e[t] = a : console.warn(`[UIController] Element not found: ${i}`);
    }), o.dispatch({ type: "SET_UI_STATE", payload: { elements: e } });
  },
  /**
   * Setup event listeners for UI interactions
   */
  setupEventListeners() {
    console.log("[UIController] setupEventListeners"), document.body.addEventListener("click", (e) => {
      const t = e.target.closest("[action-trigger]");
      if (!t) return;
      e.preventDefault();
      const i = t.getAttribute("action-trigger");
      i && (console.log(`[UIController] Action triggered: ${i}`), _.execute(i, {
        target: t,
        source: "sidebar-list-item"
        // Assume all UI-driven actions originate from the sidebar
      }));
    });
  },
  /**
   * Setup subscriptions to the event bus.
   */
  setupBusSubscriptions() {
    p.subscribe("state:selectionChanged", (e) => {
      (e?.type === "beach" || e?.type === "poi") && F.updateDetailSidebar();
    }), p.subscribe("ui:sidebarRequested", (e) => this.showSidebar(e.sidebar)), p.subscribe("ui:fullscreenToggled", this.toggleFullscreen.bind(this)), p.subscribe("ui:viewChanged", () => this.showSidebar(o.getState().ui.currentSidebar));
  },
  /**
   * Handles state changes for the current selection.
   * @param {object} selection - The new selection state.
   */
  handleSelectionChange(e) {
    (!e || e.type !== "beach") && o.getState().ui.currentSidebar === "detail" && this.showSidebar("list");
  },
  /**
   * Show specific sidebar panel
   * @param {string} type - 'home', 'list', or 'detail'
   */
  showSidebar(e) {
    console.log(`[UIController] showSidebar: ${e}`), o.dispatch({
      type: "SET_UI_STATE",
      payload: { currentSidebar: e }
    });
    const {
      SIDEBAR_WRAPPER: t,
      SIDEBAR_HOME: i,
      SIDEBAR_BEACH_LIST: a,
      SIDEBAR_BEACH: s
    } = o.getState().ui.elements;
    if (!t) return;
    i && (i.style.display = "none"), a && (a.style.display = "none"), s && (s.style.display = "none");
    let r;
    switch (e) {
      case "home":
        r = i;
        break;
      case "list":
        r = a;
        break;
      case "detail":
        r = s;
        break;
    }
    r && (r.style.display = "block"), t.style.display = "block", delete t.dataset.activeSidebar, o.getState().ui.isMobile ? this.hideMap() : this.showMap();
  },
  /**
   * Show map
   */
  showMap() {
    console.log("[UIController] showMap");
    const e = o.getUICachedElement("SIDEBAR_MAP");
    e && (e.style.display = "block");
  },
  /**
   * Hide map
   */
  hideMap() {
    console.log("[UIController] hideMap");
    const e = o.getUICachedElement("SIDEBAR_MAP");
    e && (e.style.display = "none");
  },
  /**
   * Toggle fullscreen mode
   */
  toggleFullscreen() {
    console.log("[UIController] toggleFullscreen");
    const { SIDEBAR_MAP: e, SIDEBAR_WRAPPER: t } = o.getState().ui.elements;
    if (o.getState().ui.isMobile)
      e && e.style.display === "none" ? (this.hideMap(), this.showSidebar(o.getState().ui.currentSidebar)) : (this.showMap(), t && (t.style.display = "none"));
    else {
      if (t) {
        const i = t.style.display !== "none";
        t.style.display = i ? "none" : "block";
      }
      this.showMap();
    }
  },
  /**
   * Render a list of features (beaches, regions, states) in the sidebar
   * @param {Array} features - An array of GeoJSON features
   * @param {string} type - The type of feature ('beach', 'region', 'state')
   */
  renderFeatureList(e, t) {
    console.log(`[UIController] renderFeatureList for type: ${t}`, e), P.renderFeatureList(e, t);
  }
}, k = {
  features: [
    {
      type: "Feature",
      properties: {
        Name: "Hilo",
        Slug: "hilo",
        "Collection ID": "68516bf41dee6544b85f95b2",
        "Locale ID": "678661730ea760533db7153c",
        "Item ID": "68516c9cced1885ded4216fc",
        Archived: "false",
        Draft: "false",
        "Created On": "Tue Jun 17 2025 13:24:44 GMT+0000 (Coordinated Universal Time)",
        "Updated On": "Thu Jun 26 2025 08:11:46 GMT+0000 (Coordinated Universal Time)",
        "Published On": "Thu Jun 26 2025 08:11:46 GMT+0000 (Coordinated Universal Time)",
        Image: "https://cdn.prod.website-files.com/678661730ea760533db7153d/685d00c0066f35ff235125c1_hawaiian-islands-min.jpg"
      },
      geometry: null
    },
    {
      type: "Feature",
      properties: {
        Name: "Honolulu",
        Slug: "honolulu",
        "Collection ID": "68516bf41dee6544b85f95b2",
        "Locale ID": "678661730ea760533db7153c",
        "Item ID": "68516c3ecd68e66ea0dc9b27",
        Archived: "false",
        Draft: "false",
        "Created On": "Tue Jun 17 2025 13:23:10 GMT+0000 (Coordinated Universal Time)",
        "Updated On": "Thu Jun 26 2025 08:12:10 GMT+0000 (Coordinated Universal Time)",
        "Published On": "Thu Jun 26 2025 08:12:10 GMT+0000 (Coordinated Universal Time)",
        Image: "https://cdn.prod.website-files.com/678661730ea760533db7153d/685d00cd75ee1977ab157fad_honolulu-min.jpg"
      },
      geometry: null
    },
    {
      type: "Feature",
      properties: {
        Name: "Kuai",
        Slug: "kuai",
        "Collection ID": "68516bf41dee6544b85f95b2",
        "Locale ID": "678661730ea760533db7153c",
        "Item ID": "68516c2aa3b863be97349c11",
        Archived: "false",
        Draft: "false",
        "Created On": "Tue Jun 17 2025 13:22:50 GMT+0000 (Coordinated Universal Time)",
        "Updated On": "Tue Jun 17 2025 13:44:32 GMT+0000 (Coordinated Universal Time)",
        "Published On": "Tue Jun 17 2025 13:44:32 GMT+0000 (Coordinated Universal Time)",
        Image: ""
      },
      geometry: null
    },
    {
      type: "Feature",
      properties: {
        Name: "Los Angeles",
        Slug: "los-angeles",
        "Collection ID": "68516bf41dee6544b85f95b2",
        "Locale ID": "678661730ea760533db7153c",
        "Item ID": "68516dc57ef3bc9ef8f54766",
        Archived: "false",
        Draft: "false",
        "Created On": "Tue Jun 17 2025 13:29:41 GMT+0000 (Coordinated Universal Time)",
        "Updated On": "Thu Jun 26 2025 08:11:26 GMT+0000 (Coordinated Universal Time)",
        "Published On": "Thu Jun 26 2025 08:11:26 GMT+0000 (Coordinated Universal Time)",
        Image: "https://cdn.prod.website-files.com/678661730ea760533db7153d/685d00ab84ef1711792a5fac_la-min.jpg"
      },
      geometry: null
    },
    {
      type: "Feature",
      properties: {
        Name: "Maui",
        Slug: "maui",
        "Collection ID": "68516bf41dee6544b85f95b2",
        "Locale ID": "678661730ea760533db7153c",
        "Item ID": "68516c6431a74f2ee68df7d3",
        Archived: "false",
        Draft: "false",
        "Created On": "Tue Jun 17 2025 13:23:48 GMT+0000 (Coordinated Universal Time)",
        "Updated On": "Tue Jun 17 2025 13:44:32 GMT+0000 (Coordinated Universal Time)",
        "Published On": "Tue Jun 17 2025 13:44:32 GMT+0000 (Coordinated Universal Time)",
        Image: ""
      },
      geometry: null
    },
    {
      type: "Feature",
      properties: {
        Name: "Salinas",
        Slug: "salinas",
        "Collection ID": "68516bf41dee6544b85f95b2",
        "Locale ID": "678661730ea760533db7153c",
        "Item ID": "68516d362b78dd5f2a6daaa7",
        Archived: "false",
        Draft: "false",
        "Created On": "Tue Jun 17 2025 13:27:18 GMT+0000 (Coordinated Universal Time)",
        "Updated On": "Tue Jun 17 2025 13:44:32 GMT+0000 (Coordinated Universal Time)",
        "Published On": "Tue Jun 17 2025 13:44:32 GMT+0000 (Coordinated Universal Time)",
        Image: ""
      },
      geometry: null
    },
    {
      type: "Feature",
      properties: {
        Name: "San Diego",
        Slug: "san-diego",
        "Collection ID": "68516bf41dee6544b85f95b2",
        "Locale ID": "678661730ea760533db7153c",
        "Item ID": "68516dd925006c72d02c6f1a",
        Archived: "false",
        Draft: "false",
        "Created On": "Tue Jun 17 2025 13:30:01 GMT+0000 (Coordinated Universal Time)",
        "Updated On": "Thu Jun 26 2025 08:11:11 GMT+0000 (Coordinated Universal Time)",
        "Published On": "Thu Jun 26 2025 08:11:11 GMT+0000 (Coordinated Universal Time)",
        Image: "https://cdn.prod.website-files.com/678661730ea760533db7153d/685d009ce55d7bf179d27c17_san-diego-min.jpg"
      },
      geometry: null
    },
    {
      type: "Feature",
      properties: {
        Name: "San Francisco",
        Slug: "san-francisco",
        "Collection ID": "68516bf41dee6544b85f95b2",
        "Locale ID": "678661730ea760533db7153c",
        "Item ID": "68516ccd4c9f3124c6ad72df",
        Archived: "false",
        Draft: "false",
        "Created On": "Tue Jun 17 2025 13:25:33 GMT+0000 (Coordinated Universal Time)",
        "Updated On": "Thu Jun 26 2025 08:11:38 GMT+0000 (Coordinated Universal Time)",
        "Published On": "Thu Jun 26 2025 08:11:38 GMT+0000 (Coordinated Universal Time)",
        Image: "https://cdn.prod.website-files.com/678661730ea760533db7153d/685d00b8d3ebee9be09ac549_san-fransisco-min.jpg"
      },
      geometry: null
    },
    {
      type: "Feature",
      properties: {
        Name: "Santa Cruz",
        Slug: "santa-cruz",
        "Collection ID": "68516bf41dee6544b85f95b2",
        "Locale ID": "678661730ea760533db7153c",
        "Item ID": "68516d1d147c4622c39eac61",
        Archived: "false",
        Draft: "false",
        "Created On": "Tue Jun 17 2025 13:26:53 GMT+0000 (Coordinated Universal Time)",
        "Updated On": "Tue Jun 17 2025 13:44:32 GMT+0000 (Coordinated Universal Time)",
        "Published On": "Tue Jun 17 2025 13:44:32 GMT+0000 (Coordinated Universal Time)",
        Image: ""
      },
      geometry: null
    },
    {
      type: "Feature",
      properties: {
        Name: "Santa Maria",
        Slug: "santa-maria",
        "Collection ID": "68516bf41dee6544b85f95b2",
        "Locale ID": "678661730ea760533db7153c",
        "Item ID": "68516d819e3f01bd9a77c8aa",
        Archived: "false",
        Draft: "false",
        "Created On": "Tue Jun 17 2025 13:28:33 GMT+0000 (Coordinated Universal Time)",
        "Updated On": "Tue Jun 17 2025 13:44:32 GMT+0000 (Coordinated Universal Time)",
        "Published On": "Tue Jun 17 2025 13:44:32 GMT+0000 (Coordinated Universal Time)",
        Image: ""
      },
      geometry: null
    }
  ]
}, $ = {
  LAYER_IDS: {
    STATES: "salty-state",
    CALIFORNIA: "California",
    HAWAII: "Hawaii",
    REGIONS: "salty-city",
    BEACHES: "salty-beaches",
    POIS: "salty-pois"
    // POI layer from Mapbox Studio style
  },
  hoveredFeature: null,
  hoverPopup: null,
  hoverTimeout: null,
  /**
   * Initialize the Mapbox map
   */
  async init() {
    try {
      mapboxgl.accessToken = d.MAP.ACCESS_TOKEN;
      const e = new mapboxgl.Map({
        container: d.SELECTORS.MAP_CONTAINER.slice(1),
        style: d.MAP.STYLE,
        // This is your Mapbox Studio style URL
        center: T.isMobileView() ? d.MAP.MOBILE_START_POSITION : d.MAP.DESKTOP_START_POSITION,
        zoom: d.MAP.DEFAULT_ZOOM,
        pitch: d.MAP.START_PITCH
      });
      e.on("load", () => {
        o.dispatch({ type: "SET_MAP_INSTANCE", payload: e }), this.setupEventHandlers(), this.setupBusSubscriptions(), console.log("✅ Map initialized with cloud-hosted data and styles.");
      });
      const t = document.querySelector(
        d.SELECTORS.MAP_CONTAINER
      );
      new ResizeObserver(() => e.resize()).observe(t);
    } catch (e) {
      console.error("Failed to initialize map:", e), T.showError(
        document.querySelector(d.SELECTORS.MAP_CONTAINER),
        "Failed to load map. Please check your connection and try again."
      );
    }
  },
  /**
   * Setup subscriptions to the event bus
   */
  setupBusSubscriptions() {
    p.subscribe("map:flyTo", this.flyTo.bind(this)), p.subscribe("map:showPopup", (e) => {
      e && e.feature && setTimeout(
        () => this.showPopup(e.feature, e.details, e.entityType),
        e.delay || 0
      );
    }), p.subscribe("map:closeAllPopups", this.closeAllPopups.bind(this)), p.subscribe("map:zoomTo", this.zoomTo.bind(this));
  },
  /**
   * Setup general map event handlers
   */
  setupEventHandlers() {
    const e = Object.values(this.LAYER_IDS).filter(Boolean);
    if (e.length === 0) {
      console.warn(
        "⚠️ No interactive layers are defined in LAYER_IDS. Clicks will not work."
      );
      return;
    }
    o.getMap().on("click", e, (t) => {
      if (!t.features || t.features.length === 0)
        return;
      const i = t.features[0];
      let a, s;
      switch (i.layer.id) {
        case this.LAYER_IDS.BEACHES:
          a = "beach", s = "selectBeachFromMap";
          break;
        case this.LAYER_IDS.POIS:
          a = "poi", s = "selectPOIFromMap";
          break;
        case this.LAYER_IDS.REGIONS:
          a = "region", s = "selectRegion";
          break;
        case this.LAYER_IDS.STATES:
          a = "state", s = "selectState";
          break;
        default:
          return;
      }
      s && _.execute(s, { entityType: a, feature: i });
    }), o.getMap().on("mousemove", e, (t) => {
      t.features.length > 0 && (o.getMap().getCanvas().style.cursor = "pointer", this.hoveredFeature && this.hoveredFeature.id === t.features[0].id || (this.hoveredFeature && o.getMap().setFeatureState(this.hoveredFeature, {
        state: !1
      }), this.hoveredFeature = t.features[0], o.getMap().setFeatureState(this.hoveredFeature, {
        state: !0
      }), T.isMobileView() || (clearTimeout(this.hoverTimeout), this.hoverTimeout = setTimeout(() => {
        this.hoverPopup && this.hoverPopup.remove();
        const i = this.hoveredFeature;
        let a;
        switch (i.layer.id) {
          case this.LAYER_IDS.BEACHES:
            a = "beach";
            break;
          case this.LAYER_IDS.POIS:
            a = "poi";
            break;
          default:
            return;
        }
        const s = i.properties["Item ID"] || i.id, r = a === "poi" ? o.getPOIById(s) : o.getBeachById(s);
        this.hoverPopup = this.showPopup(
          i,
          r,
          a,
          !0
        );
      }, d.UI.HOVER_POPUP_DELAY))));
    }), o.getMap().on("mouseleave", e, () => {
      clearTimeout(this.hoverTimeout), this.hoverPopup && (this.hoverPopup.remove(), this.hoverPopup = null), this.hoveredFeature && o.getMap().setFeatureState(this.hoveredFeature, {
        state: !1
      }), this.hoveredFeature = null, o.getMap().getCanvas().style.cursor = "";
    }), o.getMap().on(
      "moveend",
      T.debounce(async () => {
        console.log("🗺️ Map moveend event");
        const { ui: t } = o.getState();
        if (t.currentSidebar !== "list") {
          console.log(
            `[MapController] Sidebar update skipped, current view is "${t.currentSidebar}".`
          );
          return;
        }
        await this.updateSidebarListFromMap();
      }, 250)
    );
  },
  /**
   * Update sidebar list by querying the map for visible features
   */
  async updateSidebarListFromMap() {
    const e = o.getMap();
    if (!e) return;
    const t = e.queryRenderedFeatures({
      layers: [this.LAYER_IDS.BEACHES]
    });
    if (t.length > 0) {
      console.log(
        `[MapController] Found ${t.length} individual beaches in view.`
      ), A.renderFeatureList(t, "beach");
      return;
    }
    const i = e.queryRenderedFeatures({
      layers: [this.LAYER_IDS.POIS]
    });
    if (i.length > 0) {
      console.log(
        `[MapController] Found ${i.length} POI features in view.`
      ), A.renderFeatureList(i, "poi");
      return;
    }
    const a = e.queryRenderedFeatures({
      layers: [this.LAYER_IDS.REGIONS]
    });
    if (a.length > 0) {
      const r = a[0].layer.source, c = e.getSource(r), n = await Promise.all(
        a.map((l) => new Promise((u) => {
          if (!l.properties.cluster) {
            l.properties.point_count = 1, u(l);
            return;
          }
          c.getClusterLeaves(
            l.properties.cluster_id,
            1 / 0,
            0,
            (E, b) => {
              if (E) {
                console.error("Could not get cluster leaves:", E), l.properties.point_count = l.properties.point_count_abbreviated || 1, u(l);
                return;
              }
              l.properties.point_count = b.length, u(l);
            }
          );
        }))
      );
      console.log(
        `[MapController] Found ${n.length} regions in view.`
      );
      const m = new Map(
        k.features.map((l) => [
          l.properties.Name,
          l.properties.Image
        ])
      );
      n.forEach((l) => {
        const u = l.properties.name;
        m.has(u) && (l.properties.Image = m.get(u));
      }), A.renderFeatureList(n, "region");
      return;
    }
    const s = e.queryRenderedFeatures({
      layers: [this.LAYER_IDS.STATES]
    });
    if (s.length > 0) {
      console.log(
        `[MapController] Found ${s.length} states in view.`
      ), A.renderFeatureList(s, "state");
      return;
    }
    console.log("[MapController] No features found in view, clearing list."), A.renderFeatureList([]);
  },
  /**
   * Show popup for a feature
   * @param {Object} feature - Feature to show popup for
   * @param {Object} [details] - The full details object from the cache
   */
  showPopup(e, t, i, a = !1) {
    const s = e.geometry.coordinates.slice(), r = t || e.properties, c = t ? t["main-image"]?.url : r["Main Image"], n = t ? t.name : r.Name, m = t ? t.richTextContent : r.richTextContent, l = t ? t.adress : r["Formatted Adress"], u = t ? t.hours : r.Hours, E = t ? t["paid-partner"] : r["Paid Partner"], b = t ? t["beach-website"] : r.Website, y = t ? t.phone : r.Phone, C = t ? t["button-link"] : r["Button Link"], w = t ? t.button : r.button, D = t ? t.buttonText : r.buttonText, L = `
      <div class="popup_component">
       <img src="${c || "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300"}" alt="${n}" class="popup_image">
       ${E ? '<p class="partner-badge">Paid Partner</p>' : ""}
        <div class="spacer-tiny"></div>
       <h4 class="popup_title">${n}</h4>
        <div class="spacer-xxsmall"></div>
        ${m ? `<div class="popup_description">${m}</div>` : ""}
       ${l ? `<p class="popup_address">${l}</p>` : ""}
       ${u ? `<p class="popup_hours">Hours: ${u}</p>` : ""}
       ${b ? `<a href="${b}" target="_blank" class="salty-link">${b.replace(
      /^https?:\/\//,
      ""
    )}</a>` : ""}
       ${y ? `<a href="tel:${y}" target="_blank" class="salty-link">${y}</a>` : ""}
       <div class="spacer-xsmall"></div>
       ${i !== "poi" ? '<div class="button is-icon w-inline-block" style="background-color: rgb(0, 116, 140);">See Details</div>' : w ? `<a href="${C}" target="_blank" class="button is-icon w-inline-block" style="background-color: rgb(0, 116, 140); text-decoration: none;">${D}</a>` : ""}
      </div>
    `, g = new mapboxgl.Popup({ offset: d.UI.POPUP_OFFSET }).setLngLat(s).setHTML(L).addTo(o.getMap());
    return a || (o.dispatch({ type: "ADD_OPEN_POPUP", payload: g }), g.on("close", () => {
      o.dispatch({ type: "REMOVE_OPEN_POPUP", payload: g });
    }), g.getElement().addEventListener("click", (S) => {
      S.target.tagName === "A" || S.target.closest("a") || i !== "poi" && (_.execute("selectBeachFromPopup", {
        entityType: "beach",
        feature: e
      }), g.remove());
    })), g;
  },
  /**
   * Closes all popups currently open on the map.
   */
  closeAllPopups() {
    o.getOpenPopups().forEach((e) => e.remove()), o.dispatch({ type: "CLEAR_OPEN_POPUPS" });
  },
  /**
   * Fly to a specific location
   * @param {object} payload - The flyTo payload.
   * @param {Array} payload.coordinates - [lng, lat] coordinates
   * @param {number} payload.zoom - Target zoom level
   * @param {number} [payload.speed=Config.UI.MAP_FLY_SPEED] - Animation speed
   */
  flyTo({
    coordinates: e,
    zoom: t = d.MAP.DETAIL_ZOOM,
    speed: i = d.UI.MAP_FLY_SPEED
  }) {
    const a = o.getMap();
    a && a.flyTo({
      center: e,
      zoom: t,
      speed: i
    });
  },
  /**
   * Zooms to a specific zoom level without changing the center.
   * @param {object} payload - The zoomTo payload.
   * @param {number} payload.zoom - Target zoom level.
   * @param {number} [payload.speed=1.2] - Animation speed.
   */
  zoomTo({ zoom: e, speed: t = 1.2 }) {
    const i = o.getMap();
    i && i.easeTo({
      zoom: e,
      speed: t
    });
  }
}, W = {
  async init() {
    console.log("[DataController] Initializing data pre-fetch."), await Promise.all([
      this.prefetchAllBeachData(),
      this.prefetchAllPOIData()
    ]);
  },
  async prefetchAllBeachData() {
    try {
      const e = await fetch(`${I.BASE_URL}/api/beaches`);
      if (console.log("[DataController] Fetch response status:", e.status), !e.ok)
        throw new Error(`HTTP error! status: ${e.status}`);
      const t = await e.json();
      console.log(`[DataController] Fetched ${t.length} beach items.`), o.dispatch({ type: "SET_ALL_BEACH_DATA", payload: t }), console.log("[DataController] All beach data pre-fetched and cached.");
    } catch (e) {
      console.error("[DataController] Failed to pre-fetch beach data:", e);
    }
  },
  async prefetchAllPOIData() {
    try {
      const e = await fetch(`${I.BASE_URL}/api/pois`);
      if (console.log("[DataController] POI fetch response status:", e.status), !e.ok) {
        console.warn(`[DataController] POI API not available (status: ${e.status}), using mock data`);
        const i = [{
          id: "huntington-city-beach-lifeguard-tower-1",
          name: "Huntington City Beach Lifeguard Tower 1",
          slug: "huntington-lifeguard-tower-1",
          longitude: -118.0052,
          latitude: 33.6553,
          categoryName: "Safety & Emergency",
          customIconName: "lifeguard-tower",
          mainImageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
          mainImageAlt: "Huntington City Beach Lifeguard Tower 1",
          richTextContent: "<p>Professional lifeguard station providing safety services and emergency response at Huntington City Beach.</p>",
          geometry: {
            type: "Point",
            coordinates: [-118.0052, 33.6553]
          }
        }];
        o.dispatch({ type: "SET_ALL_POI_DATA", payload: i }), console.log("[DataController] Mock POI data cached.");
        return;
      }
      const t = await e.json();
      console.log(`[DataController] Fetched ${t.length} POI items.`), o.dispatch({ type: "SET_ALL_POI_DATA", payload: t }), console.log("[DataController] All POI data pre-fetched and cached.");
    } catch (e) {
      console.error("[DataController] Failed to pre-fetch POI data:", e);
      const t = [{
        id: "huntington-city-beach-lifeguard-tower-1",
        name: "Huntington City Beach Lifeguard Tower 1",
        slug: "huntington-lifeguard-tower-1",
        longitude: -118.0052,
        latitude: 33.6553,
        categoryName: "Safety & Emergency",
        customIconName: "lifeguard-tower",
        mainImageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
        mainImageAlt: "Huntington City Beach Lifeguard Tower 1",
        richTextContent: "<p>Professional lifeguard station providing safety services and emergency response at Huntington City Beach.</p>",
        geometry: {
          type: "Point",
          coordinates: [-118.0052, 33.6553]
        }
      }];
      o.dispatch({ type: "SET_ALL_POI_DATA", payload: t }), console.log("[DataController] Fallback to mock POI data due to error.");
    }
  }
};
document.addEventListener("DOMContentLoaded", () => {
  W.init(), A.init(), $.init();
});
