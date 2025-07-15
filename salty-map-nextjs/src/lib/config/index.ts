import { mapConfig } from "./map";
import { apiConfig, webflowConfig } from "./api";
import { selectorsConfig, uiConfig, featureConfig } from "./ui";

export const Config = {
  MAP: mapConfig,
  API: apiConfig,
  WEBFLOW: webflowConfig,
  SELECTORS: selectorsConfig,
  UI: uiConfig,
  FEATURE_CONFIG: featureConfig,
} as const;

export { mapConfig, apiConfig, webflowConfig, selectorsConfig, uiConfig, featureConfig };