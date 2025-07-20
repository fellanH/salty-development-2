// =============================================================================
// DATA CONTROLLER - REFACTORED FOR BETTER ORGANIZATION
// =============================================================================

import { AppState } from "./appState.js";
import { apiConfig } from "./config/api.js";

// =============================================================================
// API CLIENT MODULE
// =============================================================================
const ApiClient = {
  /**
   * Makes an HTTP request with error handling
   * @param {string} url - Request URL
   * @param {object} options - Fetch options
   * @returns {Promise<object>} Response data or error info
   */
  async makeRequest(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      const result = {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: null,
        error: null
      };

      if (response.ok) {
        result.data = await response.json();
      } else {
        result.error = `HTTP error! status: ${response.status}`;
      }

      return result;
    } catch (error) {
      return {
        ok: false,
        status: 0,
        statusText: 'Network Error',
        data: null,
        error: error.message
      };
    }
  },

  /**
   * Fetches beach data from API
   * @returns {Promise<object>} API response
   */
  async fetchBeaches() {
    const url = `${apiConfig.BASE_URL}/api/beaches`;
    console.log(`[ApiClient] Fetching beaches from: ${url}`);
    return await this.makeRequest(url);
  },

  /**
   * Fetches POI data from API
   * @returns {Promise<object>} API response
   */
  async fetchPOIs() {
    const url = `${apiConfig.BASE_URL}/api/pois`;
    console.log(`[ApiClient] Fetching POIs from: ${url}`);
    return await this.makeRequest(url);
  }
};

// =============================================================================
// MOCK DATA PROVIDER MODULE
// =============================================================================
const MockDataProvider = {
  /**
   * Generates mock beach data
   * @returns {Array} Mock beach data
   */
  generateMockBeachData() {
    return [
      {
        id: "sample-beach-1",
        name: "Sample Beach",
        slug: "sample-beach",
        longitude: -118.2437,
        latitude: 34.0522,
        address: "123 Beach Street, Los Angeles, CA",
        mainImageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
        mainImageAlt: "Sample Beach",
        website: "https://example.com",
        phone: "(555) 123-4567",
        amenities: {
          restrooms: true,
          showers: true,
          parking: true,
          pets: false
        },
        geometry: {
          type: 'Point',
          coordinates: [-118.2437, 34.0522]
        }
      }
    ];
  },

  /**
   * Generates mock POI data
   * @returns {Array} Mock POI data
   */
  generateMockPOIData() {
    return [
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
      }
    ];
  }
};

// =============================================================================
// DATA CACHE MANAGER MODULE
// =============================================================================
const DataCacheManager = {
  /**
   * Caches beach data in application state
   * @param {Array} beachData - Beach data to cache
   */
  cacheBeachData(beachData) {
    if (!Array.isArray(beachData)) {
      console.warn('[DataCacheManager] Invalid beach data provided for caching');
      return;
    }

    AppState.dispatch({ type: "SET_ALL_BEACH_DATA", payload: beachData });
    console.log(`[DataCacheManager] Cached ${beachData.length} beach items.`);
  },

  /**
   * Caches POI data in application state
   * @param {Array} poiData - POI data to cache
   */
  cachePOIData(poiData) {
    if (!Array.isArray(poiData)) {
      console.warn('[DataCacheManager] Invalid POI data provided for caching');
      return;
    }

    AppState.dispatch({ type: "SET_ALL_POI_DATA", payload: poiData });
    console.log(`[DataCacheManager] Cached ${poiData.length} POI items.`);
  },

  /**
   * Retrieves cached beach data
   * @returns {Map} Cached beach data
   */
  getCachedBeachData() {
    return AppState.getState().cache.beachData;
  },

  /**
   * Retrieves cached POI data
   * @returns {Map} Cached POI data
   */
  getCachedPOIData() {
    return AppState.getState().cache.poiData;
  },

  /**
   * Checks if data is already cached
   * @param {string} dataType - Type of data ('beach' or 'poi')
   * @returns {boolean} True if data is cached
   */
  isDataCached(dataType) {
    const cache = dataType === 'beach' 
      ? this.getCachedBeachData() 
      : this.getCachedPOIData();
    
    return cache && cache.size > 0;
  }
};

// =============================================================================
// DATA FETCH STRATEGIES MODULE
// =============================================================================
const DataFetchStrategies = {
  /**
   * Fetches beach data with fallback strategies
   * @returns {Promise<boolean>} Success status
   */
  async fetchBeachData() {
    console.log('[DataFetchStrategies] Starting beach data fetch...');

    // Check if already cached
    if (DataCacheManager.isDataCached('beach')) {
      console.log('[DataFetchStrategies] Beach data already cached, skipping fetch.');
      return true;
    }

    // Try API first
    const apiResult = await ApiClient.fetchBeaches();
    
    if (apiResult.ok && apiResult.data) {
      DataCacheManager.cacheBeachData(apiResult.data);
      console.log('[DataFetchStrategies] Successfully fetched and cached beach data from API.');
      return true;
    }

    // Fallback to mock data
    console.warn(`[DataFetchStrategies] API failed (${apiResult.status}), using mock beach data.`);
    const mockData = MockDataProvider.generateMockBeachData();
    DataCacheManager.cacheBeachData(mockData);
    console.log('[DataFetchStrategies] Fallback to mock beach data completed.');
    return false; // Indicate API failure but successful fallback
  },

  /**
   * Fetches POI data with fallback strategies
   * @returns {Promise<boolean>} Success status
   */
  async fetchPOIData() {
    console.log('[DataFetchStrategies] Starting POI data fetch...');

    // Check if already cached
    if (DataCacheManager.isDataCached('poi')) {
      console.log('[DataFetchStrategies] POI data already cached, skipping fetch.');
      return true;
    }

    // Try API first
    const apiResult = await ApiClient.fetchPOIs();
    
    if (apiResult.ok && apiResult.data) {
      DataCacheManager.cachePOIData(apiResult.data);
      console.log('[DataFetchStrategies] Successfully fetched and cached POI data from API.');
      return true;
    }

    // Fallback to mock data
    console.warn(`[DataFetchStrategies] POI API failed (${apiResult.status}), using mock data.`);
    const mockData = MockDataProvider.generateMockPOIData();
    DataCacheManager.cachePOIData(mockData);
    console.log('[DataFetchStrategies] Fallback to mock POI data completed.');
    return false; // Indicate API failure but successful fallback
  }
};

