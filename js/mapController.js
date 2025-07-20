// =============================================================================
// SIMPLIFIED MAP CONTROLLER MODULE
// =============================================================================

import { Config } from "./config.js";
import { Utils } from "./utils.js";
import { AppState } from "./appState.js";
import { UIController } from "./uiController.js";
import { EventBus } from "./eventBus.js";
import { cityImageData } from "./cityImageData.js";
import { ActionController } from "./actionController.js";

// =============================================================================
// MAP FEATURE HANDLERS MODULE
// =============================================================================
const MapFeatureHandlers = {
  /**
   * Determines action configuration based on feature layer
   * @param {Object} feature - Map feature
   * @returns {Object|null} Action configuration
   */
  getActionConfigForFeature(feature) {
    const layerMappings = {
      [MapController.LAYER_IDS.BEACHES]: {
        entityType: "beach",
        actionName: "selectBeachFromMap"
      },
      [MapController.LAYER_IDS.POIS]: {
        entityType: "poi", 
        actionName: "selectPOIFromMap"
      },
      [MapController.LAYER_IDS.REGIONS]: {
        entityType: "region",
        actionName: "selectRegion"
      },
      [MapController.LAYER_IDS.STATES]: {
        entityType: "state",
        actionName: "selectState"
      }
    };

    return layerMappings[feature.layer.id] || null;
  },

  /**
   * Handles click events on map features
   * @param {Object} e - Map click event
   */
  handleFeatureClick(e) {
    if (!e.features || e.features.length === 0) {
      return;
    }

    const feature = e.features[0];
    const actionConfig = this.getActionConfigForFeature(feature);
    
    if (actionConfig) {
      ActionController.execute(actionConfig.actionName, {
        entityType: actionConfig.entityType,
        feature
      });
    }
  },

  /**
   * Handles mouse movement over interactive features
   * @param {Object} e - Mouse move event
   */
  handleFeatureMouseMove(e) {
    if (e.features.length > 0) {
      AppState.getMap().getCanvas().style.cursor = "pointer";

      const currentFeature = e.features[0];
      
      if (MapController.hoveredFeature?.id === currentFeature.id) {
        return; // Same feature, no need to update
      }

      // Clear previous hover state
      this.clearHoverState();

      // Set new hover state
      MapController.hoveredFeature = currentFeature;
      AppState.getMap().setFeatureState(currentFeature, { state: true });
    }
  },

  /**
   * Handles mouse leaving interactive features
   */
  handleFeatureMouseLeave() {
    this.clearHoverState();
    AppState.getMap().getCanvas().style.cursor = "";
  },

  /**
   * Clears the current hover state
   */
  clearHoverState() {
    if (MapController.hoveredFeature) {
      AppState.getMap().setFeatureState(MapController.hoveredFeature, {
        state: false,
      });
      MapController.hoveredFeature = null;
    }
  }
};

