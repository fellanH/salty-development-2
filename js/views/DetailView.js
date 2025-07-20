// =============================================================================
// DETAIL VIEW - REFACTORED FOR BETTER ORGANIZATION
// =============================================================================

import { AppState } from "../appState.js";
import { apiConfig } from "../config/api.js";
import { Utils } from "../utils.js";

// =============================================================================
// DATA MAPPING STRATEGIES MODULE
// =============================================================================
const DataMappingStrategies = {
  /**
   * Maps POI data to view data structure
   * @param {object} details - POI details from cache
   * @returns {object} Mapped view data
   */
  mapPOIData(details) {
    return {
      // Basic info
      imageUrl: this.extractImageUrl(details, 'poi'),
      name: this.extractName(details, 'poi'),
      googleMapsUrl: details["google-maps-link"] || details.googleMapsUrl || "#",
      address: this.extractAddress(details, 'poi'),
      websiteUrl: details.website || details["website-url"],
      websiteHost: this.extractWebsiteHost(details.website || details["website-url"]),
      phone: details.phone || "N/A",
      
      // POI-specific info
      category: details.categoryName || details.category || details.type || "Point of Interest",
      description: details.richTextContent || details.description || "N/A",
      
      // Amenities (POIs typically don't have detailed amenity info)
      restrooms: "N/A",
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
      recreation: details.categoryName || details.category || "N/A",
      
      // Weather data (POIs typically don't have weather data)
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
      sunset: "N/A",
    };
  },

  /**
   * Maps beach data to view data structure
   * @param {object} details - Beach details from cache
   * @returns {object} Mapped view data
   */
  mapBeachData(details) {
    return {
      // Basic info
      imageUrl: this.extractImageUrl(details, 'beach'),
      name: this.extractName(details, 'beach'),
      googleMapsUrl: details["google-maps-link"] || "#",
      address: this.extractAddress(details, 'beach'),
      websiteUrl: details["beach-website"],
      websiteHost: this.extractWebsiteHost(details["beach-website"]),
      phone: details.phone || "N/A",
      
      // Amenities
      restrooms: details.restrooms || "N/A",
      showers: details.showers || "N/A",
      pets: details["pets-allowed"] || "N/A",
      parking: details["parking-lot-nearby"] || "N/A",
      parkingHours: details["parking-hours"] || "N/A",
      camping: details["camping-offered"] || "N/A",
      bonfire: details["bonfire-availabiliity"] || "N/A",
      fishing: details.fishing || "N/A",
      pier: details.pier || "N/A",
      picnic: details["picnic-area-rentals"] || "N/A",
      surfing: details["surfing-beach"] || "N/A",
      recreation: details["recreation-activities"] || "N/A",
      
      // Weather data
      airTemp: this.formatTemperature(details.temperature),
      feelsLike: this.formatTemperature(details.feels_like, '°F'),
      humidity: this.formatPercentage(details.humidity),
      wind: this.formatSpeed(details.windSpeed, 'mph'),
      windDirection: this.formatDirection(details.windDirection),
      aqi: details.aqi ?? "N/A",
      rainfall: this.formatMeasurement(details.rainfall, 'in'),
      pressure: this.formatMeasurement(details.pressure, 'inHg'),
      pm25: this.formatMeasurement(details.pm25, 'µg/m³'),
      pm10: this.formatMeasurement(details.pm10, 'µg/m³'),
      waterTemp: this.formatTemperature(details.water_temp, '°F'),
      waveHeight: this.formatMeasurement(details.wave_height, 'ft'),
      oceanCurrent: details.ocean_current ?? "N/A",
      uvIndex: details.uv_index ?? "N/A",
      cloudCover: this.formatPercentage(details.cloud_cover),
      sunset: this.formatTime(details.sunset),
    };
  },

  // Data extraction helper methods
  extractImageUrl(details, type) {
    if (type === 'poi') {
      return details.mainImageUrl || 
             details["main-image"]?.url || 
             "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400";
    } else {
      return details["main-image"]?.url || 
             "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300";
    }
  },

  extractName(details, type) {
    return details.name || details.Name || (type === 'poi' ? "Point of Interest" : "Beach Name");
  },

  extractAddress(details, type) {
    if (type === 'poi') {
      return details.address || 
             details["formatted-address"] || 
             details["formatted-adress"] || 
             "Address not available";
    } else {
      return details["formatted-address"] || 
             details["formatted-adress"] || 
             "Google Maps Link";
    }
  },

  extractWebsiteHost(url) {
    if (!url || !url.startsWith("http")) return "";
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  },

  // Formatting helper methods
  formatTemperature(temp, unit = '') {
    return temp ? `${Math.round(temp)}${unit}` : "N/A";
  },

  formatPercentage(value) {
    return value ? `${value}%` : "N/A";
  },

  formatSpeed(value, unit) {
    return value ? `${value} ${unit}` : "N/A";
  },

  formatDirection(value) {
    return value ? `${value}°` : "N/A";
  },

  formatMeasurement(value, unit) {
    return value ? `${value} ${unit}` : "N/A";
  },

  formatTime(timestamp) {
    if (!timestamp) return "N/A";
    try {
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit" 
      });
    } catch {
      return "N/A";
    }
  }
};

