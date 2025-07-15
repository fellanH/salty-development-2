// =============================================================================
// UTILITY FUNCTIONS  
// =============================================================================

import { Config } from "@/config";
import { Feature } from "@/types";

export const Utils = {
  /**
   * Check if current view is mobile
   * @returns {boolean} True if mobile view
   */
  isMobileView(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= Config.MAP.MOBILE_BREAKPOINT;
  },

  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Gets a unique and consistent ID from a feature's properties.
   * @param {object} feature - The GeoJSON feature.
   * @returns {string|number|null} The unique ID of the feature.
   */
  getFeatureEntityId(feature: Feature | null): string | number | null {
    if (!feature) return null;
    const p = feature.properties || {};
    // Order is important. Check properties first, then the top-level feature ID as a fallback.
    return (
      p["Item ID"] || p["Location Cluster"] || p.NAME || p.Name || feature.id || null
    );
  },

  /**
   * Format coordinate to display string
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {string} Formatted coordinate string
   */
  formatCoordinate(lat: number, lng: number): string {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  },

  /**
   * Get distance between two coordinates
   * @param {number} lat1 - First latitude
   * @param {number} lng1 - First longitude
   * @param {number} lat2 - Second latitude
   * @param {number} lng2 - Second longitude
   * @returns {number} Distance in kilometers
   */
  getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  },

  /**
   * Convert degrees to radians
   * @param {number} deg - Degrees
   * @returns {number} Radians
   */
  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  },

  /**
   * Check if a URL is valid
   * @param {string} url - URL to check
   * @returns {boolean} True if valid URL
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Truncate text to specified length
   * @param {string} text - Text to truncate
   * @param {number} length - Maximum length
   * @returns {string} Truncated text
   */
  truncateText(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  },
};