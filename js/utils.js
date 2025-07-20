// =============================================================================
// UTILITY FUNCTIONS - ORGANIZED BY DOMAIN
// =============================================================================

import { Config } from "./config.js";

// =============================================================================
// VIEWPORT AND RESPONSIVE UTILITIES
// =============================================================================
const ViewportUtils = {
  /**
   * Check if current view is mobile
   * @returns {boolean} True if mobile view
   */
  isMobileView() {
    return window.innerWidth <= Config.MAP.MOBILE_BREAKPOINT;
  },

  /**
   * Check if current view is desktop
   * @returns {boolean} True if desktop view
   */
  isDesktopView() {
    return !this.isMobileView();
  },

  /**
   * Get viewport dimensions
   * @returns {Object} Viewport width and height
   */
  getViewportDimensions() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
};

// =============================================================================
// PERFORMANCE AND TIMING UTILITIES
// =============================================================================
const PerformanceUtils = {
  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Creates a delay/sleep function
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} Promise that resolves after the delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// =============================================================================
// UI STATE AND LOADING UTILITIES
// =============================================================================
const UIStateUtils = {
  /**
   * Show loading state
   * @param {HTMLElement} element - Element to show loading in
   * @param {string} message - Custom loading message
   */
  showLoading(element, message = "Loading...") {
    if (!element) return;
    
    element.innerHTML = `
      <div class="loader" style="display: flex; justify-content: center; padding: 20px;">
        ${message}
      </div>
    `;
  },

  /**
   * Show error message
   * @param {HTMLElement} element - Element to show error in
   * @param {string} message - Error message
   */
  showError(element, message) {
    if (!element) return;
    
    element.innerHTML = `
      <div class="error" style="padding: 20px; text-align: center; color: #d32f2f;">
        ${message}
      </div>
    `;
  },

  /**
   * Show success message
   * @param {HTMLElement} element - Element to show success in
   * @param {string} message - Success message
   */
  showSuccess(element, message) {
    if (!element) return;
    
    element.innerHTML = `
      <div class="success" style="padding: 20px; text-align: center; color: #2e7d32;">
        ${message}
      </div>
    `;
  },

  /**
   * Clear element content
   * @param {HTMLElement} element - Element to clear
   */
  clearElement(element) {
    if (element) {
      element.innerHTML = '';
    }
  }
};

// =============================================================================
// FEATURE DATA UTILITIES
// =============================================================================
const FeatureDataUtils = {
  /**
   * Gets a unique and consistent ID from a feature's properties
   * @param {object} feature - The GeoJSON feature
   * @returns {string|number|null} The unique ID of the feature
   */
  getFeatureEntityId(feature) {
    if (!feature) return null;
    
    const properties = feature.properties || {};
    
    // Priority order for ID extraction
    const idFields = [
      "Item ID",
      "Location Cluster", 
      "NAME",
      "Name",
      "id"
    ];
    
    for (const field of idFields) {
      if (properties[field] !== undefined && properties[field] !== null) {
        return properties[field];
      }
    }
    
    // Fallback to feature's top-level ID
    return feature.id || null;
  },

  /**
   * Extracts coordinates from a feature
   * @param {object} feature - The GeoJSON feature
   * @returns {Array|null} [lng, lat] coordinates or null
   */
  getFeatureCoordinates(feature) {
    if (!feature?.geometry?.coordinates) return null;
    
    const { coordinates, type } = feature.geometry;
    
    // Handle different geometry types
    switch (type) {
      case 'Point':
        return coordinates;
      case 'Polygon':
      case 'MultiPolygon':
        // Return center of first polygon
        return this.getPolygonCenter(coordinates);
      default:
        return coordinates[0] || null;
    }
  },

  /**
   * Calculates the center point of a polygon
   * @param {Array} coordinates - Polygon coordinates
   * @returns {Array} [lng, lat] center coordinates
   */
  getPolygonCenter(coordinates) {
    const polygon = coordinates[0] || coordinates;
    if (!Array.isArray(polygon) || polygon.length === 0) return null;
    
    let lng = 0, lat = 0;
    polygon.forEach(coord => {
      lng += coord[0];
      lat += coord[1];
    });
    
    return [lng / polygon.length, lat / polygon.length];
  }
};

