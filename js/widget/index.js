// =============================================================================
// WIDGET INDEX MODULE
// =============================================================================

/**
 * Main entry point for the Webflow Map Widget
 * Initializes all modules and manages the widget lifecycle
 */

// Import all widget modules
import { stateManager } from './stateManager.js';
import { apiClient } from './apiClient.js';
import { mapController } from './mapController.js';
import { uiBinder } from './uiBinder.js';
import { router } from './router.js';

// =============================================================================
// WIDGET CLASS
// =============================================================================

class MapWidget {
  constructor() {
    this.isInitialized = false;
    this.modules = {
      stateManager,
      apiClient,
      mapController,
      uiBinder,
      router
    };
    
    // Configuration
    this.config = {
      mapboxToken: null,
      apiBaseUrl: null,
      containerId: 'map-widget',
      mapContainerId: 'map-container',
      locationsListId: 'locations-list',
      autoInit: true
    };
  }

  /**
   * Initialize the widget
   * @param {Object} options - Configuration options
   */
  async init(options = {}) {
    try {
      console.log('🚀 Initializing Map Widget...');
      
      // Merge configuration
      this.config = { ...this.config, ...options };
      
      // Check for required elements
      if (!this.checkRequiredElements()) {
        throw new Error('Required DOM elements not found');
      }

      // Initialize modules in order
      await this.initializeModules();
      
      // Set up global event listeners
      this.setupGlobalEventListeners();
      
      // Load initial data
      await this.loadInitialData();
      
      // Mark as initialized
      this.isInitialized = true;
      
      console.log('✅ Map Widget initialized successfully!');
      
      // Dispatch initialization event
      window.dispatchEvent(new CustomEvent('mapWidgetInitialized', {
        detail: { widget: this }
      }));
      
    } catch (error) {
      console.error('❌ Failed to initialize Map Widget:', error);
      this.handleInitializationError(error);
      throw error;
    }
  }

  /**
   * Check if all required DOM elements exist
   */
  checkRequiredElements() {
    const requiredElements = [
      this.config.mapContainerId,
      this.config.containerId
    ];

    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
      console.error('❌ Missing required DOM elements:', missingElements);
      return false;
    }

