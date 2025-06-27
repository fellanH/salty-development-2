import { AppState } from "./appState.js";
import { apiConfig } from "./config/api.js";

export const DataController = {
  async init() {
    console.log("[DataController] Initializing data pre-fetch.");
    await this.prefetchAllBeachData();
  },

  async prefetchAllBeachData() {
    try {
      const response = await fetch(`${apiConfig.BASE_URL}/api/beaches`);
      console.log('[DataController] Fetch response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const beachData = await response.json();
      console.log(`[DataController] Fetched ${beachData.length} beach items.`);

      AppState.dispatch({ type: "SET_ALL_BEACH_DATA", payload: beachData });
      console.log("[DataController] All beach data pre-fetched and cached.");
    } catch (error) {
      console.error("[DataController] Failed to pre-fetch beach data:", error);
    }
  },
}; 