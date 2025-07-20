// =============================================================================
// MAP CONTROLLER MODULE
// =============================================================================

/**
 * Controls Mapbox GL JS integration
 * Manages map initialization, markers, popups, and interactions
 */
export class MapController {
  constructor() {
    this.map = null;
    this.markers = new Map();
    this.popup = null;
    this.isInitialized = false;
    this.defaultCenter = [-73.987, 40.748]; // Default to NYC
    this.defaultZoom = 10;
    
    // Map configuration
    this.config = {
      style: 'mapbox://styles/mapbox/streets-v11',
      container: 'map-container',
      center: this.defaultCenter,
      zoom: this.defaultZoom,
      accessToken: null
    };
  }

  /**
   * Initialize the map controller
   * @param {Object} options - Configuration options
   */
  async init(options = {}) {
    try {
      // Merge options with defaults
      this.config = { ...this.config, ...options };
      
      // Get Mapbox access token
      this.config.accessToken = this.getMapboxToken();
      
      if (!this.config.accessToken) {
        throw new Error('Mapbox access token is required');
      }

      // Wait for Mapbox GL to be available
      await this.waitForMapboxGL();
      
      // Initialize the map
      this.initializeMap();
      
      // Set up event listeners
      this.setupEventListeners();
      
      console.log('🗺️ Map Controller initialized');
      this.isInitialized = true;
      
    } catch (error) {
      console.error('❌ Failed to initialize map:', error);
      this.showMapError('Failed to load the map. Please check your internet connection and try again.');
      throw error;
    }
  }

  /**
   * Get Mapbox access token from various sources
   */
  getMapboxToken() {
    // Try different sources for the token
    return (
      window.MAPBOX_ACCESS_TOKEN ||
      process.env.MAPBOX_ACCESS_TOKEN ||
      this.config.accessToken ||
      'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV1czljODcwMDAwM3BxbzFxZjBiOGxwIn0.example' // Placeholder
    );
  }

