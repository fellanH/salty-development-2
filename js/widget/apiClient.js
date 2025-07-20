// =============================================================================
// API CLIENT MODULE
// =============================================================================

/**
 * Handles all API requests to the Vercel backend
 * Provides data fetching and caching functionality
 */
export class ApiClient {
  constructor() {
    this.baseUrl = this.getBaseUrl();
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Determine the base URL for API requests
   */
  getBaseUrl() {
    // Check if we're in development or production
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    
    // Production URL (will be set based on Vercel deployment)
    return window.location.origin;
  }

  /**
   * Initialize the API client
   */
  init() {
    console.log('🌐 API Client initialized with base URL:', this.baseUrl);
  }

  /**
   * Make a GET request with caching
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   */
  async get(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = this.getCacheKey(url, options);
    
    // Check cache first
    if (this.cache.has(cacheKey) && !options.skipCache) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log('📦 Using cached data for:', endpoint);
        return cached.data;
      } else {
        // Remove expired cache entry
        this.cache.delete(cacheKey);
      }
    }

    try {
      console.log('🔄 Fetching data from:', endpoint);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
      
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw new Error(`Failed to fetch data from ${endpoint}: ${error.message}`);
    }
  }

  /**
   * Fetch all locations (beaches and POIs)
   */
  async fetchLocations() {
    try {
      // Fetch both beaches and POIs in parallel
      const [beaches, pois] = await Promise.all([
        this.get('/api/beaches'),
        this.get('/api/pois')
      ]);

      // Combine and normalize the data
      const allLocations = [
        ...this.normalizeLocations(beaches, 'Beach'),
        ...this.normalizeLocations(pois, 'POI')
      ];

      console.log(`✅ Fetched ${allLocations.length} locations (${beaches.length} beaches, ${pois.length} POIs)`);
      return allLocations;
      
    } catch (error) {
      console.error('❌ Failed to fetch locations:', error);
      throw error;
    }
  }

  /**
   * Fetch beaches only
   */
  async fetchBeaches() {
    try {
      const beaches = await this.get('/api/beaches');
      return this.normalizeLocations(beaches, 'Beach');
    } catch (error) {
      console.error('❌ Failed to fetch beaches:', error);
      throw error;
    }
  }

  /**
   * Fetch POIs only
   */
  async fetchPOIs() {
    try {
      const pois = await this.get('/api/pois');
      return this.normalizeLocations(pois, 'POI');
    } catch (error) {
      console.error('❌ Failed to fetch POIs:', error);
      throw error;
    }
  }

  /**
   * Fetch a specific location by ID
   * @param {string} locationId - The location ID
   */
  async fetchLocationById(locationId) {
    try {
      const allLocations = await this.fetchLocations();
      return allLocations.find(location => location.id === locationId);
    } catch (error) {
      console.error('❌ Failed to fetch location by ID:', error);
      throw error;
    }
  }

  /**
   * Normalize location data to match the expected format
   * @param {Array} locations - Raw location data from API
   * @param {string} type - Location type (Beach, POI, etc.)
   */
  normalizeLocations(locations, type) {
    if (!Array.isArray(locations)) {
      console.warn('⚠️ Expected array of locations, got:', typeof locations);
      return [];
    }

    return locations.map(location => this.normalizeLocation(location, type));
  }

  /**
   * Normalize a single location to the expected format
   * @param {Object} location - Raw location data
   * @param {string} type - Location type
   */
  normalizeLocation(location, type) {
    // Handle different possible data structures
    const normalized = {
      id: location.id || location._id || location.slug,
      slug: location.slug || location.id,
      name: location.name || location.title,
      type: location.type || type,
      coordinates: this.normalizeCoordinates(location),
      locationDetails: this.normalizeLocationDetails(location),
      assets: this.normalizeAssets(location),
      // Include original data for debugging/extended usage
      _raw: location
    };

    return normalized;
  }

  /**
   * Normalize coordinates from various possible formats
   * @param {Object} location - Location data
   */
  normalizeCoordinates(location) {
    // Try different coordinate formats
    if (location.coordinates) {
      return {
        longitude: location.coordinates.longitude || location.coordinates.lng || location.coordinates[0],
        latitude: location.coordinates.latitude || location.coordinates.lat || location.coordinates[1]
      };
    }
    
    if (location.lng && location.lat) {
      return {
        longitude: location.lng,
        latitude: location.lat
      };
    }
    
    if (location.longitude && location.latitude) {
      return {
        longitude: location.longitude,
        latitude: location.latitude
      };
    }

    console.warn('⚠️ No valid coordinates found for location:', location.name || location.id);
    return { longitude: null, latitude: null };
  }

  /**
   * Normalize location details
   * @param {Object} location - Location data
   */
  normalizeLocationDetails(location) {
    return {
      city: location.city || location.locationDetails?.city || location.location?.city,
      region: location.region || location.locationDetails?.region || location.location?.region || location.state,
      island: location.island || location.locationDetails?.island || location.location?.island,
      country: location.country || location.locationDetails?.country || location.location?.country
    };
  }

  /**
   * Normalize asset URLs
   * @param {Object} location - Location data
   */
  normalizeAssets(location) {
    return {
      imageUrl: location.imageUrl || location.image || location.assets?.imageUrl || location.photo?.url,
      iconUrl: location.iconUrl || location.icon || location.assets?.iconUrl,
      thumbnailUrl: location.thumbnailUrl || location.thumbnail || location.assets?.thumbnailUrl
    };
  }

  /**
   * Generate cache key for requests
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   */
  getCacheKey(url, options) {
    return `${url}_${JSON.stringify(options)}`;
  }

  /**
   * Clear all cached data
   */
  clearCache() {
    this.cache.clear();
    console.log('🗑️ API cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Health check endpoint
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      console.warn('⚠️ Health check failed:', error);
      return false;
    }
  }
}

// Create singleton instance
export const apiClient = new ApiClient();