// =============================================================================
// DOM MANIPULATION UTILITIES  
// =============================================================================
const DOMUtils = {
  /**
   * Updates a DOM element with a value, supporting various update types
   * @param {object} config - Configuration object
   * @param {HTMLElement} config.element - The DOM element to update
   * @param {*} config.value - The value to apply
   * @param {string} [config.type='text'] - 'text', 'href', 'src', 'html'
   * @param {string} [config.defaultValue='N/A'] - Fallback value
   * @param {function(value): *} [config.transform] - Transform function
   */
  updateElement({
    element,
    value,
    type = "text",
    defaultValue = "N/A",
    transform,
  }) {
    if (!element) return;

    let finalValue = value !== undefined && value !== null ? value : defaultValue;
    
    if (transform && typeof transform === 'function') {
      finalValue = transform(finalValue);
    }

    this.applyValueToElement(element, finalValue, type);
  },

  /**
   * Applies a value to an element based on type
   * @param {HTMLElement} element - Target element
   * @param {*} value - Value to apply
   * @param {string} type - Type of update
   */
  applyValueToElement(element, value, type) {
    switch (type) {
      case "href":
        element.href = value;
        break;
      case "src":
        element.src = value;
        break;
      case "html":
        element.innerHTML = value;
        break;
      case "class":
        element.className = value;
        break;
      case "style":
        element.style.cssText = value;
        break;
      default:
        element.textContent = value;
    }
  },

  /**
   * Populates elements in a container with data from an object
   * Uses data-bind attributes to map data to elements
   * @param {HTMLElement} container - Parent element containing elements to populate
   * @param {object} data - The data object
   * @param {object} options - Additional options
   */
  renderView(container, data, options = {}) {
    if (!container || !data) return;

    const { 
      bindAttribute = 'data-bind',
      missingDataHandler = () => '',
      errorHandler = (error) => console.warn('Error rendering view:', error)
    } = options;

    try {
      const elementsToUpdate = container.querySelectorAll(`[${bindAttribute}]`);
      
      elementsToUpdate.forEach((element) => {
        const key = element.getAttribute(bindAttribute);
        const value = this.getNestedValue(data, key);

        if (value !== undefined && value !== null) {
          this.updateElementByType(element, value);
        } else {
          const fallbackValue = missingDataHandler(key, element);
          if (fallbackValue !== null) {
            this.updateElementByType(element, fallbackValue);
          }
        }
      });
    } catch (error) {
      errorHandler(error);
    }
  },

  /**
   * Gets a nested value from an object using dot notation
   * @param {object} obj - Source object
   * @param {string} path - Dot notation path (e.g., 'user.name')
   * @returns {*} The value at the path
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  },

  /**
   * Updates an element based on its tag type
   * @param {HTMLElement} element - Element to update
   * @param {*} value - Value to set
   */
  updateElementByType(element, value) {
    const tagName = element.tagName.toLowerCase();
    
    switch (tagName) {
      case "a":
        element.href = value;
        break;
      case "img":
        element.src = value;
        break;
      case "input":
        element.value = value;
        break;
      default:
        element.textContent = value;
    }
  },

  /**
   * Finds an element by selector with error handling
   * @param {string} selector - CSS selector
   * @param {HTMLElement} container - Container to search in
   * @returns {HTMLElement|null} Found element or null
   */
  findElement(selector, container = document) {
    try {
      return container.querySelector(selector);
    } catch (error) {
      console.warn(`Invalid selector: ${selector}`, error);
      return null;
    }
  },

  /**
   * Finds multiple elements by selector with error handling
   * @param {string} selector - CSS selector
   * @param {HTMLElement} container - Container to search in
   * @returns {NodeList} Found elements
   */
  findElements(selector, container = document) {
    try {
      return container.querySelectorAll(selector);
    } catch (error) {
      console.warn(`Invalid selector: ${selector}`, error);
      return [];
    }
  }
};