// =============================================================================
// MAP QUERY HANDLERS MODULE  
// =============================================================================
const MapQueryHandlers = {
  /**
   * Queries map for visible features in priority order
   * @param {Object} map - Mapbox map instance
   * @returns {Promise<Object>} Query result with features and type
   */
  async queryVisibleFeatures(map) {
    // Priority order: beaches -> pois -> regions -> states
    const queryMethods = [
      () => this.queryBeaches(map),
      () => this.queryPOIs(map), 
      () => this.queryRegions(map),
      () => this.queryStates(map)
    ];

    for (const queryMethod of queryMethods) {
      const result = await queryMethod();
      if (result.features.length > 0) {
        return result;
      }
    }

    return { features: [], type: null };
  },

  /**
   * Query for beach features
   * @param {Object} map - Mapbox map instance
   * @returns {Object} Query result
   */
  queryBeaches(map) {
    const features = map.queryRenderedFeatures({
      layers: [MapController.LAYER_IDS.BEACHES]
    });
    
    if (features.length > 0) {
      console.log(`[MapController] Found ${features.length} individual beaches in view.`);
    }
    
    return { features, type: "beach" };
  },

  /**
   * Query for POI features
   * @param {Object} map - Mapbox map instance  
   * @returns {Object} Query result
   */
  queryPOIs(map) {
    const features = map.queryRenderedFeatures({
      layers: [MapController.LAYER_IDS.POIS]
    });
    
    if (features.length > 0) {
      console.log(`[MapController] Found ${features.length} POI features in view.`);
    }
    
    return { features, type: "poi" };
  },

  /**
   * Query for region features with cluster data
   * @param {Object} map - Mapbox map instance
   * @returns {Promise<Object>} Query result
   */
  async queryRegions(map) {
    const features = map.queryRenderedFeatures({
      layers: [MapController.LAYER_IDS.REGIONS]
    });

    if (features.length === 0) {
      return { features: [], type: null };
    }

    const featuresWithCounts = await this.enrichRegionsWithClusterData(map, features);
    this.addCityImagesToRegions(featuresWithCounts);
    
    console.log(`[MapController] Found ${featuresWithCounts.length} regions in view.`);
    return { features: featuresWithCounts, type: "region" };
  },

  /**
   * Query for state features
   * @param {Object} map - Mapbox map instance
   * @returns {Object} Query result
   */
  queryStates(map) {
    const features = map.queryRenderedFeatures({
      layers: [MapController.LAYER_IDS.STATES]
    });
    
    if (features.length > 0) {
      console.log(`[MapController] Found ${features.length} states in view.`);
    }
    
    return { features, type: "state" };
  },

  /**
   * Enriches region features with cluster data
   * @param {Object} map - Mapbox map instance
   * @param {Array} regionFeatures - Region features to enrich
   * @returns {Promise<Array>} Enriched features
   */
  async enrichRegionsWithClusterData(map, regionFeatures) {
    const sourceId = regionFeatures[0].layer.source;
    const source = map.getSource(sourceId);

    return await Promise.all(
      regionFeatures.map((region) => {
        return new Promise((resolve) => {
          if (!region.properties.cluster) {
            region.properties.point_count = 1;
            resolve(region);
            return;
          }

          source.getClusterLeaves(
            region.properties.cluster_id,
            Infinity,
            0,
            (err, leaves) => {
              if (err) {
                console.error("Could not get cluster leaves:", err);
                region.properties.point_count =
                  region.properties.point_count_abbreviated || 1;
              } else {
                region.properties.point_count = leaves.length;
              }
              resolve(region);
            }
          );
        });
      })
    );
  },

  /**
   * Adds city images to region features
   * @param {Array} features - Region features
   */
  addCityImagesToRegions(features) {
    const cityImageMap = new Map(
      cityImageData.features.map((feature) => [
        feature.properties.Name,
        feature.properties.Image,
      ])
    );

    features.forEach((feature) => {
      const imageName = feature.properties.name;
      if (cityImageMap.has(imageName)) {
        feature.properties.Image = cityImageMap.get(imageName);
      }
    });
  }
};

