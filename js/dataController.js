import { AppState } from "./appState.js";
import { apiConfig } from "./config/api.js";

export const DataController = {
  async initialize() {
    console.log("[DataController] Initializing data pre-fetch.");
    await Promise.all([
      this.retrieveAndCacheAllBeachData(),
      this.retrieveAndCacheAllPOIData()
    ]);
  },

  async retrieveAndCacheAllBeachData() {
    try {
      const response = await fetch(`${apiConfig.BASE_URL}/api/beaches`);
      console.log('[DataController] Beach fetch response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const beachDataCollection = await response.json();
      console.log(`[DataController] Fetched ${beachDataCollection.length} beach items.`);

      AppState.dispatch({ type: "SET_ALL_BEACH_DATA", payload: beachDataCollection });
      console.log("[DataController] All beach data pre-fetched and cached.");
    } catch (error) {
      console.error("[DataController] Failed to pre-fetch beach data:", error);
    }
  },

  async retrieveAndCacheAllPOIData() {
    try {
      const response = await fetch(`${apiConfig.BASE_URL}/api/pois`);
      console.log('[DataController] POI fetch response status:', response.status);

      if (!response.ok) {
        console.warn(`[DataController] POI API not available (status: ${response.status}), using mock data`);
        // For now, we'll create some mock POI data if the API isn't available
        const mockPOIDataCollection = [{
          id: "huntington-city-beach-lifeguard-tower-1",
          name: "Huntington City Beach Lifeguard Tower 1",
          slug: "huntington-lifeguard-tower-1",
          longitude: -118.0052,
          latitude: 33.6553,
          categoryName: "Safety & Emergency",
          customIconName: "lifeguard-tower",
          mainImageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
          mainImageAlt: "Huntington City Beach Lifeguard Tower 1",
          richTextContent: "<p>Professional lifeguard station providing safety services and emergency response at Huntington City Beach.</p>",
          geometry: {
            type: 'Point',
            coordinates: [-118.0052, 33.6553]
          }
        }];
        AppState.dispatch({ type: "SET_ALL_POI_DATA", payload: mockPOIDataCollection });
        console.log("[DataController] Mock POI data cached.");
        return;
      }
      
      const poiDataCollection = await response.json();
      console.log(`[DataController] Fetched ${poiDataCollection.length} POI items.`);

      AppState.dispatch({ type: "SET_ALL_POI_DATA", payload: poiDataCollection });
      console.log("[DataController] All POI data pre-fetched and cached.");
    } catch (error) {
      console.error("[DataController] Failed to pre-fetch POI data:", error);
      // Fallback to mock data
      const fallbackMockPOIData = [{
        id: "huntington-city-beach-lifeguard-tower-1",
        name: "Huntington City Beach Lifeguard Tower 1",
        slug: "huntington-lifeguard-tower-1",
        longitude: -118.0052,
        latitude: 33.6553,
        categoryName: "Safety & Emergency",
        customIconName: "lifeguard-tower",
        mainImageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
        mainImageAlt: "Huntington City Beach Lifeguard Tower 1",
        richTextContent: "<p>Professional lifeguard station providing safety services and emergency response at Huntington City Beach.</p>",
        geometry: {
          type: 'Point',
          coordinates: [-118.0052, 33.6553]
        }
      }];
      AppState.dispatch({ type: "SET_ALL_POI_DATA", payload: fallbackMockPOIData });
      console.log("[DataController] Fallback to mock POI data due to error.");
    }
  },
}; 