// =============================================================================
// DOM RENDERER MODULE
// =============================================================================
const DOMRenderer = {
  /**
   * Renders view data to DOM elements
   * @param {HTMLElement} container - Container element
   * @param {object} viewData - Mapped view data
   */
  renderViewData(container, viewData) {
    const attributeMap = this.getAttributeMap();
    
    // Render each data field
    for (const [dataKey, attributeValue] of Object.entries(attributeMap)) {
      if (viewData.hasOwnProperty(dataKey)) {
        this.renderDataField(container, attributeValue, viewData[dataKey], viewData);
      }
    }
    
    // Handle conditional visibility
    this.handleConditionalVisibility(container, viewData);
  },

  /**
   * Gets the data-to-attribute mapping
   * @returns {object} Attribute mapping
   */
  getAttributeMap() {
    return {
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
      sunset: "sunset",
    };
  },

  /**
   * Renders a single data field to its corresponding DOM element
   * @param {HTMLElement} container - Container element
   * @param {string} attributeValue - Data attribute value
   * @param {*} value - Data value to render
   * @param {object} allData - All view data for context
   */
  renderDataField(container, attributeValue, value, allData) {
    const element = container.querySelector(`[beach-data="${attributeValue}"]`);
    
    if (!element) return;

    this.updateElementByType(element, value, allData);
  },

  /**
   * Updates an element based on its type and the value
   * @param {HTMLElement} element - Element to update
   * @param {*} value - Value to set
   * @param {object} allData - All view data for context
   */
  updateElementByType(element, value, allData) {
    const tagName = element.tagName.toLowerCase();
    
    switch (tagName) {
      case "a":
        element.href = value || "#";
        break;
      case "img":
        element.src = value;
        element.alt = allData.name || "Image";
        break;
      default:
        element.textContent = value;
    }
  },

  /**
   * Handles conditional visibility of elements
   * @param {HTMLElement} container - Container element
   * @param {object} viewData - View data
   */
  handleConditionalVisibility(container, viewData) {
    // Handle website link wrapper visibility
    const websiteLinkWrapper = container.querySelector('[data-bind-parent="websiteUrl"]');
    if (websiteLinkWrapper) {
      const hasWebsite = viewData.websiteUrl && viewData.websiteUrl !== "N/A";
      websiteLinkWrapper.style.display = hasWebsite ? "flex" : "none";
    }

    // Handle other conditional elements
    this.handlePhoneVisibility(container, viewData);
    this.handleAddressVisibility(container, viewData);
  },

  /**
   * Handles phone number visibility
   * @param {HTMLElement} container - Container element
   * @param {object} viewData - View data
   */
  handlePhoneVisibility(container, viewData) {
    const phoneWrapper = container.querySelector('[data-bind-parent="phone"]');
    if (phoneWrapper) {
      const hasPhone = viewData.phone && viewData.phone !== "N/A";
      phoneWrapper.style.display = hasPhone ? "flex" : "none";
    }
  },

  /**
   * Handles address visibility
   * @param {HTMLElement} container - Container element
   * @param {object} viewData - View data
   */
  handleAddressVisibility(container, viewData) {
    const addressWrapper = container.querySelector('[data-bind-parent="address"]');
    if (addressWrapper) {
      const hasAddress = viewData.address && 
                         viewData.address !== "N/A" && 
                         viewData.address !== "Address not available";
      addressWrapper.style.display = hasAddress ? "flex" : "none";
    }
  }
};

// =============================================================================
// WEATHER DATA SERVICE MODULE
// =============================================================================
const WeatherDataService = {
  /**
   * Fetches weather data with caching
   * @param {string} locationId - Location ID
   * @returns {Promise<object|null>} Weather data or null
   */
  async fetchWeatherData(locationId) {
    if (!locationId) return null;

    // Check cache first
    const cachedData = this.getCachedWeatherData(locationId);
    if (cachedData) {
      console.log("[WeatherDataService] Cache hit for location:", locationId);
      return cachedData;
    }

    // Fetch from API
    try {
      const data = await this.fetchFromAPI(locationId);
      if (data) {
        this.cacheWeatherData(locationId, data);
        this.scheduleDataExpiration(locationId);
      }
      return data;
    } catch (error) {
      console.error('[WeatherDataService] Error fetching weather data:', error);
      return null;
    }
  },

  /**
   * Gets cached weather data
   * @param {string} locationId - Location ID
   * @returns {object|null} Cached data or null
   */
  getCachedWeatherData(locationId) {
    return AppState.getState().cache.weatherData.get(locationId);
  },

  /**
   * Fetches weather data from API
   * @param {string} locationId - Location ID
   * @returns {Promise<object>} Weather data
   */
  async fetchFromAPI(locationId) {
    const response = await fetch(`${apiConfig.BASE_URL}/api/weather/${locationId}`);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("[WeatherDataService] Fetched weather data for:", locationId);
    return data;
  },

  /**
   * Caches weather data
   * @param {string} locationId - Location ID
   * @param {object} data - Weather data
   */
  cacheWeatherData(locationId, data) {
    AppState.dispatch({ 
      type: "SET_WEATHER_DATA", 
      payload: { id: locationId, data } 
    });
  },

  /**
   * Schedules weather data expiration
   * @param {string} locationId - Location ID
   * @param {number} ttl - Time to live in milliseconds
   */
  scheduleDataExpiration(locationId, ttl = 5 * 60 * 1000) {
    setTimeout(() => {
      AppState.dispatch({ 
        type: "DELETE_WEATHER_DATA", 
        payload: { id: locationId } 
      });
      console.log("[WeatherDataService] Expired weather data for:", locationId);
    }, ttl);
  }
};

