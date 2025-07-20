// =============================================================================
// ACTION CONTROLLER - REFACTORED FOR BETTER ORGANIZATION
// =============================================================================

import { Config } from "./config.js";
import { AppState } from "./appState.js";
import { EventBus } from "./eventBus.js";
import { Utils } from "./utils.js";

// =============================================================================
// CONDITION EVALUATOR MODULE
// =============================================================================
const ConditionEvaluator = {
  /**
   * Evaluates if an action should be executed based on conditions
   * @param {object} conditions - Action conditions
   * @returns {boolean} True if conditions are met
   */
  shouldExecuteAction(conditions) {
    if (!conditions) return true;

    for (const [conditionKey, expectedValue] of Object.entries(conditions)) {
      if (!this.evaluateCondition(conditionKey, expectedValue)) {
        return false;
      }
    }

    return true;
  },

  /**
   * Evaluates a single condition
   * @param {string} conditionKey - Condition key
   * @param {*} expectedValue - Expected value
   * @returns {boolean} True if condition is met
   */
  evaluateCondition(conditionKey, expectedValue) {
    switch (conditionKey) {
      case "context":
        return this.evaluateContextCondition(expectedValue);
      case "screenWidth":
        return this.evaluateScreenWidthCondition(expectedValue);
      case "appState":
        return this.evaluateAppStateCondition(expectedValue);
      default:
        console.warn(`[ConditionEvaluator] Unknown condition key: ${conditionKey}`);
        return false;
    }
  },

  /**
   * Evaluates context-based conditions
   * @param {string} expectedValue - Expected context value
   * @returns {boolean} True if condition is met
   */
  evaluateContextCondition(expectedValue) {
    switch (expectedValue) {
      case "isMobile":
        return Utils.isMobileView();
      case "isDesktop":
        return Utils.isDesktopView();
      case "isTablet":
        const viewport = Utils.getViewportDimensions();
        return viewport.width >= 768 && viewport.width <= 1024;
      default:
        return false;
    }
  },

  /**
   * Evaluates screen width conditions
   * @param {object} condition - Screen width condition
   * @returns {boolean} True if condition is met
   */
  evaluateScreenWidthCondition(condition) {
    const width = window.innerWidth;
    if (condition.min && width < condition.min) return false;
    if (condition.max && width > condition.max) return false;
    return true;
  },

  /**
   * Evaluates app state conditions
   * @param {object} condition - App state condition
   * @returns {boolean} True if condition is met
   */
  evaluateAppStateCondition(condition) {
    const state = AppState.getState();
    
    if (condition.sidebar && state.ui.currentSidebar !== condition.sidebar) {
      return false;
    }
    
    if (condition.hasSelection !== undefined) {
      const hasSelection = state.currentSelection.id !== null;
      return hasSelection === condition.hasSelection;
    }

    return true;
  }
};

// =============================================================================
// CONTEXT ENHANCER MODULE
// =============================================================================
const ContextEnhancer = {
  /**
   * Enhances action context with additional data
   * @param {object} context - Original context
   * @returns {object} Enhanced context
   */
  enhanceContext(context) {
    const enhanced = { ...context };

    // Extract feature from target if not provided
    if (!enhanced.feature && enhanced.target) {
      enhanced.feature = this.extractFeatureFromTarget(enhanced.target);
    }

    // Extract entity ID
    if (enhanced.feature && !enhanced.entityId) {
      enhanced.entityId = this.extractEntityId(enhanced.feature);
    }

    // Get cached details if available
    if (enhanced.entityId && enhanced.entityType && !enhanced.details) {
      enhanced.details = this.getCachedDetails(enhanced.entityId, enhanced.entityType);
    }

    return enhanced;
  },

  /**
   * Extracts feature from DOM target
   * @param {HTMLElement} target - Target element
   * @returns {object|null} Feature object
   */
  extractFeatureFromTarget(target) {
    const { entityType, featureId } = target.dataset;
    if (entityType && featureId) {
      return AppState.getState().cache.visibleFeatures.get(featureId);
    }
    return null;
  },

  /**
   * Extracts entity ID from feature
   * @param {object} feature - Feature object
   * @returns {string|null} Entity ID
   */
  extractEntityId(feature) {
    return Utils.getFeatureEntityId(feature);
  },

  /**
   * Gets cached details for an entity
   * @param {string} entityId - Entity ID
   * @param {string} entityType - Entity type
   * @returns {object|null} Cached details
   */
  getCachedDetails(entityId, entityType) {
    switch (entityType) {
      case "poi":
        return AppState.getPOIById(entityId);
      case "beach":
        return AppState.getBeachById(entityId);
      default:
        return null;
    }
  }
};

