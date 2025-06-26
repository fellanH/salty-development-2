// =============================================================================
// ACTION CONTROLLER MODULE
// =============================================================================

import { Config } from "./config.js";
import { AppState } from "./appState.js";
import { Utils } from "./utils.js";
import { EventBus } from "./eventBus.js";
import { UIController } from "./uiController.js";

export const ActionController = {
  /**
   * Executes a named action sequence from the configuration.
   * @param {string} actionName - The key from Config.EVENT_ACTIONS (e.g., 'selectBeach').
   * @param {object} context - An object containing relevant data, like the clicked 'feature'.
   */
  execute(actionName, context = {}) {
    const actionConfig = Config.EVENT_ACTIONS[actionName];
    if (!actionConfig) {
      console.warn(
        `[ActionController] No action configured for '${actionName}'.`
      );
      return;
    }

    let actions;
    // New logic to handle contextual actions
    if (actionConfig.bySource && context.source) {
      const sourceActions = actionConfig.bySource[context.source];
      if (sourceActions) {
        actions = Utils.isMobileView()
          ? sourceActions.mobile || sourceActions.default
          : sourceActions.default;
      }
    }

    // Fallback to the original structure
    if (!actions) {
      actions = actionConfig.actions;
    }

    if (!actions || actions.length === 0) {
      console.warn(
        `[ActionController] No executable actions found for '${actionName}' with context:`,
        context
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

    actions.forEach((action) => {
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
        UIController.showSidebar(action.sidebar);
        break;

      case "SHOW_POPUP":
        if (feature) {
          EventBus.publish("map:showPopup", { feature, delay: action.delay });
        }
        break;

      case "CLOSE_ALL_POPUPS":
        EventBus.publish("map:closeAllPopups");
        break;

      case "ZOOM_TO":
        EventBus.publish("map:zoomTo", {
          zoom: action.zoomLevel,
          speed: action.speed,
        });
        break;

      case "TOGGLE_FULLSCREEN":
        UIController.toggleFullscreen();
        break;

      default:
        console.warn(
          `[ActionController] Unknown action type: '${action.type}'`
        );
    }
  },

  /**
   * Handles the selection of any entity by dispatching to the ActionController.
   * @param {object} options
   * @param {string} options.entityType - 'state', 'region', 'beach'.
   * @param {object} options.feature - The GeoJSON feature object.
   * @param {string} [options.source] - The source of the selection ('map-marker', 'sidebar-list-item').
   */
  handleEntitySelection({ entityType, feature, source }) {
    if (!feature || !feature.geometry) {
      console.error("[ActionController] Invalid feature provided.", feature);
      return;
    }

    // Convert entityType to a capitalized string for the action name (e.g., 'state' -> 'selectState')
    const actionName = `select${
      entityType.charAt(0).toUpperCase() + entityType.slice(1)
    }`;

    // The context object passes all necessary data to the ActionController
    const context = { feature, entityType, source };

    this.execute(actionName, context);
  },
};
