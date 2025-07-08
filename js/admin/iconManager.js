// =============================================================================
// ICON MANAGEMENT ADMIN INTERFACE
// Administrative Tools for Category-Icon Mapping Management
// =============================================================================

import { Config } from "../config.js";
import { AppState } from "../appState.js";
import { MarkerManager } from "../markerManager.js";

export const IconManagerAdmin = {
  
  /**
   * Initialize the admin interface (can be called from browser console)
   */
  init() {
    console.log("[IconManagerAdmin] Administrative icon management interface initialized");
    console.log("Available commands:");
    console.log("- IconManagerAdmin.listCategoryMappings()");
    console.log("- IconManagerAdmin.setCategoryIcon('category', 'iconName')");
    console.log("- IconManagerAdmin.removeCategoryIcon('category')");
    console.log("- IconManagerAdmin.getAvailableIcons()");
    console.log("- IconManagerAdmin.getCategoriesInUse()");
    console.log("- IconManagerAdmin.validateAllMappings()");
    console.log("- IconManagerAdmin.exportMappings()");
    console.log("- IconManagerAdmin.importMappings(mappingsObject)");
    console.log("- IconManagerAdmin.refreshMarkers()");
    
    // Expose to window for easy console access
    if (typeof window !== 'undefined') {
      window.IconManagerAdmin = this;
    }
  },

  /**
   * List all current category-icon mappings
   * @returns {Object} Current mappings
   */
  listCategoryMappings() {
    const mappings = Config.ICONS.categoryMapping;
    console.table(mappings);
    return mappings;
  },

  /**
   * Set or update a category-icon mapping
   * @param {string} category - Category name
   * @param {string} iconName - Icon identifier
   * @returns {boolean} Success status
   */
  setCategoryIcon(category, iconName) {
    if (!category || !iconName) {
      console.error("Both category and iconName are required");
      return false;
    }

    const previousIcon = Config.ICONS.categoryMapping[category];
    Config.ICONS.setCategoryIcon(category, iconName);
    
    console.log(`✅ Category "${category}" mapped to icon "${iconName}"`);
    if (previousIcon) {
      console.log(`   Previous icon: "${previousIcon}"`);
    }
    
    // Refresh markers to show changes
    this.refreshMarkers();
    return true;
  },

  /**
   * Remove a category-icon mapping
   * @param {string} category - Category to remove
   * @returns {boolean} Success status
   */
  removeCategoryIcon(category) {
    if (!category) {
      console.error("Category name is required");
      return false;
    }

    if (Config.ICONS.categoryMapping[category]) {
      const removedIcon = Config.ICONS.categoryMapping[category];
      delete Config.ICONS.categoryMapping[category];
      console.log(`✅ Removed category "${category}" (was mapped to "${removedIcon}")`);
      this.refreshMarkers();
      return true;
    } else {
      console.warn(`Category "${category}" not found in mappings`);
      return false;
    }
  },

  /**
   * Get all available icon names
   * @returns {Array} Array of icon names
   */
  getAvailableIcons() {
    const icons = Config.ICONS.getAvailableIcons();
    console.log("Available icons:", icons);
    return icons;
  },

  /**
   * Get categories currently in use by beaches and POIs
   * @returns {Object} Categories in use with counts
   */
  getCategoriesInUse() {
    const categoriesInUse = {};
    
    // Check beach categories
    const beaches = AppState.getState().cache.beachData;
    beaches.forEach(beach => {
      const category = beach.categoryName || beach.category || 'Uncategorized';
      categoriesInUse[category] = (categoriesInUse[category] || 0) + 1;
    });
    
    // Check POI categories
    const pois = AppState.getState().cache.poiData;
    pois.forEach(poi => {
      const category = poi.categoryName || poi.category || 'Uncategorized';
      categoriesInUse[category] = (categoriesInUse[category] || 0) + 1;
    });
    
    console.log("Categories in use:");
    console.table(categoriesInUse);
    return categoriesInUse;
  },

  /**
   * Validate all current mappings and report issues
   * @returns {Object} Validation report
   */
  validateAllMappings() {
    const report = {
      valid: [],
      unmappedCategories: [],
      unusedMappings: [],
      duplicateIcons: {}
    };

    const categoriesInUse = this.getCategoriesInUse();
    const mappings = Config.ICONS.categoryMapping;
    const availableIcons = Config.ICONS.getAvailableIcons();

    // Check for unmapped categories
    Object.keys(categoriesInUse).forEach(category => {
      if (mappings[category]) {
        report.valid.push({ category, icon: mappings[category], count: categoriesInUse[category] });
      } else {
        report.unmappedCategories.push({ category, count: categoriesInUse[category] });
      }
    });

    // Check for unused mappings
    Object.keys(mappings).forEach(category => {
      if (!categoriesInUse[category]) {
        report.unusedMappings.push({ category, icon: mappings[category] });
      }
    });

    // Check for duplicate icon assignments
    const iconUsage = {};
    Object.entries(mappings).forEach(([category, icon]) => {
      if (!iconUsage[icon]) iconUsage[icon] = [];
      iconUsage[icon].push(category);
    });

    Object.entries(iconUsage).forEach(([icon, categories]) => {
      if (categories.length > 1) {
        report.duplicateIcons[icon] = categories;
      }
    });

    console.log("📊 Validation Report:");
    console.log(`✅ Valid mappings: ${report.valid.length}`);
    console.log(`⚠️  Unmapped categories: ${report.unmappedCategories.length}`);
    console.log(`🔶 Unused mappings: ${report.unusedMappings.length}`);
    console.log(`🔄 Duplicate icon assignments: ${Object.keys(report.duplicateIcons).length}`);

    if (report.unmappedCategories.length > 0) {
      console.log("\nUnmapped categories (will use default icons):");
      console.table(report.unmappedCategories);
    }

    if (report.unusedMappings.length > 0) {
      console.log("\nUnused mappings (consider removing):");
      console.table(report.unusedMappings);
    }

    if (Object.keys(report.duplicateIcons).length > 0) {
      console.log("\nDuplicate icon assignments:");
      console.table(report.duplicateIcons);
    }

    return report;
  },

  /**
   * Export current mappings to JSON
   * @returns {string} JSON string of mappings
   */
  exportMappings() {
    const mappings = Config.ICONS.categoryMapping;
    const json = JSON.stringify(mappings, null, 2);
    console.log("📤 Current mappings (copy this to save):");
    console.log(json);
    
    // Try to save to clipboard if available
    if (navigator.clipboard) {
      navigator.clipboard.writeText(json).then(() => {
        console.log("✅ Mappings copied to clipboard!");
      }).catch(() => {
        console.log("ℹ️  Could not copy to clipboard, please copy manually from above");
      });
    }
    
    return json;
  },

  /**
   * Import mappings from JSON object
   * @param {Object} mappings - Mappings object to import
   * @returns {boolean} Success status
   */
  importMappings(mappings) {
    if (!mappings || typeof mappings !== 'object') {
      console.error("Invalid mappings object provided");
      return false;
    }

    try {
      Object.entries(mappings).forEach(([category, icon]) => {
        Config.ICONS.setCategoryIcon(category, icon);
      });
      
      console.log(`✅ Successfully imported ${Object.keys(mappings).length} category mappings`);
      this.refreshMarkers();
      return true;
    } catch (error) {
      console.error("Error importing mappings:", error);
      return false;
    }
  },

  /**
   * Refresh all markers to apply icon changes
   */
  refreshMarkers() {
    console.log("🔄 Refreshing markers to apply icon changes...");
    
    // Re-initialize markers with new icons
    import('../mapController.js').then(({ MapController }) => {
      MapController.updateDynamicMarkers();
      console.log("✅ Markers refreshed with updated icons");
    });
  },

  /**
   * Auto-assign icons to unmapped categories using intelligent matching
   * @returns {Object} Assignment results
   */
  autoAssignIcons() {
    const categoriesInUse = this.getCategoriesInUse();
    const mappings = Config.ICONS.categoryMapping;
    const results = { assigned: [], skipped: [] };

    Object.keys(categoriesInUse).forEach(category => {
      if (!mappings[category]) {
        // Try to find a suitable icon based on category name
        const icon = this.suggestIconForCategory(category);
        if (icon) {
          this.setCategoryIcon(category, icon);
          results.assigned.push({ category, icon });
        } else {
          results.skipped.push(category);
        }
      }
    });

    console.log(`🤖 Auto-assignment complete:`);
    console.log(`✅ Assigned: ${results.assigned.length}`);
    console.log(`⏭️  Skipped: ${results.skipped.length}`);

    if (results.assigned.length > 0) {
      console.table(results.assigned);
    }

    return results;
  },

  /**
   * Suggest an icon for a category based on intelligent matching
   * @param {string} category - Category name
   * @returns {string|null} Suggested icon name
   */
  suggestIconForCategory(category) {
    const categoryLower = category.toLowerCase();
    
    // Define keyword-to-icon mapping for intelligent suggestions
    const keywordMapping = {
      'restaurant': 'utensils',
      'food': 'utensils',
      'dining': 'utensils',
      'cafe': 'coffee',
      'coffee': 'coffee',
      'bar': 'glass-martini',
      'safety': 'lifeguard-tower',
      'emergency': 'lifeguard-tower',
      'lifeguard': 'lifeguard-tower',
      'info': 'info-circle',
      'information': 'info-circle',
      'visitor': 'info-circle',
      'sport': 'basketball-ball',
      'recreation': 'basketball-ball',
      'beach': 'beach-umbrella',
      'city': 'beach-umbrella',
      'state': 'shield-check',
      'parking': 'parking',
      'restroom': 'restroom',
      'shower': 'shower',
      'shopping': 'shopping-bag',
      'gift': 'shopping-bag',
      'medical': 'hospital',
      'first aid': 'first-aid',
      'entertainment': 'music',
      'nature': 'leaf',
      'wildlife': 'leaf',
      'historical': 'landmark',
      'photography': 'camera',
      'transport': 'car',
    };

    // Find matching keywords
    for (const [keyword, icon] of Object.entries(keywordMapping)) {
      if (categoryLower.includes(keyword)) {
        return icon;
      }
    }

    return null; // No suitable match found
  },

  /**
   * Generate a report of icon usage statistics
   * @returns {Object} Usage statistics
   */
  getIconUsageStats() {
    const stats = {
      totalCategories: Object.keys(Config.ICONS.categoryMapping).length,
      totalIcons: Config.ICONS.getAvailableIcons().length,
      iconUsage: {},
      mostUsedIcons: [],
      unusedIcons: []
    };

    // Count icon usage
    Object.values(Config.ICONS.categoryMapping).forEach(icon => {
      stats.iconUsage[icon] = (stats.iconUsage[icon] || 0) + 1;
    });

    // Sort by usage
    stats.mostUsedIcons = Object.entries(stats.iconUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    // Find unused icons
    const usedIcons = new Set(Object.values(Config.ICONS.categoryMapping));
    stats.unusedIcons = Config.ICONS.getAvailableIcons()
      .filter(icon => !usedIcons.has(icon));

    console.log("📈 Icon Usage Statistics:");
    console.table(stats.iconUsage);
    
    return stats;
  }
}; 