// =============================================================================
// MAP ACTION HANDLERS MODULE
// =============================================================================
const MapActionHandlers = {
  /**
   * Handles FLY_TO action
   * @param {object} action - Action configuration
   * @param {object} context - Action context
   */
  handleFlyTo(action, context) {
    const { feature } = context;
    
    if (!feature?.geometry?.coordinates) {
      console.warn("[MapActionHandlers] Cannot fly to feature without coordinates");
      return;
    }

    EventBus.publish("map:flyTo", {
      coordinates: feature.geometry.coordinates,
      zoom: action.zoomLevel || Config.MAP.DETAIL_ZOOM,
      speed: action.speed || Config.UI.MAP_FLY_SPEED,
    });
  },

  /**
   * Handles FLY_TO_DEFAULT_POSITION action
   * @param {object} action - Action configuration
   * @param {object} context - Action context
   */
  handleFlyToDefault(action, context) {
    const position = Utils.isMobileView()
      ? Config.MAP.MOBILE_START_POSITION
      : Config.MAP.DESKTOP_START_POSITION;
    
    const zoom = action.zoomLevel || Config.MAP.DEFAULT_ZOOM;
    
    EventBus.publish("map:flyTo", { 
      coordinates: position, 
      zoom: zoom,
      speed: action.speed || Config.UI.MAP_FLY_SPEED
    });
  },

  /**
   * Handles ZOOM_TO action
   * @param {object} action - Action configuration
   * @param {object} context - Action context
   */
  handleZoomTo(action, context) {
    EventBus.publish("map:zoomTo", {
      zoom: action.zoomLevel || Config.MAP.DEFAULT_ZOOM,
      speed: action.speed || 1.2,
    });
  },

  /**
   * Handles SHOW_POPUP action
   * @param {object} action - Action configuration
   * @param {object} context - Action context
   */
  handleShowPopup(action, context) {
    const { feature, details } = context;
    
    if (!feature) {
      console.warn("[MapActionHandlers] Cannot show popup without feature");
      return;
    }

    EventBus.publish("map:showPopup", { 
      feature, 
      details, 
      delay: action.delay || 0 
    });
  },

  /**
   * Handles CLOSE_ALL_POPUPS action
   * @param {object} action - Action configuration
   * @param {object} context - Action context
   */
  handleCloseAllPopups(action, context) {
    EventBus.publish("map:closeAllPopups");
  }
};

// =============================================================================
// UI ACTION HANDLERS MODULE
// =============================================================================
const UIActionHandlers = {
  /**
   * Handles SHOW_SIDEBAR action
   * @param {object} action - Action configuration
   * @param {object} context - Action context
   */
  handleShowSidebar(action, context) {
    if (!action.sidebar) {
      console.warn("[UIActionHandlers] SHOW_SIDEBAR action requires sidebar parameter");
      return;
    }

    EventBus.publish("ui:sidebarRequested", { 
      sidebar: action.sidebar,
      context: context
    });
  },

  /**
   * Handles TOGGLE_FULLSCREEN action
   * @param {object} action - Action configuration
   * @param {object} context - Action context
   */
  handleToggleFullscreen(action, context) {
    EventBus.publish("ui:fullscreenToggled", { context });
  },

  /**
   * Handles UPDATE_LOADING_STATE action
   * @param {object} action - Action configuration
   * @param {object} context - Action context
   */
  handleUpdateLoadingState(action, context) {
    AppState.dispatch({
      type: "SET_UI_STATE",
      payload: { isLoading: action.isLoading || false }
    });
  },

  /**
   * Handles SHOW_NOTIFICATION action
   * @param {object} action - Action configuration
   * @param {object} context - Action context
   */
  handleShowNotification(action, context) {
    EventBus.publish("ui:notificationRequested", {
      message: action.message || "Notification",
      type: action.notificationType || "info",
      duration: action.duration || 3000
    });
  }
};

// =============================================================================
// STATE ACTION HANDLERS MODULE
// =============================================================================
const StateActionHandlers = {
  /**
   * Handles UPDATE_APP_STATE action
   * @param {object} action - Action configuration
   * @param {object} context - Action context
   */
  handleUpdateAppState(action, context) {
    const { feature, entityType, entityId } = context;
    
    if (!feature || !entityType || !entityId) {
      console.warn("[StateActionHandlers] UPDATE_APP_STATE requires feature, entityType, and entityId");
      return;
    }

    AppState.dispatch({
      type: "SET_SELECTION",
      payload: { 
        type: entityType, 
        id: entityId, 
        feature 
      },
    });
  },

  /**
   * Handles CLEAR_SELECTION action
   * @param {object} action - Action configuration
   * @param {object} context - Action context
   */
  handleClearSelection(action, context) {
    AppState.dispatch({
      type: "SET_SELECTION",
      payload: { 
        type: null, 
        id: null, 
        feature: null 
      },
    });
  },

  /**
   * Handles UPDATE_CACHE action
   * @param {object} action - Action configuration
   * @param {object} context - Action context
   */
  handleUpdateCache(action, context) {
    if (action.cacheType && action.data) {
      AppState.dispatch({
        type: `SET_${action.cacheType.toUpperCase()}_DATA`,
        payload: action.data
      });
    }
  }
};