// =============================================================================
// POPUP MANAGER MODULE
// =============================================================================
const PopupManager = {
  /**
   * Creates and shows a popup for a feature
   * @param {Object} feature - Feature to show popup for
   * @param {Object} details - Feature details from cache
   */
  showPopup(feature, details) {
    const coordinates = feature.geometry.coordinates.slice();
    const popupData = this.extractPopupData(feature, details);
    const popupHTML = this.generatePopupHTML(popupData);
    
    const popup = new mapboxgl.Popup({ offset: Config.UI.POPUP_OFFSET })
      .setLngLat(coordinates)
      .setHTML(popupHTML)
      .addTo(AppState.getMap());

    this.setupPopupTracking(popup);
    this.setupPopupClickHandler(popup, feature);
  },

  /**
   * Extracts data needed for popup from feature and details
   * @param {Object} feature - Map feature
   * @param {Object} details - Cached details
   * @returns {Object} Popup data
   */
  extractPopupData(feature, details) {
    const properties = details || feature.properties;
    
    return {
      imageUrl: this.getImageUrl(details, properties),
      name: this.getName(details, properties),
      address: this.getAddress(details, properties),
      hours: this.getHours(details, properties),
      isPaidPartner: this.getPaidPartnerStatus(details, properties),
      website: this.getWebsite(details, properties),
      phone: this.getPhone(details, properties),
      buttonLink: this.getButtonLink(details, properties)
    };
  },

  /**
   * Generates HTML for popup
   * @param {Object} data - Popup data
   * @returns {string} Popup HTML
   */
  generatePopupHTML(data) {
    return `
      <div class="popup_component">
       <img src="${data.imageUrl}" alt="${data.name}" class="popup_image">
       ${data.isPaidPartner ? '<p class="partner-badge">Paid Partner</p>' : ""}
        <div class="spacer-tiny"></div>
       <h4 class="popup_title">${data.name}</h4>
        <div class="spacer-xxsmall"></div>
       ${data.address ? `<p class="popup_address">${data.address}</p>` : ""}
       ${data.hours ? `<p class="popup_hours">Hours: ${data.hours}</p>` : ""}
       ${this.generateWebsiteLink(data.website)}
       ${this.generatePhoneLink(data.phone)}
       <div class="spacer-xsmall"></div>
       <div class="button is-icon w-inline-block" style="background-color: rgb(0, 116, 140));">See Details</div>
      </div>
    `;
  },

  /**
   * Sets up popup tracking in app state
   * @param {Object} popup - Mapbox popup instance
   */
  setupPopupTracking(popup) {
    AppState.dispatch({ type: "ADD_OPEN_POPUP", payload: popup });
    popup.on("close", () => {
      AppState.dispatch({ type: "REMOVE_OPEN_POPUP", payload: popup });
    });
  },

  /**
   * Sets up click handler for popup
   * @param {Object} popup - Mapbox popup instance
   * @param {Object} feature - Map feature
   */
  setupPopupClickHandler(popup, feature) {
    const popupEl = popup.getElement();
    popupEl.addEventListener("click", () => {
      ActionController.execute("selectBeachFromPopup", {
        entityType: "beach",
        feature: feature,
      });
      popup.remove();
    });
  },

  // Data extraction helper methods
  getImageUrl(details, properties) {
    return details?.["main-image"]?.url || 
           properties?.["Main Image"] || 
           "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300";
  },

  getName(details, properties) {
    return details?.name || properties?.Name || "Unknown Location";
  },

  getAddress(details, properties) {
    return details?.["adress"] || properties?.["Formatted Adress"];
  },

  getHours(details, properties) {
    return details?.["hours"] || properties?.["Hours"];
  },

  getPaidPartnerStatus(details, properties) {
    return details?.["paid-partner"] || properties?.["Paid Partner"];
  },

  getWebsite(details, properties) {
    return details?.["beach-website"] || properties?.["Website"];
  },

  getPhone(details, properties) {
    return details?.["phone"] || properties?.["Phone"];
  },

  getButtonLink(details, properties) {
    return details?.["button-link"] || properties?.["Button Link"];
  },

  generateWebsiteLink(website) {
    return website ? `<a href="${website}" target="_blank" class="salty-link">${website.replace(/^https?:\/\//, "")}</a>` : "";
  },

  generatePhoneLink(phone) {
    return phone ? `<a href="tel:${phone}" target="_blank" class="salty-link">${phone}</a>` : "";
  },

  /**
   * Closes all open popups
   */
  closeAllPopups() {
    AppState.getOpenPopups().forEach((popup) => popup.remove());
    AppState.dispatch({ type: "CLEAR_OPEN_POPUPS" });
  }
};

