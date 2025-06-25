// =============================================================================
// ACTION CONTROLLER MODULE
// =============================================================================

import { Config } from "./config.js";
import { AppState } from "./appState.js";
import { Utils } from "./utils.js";
import { EventBus } from "./eventBus.js";

export const ActionController = {
  /**
   * Executes a named action sequence from the configuration.
   * @param {string} actionName - The key from Config.EVENT_ACTIONS (e.g., 'selectBeach').
   * @param {object} context - An object containing relevant data, like the clicked 'feature'.
   */
  execute(actionName, context = {}) {
    const actionConfig = Config.EVENT_ACTIONS[actionName];

    if (!actionConfig || !actionConfig.actions) {
      console.warn(
        `[ActionController] No action configured for '${actionName}'.`
      );
      return;
    }

    console.log(
      `[ActionController] Executing action: '${actionName}'`,
      context
    );

    // If context doesn't have feature, get it from the dataset.
    // This is the single point where we resolve the clicked item to its data.
    if (!context.feature && context.target) {
      const { entityType, featureId } = context.target.dataset;
      if (entityType && featureId) {
        context.feature = AppState.cache.visibleFeatures.get(featureId);
        context.entityType = entityType;
      }
    }

    actionConfig.actions.forEach((action) => {
      this.runAction(action, context);
    });
  },

  /**
   * Runs a single action from a sequence.
   * @param {object} action - The action object from the config.
   * @param {object} context - The context for this execution.
   */
  runAction(action, context) {
    const { feature, entityType } = context;

    switch (action.type) {
      case "FLY_TO":
        if (feature && feature.geometry) {
          EventBus.publish("map:flyTo", {
            coordinates: feature.geometry.coordinates,
            zoom: action.zoomLevel,
            speed: action.speed,
          });
        }
        break;

      case "FLY_TO_DEFAULT_POSITION":
        const position = Utils.isMobileView()
          ? Config.MAP.MOBILE_START_POSITION
          : Config.MAP.DESKTOP_START_POSITION;
        const zoom = Config.MAP.DEFAULT_ZOOM;
        EventBus.publish("map:flyTo", { coordinates: position, zoom: zoom });
        break;

      case "UPDATE_APP_STATE":
        if (feature && entityType) {
          const entityId = Utils.getFeatureEntityId(feature);
          AppState.setSelection(entityType, entityId, feature);
        }
        break;

      case "SHOW_SIDEBAR":
        EventBus.publish("ui:showSidebar", { sidebar: action.sidebar });
        break;

      case "SHOW_POPUP":
        if (feature) {
          EventBus.publish("map:showPopup", { feature, delay: action.delay });
        }
        break;

      case "TOGGLE_FULLSCREEN":
        EventBus.publish("ui:toggleFullscreen");
        break;

      default:
        console.warn(
          `[ActionController] Unknown action type: '${action.type}'`
        );
    }
  },
};