// =============================================================================
// DATA VALIDATION AND TRANSFORMATION UTILITIES
// =============================================================================
const DataUtils = {
  /**
   * Checks if a value is empty (null, undefined, empty string, empty array)
   * @param {*} value - Value to check
   * @returns {boolean} True if empty
   */
  isEmpty(value) {
    return value === null || 
           value === undefined || 
           value === '' || 
           (Array.isArray(value) && value.length === 0) ||
           (typeof value === 'object' && Object.keys(value).length === 0);
  },

  /**
   * Safely gets a value with a fallback
   * @param {*} value - Primary value
   * @param {*} fallback - Fallback value
   * @returns {*} Value or fallback
   */
  getValueOrFallback(value, fallback = 'N/A') {
    return this.isEmpty(value) ? fallback : value;
  },

  /**
   * Formats a URL to remove protocol for display
   * @param {string} url - URL to format
   * @returns {string} Formatted URL
   */
  formatUrlForDisplay(url) {
    if (!url || typeof url !== 'string') return '';
    return url.replace(/^https?:\/\//, '');
  },

  /**
   * Validates an email address
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validates a phone number (basic validation)
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid phone
   */
  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone?.replace(/\D/g, ''));
  },

  /**
   * Truncates text to a specified length
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @param {string} suffix - Suffix to add when truncated
   * @returns {string} Truncated text
   */
  truncateText(text, maxLength, suffix = '...') {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  }
};

// =============================================================================
// MAIN UTILS EXPORT - BACKWARD COMPATIBILITY
// =============================================================================
export const Utils = {
  // Viewport utilities
  isMobileView: ViewportUtils.isMobileView.bind(ViewportUtils),
  isDesktopView: ViewportUtils.isDesktopView.bind(ViewportUtils),
  getViewportDimensions: ViewportUtils.getViewportDimensions.bind(ViewportUtils),

  // Performance utilities  
  debounce: PerformanceUtils.debounce.bind(PerformanceUtils),
  throttle: PerformanceUtils.throttle.bind(PerformanceUtils),
  delay: PerformanceUtils.delay.bind(PerformanceUtils),

  // UI state utilities
  showLoading: UIStateUtils.showLoading.bind(UIStateUtils),
  showError: UIStateUtils.showError.bind(UIStateUtils),
  showSuccess: UIStateUtils.showSuccess.bind(UIStateUtils),
  clearElement: UIStateUtils.clearElement.bind(UIStateUtils),

  // Feature data utilities
  getFeatureEntityId: FeatureDataUtils.getFeatureEntityId.bind(FeatureDataUtils),
  getFeatureCoordinates: FeatureDataUtils.getFeatureCoordinates.bind(FeatureDataUtils),
  getPolygonCenter: FeatureDataUtils.getPolygonCenter.bind(FeatureDataUtils),

  // DOM utilities
  updateElement: DOMUtils.updateElement.bind(DOMUtils),
  renderView: DOMUtils.renderView.bind(DOMUtils),
  findElement: DOMUtils.findElement.bind(DOMUtils),
  findElements: DOMUtils.findElements.bind(DOMUtils),

  // Data utilities
  isEmpty: DataUtils.isEmpty.bind(DataUtils),
  getValueOrFallback: DataUtils.getValueOrFallback.bind(DataUtils),
  formatUrlForDisplay: DataUtils.formatUrlForDisplay.bind(DataUtils),
  isValidEmail: DataUtils.isValidEmail.bind(DataUtils),
  isValidPhone: DataUtils.isValidPhone.bind(DataUtils),
  truncateText: DataUtils.truncateText.bind(DataUtils),
};

// Also export individual modules for more focused imports
export { 
  ViewportUtils, 
  PerformanceUtils, 
  UIStateUtils, 
  FeatureDataUtils, 
  DOMUtils, 
  DataUtils 
};