    return true;
  }

  /**
   * Initialize all modules in the correct order
   */
  async initializeModules() {
    // 1. Initialize state manager first
    this.modules.stateManager.init();
    
    // 2. Initialize API client
    this.modules.apiClient.init();
    
    // 3. Initialize UI binder
    this.modules.uiBinder.init();
    
    // 4. Initialize map controller
    await this.modules.mapController.init({
      container: this.config.mapContainerId,
      accessToken: this.config.mapboxToken
    });
    
    // 5. Initialize router
    this.modules.router.init();
    
    // Expose modules globally for easy access
    if (!window.mapWidget) {
      window.mapWidget = {};
    }
    
    Object.assign(window.mapWidget, {
      widget: this,
      ...this.modules
    });
  }

  /**
   * Set up global event listeners
   */
  setupGlobalEventListeners() {
    // Listen for state changes
    window.addEventListener('mapStateChange', (event) => {
      this.handleStateChange(event.detail);
    });

    // Listen for map events
    window.addEventListener('mapLoaded', () => {
      console.log('🗺️ Map loaded, syncing with state...');
      this.syncMapWithState();
    });

    // Listen for location selection
    window.addEventListener('locationSelected', (event) => {
      this.handleLocationSelection(event.detail.location);
    });

    // Listen for route changes
    window.addEventListener('routeChange', (event) => {
      this.handleRouteChange(event.detail);
    });

    // Listen for window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Set up filter event listeners
    this.setupFilterEventListeners();
  }

  /**
   * Set up filter and search event listeners
   */
  setupFilterEventListeners() {
    // Type filter
    const typeFilter = document.getElementById('type-filter');
    if (typeFilter) {
      typeFilter.addEventListener('change', (e) => {
        this.modules.stateManager.updateFilters({ type: e.target.value });
      });
    }

    // Region filter
    const regionFilter = document.getElementById('region-filter');
    if (regionFilter) {
      regionFilter.addEventListener('change', (e) => {
        this.modules.stateManager.updateFilters({ region: e.target.value });
      });
    }

    // City filter
    const cityFilter = document.getElementById('city-filter');
    if (cityFilter) {
      cityFilter.addEventListener('change', (e) => {
        this.modules.stateManager.updateFilters({ city: e.target.value });
      });
    }

    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.modules.stateManager.updateFilters({ search: e.target.value });
        }, 300); // Debounce search
      });
    }

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        this.modules.stateManager.clearFilters();
        this.clearFilterInputs();
      });
    }
  }

  /**
   * Load initial data
   */
  async loadInitialData() {
    try {
      // Set loading state
      this.modules.stateManager.setLoading(true);
      
      // Fetch locations data
      const locations = await this.modules.apiClient.fetchLocations();
      
      // Update state with locations
      this.modules.stateManager.setLocations(locations);
      
      // Update UI
      this.modules.uiBinder.updateLocationsList(locations, this.config.locationsListId);
      
      // Add markers to map
      if (this.modules.mapController.isInitialized) {
        this.modules.mapController.addMarkers(locations);
      }
      
      // Clear loading state
      this.modules.stateManager.setLoading(false);
      
      console.log(`✅ Loaded ${locations.length} locations`);
      
    } catch (error) {
      console.error('❌ Failed to load initial data:', error);
      this.modules.stateManager.setError('Failed to load location data. Please try again.');
      this.modules.stateManager.setLoading(false);
    }
  }

  /**
   * Handle state changes
   * @param {Object} stateChange - State change details
   */
  handleStateChange(stateChange) {
    const { newState, changes } = stateChange;

    // Handle filtered locations change
    if (changes.filteredLocations) {
      this.modules.uiBinder.updateLocationsList(newState.filteredLocations, this.config.locationsListId);
      
      if (this.modules.mapController.isInitialized) {
        this.modules.mapController.updateMarkerVisibility(newState.filteredLocations);
      }
    }

    // Handle active location change
    if (changes.activeLocationId) {
      if (newState.activeLocationId) {
        this.modules.uiBinder.highlightLocationItem(newState.activeLocationId);
        
        if (this.modules.mapController.isInitialized) {
          this.modules.mapController.highlightMarker(newState.activeLocationId);
        }
      }
    }

    // Handle loading state change
    if (changes.isLoading) {
      this.modules.uiBinder.updateLoadingState(newState.isLoading, this.config.containerId);
    }

    // Handle error state change
    if (changes.error) {
      this.modules.uiBinder.updateErrorState(newState.error, this.config.containerId);
    }

    // Handle filter changes
    if (changes.filters) {
      this.modules.uiBinder.updateFiltersUI(newState.filters, newState.locations);
    }

    // Update visibility based on state
    this.modules.uiBinder.updateVisibility(newState);
  }

  /**
   * Handle location selection
   * @param {Object} location - Selected location
   */
  handleLocationSelection(location) {
    // Update URL
    this.modules.router.navigateTo(`/locations/${location.slug}`);
  }

  /**
   * Handle route changes
   * @param {Object} routeChange - Route change details
   */
  handleRouteChange(routeChange) {
    console.log('🧭 Route changed:', routeChange.path);
    // Additional route change handling can be added here
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Resize map
    if (this.modules.mapController.isInitialized) {
      this.modules.mapController.resize();
    }
  }

  /**
   * Sync map with current state
   */
  syncMapWithState() {
    const state = this.modules.stateManager.getState();
    
    if (state.locations && state.locations.length > 0) {
      this.modules.mapController.addMarkers(state.locations);
    }
  }

  /**
   * Clear filter inputs
   */
  clearFilterInputs() {
    const inputs = [
      'type-filter',
      'region-filter', 
      'city-filter',
      'search-input'
    ];

    inputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        if (element.tagName === 'SELECT') {
          element.value = 'all';
        } else {
          element.value = '';
        }
      }
    });
  }

  /**
   * Handle initialization errors
   * @param {Error} error - Initialization error
   */
  handleInitializationError(error) {
    const container = document.getElementById(this.config.containerId);
    if (container) {
      container.innerHTML = `
        <div class="widget-error">
          <div class="error-content">
            <h3>Widget Error</h3>
            <p>Failed to initialize the map widget: ${error.message}</p>
            <button onclick="location.reload()" class="retry-btn">Retry</button>
          </div>
        </div>
      `;
    }
  }

  /**
   * Get widget status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      modules: Object.keys(this.modules).reduce((status, key) => {
        status[key] = this.modules[key].isInitialized || false;
        return status;
      }, {}),
      config: this.config
    };
  }

  /**
   * Refresh widget data
   */
  async refresh() {
    if (!this.isInitialized) return;
    
    try {
      console.log('🔄 Refreshing widget data...');
      
      // Clear cache
      this.modules.apiClient.clearCache();
      
      // Reload data
      await this.loadInitialData();
      
      console.log('✅ Widget data refreshed');
      
    } catch (error) {
      console.error('❌ Failed to refresh widget:', error);
      this.modules.stateManager.setError('Failed to refresh data. Please try again.');
    }
  }

  /**
   * Destroy the widget and clean up
   */
  destroy() {
    try {
      console.log('🗑️ Destroying Map Widget...');
      
      // Destroy modules
      Object.values(this.modules).forEach(module => {
        if (module.destroy && typeof module.destroy === 'function') {
          module.destroy();
        }
      });
      
      // Clear global references
      if (window.mapWidget) {
        delete window.mapWidget;
      }
      
      this.isInitialized = false;
      
      console.log('✅ Map Widget destroyed');
      
    } catch (error) {
      console.error('❌ Error destroying widget:', error);
    }
  }
}

