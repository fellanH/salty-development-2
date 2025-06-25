// =============================================================================
// UI CONTROLLER MODULE
// =============================================================================

import { Config } from "./config.js";
import { Utils } from "./utils.js";
import { MockAPI } from "./mockAPI.js";
import { AppState } from "./appState.js";
import { MapController } from "./mapController.js";
import { NavigationController } from "./navigationController.js";
import { ActionController } from "./actionController.js";
import { EventBus } from "./eventBus.js";

export const UIController = {
  // Cache DOM elements
  elements: {},

  /**
   * Initialize UI controller and cache DOM elements
   */
  init() {
    console.log("[UIController] init");
    this.cacheElements();
    this.setupEventListeners();
    this.setupBusSubscriptions();
    this.setupSidebarObserver();
    this.updateResponsiveLayout();

    // Setup resize handler
    window.addEventListener(
      "resize",
      Utils.debounce(() => {
        console.log("[UIController] window resize");
        this.updateResponsiveLayout();
      }, 250)
    );
  },

  /**
   * Cache frequently used DOM elements
   */
  cacheElements() {
    console.log("[UIController] cacheElements");
    Object.entries(Config.SELECTORS).forEach(([key, selector]) => {
      const element = document.querySelector(selector);
      if (element) {
        this.elements[key] = element;
        console.log(`[UIController] Cached element: ${key} (${selector})`);
      } else {
        console.warn(`[UIController] Element not found: ${selector}`);
      }
    });
  },

  /**
   * Setup event listeners for UI interactions
   */
  setupEventListeners() {
    console.log("[UIController] setupEventListeners");

    // Use a generic handler for all elements with a data-action attribute
    document.body.addEventListener("click", (e) => {
      const target = e.target.closest("[data-action]");
      if (!target) return;

      e.preventDefault();
      const actionName = target.dataset.action;
      if (actionName) {
        console.log(`[UIController] Action triggered: ${actionName}`);
        ActionController.execute(actionName, { target });
      }
    });

    // You will now need to add `data-action` attributes to your HTML elements, for example:
    // <button data-action="navigateHome">Home</button>
    // <button data-action="backToList" class="modal_back-button">Back</button>
    // <button data-action="closeDetailAndReset" class="modal_close-button">Close</button>
  },

  /**
   * Setup subscriptions to the event bus.
   */
  setupBusSubscriptions() {
    EventBus.subscribe("ui:showSidebar", (data) =>
      this.showSidebar(data.sidebar)
    );
    EventBus.subscribe("ui:toggleFullscreen", this.toggleFullscreen.bind(this));
    EventBus.subscribe(
      "state:selectionChanged",
      this.handleSelectionChange.bind(this)
    );
  },

  /**
   * Handles state changes for the current selection.
   * @param {object} selection - The new selection state.
   */
  handleSelectionChange(selection) {
    // Only update and show the detail sidebar if a 'beach' is selected.
    if (selection && selection.type === "beach") {
      this.updateDetailSidebar();
    } else if (AppState.ui.currentSidebar === "detail") {
      // If any other type is selected (state, region) or the selection is cleared,
      // and if the detail sidebar is currently visible, hide it.
      this.hideDetailSidebar();
    }
  },

  /**
   * Observes sidebar elements for style changes (e.g., from Webflow interactions)
   * and keeps the application state in sync.
   */
  setupSidebarObserver() {
    const observer = new MutationObserver(
      this.handleSidebarMutation.bind(this)
    );
    const config = { attributes: true, attributeFilter: ["style"] };

    const sidebarsToObserve = [
      this.elements.SIDEBAR_HOME,
      this.elements.SIDEBAR_BEACH_LIST,
      this.elements.SIDEBAR_BEACH,
    ];

    sidebarsToObserve.forEach((sidebar) => {
      if (sidebar) {
        observer.observe(sidebar, config);
      }
    });
  },

  /**
   * Handles mutations to the sidebar elements.
   */
  handleSidebarMutation() {
    let newSidebar = null;

    // Determine which sidebar is currently displayed
    if (
      this.elements.SIDEBAR_BEACH &&
      this.elements.SIDEBAR_BEACH.style.display === "block"
    ) {
      newSidebar = "detail";
    } else if (
      this.elements.SIDEBAR_BEACH_LIST &&
      this.elements.SIDEBAR_BEACH_LIST.style.display === "block"
    ) {
      newSidebar = "list";
    } else if (
      this.elements.SIDEBAR_HOME &&
      this.elements.SIDEBAR_HOME.style.display === "block"
    ) {
      newSidebar = "home";
    }

    // If the visible sidebar has changed, update the app state
    if (newSidebar && newSidebar !== AppState.ui.currentSidebar) {
      console.log(
        `[UIController] Sidebar state synced by observer to: ${newSidebar}`
      );
      AppState.updateUI({ currentSidebar: newSidebar });

      // If the list view becomes active, refresh its content to match the map
      if (newSidebar === "list") {
        MapController.updateSidebarListFromMap();
      }
    }
  },

  /**
   * Update layout based on screen size
   */
  updateResponsiveLayout() {
    console.log("[UIController] updateResponsiveLayout");
    const isMobile = Utils.isMobileView();
    AppState.updateUI({ isMobile });

    if (isMobile) {
      this.showSidebar("home");
      this.hideMap();
    } else {
      this.showSidebar("home");
      this.showMap();
    }
  },

  /**
   * Show specific sidebar panel
   * @param {string} type - 'home', 'list', or 'detail'
   */
  showSidebar(type) {
    console.log(`[UIController] showSidebar: ${type}`);
    AppState.updateUI({ currentSidebar: type });

    // Hide all sidebar panels
    if (this.elements.SIDEBAR_HOME)
      this.elements.SIDEBAR_HOME.style.display = "none";
    if (this.elements.SIDEBAR_BEACH_LIST)
      this.elements.SIDEBAR_BEACH_LIST.style.display = "none";
    if (this.elements.SIDEBAR_BEACH)
      this.elements.SIDEBAR_BEACH.style.display = "none";

    // Show requested panel
    switch (type) {
      case "home":
        if (this.elements.SIDEBAR_HOME)
          this.elements.SIDEBAR_HOME.style.display = "block";
        break;
      case "list":
        if (this.elements.SIDEBAR_BEACH_LIST)
          this.elements.SIDEBAR_BEACH_LIST.style.display = "block";
        break;
      case "detail":
        if (this.elements.SIDEBAR_BEACH)
          this.elements.SIDEBAR_BEACH.style.display = "block";
        break;
    }

    // Show sidebar wrapper
    if (this.elements.SIDEBAR_WRAPPER) {
      this.elements.SIDEBAR_WRAPPER.style.display = "block";
    }

    // Handle map visibility on mobile
    if (Utils.isMobileView()) {
      this.hideMap();
    } else {
      this.showMap();
    }
  },

  /**
   * Show map
   */
  showMap() {
    console.log("[UIController] showMap");
    if (this.elements.SIDEBAR_MAP) {
      this.elements.SIDEBAR_MAP.style.display = "block";
    }
  },

  /**
   * Hide map
   */
  hideMap() {
    console.log("[UIController] hideMap");
    if (this.elements.SIDEBAR_MAP) {
      this.elements.SIDEBAR_MAP.style.display = "none";
    }
  },

  /**
   * Toggle fullscreen mode
   */
  toggleFullscreen() {
    console.log("[UIController] toggleFullscreen");
    if (Utils.isMobileView()) {
      // On mobile, toggle between map and sidebar
      if (
        this.elements.SIDEBAR_MAP &&
        this.elements.SIDEBAR_MAP.style.display === "none"
      ) {
        this.hideMap();
        this.showSidebar(AppState.ui.currentSidebar);
      } else {
        this.showMap();
        if (this.elements.SIDEBAR_WRAPPER) {
          this.elements.SIDEBAR_WRAPPER.style.display = "none";
        }
      }
    } else {
      // On desktop, toggle sidebar visibility
      if (this.elements.SIDEBAR_WRAPPER) {
        const isVisible =
          this.elements.SIDEBAR_WRAPPER.style.display !== "none";
        this.elements.SIDEBAR_WRAPPER.style.display = isVisible
          ? "none"
          : "block";
      }
      this.showMap();
    }
  },

  /**
   * Render a list of features (beaches, regions, states) in the sidebar
   * @param {Array} features - An array of GeoJSON features
   * @param {string} type - The type of feature ('beach', 'region', 'state')
   */
  renderFeatureList(features = [], type = "beach") {
    console.log(`[UIController] renderFeatureList for type: ${type}`, features);
    const listContainer = this.elements.BEACH_LIST_CONTAINER;

    if (!listContainer) {
      console.error(
        "Beach list container not found. Check config selector: BEACH_LIST_CONTAINER"
      );
      return;
    }

    listContainer.innerHTML = "";
    AppState.cache.visibleFeatures.clear();

    if (features.length === 0) {
      listContainer.innerHTML =
        '<p style="padding: 20px; text-align: center;">No items in view. Pan or zoom the map to find some.</p>';
      return;
    }

    // Sort features before rendering
    const getSortName = (props) =>
      props.Name || props.State || props["Location Cluster"] || "";
    features.sort((a, b) =>
      getSortName(a.properties).localeCompare(getSortName(b.properties))
    );

    const seenIds = new Set(); // Moved outside the loop

    features.forEach((feature) => {
      const entityId = Utils.getFeatureEntityId(feature);

      // Cache the feature so the action controller can find it
      if (entityId) {
        // Ensure the key is a string for consistency with dataset attributes
        AppState.cache.visibleFeatures.set(String(entityId), feature);
      }

      // Deduplicate beaches before rendering
      if (type === "beach") {
        const beachId = feature.properties["Item ID"];
        if (beachId && !seenIds.has(beachId)) {
          seenIds.add(beachId);
          const listItem = this.createListItem(feature, type);
          listContainer.appendChild(listItem);
        }
      } else {
        const listItem = this.createListItem(feature, type);
        listContainer.appendChild(listItem);
      }
    });
  },

  /**
   * Create a list item by cloning and populating a dedicated template.
   * @param {Object} feature - GeoJSON feature
   * @param {string} type - The type of feature ('beach', 'region', 'state')
   * @returns {HTMLElement} List item element
   */
  createListItem(feature, type) {
    const config = Config.LIST_ITEM_TEMPLATES[type];
    if (!config) {
      console.error(`No template configuration found for type: ${type}`);
      return document.createElement("div"); // Return empty element on error
    }

    const template = document.querySelector(config.templateId);
    if (!template) {
      console.error(`Template element not found for ID: ${config.templateId}`);
      return document.createElement("div"); // Return empty element on error
    }

    const clone = template.content.cloneNode(true);
    const listItem = clone.firstElementChild;
    const properties = feature.properties;

    // Set the data attributes for the action controller
    const entityId = Utils.getFeatureEntityId(feature);
    listItem.dataset.entityType = type;
    listItem.dataset.featureId = entityId;

    let actionName = "";
    switch (type) {
      case "state":
        actionName = "selectState";
        break;
      case "region":
        actionName = "selectRegion";
        break;
      case "beach":
        actionName = "selectBeach";
        break;
    }
    listItem.dataset.action = actionName;

    // Apply data mapping from the config
    for (const selector in config.dataMapping) {
      const el = listItem.querySelector(selector);
      const mapping = config.dataMapping[selector];

      if (el) {
        switch (mapping.type) {
          case "text":
            el.textContent = mapping.source(properties) || "";
            break;
          case "image":
            el.src = mapping.source(properties);
            el.alt = properties.Name || "List item image";
            break;
          case "style":
            Object.assign(el.style, mapping.style);
            break;
        }
      } else {
        console.warn(
          `[UIController] Element for selector "${selector}" not found in template "${config.templateId}"`
        );
      }
    }

    return listItem;
  },

  /**
   * Update detail sidebar with current selection
   */
  async updateDetailSidebar() {
    console.log(
      "[UIController] updateDetailSidebar",
      AppState.currentSelection
    );
    const { id, type, feature } = AppState.currentSelection;

    if (!id || !feature || !this.elements.SIDEBAR_BEACH) {
      this.showSidebar("list"); // or 'home'
      return;
    }

    // Show the detail sidebar
    this.showSidebar("detail");

    // Temporarily use feature properties for details
    const details = feature.properties;

    // Show loading state for weather-dependent parts
    // You can implement a more granular loading state later

    try {
      const weatherData = await this.fetchWeatherData(id);
      console.log("[UIController] updateDetailSidebar fetched", {
        details,
        weatherData,
      });
      this.renderDetailContent(details, weatherData);
    } catch (error) {
      console.error("[UIController] Error updating detail sidebar:", error);
      // Optionally show an error message for the weather part
      this.renderDetailContent(details, null); // Render without weather
    }
  },

  /**
   * Fetch weather data with caching
   * @param {string} locationId - Location ID
   * @returns {Promise} Weather data
   */
  async fetchWeatherData(locationId) {
    console.log("[UIController] fetchWeatherData", locationId);
    // Check cache first
    if (AppState.cache.weatherData.has(locationId)) {
      console.log("[UIController] fetchWeatherData cache hit", locationId);
      return AppState.cache.weatherData.get(locationId);
    }

    // Fetch from API (mock)
    const data = await MockAPI.fetchWeather(locationId);
    console.log("[UIController] fetchWeatherData fetched", data);
    // Cache with expiration (5 minutes)
    AppState.cache.weatherData.set(locationId, data);
    setTimeout(() => {
      AppState.cache.weatherData.delete(locationId);
    }, 5 * 60 * 1000);

    return data;
  },

  /**
   * Render detail sidebar content
   * @param {Object} details - Detail data
   * @param {Object} weather - Weather data
   */
  renderDetailContent(details, weather) {
    console.log("[UIController] renderDetailContent", { details, weather });

    const { updateElement } = Utils;
    const el = this.elements;

    const getProperty = (obj, keys, defaultVal = "") => {
      for (const key of keys) {
        if (obj[key] !== undefined && obj[key] !== null) {
          return obj[key];
        }
      }
      return defaultVal;
    };

    // --- Populate Basic Info ---
    updateElement({
      element: el.BEACH_DETAIL_IMAGE,
      value: getProperty(
        details,
        ["Main Image", "image", "imageUrl"],
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300"
      ),
      type: "src",
    });
    updateElement({
      element: el.BEACH_DETAIL_TITLE,
      value: getProperty(details, ["Name", "name"]),
      defaultValue: "Beach Name",
    });

    const googleMapsLink = getProperty(details, [
      "Google Maps Link",
      "google_maps_link",
    ]);
    updateElement({
      element: el.BEACH_DETAIL_ADDRESS_LINK,
      value: googleMapsLink,
      type: "href",
      defaultValue: "#",
    });
    updateElement({
      element: el.BEACH_DETAIL_ADDRESS_TEXT,
      value: getProperty(details, [
        "Formatted Address",
        "Formatted Adress",
        "address",
      ]),
      defaultValue: "Address not available",
    });

    const website = getProperty(details, ["Beach website", "website"]);
    if (el.BEACH_DETAIL_WEBSITE_LINK?.parentElement) {
      el.BEACH_DETAIL_WEBSITE_LINK.parentElement.style.display = website
        ? "flex"
        : "none";
    }
    updateElement({
      element: el.BEACH_DETAIL_WEBSITE_LINK,
      value: website,
      type: "href",
      defaultValue: "#",
    });
    updateElement({
      element: el.BEACH_DETAIL_WEBSITE_TEXT,
      value: website,
      defaultValue: "",
    });

    // --- Populate Amenities (Land) ---
    updateElement({
      element: el.BEACH_DETAIL_RESTROOMS?.children[1],
      value: details.Restrooms,
    });
    updateElement({
      element: el.BEACH_DETAIL_SHOWERS?.children[1],
      value: details.Showers,
    });
    updateElement({
      element: el.BEACH_DETAIL_PETS?.children[1],
      value: details.Pets,
    });
    updateElement({
      element: el.BEACH_DETAIL_PARKING?.children[1],
      value: details["Parking lot nearby"],
    });
    updateElement({
      element: el.BEACH_DETAIL_CAMPING?.children[1],
      value: details.Camping,
    });

    // --- Populate Weather Data ---
    if (weather) {
      updateElement({
        element: el.WEATHER_AIR_TEMP?.children[1]?.children[0],
        value: weather.temperature,
        transform: (v) => Math.round(v),
      });
      updateElement({
        element: el.WEATHER_FEELS_LIKE?.children[1],
        value: weather.feels_like,
        transform: (v) => `${Math.round(v)}°F`,
      });
      updateElement({
        element: el.WEATHER_HUMIDITY?.children[1],
        value: weather.humidity,
        transform: (v) => `${v}%`,
      });
      updateElement({
        element: el.WEATHER_WIND?.children[1],
        value: weather.windSpeed,
        transform: (v) => `${v} mph`,
      });
      updateElement({
        element: el.WEATHER_WIND_DIRECTION?.children[1],
        value: weather.windDirection,
        transform: (v) => `${v}°`,
      });
      updateElement({
        element: el.WEATHER_AQI?.children[1],
        value: weather.aqi,
      });
      updateElement({
        element: el.WEATHER_RAINFALL?.children[1],
        value: weather.rainfall,
        transform: (v) => `${v} in`,
      });
      updateElement({
        element: el.WEATHER_PRESSURE?.children[1],
        value: weather.pressure,
        transform: (v) => `${v} inHg`,
      });
      updateElement({
        element: el.WEATHER_PM25?.children[1],
        value: weather.pm25,
        transform: (v) => `${v} µg/m³`,
      });
      updateElement({
        element: el.WEATHER_PM10?.children[1],
        value: weather.pm10,
        transform: (v) => `${v} µg/m³`,
      });
      updateElement({
        element: el.WEATHER_WATER_TEMP?.children[1],
        value: weather.water_temp,
        transform: (v) => `${Math.round(v)}°F`,
      });
      updateElement({
        element: el.WEATHER_WAVE_HEIGHT?.children[1],
        value: weather.wave_height,
        transform: (v) => `${v} ft`,
      });
      updateElement({
        element: el.WEATHER_OCEAN_CURRENT?.children[1],
        value: weather.ocean_current,
      });
      updateElement({
        element: el.WEATHER_UV_INDEX?.children[1]?.children[0],
        value: weather.uv_index,
      });
      updateElement({
        element: el.WEATHER_CLOUD_COVER?.children[1],
        value: weather.cloud_cover,
        transform: (v) => `${v}%`,
      });
      updateElement({
        element: el.WEATHER_SUNSET?.children[1],
        value: weather.sunset,
        transform: (v) =>
          new Date(v * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
      });
    } else {
      // Clear all weather fields if no data is available
      const weatherElements = [
        el.WEATHER_AIR_TEMP?.children[1]?.children[0],
        el.WEATHER_FEELS_LIKE?.children[1],
        el.WEATHER_HUMIDITY?.children[1],
        el.WEATHER_WIND?.children[1],
        el.WEATHER_WIND_DIRECTION?.children[1],
        el.WEATHER_AQI?.children[1],
        el.WEATHER_RAINFALL?.children[1],
        el.WEATHER_PRESSURE?.children[1],
        el.WEATHER_PM25?.children[1],
        el.WEATHER_PM10?.children[1],
        el.WEATHER_WATER_TEMP?.children[1],
        el.WEATHER_WAVE_HEIGHT?.children[1],
        el.WEATHER_OCEAN_CURRENT?.children[1],
        el.WEATHER_UV_INDEX?.children[1]?.children[0],
        el.WEATHER_CLOUD_COVER?.children[1],
        el.WEATHER_SUNSET?.children[1],
      ];
      weatherElements.forEach((element) =>
        updateElement({ element, value: null })
      );
      console.warn("No weather data available to render.");
    }
  },

  /**
   * Hide detail sidebar
   */
  hideDetailSidebar() {
    console.log("[UIController] hideDetailSidebar");
    // As per navigation flow, hiding detail should show the list.
    this.showSidebar("list");
  },
};