// =============================================================================
// DATA VALIDATION MODULE
// =============================================================================
const DataValidator = {
  /**
   * Validates beach data structure
   * @param {object} beachItem - Beach item to validate
   * @returns {boolean} True if valid
   */
  validateBeachData(beachItem) {
    const requiredFields = ['id', 'name'];
    return requiredFields.every(field => 
      beachItem && typeof beachItem[field] !== 'undefined'
    );
  },

  /**
   * Validates POI data structure
   * @param {object} poiItem - POI item to validate
   * @returns {boolean} True if valid
   */
  validatePOIData(poiItem) {
    const requiredFields = ['id', 'name'];
    return requiredFields.every(field => 
      poiItem && typeof poiItem[field] !== 'undefined'
    );
  },

  /**
   * Validates an array of data items
   * @param {Array} dataArray - Array of data items
   * @param {string} dataType - Type of data ('beach' or 'poi')
   * @returns {object} Validation result
   */
  validateDataArray(dataArray, dataType) {
    if (!Array.isArray(dataArray)) {
      return { isValid: false, errors: ['Data is not an array'] };
    }

    const validator = dataType === 'beach' 
      ? this.validateBeachData 
      : this.validatePOIData;

    const errors = [];
    const validItems = dataArray.filter((item, index) => {
      const isValid = validator(item);
      if (!isValid) {
        errors.push(`Invalid ${dataType} item at index ${index}`);
      }
      return isValid;
    });

    return {
      isValid: errors.length === 0,
      errors,
      validItemCount: validItems.length,
      totalItemCount: dataArray.length
    };
  }
};

// =============================================================================
// MAIN DATA CONTROLLER
// =============================================================================
export const DataController = {
  /**
   * Initializes data controller and prefetches all data
   * @returns {Promise<void>}
   */
  async init() {
    console.log("[DataController] Initializing data pre-fetch...");
    
    try {
      const results = await Promise.allSettled([
        this.prefetchAllBeachData(),
        this.prefetchAllPOIData()
      ]);

      this.logInitializationResults(results);
      console.log("[DataController] Data initialization completed.");
    } catch (error) {
      console.error("[DataController] Critical error during initialization:", error);
      throw error;
    }
  },

  /**
   * Prefetches all beach data
   * @returns {Promise<boolean>} Success status
   */
  async prefetchAllBeachData() {
    try {
      return await DataFetchStrategies.fetchBeachData();
    } catch (error) {
      console.error("[DataController] Failed to prefetch beach data:", error);
      return false;
    }
  },

  /**
   * Prefetches all POI data
   * @returns {Promise<boolean>} Success status
   */
  async prefetchAllPOIData() {
    try {
      return await DataFetchStrategies.fetchPOIData();
    } catch (error) {
      console.error("[DataController] Failed to prefetch POI data:", error);
      return false;
    }
  },

  /**
   * Forces refresh of cached data
   * @param {string} dataType - Type of data to refresh ('beach', 'poi', or 'all')
   * @returns {Promise<void>}
   */
  async refreshData(dataType = 'all') {
    console.log(`[DataController] Refreshing ${dataType} data...`);

    if (dataType === 'all' || dataType === 'beach') {
      await DataFetchStrategies.fetchBeachData();
    }

    if (dataType === 'all' || dataType === 'poi') {
      await DataFetchStrategies.fetchPOIData();
    }

    console.log(`[DataController] Data refresh completed for: ${dataType}`);
  },

  /**
   * Gets cache statistics
   * @returns {object} Cache statistics
   */
  getCacheStats() {
    return {
      beaches: {
        count: DataCacheManager.getCachedBeachData().size,
        cached: DataCacheManager.isDataCached('beach')
      },
      pois: {
        count: DataCacheManager.getCachedPOIData().size,
        cached: DataCacheManager.isDataCached('poi')
      }
    };
  },

  /**
   * Logs initialization results
   * @param {Array} results - Promise settlement results
   */
  logInitializationResults(results) {
    results.forEach((result, index) => {
      const dataType = index === 0 ? 'Beach' : 'POI';
      
      if (result.status === 'fulfilled') {
        const status = result.value ? '✅ Success' : '⚠️ API Failed (Using Mock Data)';
        console.log(`[DataController] ${dataType} data: ${status}`);
      } else {
        console.error(`[DataController] ${dataType} data: ❌ Failed -`, result.reason);
      }
    });
  }
};

// Export individual modules for testing or focused imports
export {
  ApiClient,
  MockDataProvider,
  DataCacheManager,
  DataFetchStrategies,
  DataValidator
}; 