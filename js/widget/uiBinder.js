// =============================================================================
// UI BINDER MODULE
// =============================================================================

/**
 * Binds data to DOM elements and manages UI updates
 * Handles templates, lists, and dynamic content
 */
export class UIBinder {
  constructor() {
    this.templates = new Map();
    this.boundElements = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialize the UI binder
   */
  init() {
    // Cache templates
    this.cacheTemplates();
    
    // Set up mutation observer for dynamic content
    this.setupMutationObserver();
    
    console.log('🎨 UI Binder initialized');
    this.isInitialized = true;
  }

  /**
   * Cache all available templates
   */
  cacheTemplates() {
    const templateContainer = document.getElementById('widget-templates');
    if (!templateContainer) {
      console.warn('⚠️ No template container found with id "widget-templates"');
      return;
    }

    const templates = templateContainer.querySelectorAll('[data-template]');
    templates.forEach(template => {
      const templateName = template.getAttribute('data-template');
      this.templates.set(templateName, template.cloneNode(true));
      console.log(`📄 Cached template: ${templateName}`);
    });
  }

  /**
   * Set up mutation observer to handle dynamic DOM changes
   */
  setupMutationObserver() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.bindNewElement(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Bind data to newly added DOM elements
   * @param {Element} element - DOM element to bind
   */
  bindNewElement(element) {
    // Check if element has binding attributes
    const bindingAttributes = [
      'data-bind-text',
      'data-bind-html',
      'data-bind-src',
      'data-bind-href',
      'data-bind-class',
      'data-bind-style'
    ];

    const hasBinding = bindingAttributes.some(attr => 
      element.hasAttribute(attr) || element.querySelector(`[${attr}]`)
    );

    if (hasBinding && window.mapWidget?.state) {
      this.bindElement(element, window.mapWidget.state);
    }
  }

  /**
   * Update locations list in the DOM
   * @param {Array} locations - Array of location objects
   * @param {string} containerId - Container element ID
   */
  updateLocationsList(locations, containerId = 'locations-list') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`⚠️ Container not found: ${containerId}`);
      return;
    }

    // Clear existing content
    container.innerHTML = '';

    if (!locations || locations.length === 0) {
      container.innerHTML = '<div class="no-locations">No locations found.</div>';
      return;
    }

    // Create location items
    locations.forEach(location => {
      const locationElement = this.createLocationListItem(location);
      if (locationElement) {
        container.appendChild(locationElement);
      }
    });

