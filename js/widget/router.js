// =============================================================================
// ROUTER MODULE
// =============================================================================

/**
 * Manages hash-based URL routing for the widget
 * Handles navigation and deep linking
 */
export class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.isInitialized = false;
    this.baseHash = '#';
  }

  /**
   * Initialize the router
   */
  init() {
    // Set up default routes
    this.setupDefaultRoutes();
    
    // Listen for hash changes
    this.setupEventListeners();
    
    // Handle initial route
    this.handleInitialRoute();
    
    console.log('🧭 Router initialized');
    this.isInitialized = true;
  }

  /**
   * Set up default routes for the widget
   */
  setupDefaultRoutes() {
    // Home/map view
    this.addRoute('/', () => {
      this.showMapView();
    });

    // Location detail view
    this.addRoute('/locations/:slug', (params) => {
      this.showLocationDetail(params.slug);
    });

    // List view
    this.addRoute('/list', () => {
      this.showListView();
    });

    // Filter views
    this.addRoute('/filter/:type', (params) => {
      this.showFilteredView(params.type);
    });

    // Search results
    this.addRoute('/search/:query', (params) => {
      this.showSearchResults(params.query);
    });
  }

  /**
   * Set up event listeners for routing
   */
  setupEventListeners() {
    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      this.handleRouteChange();
    });

    // Listen for popstate (back/forward buttons)
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });

    // Listen for programmatic navigation
    window.addEventListener('navigate', (event) => {
      if (event.detail?.path) {
        this.navigateTo(event.detail.path);
      }
    });
  }

  /**
   * Handle initial route when the widget loads
   */
  handleInitialRoute() {
    const currentHash = window.location.hash;
    
    if (currentHash && currentHash.length > 1) {
      // Handle existing hash
      this.handleRouteChange();
    } else {
      // Default to home route
      this.navigateTo('/');
    }
  }

  /**
   * Handle route changes
   */
  handleRouteChange() {
    const hash = window.location.hash;
    const path = hash.replace(this.baseHash, '') || '/';
    
    this.currentRoute = path;
    this.executeRoute(path);
  }

  /**
   * Add a route to the router
   * @param {string} pattern - Route pattern (supports :param syntax)
   * @param {Function} handler - Route handler function
   */
  addRoute(pattern, handler) {
    const regex = this.patternToRegex(pattern);
    this.routes.set(pattern, {
      pattern,
      regex,
      handler,
      paramNames: this.extractParamNames(pattern)
    });
  }

  /**
   * Convert route pattern to regex
   * @param {string} pattern - Route pattern
   */
  patternToRegex(pattern) {
    const escaped = pattern.replace(/\//g, '\\/');
    const withParams = escaped.replace(/:(\w+)/g, '([^/]+)');
    return new RegExp(`^${withParams}$`);
  }

  /**
   * Extract parameter names from route pattern
   * @param {string} pattern - Route pattern
   */
  extractParamNames(pattern) {
    const matches = pattern.match(/:(\w+)/g);
    return matches ? matches.map(match => match.substring(1)) : [];
  }

  /**
   * Execute the appropriate route handler
   * @param {string} path - Current path
   */
  executeRoute(path) {
    let routeFound = false;

    for (const [pattern, route] of this.routes) {
      const match = path.match(route.regex);
      
      if (match) {
        routeFound = true;
        
        // Extract parameters
        const params = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });

        // Execute handler
        try {
          route.handler(params, path);
          console.log(`🧭 Navigated to: ${pattern}`, params);
        } catch (error) {
          console.error('❌ Route handler error:', error);
        }
        
        break;
      }
    }

    if (!routeFound) {
      console.warn('⚠️ No route found for path:', path);
      this.handle404(path);
    }

    // Dispatch route change event
    this.dispatchRouteChangeEvent(path);
  }

  /**
   * Navigate to a specific path
   * @param {string} path - Target path
   * @param {boolean} replace - Whether to replace current history entry
   */
  navigateTo(path, replace = false) {
    const fullHash = `${this.baseHash}${path}`;
    
    if (replace) {
      window.location.replace(`${window.location.pathname}${window.location.search}${fullHash}`);
    } else {
      window.location.hash = fullHash;
    }
  }

  /**
   * Go back in history
   */
  goBack() {
    window.history.back();
  }

  /**
   * Go forward in history
   */
  goForward() {
    window.history.forward();
  }

  /**
   * Replace current route
   * @param {string} path - New path
   */
  replace(path) {
    this.navigateTo(path, true);
  }

  /**
   * Get current route path
   */
  getCurrentPath() {
    return this.currentRoute;
  }

  /**
   * Check if a path matches the current route
   * @param {string} path - Path to check
   */
  isCurrentPath(path) {
    return this.currentRoute === path;
  }

  /**
   * Dispatch route change event
   * @param {string} path - Current path
   */
  dispatchRouteChangeEvent(path) {
    window.dispatchEvent(new CustomEvent('routeChange', {
      detail: { 
        path,
        previousPath: this.previousRoute 
      }
    }));
    
    this.previousRoute = path;
  }

  // ==========================================
  // ROUTE HANDLERS
  // ==========================================

  /**
   * Show the main map view
   */
  showMapView() {
    // Clear active location
    if (window.mapWidget?.setState) {
      window.mapWidget.setState({ activeLocationId: null });
    }

    // Show map container
    this.showView('map');
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('showMapView'));
  }

  /**
   * Show location detail view
   * @param {string} slug - Location slug
   */
  async showLocationDetail(slug) {
    try {
      // Set loading state
      if (window.mapWidget?.setState) {
        window.mapWidget.setState({ isLoading: true });
      }

      // Find location by slug
      const location = await this.findLocationBySlug(slug);
      
      if (!location) {
        console.warn(`⚠️ Location not found: ${slug}`);
        this.handle404(`/locations/${slug}`);
        return;
      }

      // Set active location
      if (window.mapWidget?.setState) {
        window.mapWidget.setState({ 
          activeLocationId: location.id,
          isLoading: false 
        });
      }

      // Center map on location
      if (window.mapWidget?.mapController) {
        window.mapWidget.mapController.centerOnLocation(location);
        window.mapWidget.mapController.showLocationPopup(location);
      }

      // Highlight in list
      if (window.mapWidget?.uiBinder) {
        window.mapWidget.uiBinder.highlightLocationItem(location.id);
      }

      // Dispatch event
      window.dispatchEvent(new CustomEvent('showLocationDetail', {
        detail: { location }
      }));

    } catch (error) {
      console.error('❌ Error showing location detail:', error);
      this.handle404(`/locations/${slug}`);
    }
  }

  /**
   * Show list view
   */
  showListView() {
    // Show list container
    this.showView('list');
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('showListView'));
  }

  /**
   * Show filtered view
   * @param {string} type - Filter type
   */
  showFilteredView(type) {
    // Apply filter
    if (window.mapWidget?.setState) {
      window.mapWidget.setState({
        filters: { type: type === 'all' ? null : type }
      });
    }

    // Dispatch event
    window.dispatchEvent(new CustomEvent('showFilteredView', {
      detail: { type }
    }));
  }

  /**
   * Show search results
   * @param {string} query - Search query
   */
  showSearchResults(query) {
    const decodedQuery = decodeURIComponent(query);
    
    // Apply search filter
    if (window.mapWidget?.setState) {
      window.mapWidget.setState({
        filters: { search: decodedQuery }
      });
    }

    // Dispatch event
    window.dispatchEvent(new CustomEvent('showSearchResults', {
      detail: { query: decodedQuery }
    }));
  }

  /**
   * Handle 404 errors
   * @param {string} path - Requested path
   */
  handle404(path) {
    console.warn(`⚠️ 404: Path not found - ${path}`);
    
    // Navigate to home
    this.navigateTo('/');
    
    // Dispatch 404 event
    window.dispatchEvent(new CustomEvent('route404', {
      detail: { path }
    }));
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  /**
   * Show a specific view and hide others
   * @param {string} viewName - View to show
   */
  showView(viewName) {
    const views = ['map', 'list', 'detail'];
    
    views.forEach(view => {
      const element = document.getElementById(`${view}-view`);
      if (element) {
        element.style.display = view === viewName ? '' : 'none';
      }
    });
  }

  /**
   * Find location by slug
   * @param {string} slug - Location slug
   */
  async findLocationBySlug(slug) {
    if (!window.mapWidget?.state?.locations) {
      // Try to fetch locations if not available
      if (window.mapWidget?.apiClient) {
        const locations = await window.mapWidget.apiClient.fetchLocations();
        return locations.find(loc => loc.slug === slug);
      }
      return null;
    }

    return window.mapWidget.state.locations.find(loc => loc.slug === slug);
  }

  /**
   * Build URL for a location
   * @param {Object} location - Location object
   */
  buildLocationUrl(location) {
    return `/locations/${location.slug}`;
  }

  /**
   * Build URL for a filter
   * @param {string} type - Filter type
   */
  buildFilterUrl(type) {
    return `/filter/${type}`;
  }

  /**
   * Build URL for search
   * @param {string} query - Search query
   */
  buildSearchUrl(query) {
    return `/search/${encodeURIComponent(query)}`;
  }

  /**
   * Generate link HTML
   * @param {string} path - Target path
   * @param {string} text - Link text
   * @param {string} className - CSS class
   */
  createLink(path, text, className = '') {
    return `<a href="#${path}" class="${className}">${text}</a>`;
  }

  /**
   * Get query parameters from current URL
   */
  getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    
    for (const [key, value] of params) {
      result[key] = value;
    }
    
    return result;
  }

  /**
   * Update URL with query parameters
   * @param {Object} params - Parameters to add/update
   */
  updateQueryParams(params) {
    const urlParams = new URLSearchParams(window.location.search);
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        urlParams.set(key, params[key]);
      } else {
        urlParams.delete(key);
      }
    });

    const newUrl = `${window.location.pathname}?${urlParams.toString()}${window.location.hash}`;
    window.history.replaceState({}, '', newUrl);
  }

  /**
   * Destroy the router and clean up
   */
  destroy() {
    // Remove event listeners
    window.removeEventListener('hashchange', this.handleRouteChange);
    window.removeEventListener('popstate', this.handleRouteChange);
    
    this.routes.clear();
    this.isInitialized = false;
  }
}

// Create singleton instance
export const router = new Router();