// =============================================================================
// MAIN MAP CONTROLLER
// =============================================================================
export const MapController = {
  LAYER_IDS: {
    STATES: "salty-state",
    CALIFORNIA: "California",
    HAWAII: "Hawaii",
    REGIONS: "salty-city",
    BEACHES: "salty-beaches",
    POIS: "salty-pois",
  },
  hoveredFeature: null,

  /**
   * Initialize the Mapbox map
   */
  async init() {
    try {
      this.setupMapboxConfiguration();
      await this.createMapInstance();
    } catch (error) {
      this.handleMapInitializationError(error);
    }
  },

  /**
   * Sets up Mapbox configuration
   */
  setupMapboxConfiguration() {
    mapboxgl.accessToken = Config.MAP.ACCESS_TOKEN;
  },

  /**
   * Creates the map instance and sets up event handlers
   */
  async createMapInstance() {
    const map = new mapboxgl.Map({
      container: Config.SELECTORS.MAP_CONTAINER.slice(1),
      style: Config.MAP.STYLE,
      center: Utils.isMobileView()
        ? Config.MAP.MOBILE_START_POSITION
        : Config.MAP.DESKTOP_START_POSITION,
      zoom: Config.MAP.DEFAULT_ZOOM,
      pitch: Config.MAP.START_PITCH,
    });

    map.on("load", () => {
      AppState.dispatch({ type: "SET_MAP_INSTANCE", payload: map });
      this.setupEventHandlers();
      this.setupBusSubscriptions();
      this.setupMapResizeObserver();
      console.log("✅ Map initialized with cloud-hosted data and styles.");
    });
  },

  /**
   * Sets up ResizeObserver for map container
   */
  setupMapResizeObserver() {
    const mapContainer = document.querySelector(Config.SELECTORS.MAP_CONTAINER);
    const resizeObserver = new ResizeObserver(() => AppState.getMap()?.resize());
    resizeObserver.observe(mapContainer);
  },

  /**
   * Handles map initialization errors
   * @param {Error} error - Initialization error
   */
  handleMapInitializationError(error) {
    console.error("Failed to initialize map:", error);
    Utils.showError(
      document.querySelector(Config.SELECTORS.MAP_CONTAINER),
      "Failed to load map. Please check your connection and try again."
    );
  },

  /**
   * Setup subscriptions to the event bus
   */
  setupBusSubscriptions() {
    EventBus.subscribe("map:flyTo", this.flyTo.bind(this));
    EventBus.subscribe("map:showPopup", (data) => {
      if (data?.feature) {
        setTimeout(
          () => PopupManager.showPopup(data.feature, data.details),
          data.delay || 0
        );
      }
    });
    EventBus.subscribe("map:closeAllPopups", PopupManager.closeAllPopups.bind(PopupManager));
    EventBus.subscribe("map:zoomTo", this.zoomTo.bind(this));
  },

  /**
   * Setup general map event handlers
   */
  setupEventHandlers() {
    const interactiveLayers = Object.values(this.LAYER_IDS).filter(Boolean);

    if (interactiveLayers.length === 0) {
      console.warn("⚠️ No interactive layers are defined in LAYER_IDS. Clicks will not work.");
      return;
    }

    this.setupClickHandlers(interactiveLayers);
    this.setupHoverHandlers(interactiveLayers);
    this.setupMapMoveHandler();
  },

  /**
   * Sets up click event handlers for interactive layers
   * @param {Array} interactiveLayers - Array of layer IDs
   */
  setupClickHandlers(interactiveLayers) {
    AppState.getMap().on("click", interactiveLayers, 
      MapFeatureHandlers.handleFeatureClick.bind(MapFeatureHandlers)
    );
  },

  /**
   * Sets up hover event handlers for interactive layers  
   * @param {Array} interactiveLayers - Array of layer IDs
   */
  setupHoverHandlers(interactiveLayers) {
    AppState.getMap().on("mousemove", interactiveLayers,
      MapFeatureHandlers.handleFeatureMouseMove.bind(MapFeatureHandlers)
    );

    AppState.getMap().on("mouseleave", interactiveLayers,
      MapFeatureHandlers.handleFeatureMouseLeave.bind(MapFeatureHandlers)
    );
  },

  /**
   * Sets up map move event handler with debouncing
   */
  setupMapMoveHandler() {
    AppState.getMap().on(
      "moveend",
      Utils.debounce(async () => {
        console.log("🗺️ Map moveend event");
        const { ui } = AppState.getState();
        
        if (ui.currentSidebar !== "list") {
          console.log(`[MapController] Sidebar update skipped, current view is "${ui.currentSidebar}".`);
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
    const map = AppState.getMap();
    if (!map) return;

    const { features, type } = await MapQueryHandlers.queryVisibleFeatures(map);
    
    if (features.length > 0) {
      UIController.renderFeatureList(features, type);
    } else {
      console.log("[MapController] No features found in view, clearing list.");
      UIController.renderFeatureList([]);
    }
  },

  /**
   * Show popup for a feature (delegated to PopupManager)
   * @param {Object} feature - Feature to show popup for
   * @param {Object} details - The full details object from the cache
   */
  showPopup(feature, details) {
    PopupManager.showPopup(feature, details);
  },

  /**
   * Closes all popups currently open on the map (delegated to PopupManager)
   */
  closeAllPopups() {
    PopupManager.closeAllPopups();
  },

  /**
   * Fly to a specific location
   * @param {object} payload - The flyTo payload
   */
  flyTo({
    coordinates,
    zoom = Config.MAP.DETAIL_ZOOM,
    speed = Config.UI.MAP_FLY_SPEED,
  }) {
    const map = AppState.getMap();
    if (map) {
      map.flyTo({
        center: coordinates,
        zoom,
        speed: speed,
      });
    }
  },

  /**
   * Zooms to a specific zoom level without changing the center
   * @param {object} payload - The zoomTo payload
   */
  zoomTo({ zoom, speed = 1.2 }) {
    const map = AppState.getMap();
    if (map) {
      map.easeTo({
        zoom,
        speed,
      });
    }
  },
};
