// =============================================================================
// SIMPLIFIED MAP CONTROLLER MODULE
// =============================================================================

import { Config } from "./config.js";
import { Utils } from "./utils.js";
import { AppState } from "./appState.js";
import { UIController } from "./uiController.js";
import { NavigationController } from "./navigationController.js";
import { EventBus } from "./eventBus.js";

export const MapController = {
  // TODO: Replace these with your actual layer IDs from Mapbox Studio
  LAYER_IDS: {
    STATES: "salty-state",
    CALIFORNIA: "California",
    HAWAII: "Hawaii",
    REGIONS: "salty-city",
    BEACHES: "salty-beaches",
  },
  hoveredFeature: null,

  /**
   * Initialize the Mapbox map
   */
  async init() {
    try {
      mapboxgl.accessToken = Config.MAP.ACCESS_TOKEN;

      // The map style now contains all data sources and layer styling
      const map = new mapboxgl.Map({
        container: Config.SELECTORS.MAP_CONTAINER.slice(1),
        style: Config.MAP.STYLE, // This is your Mapbox Studio style URL
        center: Utils.isMobileView()
          ? Config.MAP.MOBILE_START_POSITION
          : Config.MAP.DESKTOP_START_POSITION,
        zoom: Config.MAP.DEFAULT_ZOOM,
        pitch: Config.MAP.START_PITCH,
      });

      map.on("load", () => {
        AppState.map = map;
        this.setupEventHandlers();
        this.setupBusSubscriptions();
        console.log("✅ Map initialized with cloud-hosted data and styles.");
      });

      const mapContainer = document.querySelector(
        Config.SELECTORS.MAP_CONTAINER
      );
      const resizeObserver = new ResizeObserver(() => map.resize());
      resizeObserver.observe(mapContainer);
    } catch (error) {
      console.error("Failed to initialize map:", error);
      Utils.showError(
        document.querySelector(Config.SELECTORS.MAP_CONTAINER),
        "Failed to load map. Please check your connection and try again."
      );
    }
  },

  /**
   * Setup subscriptions to the event bus
   */
  setupBusSubscriptions() {
    EventBus.subscribe("map:flyTo", this.flyTo.bind(this));
    EventBus.subscribe("map:showPopup", (data) => {
      if (data && data.feature) {
        setTimeout(() => this.showPopup(data.feature), data.delay || 0);
      }
    });
  },

  /**
   * Setup general map event handlers
   */
  setupEventHandlers() {
    const interactiveLayers = Object.values(this.LAYER_IDS).filter(Boolean);

    if (interactiveLayers.length === 0) {
      console.warn(
        "⚠️ No interactive layers are defined in LAYER_IDS. Clicks will not work."
      );
      return;
    }

    // Click handler for all interactive layers
    AppState.map.on("click", interactiveLayers, (e) => {
      if (!e.features || e.features.length === 0) {
        return;
      }

      // Determine the type of feature clicked and handle it
      const feature = e.features[0]; // Prioritize the topmost feature
      let entityType;

      switch (feature.layer.id) {
        case this.LAYER_IDS.BEACHES:
          entityType = "beach";
          break;
        case this.LAYER_IDS.REGIONS:
          entityType = "region";
          break;
        case this.LAYER_IDS.STATES:
          entityType = "state";
          break;
        default:
          console.warn(
            `[MapController] Clicked on an unhandled layer: ${feature.layer.id}`
          );
          return;
      }

      NavigationController.handleEntitySelection({ entityType, feature });
    });

    // Cursor and hover state handlers
    AppState.map.on("mousemove", interactiveLayers, (e) => {
      if (e.features.length > 0) {
        AppState.map.getCanvas().style.cursor = "pointer";

        if (
          this.hoveredFeature &&
          this.hoveredFeature.id === e.features[0].id
        ) {
          // Do nothing if it's the same feature
        } else {
          // Unset state on the previously hovered feature
          if (this.hoveredFeature) {
            AppState.map.setFeatureState(this.hoveredFeature, { state: false });
          }

          // Set state on the new hovered feature
          this.hoveredFeature = e.features[0];
          AppState.map.setFeatureState(this.hoveredFeature, { state: true });
        }
      }
    });

    AppState.map.on("mouseleave", interactiveLayers, () => {
      if (this.hoveredFeature) {
        AppState.map.setFeatureState(this.hoveredFeature, { state: false });
      }
      this.hoveredFeature = null;
      AppState.map.getCanvas().style.cursor = "";
    });

    // Update sidebar on map move
    AppState.map.on(
      "moveend",
      Utils.debounce(() => {
        console.log("🗺️ Map moveend event");
        // Only update the list if the list view is actually visible
        if (AppState.ui.currentSidebar !== "list") {
          console.log(
            `[MapController] Sidebar update skipped, current view is "${AppState.ui.currentSidebar}".`
          );
          return;
        }
        this.updateSidebarListFromMap();
      }, 250)
    );
  },

  /**
   * Update sidebar list by querying the map for visible features
   */
  updateSidebarListFromMap() {
    if (!AppState.map) return;

    // Query for individual beaches first
    const beachFeatures = AppState.map.queryRenderedFeatures({
      layers: [this.LAYER_IDS.BEACHES],
    });
    if (beachFeatures.length > 0) {
      console.log(
        `[MapController] Found ${beachFeatures.length} individual beaches in view.`
      );
      UIController.renderFeatureList(beachFeatures, "beach");
      return;
    }

    // If no individual beaches, query for regions
    const regionFeatures = AppState.map.queryRenderedFeatures({
      layers: [this.LAYER_IDS.REGIONS],
    });
    if (regionFeatures.length > 0) {
      console.log(
        `[MapController] Found ${regionFeatures.length} regions in view.`
      );
      UIController.renderFeatureList(regionFeatures, "region");
      return;
    }

    // If no regions, query for states
    const stateFeatures = AppState.map.queryRenderedFeatures({
      layers: [this.LAYER_IDS.STATES],
    });
    if (stateFeatures.length > 0) {
      console.log(
        `[MapController] Found ${stateFeatures.length} states in view.`
      );
      UIController.renderFeatureList(stateFeatures, "state");
      return;
    }

    // If nothing is found, clear the list
    console.log("[MapController] No features found in view, clearing list.");
    UIController.renderFeatureList([]);
  },

  /**
   * Show popup for a feature
   * @param {Object} feature - Feature to show popup for
   */
  showPopup(feature) {
    const coordinates = feature.geometry.coordinates.slice();
    const properties = feature.properties;

    const popupHTML = `
      <div class="popup_component">
        <img src="${
          properties["Main Image"] ||
          "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300"
        }"
             alt="${properties.Name}"
             class="popup_image"
             style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px;">
        <h4 class="popup_title" style="margin: 10px 0 5px 0; font-size: 16px;">${
          properties.Name
        }</h4>
        <p class="popup_address" style="margin: 0; color: #666; font-size: 14px;">${
          properties["Formatted Adress"] || "Address not available"
        }</p>
      </div>
    `;

    new mapboxgl.Popup({ offset: Config.UI.POPUP_OFFSET })
      .setLngLat(coordinates)
      .setHTML(popupHTML)
      .addTo(AppState.map);
  },

  /**
   * Fly to a specific location
   * @param {object} payload - The flyTo payload.
   * @param {Array} payload.coordinates - [lng, lat] coordinates
   * @param {number} payload.zoom - Target zoom level
   * @param {number} [payload.speed=Config.UI.MAP_FLY_SPEED] - Animation speed
   */
  flyTo({
    coordinates,
    zoom = Config.MAP.DETAIL_ZOOM,
    speed = Config.UI.MAP_FLY_SPEED,
  }) {
    if (AppState.map) {
      AppState.map.flyTo({
        center: coordinates,
        zoom,
        speed: speed,
      });
    }
  },
};
