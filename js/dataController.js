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
      
      // Add mock beach data with categories for testing the icon system
      const mockBeachData = [
        {
          id: "huntington-city-beach",
          name: "Huntington City Beach",
          categoryName: "City Beach",
          longitude: -118.0030,
          latitude: 33.6550,
          'main-image': { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400" },
          geometry: {
            type: 'Point',
            coordinates: [-118.0030, 33.6550]
          }
        },
        {
          id: "malibu-state-beach",
          name: "Malibu State Beach",
          categoryName: "State Beach",
          longitude: -118.6919,
          latitude: 34.0259,
          'main-image': { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400" },
          geometry: {
            type: 'Point',
            coordinates: [-118.6919, 34.0259]
          }
        }
      ];
      
      AppState.dispatch({ type: "SET_ALL_BEACH_DATA", payload: mockBeachData });
      console.log("[DataController] Added mock beach data for testing.");
    }
  },

  async prefetchAllPOIData() {
    try {
      const response = await fetch(`${apiConfig.BASE_URL}/api/pois`);
      console.log('[DataController] POI fetch response status:', response.status);

      if (!response.ok) {
        console.warn(`[DataController] POI API not available (status: ${response.status}), using mock data`);
        // Enhanced mock POI data with categories for testing
        const mockPOIData = [
          {
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
          },
          {
            id: "santa-monica-beach-restaurant",
            name: "Beachside Cafe",
            slug: "beachside-cafe-santa-monica",
            longitude: -118.4965,
            latitude: 34.0085,
            categoryName: "Food & Dining",
            customIconName: "utensils",
            mainImageUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400",
            mainImageAlt: "Beachside Cafe",
            richTextContent: "<p>Oceanfront dining with fresh seafood and stunning sunset views.</p>",
            geometry: {
              type: 'Point',
              coordinates: [-118.4965, 34.0085]
            }
          }
        ];
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
      // Enhanced fallback mock POI data
      const mockPOIData = [
        {
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
        },
        {
          id: "santa-monica-beach-restaurant",
          name: "Beachside Cafe",
          slug: "beachside-cafe-santa-monica",
          longitude: -118.4965,
          latitude: 34.0085,
          categoryName: "Food & Dining",
          customIconName: "utensils",
          mainImageUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400",
          mainImageAlt: "Beachside Cafe",
          richTextContent: "<p>Oceanfront dining with fresh seafood and stunning sunset views.</p>",
          geometry: {
            type: 'Point',
            coordinates: [-118.4965, 34.0085]
          }
        }
      ];
      AppState.dispatch({ type: "SET_ALL_POI_DATA", payload: mockPOIData });
      console.log("[DataController] Fallback to mock POI data due to error.");
    }
  },
}; 