// =============================================================================
// ACTION HANDLER REGISTRY
// =============================================================================
const ActionHandlerRegistry = {
  // Map actions
  FLY_TO: MapActionHandlers.handleFlyTo,
  FLY_TO_DEFAULT_POSITION: MapActionHandlers.handleFlyToDefault,
  ZOOM_TO: MapActionHandlers.handleZoomTo,
  SHOW_POPUP: MapActionHandlers.handleShowPopup,
  CLOSE_ALL_POPUPS: MapActionHandlers.handleCloseAllPopups,

  // UI actions
  SHOW_SIDEBAR: UIActionHandlers.handleShowSidebar,
  TOGGLE_FULLSCREEN: UIActionHandlers.handleToggleFullscreen,
  UPDATE_LOADING_STATE: UIActionHandlers.handleUpdateLoadingState,
  SHOW_NOTIFICATION: UIActionHandlers.handleShowNotification,

  // State actions
  UPDATE_APP_STATE: StateActionHandlers.handleUpdateAppState,
  CLEAR_SELECTION: StateActionHandlers.handleClearSelection,
  UPDATE_CACHE: StateActionHandlers.handleUpdateCache,

  /**
   * Registers a new action handler
   * @param {string} actionType - Action type
   * @param {Function} handler - Handler function
   */
  register(actionType, handler) {
    this[actionType] = handler;
  },

  /**
   * Gets handler for action type
   * @param {string} actionType - Action type
   * @returns {Function|null} Handler function
   */
  getHandler(actionType) {
    return this[actionType] || null;
  }
};

// =============================================================================
// ACTION EXECUTION ENGINE MODULE
// =============================================================================
const ActionExecutionEngine = {
  /**
   * Executes a single action
   * @param {object} action - Action configuration
   * @param {object} context - Enhanced context
   * @returns {boolean} True if action was executed
   */
  executeAction(action, context) {
    // Check conditions
    if (!ConditionEvaluator.shouldExecuteAction(action.when)) {
      console.log(`[ActionExecutionEngine] Skipping action ${action.type} due to unmet conditions`);
      return false;
    }

    // Get handler
    const handler = ActionHandlerRegistry.getHandler(action.type);
    if (!handler) {
      console.warn(`[ActionExecutionEngine] No handler found for action type: ${action.type}`);
      return false;
    }

    try {
      // Execute action
      handler(action, context);
      console.log(`[ActionExecutionEngine] Successfully executed action: ${action.type}`);
      return true;
    } catch (error) {
      console.error(`[ActionExecutionEngine] Error executing action ${action.type}:`, error);
      return false;
    }
  },

  /**
   * Executes a sequence of actions
   * @param {Array} actions - Array of action configurations
   * @param {object} context - Enhanced context
   * @returns {object} Execution results
   */
  executeActionSequence(actions, context) {
    const results = {
      executed: 0,
      skipped: 0,
      failed: 0,
      total: actions.length
    };

    actions.forEach((action) => {
      const executed = this.executeAction(action, context);
      if (executed) {
        results.executed++;
      } else {
        // Could be skipped due to conditions or failed
        results.skipped++;
      }
    });

    return results;
  }
};

// =============================================================================
// MAIN ACTION CONTROLLER
// =============================================================================
const ActionController = {
  /**
   * Executes a named action sequence
   * @param {string} actionName - The key from Config.EVENT_ACTIONS
   * @param {object} context - Contextual data (e.g., feature, target)
   * @returns {object} Execution results
   */
  execute(actionName, context = {}) {
    // Get action configuration
    const actionConfig = Config.EVENT_ACTIONS[actionName];
    if (!actionConfig) {
      console.warn(`[ActionController] No action configured for '${actionName}'.`);
      return { success: false, error: 'Action not found' };
    }

    // Enhance context with additional data
    const enhancedContext = ContextEnhancer.enhanceContext(context);
    
    console.log(`[ActionController] Executing action sequence: '${actionName}'`, enhancedContext);

    // Execute action sequence
    const results = ActionExecutionEngine.executeActionSequence(
      actionConfig.actions, 
      enhancedContext
    );

    console.log(`[ActionController] Action sequence '${actionName}' completed:`, results);
    
    return { 
      success: results.failed === 0, 
      results 
    };
  },

  /**
   * Executes a single action directly (for testing or dynamic actions)
   * @param {object} action - Action configuration
   * @param {object} context - Context
   * @returns {boolean} Success status
   */
  executeSingle(action, context = {}) {
    const enhancedContext = ContextEnhancer.enhanceContext(context);
    return ActionExecutionEngine.executeAction(action, enhancedContext);
  },

  /**
   * Registers a custom action handler
   * @param {string} actionType - Action type
   * @param {Function} handler - Handler function
   */
  registerHandler(actionType, handler) {
    ActionHandlerRegistry.register(actionType, handler);
  },

  /**
   * Gets available action types
   * @returns {Array} Array of action types
   */
  getAvailableActionTypes() {
    return Object.keys(ActionHandlerRegistry).filter(key => typeof ActionHandlerRegistry[key] === 'function');
  }
};

// Export main controller and modules for testing
export { 
  ActionController,
  ConditionEvaluator,
  ContextEnhancer,
  MapActionHandlers,
  UIActionHandlers,
  StateActionHandlers,
  ActionHandlerRegistry,
  ActionExecutionEngine
}; 