// =============================================================================
// AUTO-INITIALIZATION
// =============================================================================

/**
 * Auto-initialize the widget when DOM is ready
 */
function autoInit() {
  // Check if widget should auto-initialize
  const autoInitElement = document.querySelector('[data-widget="map-widget"]');
  const mapContainer = document.getElementById('map-container');
  
  if (autoInitElement || mapContainer) {
    console.log('🔍 Auto-initializing Map Widget...');
    
    // Get configuration from data attributes
    const config = autoInitElement ? getConfigFromDataAttributes(autoInitElement) : {};
    
    // Create and initialize widget
    const widget = new MapWidget();
    widget.init(config).catch(error => {
      console.error('❌ Auto-initialization failed:', error);
    });
    
    return widget;
  }
  
  return null;
}

/**
 * Extract configuration from data attributes
 * @param {Element} element - Element with data attributes
 */
function getConfigFromDataAttributes(element) {
  const config = {};
  
  // Map data attributes to config
  const attributeMap = {
    'data-mapbox-token': 'mapboxToken',
    'data-api-base-url': 'apiBaseUrl',
    'data-container-id': 'containerId',
    'data-map-container-id': 'mapContainerId',
    'data-locations-list-id': 'locationsListId'
  };
  
  Object.keys(attributeMap).forEach(attr => {
    const value = element.getAttribute(attr);
    if (value) {
      config[attributeMap[attr]] = value;
    }
  });
  
  return config;
}

// =============================================================================
// INITIALIZATION
// =============================================================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInit);
} else {
  // DOM is already ready
  autoInit();
}

// =============================================================================
// EXPORTS
// =============================================================================

// Export for manual initialization
export { MapWidget };

// Expose globally for Webflow
window.MapWidget = MapWidget;

console.log('📦 Map Widget module loaded');