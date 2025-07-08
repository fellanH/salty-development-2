// =============================================================================
// ICON CONFIGURATION MODULE
// Category-Based Icon System for Beach and POI Markers
// =============================================================================

/**
 * Universal Category-Icon Mapping System
 * Maps category names to their corresponding icon identifiers
 */
export const categoryIconMapping = {
  // Beach Categories
  "City Beach": "beach-umbrella",
  "State Beach": "shield-check",
  "County Beach": "building-government",
  "Private Beach": "lock",
  "Recreational Beach": "volleyball",
  "Surfing Beach": "waves",
  "Family Beach": "users",
  "Pet-Friendly Beach": "dog",
  "Fishing Beach": "fish",
  "Camping Beach": "tent",

  // POI Categories
  "Safety & Emergency": "lifeguard-tower",
  "Information & Services": "info-circle",
  "Recreation & Sports": "basketball-ball",
  "Food & Dining": "utensils",
  "Shopping & Retail": "shopping-bag",
  "Accommodation": "bed",
  "Transportation": "car",
  "Restrooms & Facilities": "restroom",
  "Parking": "parking",
  "Medical Services": "hospital",
  "Entertainment": "music",
  "Nature & Wildlife": "leaf",
  "Historical Sites": "landmark",
  "Photography Spots": "camera",
  "Lifeguard Tower": "lifeguard-tower",
  "Restaurant": "utensils",
  "Cafe": "coffee",
  "Bar": "glass-martini",
  "Restroom": "restroom",
  "Parking Lot": "parking",
  "Visitor Center": "info-circle",
  "Gift Shop": "shopping-bag",
  "Beach Rental": "umbrella-beach",
  "Surf Shop": "waves",
  "Pier": "anchor",
  "Boardwalk": "walking",
  "Playground": "child",
  "Picnic Area": "picnic-table",
  "Shower": "shower",
  "Changing Room": "door-open",
  "First Aid": "first-aid",
  "Concession Stand": "hotdog",
};

/**
 * Default fallback icons for when category mapping is not found
 */
export const defaultIcons = {
  beach: "map-marker",
  poi: "map-pin",
  cluster: "layer-group",
};

/**
 * Icon style configuration for different marker states
 */
export const iconStyles = {
  default: {
    size: 1.0,
    color: "#2563eb", // Blue
    haloColor: "#ffffff",
    haloWidth: 2,
  },
  hover: {
    size: 1.2,
    color: "#1d4ed8", // Darker blue
    haloColor: "#ffffff",
    haloWidth: 3,
  },
  selected: {
    size: 1.3,
    color: "#dc2626", // Red
    haloColor: "#ffffff",
    haloWidth: 3,
  },
  cluster: {
    size: 1.1,
    color: "#059669", // Green
    haloColor: "#ffffff",
    haloWidth: 2,
  },
};

/**
 * Get icon name for a given category
 * @param {string} category - The category name
 * @param {string} type - The entity type ('beach' or 'poi')
 * @returns {string} Icon name/identifier
 */
export function getIconForCategory(category, type = 'poi') {
  if (!category) {
    return defaultIcons[type] || defaultIcons.poi;
  }

  // Try exact match first
  if (categoryIconMapping[category]) {
    return categoryIconMapping[category];
  }

  // Try case-insensitive match
  const lowerCategory = category.toLowerCase();
  const matchingKey = Object.keys(categoryIconMapping).find(
    key => key.toLowerCase() === lowerCategory
  );

  if (matchingKey) {
    return categoryIconMapping[matchingKey];
  }

  // Try partial match for flexibility
  const partialMatch = Object.keys(categoryIconMapping).find(
    key => key.toLowerCase().includes(lowerCategory) || 
           lowerCategory.includes(key.toLowerCase())
  );

  if (partialMatch) {
    return categoryIconMapping[partialMatch];
  }

  // Return default for type
  return defaultIcons[type] || defaultIcons.poi;
}

/**
 * Add or update a category-icon mapping
 * @param {string} category - Category name
 * @param {string} iconName - Icon identifier
 */
export function setCategoryIcon(category, iconName) {
  categoryIconMapping[category] = iconName;
}

/**
 * Get all available icons
 * @returns {Array} Array of unique icon names
 */
export function getAvailableIcons() {
  const allIcons = new Set([
    ...Object.values(categoryIconMapping),
    ...Object.values(defaultIcons)
  ]);
  return Array.from(allIcons).sort();
}

/**
 * Get icon style for a given state
 * @param {string} state - The marker state ('default', 'hover', 'selected', 'cluster')
 * @returns {object} Style configuration
 */
export function getIconStyle(state = 'default') {
  return iconStyles[state] || iconStyles.default;
} 