// =============================================================================
// DETAIL DATA RESOLVER MODULE
// =============================================================================
const DetailDataResolver = {
  /**
   * Resolves detail data for an entity
   * @param {string} entityId - Entity ID
   * @param {string} entityType - Entity type ('beach' or 'poi')
   * @returns {object|null} Resolved detail data
   */
  resolveDetailData(entityId, entityType) {
    if (!entityId || !entityType) return null;

    switch (entityType) {
      case "poi":
        return this.resolvePOIData(entityId);
      case "beach":
        return this.resolveBeachData(entityId);
      default:
        console.warn(`[DetailDataResolver] Unknown entity type: ${entityType}`);
        return null;
    }
  },

  /**
   * Resolves POI data from cache
   * @param {string} poiId - POI ID
   * @returns {object|null} POI data
   */
  resolvePOIData(poiId) {
    const details = AppState.getPOIById(poiId);
    const cache = AppState.getState().cache.poiData;
    
    console.log(`[DetailDataResolver] POI Cache has ${cache.size} items. Looking for ID: ${poiId}`);
    
    if (!details) {
      console.error(`[DetailDataResolver] Could not find POI with ID ${poiId} in cache.`);
      return null;
    }

    return details;
  },

  /**
   * Resolves beach data from cache
   * @param {string} beachId - Beach ID
   * @returns {object|null} Beach data
   */
  resolveBeachData(beachId) {
    const details = AppState.getBeachById(beachId);
    const cache = AppState.getState().cache.beachData;
    
    console.log(`[DetailDataResolver] Beach Cache has ${cache.size} items. Looking for ID: ${beachId}`);
    
    if (!details) {
      console.error(`[DetailDataResolver] Could not find beach with ID ${beachId} in cache.`);
      return null;
    }

    return details;
  }
};

// =============================================================================
// MAIN DETAIL VIEW
// =============================================================================
export const DetailView = {
  /**
   * Initializes the detail view
   */
  init() {
    console.log("[DetailView] Initialized detail view with refactored modules.");
  },

  /**
   * Updates detail sidebar with current selection using declarative rendering
   * @returns {Promise<void>}
   */
  async updateDetailSidebar() {
    const { id, type } = AppState.getCurrentSelection();
    const viewContainer = AppState.getUICachedElement("SIDEBAR_BEACH");

    console.log(`[DetailView] Updating sidebar for ID: ${id}, type: ${type}`);

    if (!id || !viewContainer) {
      console.log("[DetailView] Missing ID or view container, skipping update.");
      return;
    }

    try {
      // Resolve detail data
      const details = DetailDataResolver.resolveDetailData(id, type);
      if (!details) {
        Utils.showError(viewContainer, "Could not load details for the selected item.");
        return;
      }

      console.log('[DetailView] Details resolved from cache:', details);

      // Map data to view structure
      const viewData = this.mapDetailsToViewData(details, type);
      
      // Render to DOM
      DOMRenderer.renderViewData(viewContainer, viewData);
      
      console.log('[DetailView] Successfully updated detail sidebar.');
      
    } catch (error) {
      console.error('[DetailView] Error updating detail sidebar:', error);
      Utils.showError(viewContainer, "An error occurred while loading details.");
    }
  },

  /**
   * Maps detail data to view data structure
   * @param {object} details - Raw detail data
   * @param {string} type - Entity type
   * @returns {object} Mapped view data
   */
  mapDetailsToViewData(details, type) {
    switch (type) {
      case "poi":
        return DataMappingStrategies.mapPOIData(details);
      case "beach":
        return DataMappingStrategies.mapBeachData(details);
      default:
        throw new Error(`Unknown entity type: ${type}`);
    }
  },

  /**
   * Fetches weather data (delegated to WeatherDataService)
   * @param {string} locationId - Location ID
   * @returns {Promise<object|null>} Weather data
   */
  async fetchWeatherData(locationId) {
    return await WeatherDataService.fetchWeatherData(locationId);
  },
};

// Export individual modules for testing or focused imports
export {
  DataMappingStrategies,
  DOMRenderer,
  WeatherDataService,
  DetailDataResolver
}; 