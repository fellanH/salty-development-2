// =============================================================================
// CONFIGURATION MODULE
// =============================================================================

import { mapConfig } from "./config/map.js";
import { eventActionsConfig } from "./config/actions.js";
import { apiConfig, webflowConfig } from "./config/api.js";
import { selectorsConfig, uiConfig, featureConfig } from "./config/ui.js";
import { categoryIconMapping, defaultIcons, iconStyles, getIconForCategory, setCategoryIcon, getAvailableIcons, getIconStyle } from "./config/icons.js";

export const Config = {
  MAP: mapConfig,
  EVENT_ACTIONS: eventActionsConfig,
  API: apiConfig,
  WEBFLOW: webflowConfig,
  SELECTORS: selectorsConfig,
  UI: uiConfig,
  FEATURE_CONFIG: featureConfig,
  ICONS: {
    categoryMapping: categoryIconMapping,
    defaults: defaultIcons,
    styles: iconStyles,
    getIconForCategory,
    setCategoryIcon,
    getAvailableIcons,
    getIconStyle,
  },
};
