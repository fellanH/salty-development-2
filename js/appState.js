// =============================================================================
// APPLICATION STATE MODULE
// =============================================================================

import { EventBus } from "./eventBus.js";

export const AppState = {
  // Core application state
  map: null,
  currentSelection: {
    id: null,
    type: null, // 'beach' or 'poi'
    feature: null,
  },

  // Data cache
  cache: {
    config: null,
    geojsonData: null,
    beachDetails: new Map(),
    weatherData: new Map(),
    visibleFeatures: new Map(),
  },

  // UI state
  ui: {
    currentSidebar: "home", // 'home', 'list', 'detail'
    isMobile: false,
    isLoading: false,
  },

  /**
   * Set the currently selected item
   * @param {string} type - 'beach' or 'poi'
   * @param {string} id - The item ID
   * @param {Object} feature - The GeoJSON feature
   */
  setSelection(type, id, feature = null) {
    if (
      this.currentSelection.id === id &&
      this.currentSelection.type === type
    ) {
      return; // Avoid unnecessary updates
    }

    this.currentSelection = { id, type, feature };
    EventBus.publish("state:selectionChanged", this.currentSelection);
  },

  /**
   * Clear the current selection
   */
  clearSelection() {
    this.setSelection(null, null, null);
  },

  /**
   * Update UI state
   * @param {Object} updates - State updates
   */
  updateUI(updates) {
    this.ui = { ...this.ui, ...updates };
  },
};
