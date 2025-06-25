console.log("🗺️ Salty Map Application Loading...");

// =============================================================================
// MODULAR SALTY MAP APPLICATION
// =============================================================================

import { Config } from "./js/config.js";
import { Utils } from "./js/utils.js";
import { MockAPI } from "./js/mockAPI.js";
import { AppState } from "./js/appState.js";
import { MapController } from "./js/mapController.js";
import { UIController } from "./js/uiController.js";
import { NavigationController } from "./js/navigationController.js";
import { ActionController } from "./js/actionController.js";

// =============================================================================
// APPLICATION INITIALIZATION
// =============================================================================

document.addEventListener("DOMContentLoaded", async function () {
  console.log("🚀 Salty Map Application Starting...");

  try {
    // Initialize modules in sequence
    console.log("📱 Initializing UI Controller...");
    UIController.init();

    console.log("🗺️ Initializing Map Controller...");
    await MapController.init();

    console.log("✅ Application initialized successfully!");
    console.log("📊 Application modules loaded:", {
      Config: !!Config,
      Utils: !!Utils,
      MockAPI: !!MockAPI,
      AppState: !!AppState,
      MapController: !!MapController,
      UIController: !!UIController,
      NavigationController: !!NavigationController,
      ActionController: !!ActionController,
    });
  } catch (error) {
    console.error("❌ Failed to initialize application:", error);

    // Show user-friendly error message
    const mapContainer = document.querySelector(Config.SELECTORS.MAP_CONTAINER);
    if (mapContainer) {
      Utils.showError(
        mapContainer,
        "Sorry, we couldn't load the map. Please refresh the page to try again."
      );
    }
  }
});

// =============================================================================
// GLOBAL ERROR HANDLING
// =============================================================================

window.addEventListener("error", function (e) {
  console.error("Global error:", e.error);
  // You could send this to an error reporting service here
});

window.addEventListener("unhandledrejection", function (e) {
  console.error("Unhandled promise rejection:", e.reason);
  // You could send this to an error reporting service here
});

// =============================================================================
// EXPORT FOR TESTING (OPTIONAL)
// =============================================================================

// Export modules for potential testing or external access
export {
  Config,
  Utils,
  MockAPI,
  AppState,
  MapController,
  UIController,
  NavigationController,
  ActionController,
};

console.log("📋 Salty Map Application Loaded");
