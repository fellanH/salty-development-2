// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

import { Config } from "./config.js";

export const Utils = {
  /**
   * Check if current view is mobile
   * @returns {boolean} True if mobile view
   */
  isMobileView() {
    return window.innerWidth <= Config.MAP.mobileBreakpointInPixels;
  },

  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} waitTimeInMs - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  createDebouncedFunction(func, waitTimeInMs) {
    let timeoutId;
    return function executeAfterDelay(...args) {
      const executeFunction = () => {
        clearTimeout(timeoutId);
        func(...args);
      };
      clearTimeout(timeoutId);
      timeoutId = setTimeout(executeFunction, waitTimeInMs);
    };
  },

  /**
   * Show loading state
   * @param {HTMLElement} element - Element to show loading in
   */
  displayLoading(element) {
    element.innerHTML =
      '<div class="loader" style="display: flex; justify-content: center; padding: 20px;">Loading...</div>';
  },

  /**
   * Show error message
   * @param {HTMLElement} element - Element to show error in
   * @param {string} message - Error message
   */
  displayError(element, message) {
    element.innerHTML = `<div class="error" style="padding: 20px; text-align: center; color: #d32f2f;">${message}</div>`;
  },

  /**
   * Gets a unique and consistent ID from a feature's properties.
   * @param {object} feature - The GeoJSON feature.
   * @returns {string|number|null} The unique ID of the feature.
   */
  extractFeatureEntityId(feature) {
    if (!feature) return null;
    const properties = feature.properties || {};
    // Order is important. Check properties first, then the top-level feature ID as a fallback.
    return (
      properties["Item ID"] || properties["Location Cluster"] || properties.NAME || properties.Name || feature.id
    );
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
  updateElementContent({
    element,
    value,
    type = "text",
    defaultValue = "N/A",
    transform,
  }) {
    if (!element) return;

    let finalValue =
      value !== undefined && value !== null ? value : defaultValue;
    if (transform) {
      finalValue = transform(finalValue);
    }

    switch (type) {
      case "href":
        element.href = finalValue;
        break;
      case "src":
        element.src = finalValue;
        break;
      case "html":
        element.innerHTML = finalValue;
        break;
      default:
        element.textContent = finalValue;
        break;
    }
  },

  /**
   * Binds data to an element based on its `data-bind` attribute.
   * @param {HTMLElement} element - The element to bind data to.
   * @param {object} data - The data object.
   */
  bindDataToElement(element, data) {
    const key = element.dataset.bind;
    const value = data[key];
    if (value !== undefined) {
      element.textContent = value;
    }
  },

  /**
   * Helper to safely parse JSON with error handling
   * @param {string} jsonString - JSON string to parse
   * @returns {object|null} Parsed object or null if parsing fails
   */
  parseJsonSafely(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn('Failed to parse JSON:', error);
      return null;
    }
  },

  /**
   * Format duration from milliseconds to human readable format
   * @param {number} durationInMs - Duration in milliseconds
   * @returns {string} Formatted duration string
   */
  formatDuration(durationInMs) {
    const seconds = Math.floor(durationInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
};