    console.log(`📋 Updated locations list with ${locations.length} items`);
  }

  /**
   * Create a location list item element
   * @param {Object} location - Location object
   */
  createLocationListItem(location) {
    // Try to use template first
    const template = this.getTemplate('location-item') || this.getTemplate('list-item');
    
    if (template) {
      const element = template.cloneNode(true);
      element.removeAttribute('data-template');
      element.setAttribute('data-location-id', location.id);
      element.setAttribute('data-location-type', location.type);
      
      // Populate template with location data
      this.populateLocationTemplate(element, location);
      
      // Add click handler
      element.addEventListener('click', () => {
        this.onLocationItemClick(location);
      });
      
      return element;
    } else {
      // Fallback: create simple list item
      return this.createFallbackLocationItem(location);
    }
  }

  /**
   * Create fallback location item when no template is available
   * @param {Object} location - Location object
   */
  createFallbackLocationItem(location) {
    const element = document.createElement('div');
    element.className = 'location-item';
    element.setAttribute('data-location-id', location.id);
    element.setAttribute('data-location-type', location.type);
    
    element.innerHTML = `
      <div class="location-content">
        ${location.assets?.imageUrl ? 
          `<div class="location-image">
            <img src="${location.assets.imageUrl}" alt="${location.name}" loading="lazy">
          </div>` : 
          `<div class="location-icon ${location.type.toLowerCase()}"></div>`
        }
        <div class="location-info">
          <h3 class="location-name">${location.name}</h3>
          <p class="location-type">${location.type}</p>
          ${location.locationDetails?.city ? 
            `<p class="location-city">${location.locationDetails.city}</p>` : ''
          }
          ${location.locationDetails?.region ? 
            `<p class="location-region">${location.locationDetails.region}</p>` : ''
          }
        </div>
        <div class="location-actions">
          <button class="view-on-map-btn" data-action="view-on-map">View on Map</button>
        </div>
      </div>
    `;

    // Add event listeners
    element.addEventListener('click', () => {
      this.onLocationItemClick(location);
    });

    const viewOnMapBtn = element.querySelector('.view-on-map-btn');
    if (viewOnMapBtn) {
      viewOnMapBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onViewOnMapClick(location);
      });
    }

    return element;
  }

  /**
   * Populate location template with data
   * @param {Element} template - Template element
   * @param {Object} location - Location data
   */
  populateLocationTemplate(template, location) {
    // Populate text content
    this.populateTextElements(template, {
      name: location.name,
      type: location.type,
      city: location.locationDetails?.city,
      region: location.locationDetails?.region,
      island: location.locationDetails?.island,
      country: location.locationDetails?.country
    });

    // Populate image elements
    if (location.assets?.imageUrl) {
      const imageElements = template.querySelectorAll('[data-element="image"], [data-element="photo"]');
      imageElements.forEach(img => {
        img.src = location.assets.imageUrl;
        img.alt = location.name;
      });
    }

    // Populate links
    const linkElements = template.querySelectorAll('[data-element="link"]');
    linkElements.forEach(link => {
      link.href = `#/locations/${location.slug}`;
    });

    // Set data attributes
    template.setAttribute('data-location-id', location.id);
    template.setAttribute('data-location-type', location.type);
  }

  /**
   * Populate text elements using data-element attributes
   * @param {Element} container - Container element
   * @param {Object} data - Data object
   */
  populateTextElements(container, data) {
    Object.keys(data).forEach(key => {
      const elements = container.querySelectorAll(`[data-element="${key}"]`);
      elements.forEach(element => {
        const value = data[key];
        if (value !== undefined && value !== null) {
          element.textContent = value;
          element.style.display = '';
        } else {
          element.style.display = 'none';
        }
      });
    });
  }

  /**
   * Handle location item click
   * @param {Object} location - Location object
   */
  onLocationItemClick(location) {
    // Update active location
    if (window.mapWidget?.setState) {
      window.mapWidget.setState({ activeLocationId: location.id });
    }

    // Highlight in list
    this.highlightLocationItem(location.id);

    // Center map on location
    if (window.mapWidget?.mapController) {
      window.mapWidget.mapController.centerOnLocation(location);
      window.mapWidget.mapController.highlightMarker(location.id);
    }

    // Dispatch event
    window.dispatchEvent(new CustomEvent('locationSelected', {
      detail: { location }
    }));
  }

  /**
   * Handle "View on Map" button click
   * @param {Object} location - Location object
   */
  onViewOnMapClick(location) {
    // Center map and show popup
    if (window.mapWidget?.mapController) {
      window.mapWidget.mapController.centerOnLocation(location);
      window.mapWidget.mapController.showLocationPopup(location);
    }

    // Dispatch event
    window.dispatchEvent(new CustomEvent('viewOnMapRequested', {
      detail: { location }
    }));
  }

  /**
   * Highlight a location item in the list
   * @param {string} locationId - Location ID to highlight
   */
  highlightLocationItem(locationId) {
    // Remove existing highlights
    document.querySelectorAll('.location-item.active').forEach(item => {
      item.classList.remove('active');
    });

    // Add highlight to specified item
    const item = document.querySelector(`[data-location-id="${locationId}"]`);
    if (item) {
      item.classList.add('active');
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Update loading state in UI
   * @param {boolean} isLoading - Loading state
   * @param {string} containerId - Container to update
   */
  updateLoadingState(isLoading, containerId = 'map-widget') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (isLoading) {
      this.showLoadingSpinner(container);
    } else {
      this.hideLoadingSpinner(container);
    }
  }

  /**
   * Show loading spinner
   * @param {Element} container - Container element
   */
  showLoadingSpinner(container) {
    // Remove existing spinner
    const existingSpinner = container.querySelector('.loading-spinner');
    if (existingSpinner) {
      existingSpinner.remove();
    }

    // Create spinner
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = `
      <div class="spinner-content">
        <div class="spinner-icon"></div>
        <p>Loading locations...</p>
      </div>
    `;

    container.appendChild(spinner);
  }

  /**
   * Hide loading spinner
   * @param {Element} container - Container element
   */
  hideLoadingSpinner(container) {
    const spinner = container.querySelector('.loading-spinner');
    if (spinner) {
      spinner.remove();
    }
  }

  /**
   * Update error state in UI
   * @param {string|null} error - Error message or null to clear
   * @param {string} containerId - Container to update
   */
  updateErrorState(error, containerId = 'map-widget') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Remove existing error
    const existingError = container.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    if (error) {
      // Create error message
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.innerHTML = `
        <div class="error-content">
          <h3>Error</h3>
          <p>${error}</p>
          <button class="retry-btn" onclick="location.reload()">Retry</button>
        </div>
      `;

      container.appendChild(errorElement);
    }
  }

  /**
   * Bind data to an element using data attributes
   * @param {Element} element - Element to bind
   * @param {Object} data - Data to bind
   */
  bindElement(element, data) {
    // Text binding
    const textBindings = element.querySelectorAll('[data-bind-text]');
    textBindings.forEach(el => {
      const path = el.getAttribute('data-bind-text');
      const value = this.getNestedValue(data, path);
      if (value !== undefined) {
        el.textContent = value;
      }
    });

    // HTML binding
    const htmlBindings = element.querySelectorAll('[data-bind-html]');
    htmlBindings.forEach(el => {
      const path = el.getAttribute('data-bind-html');
      const value = this.getNestedValue(data, path);
      if (value !== undefined) {
        el.innerHTML = value;
      }
    });

    // Source binding (for images)
    const srcBindings = element.querySelectorAll('[data-bind-src]');
    srcBindings.forEach(el => {
      const path = el.getAttribute('data-bind-src');
      const value = this.getNestedValue(data, path);
      if (value !== undefined) {
        el.src = value;
      }
    });

    // Href binding (for links)
    const hrefBindings = element.querySelectorAll('[data-bind-href]');
    hrefBindings.forEach(el => {
      const path = el.getAttribute('data-bind-href');
      const value = this.getNestedValue(data, path);
      if (value !== undefined) {
        el.href = value;
      }
    });
  }

  /**
   * Get nested value from object using dot notation
   * @param {Object} obj - Source object
   * @param {string} path - Dot-separated path
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * Get cached template
   * @param {string} templateName - Template name
   */
  getTemplate(templateName) {
    return this.templates.get(templateName);
  }

  /**
   * Register a new template
   * @param {string} name - Template name
   * @param {Element} template - Template element
   */
  registerTemplate(name, template) {
    this.templates.set(name, template.cloneNode(true));
  }

  /**
   * Update filters UI
   * @param {Object} filters - Current filters
   * @param {Array} locations - All locations for filter options
   */
  updateFiltersUI(filters, locations) {
    // Update type filter
    this.updateFilterSelect('type-filter', filters.type, 
      this.getUniqueValues(locations, 'type'));

    // Update region filter
    this.updateFilterSelect('region-filter', filters.region, 
      this.getUniqueValues(locations, 'locationDetails.region'));

    // Update city filter
    this.updateFilterSelect('city-filter', filters.city, 
      this.getUniqueValues(locations, 'locationDetails.city'));

    // Update search input
    const searchInput = document.getElementById('search-input');
    if (searchInput && filters.search !== undefined) {
      searchInput.value = filters.search;
    }
  }

  /**
   * Update a filter select element
   * @param {string} selectId - Select element ID
   * @param {string} currentValue - Current filter value
   * @param {Array} options - Available options
   */
  updateFilterSelect(selectId, currentValue, options) {
    const select = document.getElementById(selectId);
    if (!select) return;

    // Clear existing options except "All"
    const firstOption = select.querySelector('option[value="all"]');
    select.innerHTML = '';
    
    if (firstOption) {
      select.appendChild(firstOption);
    } else {
      const allOption = document.createElement('option');
      allOption.value = 'all';
      allOption.textContent = 'All';
      select.appendChild(allOption);
    }

    // Add options
    options.forEach(option => {
      if (option) {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
      }
    });

    // Set current value
    select.value = currentValue || 'all';
  }

  /**
   * Get unique values from locations array
   * @param {Array} locations - Locations array
   * @param {string} path - Property path
   */
  getUniqueValues(locations, path) {
    const values = locations.map(location => 
      this.getNestedValue(location, path)
    ).filter(value => value !== undefined && value !== null);

    return [...new Set(values)].sort();
  }

  /**
   * Show/hide elements based on state
   * @param {Object} state - Current state
   */
  updateVisibility(state) {
    // Show/hide loading elements
    const loadingElements = document.querySelectorAll('[data-show-when="loading"]');
    loadingElements.forEach(el => {
      el.style.display = state.isLoading ? '' : 'none';
    });

    // Show/hide error elements
    const errorElements = document.querySelectorAll('[data-show-when="error"]');
    errorElements.forEach(el => {
      el.style.display = state.error ? '' : 'none';
    });

    // Show/hide content elements
    const contentElements = document.querySelectorAll('[data-show-when="loaded"]');
    contentElements.forEach(el => {
      el.style.display = (!state.isLoading && !state.error) ? '' : 'none';
    });
  }
}

// Create singleton instance
export const uiBinder = new UIBinder();