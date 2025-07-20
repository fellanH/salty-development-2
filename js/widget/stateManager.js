// =============================================================================
// STATE MANAGER MODULE
// =============================================================================

/**
 * Central state management for the map widget
 * Manages global state and notifies listeners of changes
 */
export class StateManager {
  constructor() {
    this.state = {
      locations: [],
      filteredLocations: [],
      activeLocationId: null,
      filters: {},
      isLoading: false,
      error: null,
      mapCenter: null,
      mapZoom: null
    };
    
    this.listeners = new Set();
  }

  /**
   * Initialize the state manager and expose it globally
   */
  init() {
    // Create global namespace
    if (!window.mapWidget) {
      window.mapWidget = {};
    }
    
    // Expose state and setState globally
    window.mapWidget.state = this.state;
    window.mapWidget.setState = this.setState.bind(this);
    window.mapWidget.getState = this.getState.bind(this);
    window.mapWidget.subscribe = this.subscribe.bind(this);
    window.mapWidget.unsubscribe = this.unsubscribe.bind(this);
    
    console.log('🔄 State Manager initialized');
  }

  /**
   * Get current state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Update state and notify listeners
   * @param {Object} updates - State updates to apply
   */
  setState(updates) {
    const previousState = { ...this.state };
    this.state = { ...this.state, ...updates };
    
    // Update global reference
    window.mapWidget.state = this.state;
    
    // Notify listeners
    this.notifyListeners(this.state, previousState);
    
    // Dispatch custom event
    this.dispatchStateChangeEvent(this.state, previousState);
  }

  /**
   * Subscribe to state changes
   * @param {Function} listener - Callback function
   */
  subscribe(listener) {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Unsubscribe from state changes
   * @param {Function} listener - Callback function to remove
   */
  unsubscribe(listener) {
    this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of state changes
   * @param {Object} newState - New state
   * @param {Object} previousState - Previous state
   */
  notifyListeners(newState, previousState) {
    this.listeners.forEach(listener => {
      try {
        listener(newState, previousState);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  }

  /**
   * Dispatch custom DOM event for state changes
   * @param {Object} newState - New state
   * @param {Object} previousState - Previous state
   */
  dispatchStateChangeEvent(newState, previousState) {
    const event = new CustomEvent('mapStateChange', {
      detail: {
        newState,
        previousState,
        changes: this.getStateChanges(newState, previousState)
      }
    });
    
    window.dispatchEvent(event);
  }

  /**
   * Get specific changes between states
   * @param {Object} newState - New state
   * @param {Object} previousState - Previous state
   */
  getStateChanges(newState, previousState) {
    const changes = {};
    
    Object.keys(newState).forEach(key => {
      if (newState[key] !== previousState[key]) {
        changes[key] = {
          from: previousState[key],
          to: newState[key]
        };
      }
    });
    
    return changes;
  }

  /**
   * Filter locations based on current filters
   */
  applyFilters() {
    const { locations, filters } = this.state;
    
    let filtered = [...locations];
    
    // Apply type filter
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(location => 
        location.type?.toLowerCase() === filters.type.toLowerCase()
      );
    }
    
    // Apply region filter
    if (filters.region && filters.region !== 'all') {
      filtered = filtered.filter(location => 
        location.locationDetails?.region?.toLowerCase() === filters.region.toLowerCase()
      );
    }
    
    // Apply city filter
    if (filters.city && filters.city !== 'all') {
      filtered = filtered.filter(location => 
        location.locationDetails?.city?.toLowerCase() === filters.city.toLowerCase()
      );
    }
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(location =>
        location.name?.toLowerCase().includes(searchTerm) ||
        location.locationDetails?.city?.toLowerCase().includes(searchTerm) ||
        location.locationDetails?.region?.toLowerCase().includes(searchTerm)
      );
    }
    
    this.setState({ filteredLocations: filtered });
  }

  /**
   * Set active location
   * @param {string} locationId - ID of the location to activate
   */
  setActiveLocation(locationId) {
    this.setState({ activeLocationId: locationId });
  }

  /**
   * Clear active location
   */
  clearActiveLocation() {
    this.setState({ activeLocationId: null });
  }

  /**
   * Set loading state
   * @param {boolean} isLoading - Loading state
   */
  setLoading(isLoading) {
    this.setState({ isLoading });
  }

  /**
   * Set error state
   * @param {string|null} error - Error message or null to clear
   */
  setError(error) {
    this.setState({ error });
  }

  /**
   * Update locations data
   * @param {Array} locations - Array of location objects
   */
  setLocations(locations) {
    this.setState({ 
      locations,
      filteredLocations: locations // Initially show all locations
    });
  }

  /**
   * Update filters and apply them
   * @param {Object} newFilters - Filter updates
   */
  updateFilters(newFilters) {
    this.setState({ filters: { ...this.state.filters, ...newFilters } });
    this.applyFilters();
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    this.setState({ filters: {} });
    this.setState({ filteredLocations: [...this.state.locations] });
  }

  /**
   * Update map position
   * @param {Object} position - Map center and zoom
   */
  updateMapPosition(position) {
    this.setState({
      mapCenter: position.center,
      mapZoom: position.zoom
    });
  }
}

// Create singleton instance
export const stateManager = new StateManager();