  /**
   * Wait for Mapbox GL to be loaded
   */
  async waitForMapboxGL() {
    return new Promise((resolve, reject) => {
      // Check if Mapbox GL is already loaded
      if (window.mapboxgl) {
        resolve();
        return;
      }

      // Wait for it to load
      const checkInterval = setInterval(() => {
        if (window.mapboxgl) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('Mapbox GL JS failed to load'));
      }, 10000);
    });
  }

  /**
   * Initialize the Mapbox map
   */
  initializeMap() {
    // Set the access token
    window.mapboxgl.accessToken = this.config.accessToken;

    // Create the map
    this.map = new window.mapboxgl.Map({
      container: this.config.container,
      style: this.config.style,
      center: this.config.center,
      zoom: this.config.zoom,
      attributionControl: true
    });

    // Add navigation controls
    this.map.addControl(new window.mapboxgl.NavigationControl(), 'top-right');
    
    // Add fullscreen control
    this.map.addControl(new window.mapboxgl.FullscreenControl(), 'top-right');
  }

  /**
   * Set up event listeners for the map
   */
  setupEventListeners() {
    if (!this.map) return;

    // Map load event
    this.map.on('load', () => {
      console.log('🗺️ Map loaded successfully');
      this.onMapLoad();
    });

    // Map move events for state synchronization
    this.map.on('moveend', () => {
      this.syncMapState();
    });

    this.map.on('zoomend', () => {
      this.syncMapState();
    });

    // Click events
    this.map.on('click', (e) => {
      this.onMapClick(e);
    });
  }

  /**
   * Handle map load event
   */
  onMapLoad() {
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('mapLoaded', {
      detail: { mapController: this }
    }));
  }

  /**
   * Handle map click events
   */
  onMapClick(e) {
    // Close any open popups when clicking on empty space
    if (this.popup) {
      this.popup.remove();
      this.popup = null;
    }

    // Dispatch click event
    window.dispatchEvent(new CustomEvent('mapClick', {
      detail: { 
        coordinates: [e.lngLat.lng, e.lngLat.lat],
        originalEvent: e 
      }
    }));
  }

  /**
   * Sync map state with global state manager
   */
  syncMapState() {
    if (!this.map || !window.mapWidget?.setState) return;

    const center = this.map.getCenter();
    const zoom = this.map.getZoom();

    window.mapWidget.setState({
      mapCenter: [center.lng, center.lat],
      mapZoom: zoom
    });
  }

  /**
   * Add markers for locations
   * @param {Array} locations - Array of location objects
   */
  addMarkers(locations) {
    if (!this.map || !Array.isArray(locations)) return;

    // Clear existing markers
    this.clearMarkers();

    locations.forEach(location => {
      this.addMarker(location);
    });

    // Fit map to show all markers
    if (locations.length > 0) {
      this.fitToMarkers(locations);
    }
  }

  /**
   * Add a single marker
   * @param {Object} location - Location object
   */
  addMarker(location) {
    if (!this.map || !location.coordinates) return;

    const { longitude, latitude } = location.coordinates;
    
    if (!longitude || !latitude) {
      console.warn('⚠️ Invalid coordinates for location:', location.name);
      return;
    }

    // Create marker element
    const markerElement = this.createMarkerElement(location);
    
    // Create Mapbox marker
    const marker = new window.mapboxgl.Marker(markerElement)
      .setLngLat([longitude, latitude])
      .addTo(this.map);

    // Store marker reference
    this.markers.set(location.id, {
      marker,
      location,
      element: markerElement
    });

    // Add click handler
    markerElement.addEventListener('click', (e) => {
      e.stopPropagation();
      this.onMarkerClick(location);
    });
  }

  /**
   * Create marker DOM element
   * @param {Object} location - Location object
   */
  createMarkerElement(location) {
    const element = document.createElement('div');
    element.className = 'map-marker';
    element.setAttribute('data-location-id', location.id);
    element.setAttribute('data-location-type', location.type);
    
    // Add icon or default styling
    if (location.assets?.iconUrl) {
      element.innerHTML = `<img src="${location.assets.iconUrl}" alt="${location.name}" class="marker-icon">`;
    } else {
      // Default marker styling
      element.innerHTML = `<div class="marker-default ${location.type.toLowerCase()}"></div>`;
    }

    return element;
  }

  /**
   * Handle marker click events
   * @param {Object} location - Location object
   */
  onMarkerClick(location) {
    // Update active location in state
    if (window.mapWidget?.setState) {
      window.mapWidget.setState({ activeLocationId: location.id });
    }

    // Show popup
    this.showLocationPopup(location);

    // Center map on location
    this.centerOnLocation(location);

    // Dispatch marker click event
    window.dispatchEvent(new CustomEvent('markerClick', {
      detail: { location }
    }));
  }

  /**
   * Show popup for a location
   * @param {Object} location - Location object
   */
  showLocationPopup(location) {
    if (!this.map || !location.coordinates) return;

    // Remove existing popup
    if (this.popup) {
      this.popup.remove();
    }

    // Get popup template
    const popupContent = this.createPopupContent(location);

    // Create popup
    this.popup = new window.mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      maxWidth: '300px'
    })
      .setLngLat([location.coordinates.longitude, location.coordinates.latitude])
      .setHTML(popupContent)
      .addTo(this.map);

    // Add popup event listeners
    this.setupPopupEventListeners(location);
  }

  /**
   * Create popup content HTML
   * @param {Object} location - Location object
   */
  createPopupContent(location) {
    const template = document.getElementById('widget-templates')?.querySelector('[data-template="popup"]');
    
    if (template) {
      // Use template if available
      const clone = template.cloneNode(true);
      clone.removeAttribute('data-template');
      
      // Populate template with data
      this.populateTemplate(clone, location);
      
      return clone.outerHTML;
    } else {
      // Fallback HTML
      return `
        <div class="map-popup">
          <h3>${location.name}</h3>
          <p class="location-type">${location.type}</p>
          ${location.locationDetails?.city ? `<p class="location-city">${location.locationDetails.city}</p>` : ''}
          ${location.assets?.imageUrl ? `<img src="${location.assets.imageUrl}" alt="${location.name}" class="popup-image">` : ''}
          <button class="popup-details-btn" data-location-id="${location.id}">View Details</button>
        </div>
      `;
    }
  }

  /**
   * Populate template with location data
   * @param {Element} template - Template element
   * @param {Object} location - Location object
   */
  populateTemplate(template, location) {
    // Populate named elements
    const nameElement = template.querySelector('[data-element="name"]');
    if (nameElement) nameElement.textContent = location.name;

    const cityElement = template.querySelector('[data-element="city"]');
    if (cityElement) cityElement.textContent = location.locationDetails?.city || '';

    const typeElement = template.querySelector('[data-element="type"]');
    if (typeElement) typeElement.textContent = location.type;

    // Add location ID for event handling
    template.setAttribute('data-location-id', location.id);
  }

  /**
   * Set up popup event listeners
   * @param {Object} location - Location object
   */
  setupPopupEventListeners(location) {
    if (!this.popup) return;

    // Wait for popup to be added to DOM
    setTimeout(() => {
      const popupElement = document.querySelector('.mapboxgl-popup-content');
      if (!popupElement) return;

      // Details button click
      const detailsBtn = popupElement.querySelector('.popup-details-btn');
      if (detailsBtn) {
        detailsBtn.addEventListener('click', () => {
          this.onPopupDetailsClick(location);
        });
      }
    }, 100);
  }

  /**
   * Handle popup details button click
   * @param {Object} location - Location object
   */
  onPopupDetailsClick(location) {
    // Navigate to location details
    if (window.mapWidget?.router) {
      window.mapWidget.router.navigateTo(`/locations/${location.slug}`);
    }

    // Dispatch event
    window.dispatchEvent(new CustomEvent('locationDetailsRequest', {
      detail: { location }
    }));
  }

  /**
   * Center map on a location
   * @param {Object} location - Location object
   */
  centerOnLocation(location) {
    if (!this.map || !location.coordinates) return;

    this.map.flyTo({
      center: [location.coordinates.longitude, location.coordinates.latitude],
      zoom: Math.max(this.map.getZoom(), 12), // Zoom in if needed
      duration: 1000
    });
  }

  /**
   * Fit map bounds to show all markers
   * @param {Array} locations - Array of locations
   */
  fitToMarkers(locations) {
    if (!this.map || !locations.length) return;

    const validLocations = locations.filter(loc => 
      loc.coordinates && loc.coordinates.longitude && loc.coordinates.latitude
    );

    if (validLocations.length === 0) return;

    if (validLocations.length === 1) {
      // Single location - center on it
      this.centerOnLocation(validLocations[0]);
      return;
    }

    // Multiple locations - fit bounds
    const bounds = new window.mapboxgl.LngLatBounds();
    
    validLocations.forEach(location => {
      bounds.extend([location.coordinates.longitude, location.coordinates.latitude]);
    });

    this.map.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15,
      duration: 1000
    });
  }

  /**
   * Clear all markers from the map
   */
  clearMarkers() {
    this.markers.forEach(({ marker }) => {
      marker.remove();
    });
    this.markers.clear();
  }

  /**
   * Update marker visibility based on filtered locations
   * @param {Array} filteredLocations - Array of filtered locations
   */
  updateMarkerVisibility(filteredLocations) {
    const filteredIds = new Set(filteredLocations.map(loc => loc.id));

    this.markers.forEach(({ marker, element }, locationId) => {
      const shouldShow = filteredIds.has(locationId);
      element.style.display = shouldShow ? 'block' : 'none';
    });
  }

  /**
   * Highlight a specific marker
   * @param {string} locationId - Location ID to highlight
   */
  highlightMarker(locationId) {
    // Remove existing highlights
    this.markers.forEach(({ element }) => {
      element.classList.remove('highlighted');
    });

    // Add highlight to specified marker
    const markerData = this.markers.get(locationId);
    if (markerData) {
      markerData.element.classList.add('highlighted');
    }
  }

  /**
   * Show error message on map
   * @param {string} message - Error message
   */
  showMapError(message) {
    const container = document.getElementById(this.config.container);
    if (container) {
      container.innerHTML = `
        <div class="map-error">
          <div class="error-content">
            <h3>Map Error</h3>
            <p>${message}</p>
            <button onclick="location.reload()" class="retry-btn">Retry</button>
          </div>
        </div>
      `;
    }
  }

  /**
   * Resize map (useful for responsive layouts)
   */
  resize() {
    if (this.map) {
      this.map.resize();
    }
  }

  /**
   * Get current map bounds
   */
  getBounds() {
    return this.map ? this.map.getBounds() : null;
  }

  /**
   * Get current map center
   */
  getCenter() {
    return this.map ? this.map.getCenter() : null;
  }

  /**
   * Get current map zoom
   */
  getZoom() {
    return this.map ? this.map.getZoom() : null;
  }

  /**
   * Destroy the map and clean up
   */
  destroy() {
    if (this.popup) {
      this.popup.remove();
    }
    
    this.clearMarkers();
    
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    
    this.isInitialized = false;
  }
}

// Create singleton instance
export const mapController = new MapController();