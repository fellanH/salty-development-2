// =============================================================================
// MARKER MANAGER MODULE
// Dynamic Category-Based Icon System for Map Markers
// =============================================================================

import { Config } from "./config.js";
import { AppState } from "./appState.js";

export const MarkerManager = {
  // Store active markers
  activeMarkers: new Map(),
  
  // Store marker elements for cleanup
  markerElements: new Map(),

  /**
   * Initialize marker management system
   */
  init() {
    console.log("[MarkerManager] Initializing dynamic marker system");
    this.setupMarkerEventHandlers();
  },

  /**
   * Create a marker icon based on category
   * @param {string} category - The category name
   * @param {string} type - Entity type ('beach' or 'poi')
   * @param {string} state - Marker state ('default', 'hover', 'selected')
   * @returns {HTMLElement} Icon element
   */
  createCategoryIcon(category, type = 'poi', state = 'default') {
    const iconName = Config.ICONS.getIconForCategory(category, type);
    const iconStyle = Config.ICONS.getIconStyle(state);
    
    // Create icon container
    const iconContainer = document.createElement('div');
    iconContainer.className = `marker-icon marker-icon-${type} marker-icon-${state}`;
    iconContainer.style.cssText = `
      width: ${24 * iconStyle.size}px;
      height: ${24 * iconStyle.size}px;
      background-color: ${iconStyle.color};
      border: ${iconStyle.haloWidth}px solid ${iconStyle.haloColor};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
    
    // Add icon (using text as placeholder - in real implementation you'd use icon fonts or SVGs)
    const iconText = this.getIconSymbol(iconName);
    iconContainer.innerHTML = `<span style="color: white; font-size: ${12 * iconStyle.size}px; font-weight: bold;">${iconText}</span>`;
    
    // Add data attributes for identification
    iconContainer.setAttribute('data-icon-name', iconName);
    iconContainer.setAttribute('data-category', category || 'unknown');
    iconContainer.setAttribute('data-type', type);
    
    return iconContainer;
  },

  /**
   * Get a symbol representation for an icon name (placeholder for actual icons)
   * In a real implementation, this would load actual icon fonts or SVGs
   * @param {string} iconName - The icon identifier
   * @returns {string} Symbol representation
   */
  getIconSymbol(iconName) {
    const iconSymbols = {
      // Beach icons
      "beach-umbrella": "🏖️",
      "shield-check": "🛡️",
      "building-government": "🏛️",
      "lock": "🔒",
      "volleyball": "🏐",
      "waves": "🌊",
      "users": "👥",
      "dog": "🐕",
      "fish": "🐟",
      "tent": "⛺",
      
      // POI icons
      "lifeguard-tower": "🏥",
      "info-circle": "ℹ️",
      "basketball-ball": "🏀",
      "utensils": "🍴",
      "shopping-bag": "🛍️",
      "bed": "🛏️",
      "car": "🚗",
      "restroom": "🚻",
      "parking": "🅿️",
      "hospital": "🏥",
      "music": "🎵",
      "leaf": "🍃",
      "landmark": "🏛️",
      "camera": "📷",
      "coffee": "☕",
      "glass-martini": "🍸",
      "umbrella-beach": "🏖️",
      "anchor": "⚓",
      "walking": "🚶",
      "child": "👶",
      "picnic-table": "🧺",
      "shower": "🚿",
      "door-open": "🚪",
      "first-aid": "🩹",
      "hotdog": "🌭",
      
      // Defaults
      "map-marker": "📍",
      "map-pin": "📌",
      "layer-group": "📂",
    };
    
    return iconSymbols[iconName] || "📍";
  },

  /**
   * Add dynamic markers to the map for features
   * @param {Array} features - GeoJSON features to add markers for
   * @param {string} type - Feature type ('beach' or 'poi')
   */
  addMarkersForFeatures(features, type) {
    const map = AppState.getMap();
    if (!map || !features || features.length === 0) return;

    console.log(`[MarkerManager] Adding ${features.length} ${type} markers with category-based icons`);

    features.forEach(feature => {
      if (!feature.geometry || !feature.geometry.coordinates) return;

      const category = this.extractCategory(feature, type);
      const entityId = feature.properties['Item ID'] || feature.id;
      
      // Remove existing marker if it exists
      this.removeMarker(entityId);
      
      // Create icon element
      const iconElement = this.createCategoryIcon(category, type, 'default');
      
      // Create Mapbox marker
      const marker = new mapboxgl.Marker(iconElement)
        .setLngLat(feature.geometry.coordinates)
        .addTo(map);

      // Store marker references
      this.activeMarkers.set(entityId, marker);
      this.markerElements.set(entityId, iconElement);
      
      // Add click handler
      iconElement.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleMarkerClick(feature, type, iconElement);
      });
      
      // Add hover handlers
      iconElement.addEventListener('mouseenter', () => {
        this.updateMarkerState(entityId, category, type, 'hover');
      });
      
      iconElement.addEventListener('mouseleave', () => {
        const selection = AppState.getCurrentSelection();
        const isSelected = selection.id === entityId;
        this.updateMarkerState(entityId, category, type, isSelected ? 'selected' : 'default');
      });
    });
  },

  /**
   * Extract category from feature based on type
   * @param {Object} feature - GeoJSON feature
   * @param {string} type - Feature type
   * @returns {string} Category name
   */
  extractCategory(feature, type) {
    const props = feature.properties;
    
    if (type === 'poi') {
      return props.categoryName || props.category || props.type || props.Type || 'Point of Interest';
    } else if (type === 'beach') {
      return props.categoryName || props.category || props.type || props.Type || 'Beach';
    }
    
    return 'Unknown';
  },

  /**
   * Handle marker click events
   * @param {Object} feature - Clicked feature
   * @param {string} type - Feature type
   * @param {HTMLElement} iconElement - Icon element
   */
  handleMarkerClick(feature, type, iconElement) {
    console.log(`[MarkerManager] Category-based ${type} marker clicked:`, feature.properties);
    
    // Determine action based on type
    let actionName;
    switch (type) {
      case 'beach':
        actionName = 'selectBeachFromMap';
        break;
      case 'poi':
        actionName = 'selectPOIFromMap';
        break;
      default:
        return;
    }
    
    // Import ActionController dynamically to avoid circular imports
    import('./actionController.js').then(({ ActionController }) => {
      ActionController.execute(actionName, { 
        feature, 
        entityType: type,
        source: 'dynamic-marker'
      });
    });
  },

  /**
   * Update marker visual state
   * @param {string} entityId - Entity ID
   * @param {string} category - Category name
   * @param {string} type - Entity type
   * @param {string} state - New state
   */
  updateMarkerState(entityId, category, type, state) {
    const iconElement = this.markerElements.get(entityId);
    if (!iconElement) return;

    const iconStyle = Config.ICONS.getIconStyle(state);
    
    // Update element styles
    iconElement.style.width = `${24 * iconStyle.size}px`;
    iconElement.style.height = `${24 * iconStyle.size}px`;
    iconElement.style.backgroundColor = iconStyle.color;
    iconElement.style.borderWidth = `${iconStyle.haloWidth}px`;
    iconElement.style.borderColor = iconStyle.haloColor;
    
    // Update class names
    iconElement.className = `marker-icon marker-icon-${type} marker-icon-${state}`;
  },

  /**
   * Update selected marker state
   * @param {string} entityId - Selected entity ID
   * @param {string} type - Entity type
   */
  updateSelectedMarker(entityId, type) {
    // Reset all markers to default state
    this.markerElements.forEach((element, id) => {
      if (id !== entityId) {
        const category = element.getAttribute('data-category');
        const markerType = element.getAttribute('data-type');
        this.updateMarkerState(id, category, markerType, 'default');
      }
    });
    
    // Set selected marker to selected state
    if (entityId) {
      const iconElement = this.markerElements.get(entityId);
      if (iconElement) {
        const category = iconElement.getAttribute('data-category');
        this.updateMarkerState(entityId, category, type, 'selected');
      }
    }
  },

  /**
   * Remove a specific marker
   * @param {string} entityId - Entity ID to remove
   */
  removeMarker(entityId) {
    const marker = this.activeMarkers.get(entityId);
    if (marker) {
      marker.remove();
      this.activeMarkers.delete(entityId);
      this.markerElements.delete(entityId);
    }
  },

  /**
   * Clear all dynamic markers
   */
  clearAllMarkers() {
    console.log("[MarkerManager] Clearing all dynamic markers");
    this.activeMarkers.forEach(marker => marker.remove());
    this.activeMarkers.clear();
    this.markerElements.clear();
  },

  /**
   * Setup event handlers for marker management
   */
  setupMarkerEventHandlers() {
    // Listen for selection changes to update marker states
    import('./eventBus.js').then(({ EventBus }) => {
      EventBus.subscribe('state:selectionChanged', (selection) => {
        if (selection && selection.id) {
          this.updateSelectedMarker(selection.id, selection.type);
        }
      });
    });
  },

  /**
   * Get marker statistics
   * @returns {Object} Marker statistics
   */
  getMarkerStats() {
    const stats = {
      total: this.activeMarkers.size,
      byType: {},
      byCategory: {},
    };

    this.markerElements.forEach(element => {
      const type = element.getAttribute('data-type');
      const category = element.getAttribute('data-category');
      
      stats.byType[type] = (stats.byType[type] || 0) + 1;
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
    });

    return stats;
  },
}; 