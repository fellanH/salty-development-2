import { AppState } from "./appState.js";
import { apiConfig } from "./config/api.js";

export const DataController = {
  async init() {
    console.log("[DataController] Initializing data pre-fetch.");
    await Promise.all([
      this.prefetchAllBeachData(),
      this.prefetchAllPOIData()
    ]);
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

  async prefetchAllPOIData() {
    try {
      const response = await fetch(`${apiConfig.BASE_URL}/api/pois`);
      console.log('[DataController] POI fetch response status:', response.status);

      if (!response.ok) {
        console.warn(`[DataController] POI API not available (status: ${response.status}), using mock data`);
        // For now, we'll create some mock POI data if the API isn't available
        const mockPOIData = [{
          id: "huntington-city-beach-lifeguard-tower-1",
          name: "Huntington City Beach Lifeguard Tower 1",
          type: "Lifeguard Tower",
          description: "Lifeguard station providing safety services at Huntington City Beach",
          imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"
        }];
        AppState.dispatch({ type: "SET_ALL_POI_DATA", payload: mockPOIData });
        console.log("[DataController] Mock POI data cached.");
        return;
      }
      
      const poiData = await response.json();
      console.log(`[DataController] Fetched ${poiData.length} POI items.`);

      AppState.dispatch({ type: "SET_ALL_POI_DATA", payload: poiData });
      console.log("[DataController] All POI data pre-fetched and cached.");
    } catch (error) {
      console.error("[DataController] Failed to pre-fetch POI data:", error);
      // Fallback to mock data
      const mockPOIData = [{
        id: "huntington-city-beach-lifeguard-tower-1",
        name: "Huntington City Beach Lifeguard Tower 1",
        type: "Lifeguard Tower",
        description: "Lifeguard station providing safety services at Huntington City Beach",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"
      }];
      AppState.dispatch({ type: "SET_ALL_POI_DATA", payload: mockPOIData });
      console.log("[DataController] Fallback to mock POI data due to error.");
    }
  },
}; 