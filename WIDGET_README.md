# Webflow Map Widget

A self-contained JavaScript widget for integrating interactive Mapbox maps with Webflow CMS data. The widget fetches location data from your Vercel API, displays it on an interactive map, and provides filtering and search capabilities.

## Features

- 🗺️ **Interactive Mapbox Map** - Full-featured map with zoom, pan, and marker interactions
- 📍 **Dynamic Markers** - Location markers with popups and custom icons
- 🔍 **Advanced Filtering** - Filter by type, region, city, and search text
- 🎨 **Template-Based UI** - Customizable HTML templates for popups and list items
- 🧭 **Hash-Based Routing** - Deep linking to specific locations and views
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🔄 **State Management** - Centralized state with event-driven updates
- ⚡ **Performance Optimized** - Caching, lazy loading, and efficient rendering

## Architecture

The widget follows a modular architecture with the following components:

- **State Manager** - Centralized state management with event notifications
- **API Client** - Data fetching with caching and normalization
- **Map Controller** - Mapbox GL JS integration and marker management
- **UI Binder** - DOM manipulation and template binding
- **Router** - Hash-based routing for deep linking

## Installation & Setup

### 1. Build the Widget

```bash
# Install dependencies
npm install

# Build for production
NODE_ENV=production npm run build

# Build for development (with sourcemaps)
npm run build:dev

# Development mode with watch
npm run dev
```

### 2. Deploy to Vercel

The built widget files will be in the `dist/` directory. Deploy these along with your API endpoints to Vercel.

### 3. Integration with Webflow

#### Method 1: Auto-initialization

Add the required DOM structure and the widget will auto-initialize:

```html
<!-- In Webflow Custom Code (Head) -->
<script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>
<link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet">

<!-- In Webflow Custom Code (Footer) -->
<script src="https://your-project-name.vercel.app/widget.js" defer></script>
```

#### Method 2: Manual initialization

```javascript
const widget = new MapWidget();
widget.init({
  mapboxToken: 'YOUR_MAPBOX_TOKEN',
  containerId: 'map-widget',
  mapContainerId: 'map-container',
  locationsListId: 'locations-list'
});
```

## Required DOM Structure

### Basic Structure

```html
<!-- Main widget container -->
<div id="map-widget" data-widget="map-widget" data-mapbox-token="YOUR_MAPBOX_TOKEN">
  
  <!-- Map container -->
  <div id="map-container"></div>
  
  <!-- Locations list container -->
  <div id="locations-list"></div>
  
</div>
```

### Complete Structure with Filters

```html
<div id="map-widget" data-widget="map-widget">
  
  <!-- Sidebar with filters and list -->
  <div id="locations-sidebar">
    
    <!-- Filters Section -->
    <div class="filters-section">
      <input type="text" id="search-input" placeholder="Search locations...">
      
      <select id="type-filter">
        <option value="all">All Types</option>
      </select>
      
      <select id="region-filter">
        <option value="all">All Regions</option>
      </select>
      
      <select id="city-filter">
        <option value="all">All Cities</option>
      </select>
      
      <button id="clear-filters">Clear Filters</button>
    </div>
    
    <!-- Locations List -->
    <div id="locations-list"></div>
    
  </div>
  
  <!-- Map Container -->
  <div id="map-container"></div>
  
</div>
```

### Templates (Optional)

Add hidden templates for customized rendering:

```html
<div id="widget-templates" style="display: none;">
  
  <!-- Popup Template -->
  <div class="popup" data-template="popup">
    <h3 data-element="name">Location Name</h3>
    <p data-element="city">City</p>
    <button class="popup-details-btn">View Details</button>
  </div>
  
  <!-- Location List Item Template -->
  <div class="location-item" data-template="location-item">
    <div class="location-content">
      <h3 data-element="name">Location Name</h3>
      <p data-element="type">Type</p>
      <p data-element="city">City</p>
      <img data-element="image" alt="">
      <button data-action="view-on-map">View on Map</button>
    </div>
  </div>
  
</div>
```

## Configuration Options

### Data Attributes

Configure the widget using data attributes on the main container:

```html
<div id="map-widget" 
     data-widget="map-widget"
     data-mapbox-token="YOUR_MAPBOX_TOKEN"
     data-api-base-url="https://your-api.vercel.app"
     data-container-id="map-widget"
     data-map-container-id="map-container"
     data-locations-list-id="locations-list">
</div>
```

### JavaScript Configuration

```javascript
const widget = new MapWidget();
await widget.init({
  mapboxToken: 'YOUR_MAPBOX_TOKEN',
  apiBaseUrl: 'https://your-api.vercel.app',
  containerId: 'map-widget',
  mapContainerId: 'map-container',
  locationsListId: 'locations-list'
});
```

## API Requirements

The widget expects your API to provide location data in this format:

```javascript
[
  {
    "id": "unique-id",
    "slug": "location-slug",
    "name": "Location Name",
    "type": "Beach", // or "POI"
    "coordinates": {
      "longitude": -73.987,
      "latitude": 40.748
    },
    "locationDetails": {
      "city": "City Name",
      "region": "Region Name",
      "island": "Island Name",
      "country": "Country Name"
    },
    "assets": {
      "imageUrl": "https://example.com/image.jpg",
      "iconUrl": "https://example.com/icon.png"
    }
  }
]
```

## CSS Styling

### Essential CSS Classes

```css
/* Widget container */
#map-widget {
  width: 100%;
  height: 100vh;
  display: flex;
}

/* Map container */
#map-container {
  flex: 1;
  min-height: 400px;
}

/* Location items */
.location-item {
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 15px;
  cursor: pointer;
}

.location-item.active {
  border-color: #007bff;
}

/* Map markers */
.map-marker {
  cursor: pointer;
}

.marker-default {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
}

.marker-default.beach {
  background: #17a2b8;
}

.marker-default.poi {
  background: #28a745;
}

/* Loading states */
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}
```

## Events

The widget dispatches custom events that you can listen for:

### Widget Events

```javascript
// Widget initialization
window.addEventListener('mapWidgetInitialized', (event) => {
  console.log('Widget ready:', event.detail.widget);
});

// State changes
window.addEventListener('mapStateChange', (event) => {
  console.log('State changed:', event.detail.newState);
});

// Location selection
window.addEventListener('locationSelected', (event) => {
  console.log('Location selected:', event.detail.location);
});

// Route changes
window.addEventListener('routeChange', (event) => {
  console.log('Route changed:', event.detail.path);
});
```

### Map Events

```javascript
// Map loaded
window.addEventListener('mapLoaded', (event) => {
  console.log('Map ready:', event.detail.mapController);
});

// Marker clicked
window.addEventListener('markerClick', (event) => {
  console.log('Marker clicked:', event.detail.location);
});
```

## Routing

The widget supports hash-based routing for deep linking:

- `/` - Main map view
- `/locations/:slug` - Specific location detail
- `/list` - List view
- `/filter/:type` - Filtered view
- `/search/:query` - Search results

### Navigation

```javascript
// Programmatic navigation
window.mapWidget.router.navigateTo('/locations/sunset-beach');

// Generate URLs
const locationUrl = window.mapWidget.router.buildLocationUrl(location);
const filterUrl = window.mapWidget.router.buildFilterUrl('Beach');
```

## State Management

Access and modify the widget state:

```javascript
// Get current state
const state = window.mapWidget.getState();

// Update state
window.mapWidget.setState({
  activeLocationId: 'some-location-id'
});

// Listen for state changes
window.mapWidget.subscribe((newState, prevState) => {
  console.log('State updated:', newState);
});
```

## API Methods

### Widget Methods

```javascript
const widget = window.mapWidget.widget;

// Refresh data
await widget.refresh();

// Get status
const status = widget.getStatus();

// Destroy widget
widget.destroy();
```

### Map Methods

```javascript
const mapController = window.mapWidget.mapController;

// Center on location
mapController.centerOnLocation(location);

// Add markers
mapController.addMarkers(locations);

// Show popup
mapController.showLocationPopup(location);

// Fit bounds to show all markers
mapController.fitToMarkers(locations);
```

## Customization

### Custom Templates

Create custom templates using data attributes:

```html
<div data-template="my-popup">
  <div class="custom-popup">
    <h2 data-element="name"></h2>
    <p data-element="city"></p>
    <img data-element="image" class="popup-image">
    <a data-element="link" class="details-link">Learn More</a>
  </div>
</div>
```

### Custom Markers

Override marker creation:

```javascript
// Custom marker element creation
const originalCreateMarker = window.mapWidget.mapController.createMarkerElement;
window.mapWidget.mapController.createMarkerElement = function(location) {
  const element = originalCreateMarker.call(this, location);
  element.classList.add('my-custom-marker');
  return element;
};
```

## Troubleshooting

### Common Issues

1. **Map not loading**
   - Check Mapbox token is valid
   - Ensure Mapbox GL JS is loaded before widget
   - Verify container element exists

2. **No location data**
   - Check API endpoints are accessible
   - Verify CORS headers are configured
   - Check browser console for API errors

3. **Styling issues**
   - Ensure required CSS classes are defined
   - Check for CSS conflicts with Webflow styles
   - Verify responsive design breakpoints

### Debug Mode

Enable verbose logging:

```javascript
// Enable debug mode
window.mapWidget.debug = true;
```

### Performance Tips

- Use image optimization for location photos
- Implement lazy loading for large datasets
- Consider marker clustering for dense areas
- Cache API responses appropriately

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- Mapbox GL JS 2.15.0+
- Modern browser with ES6 support

## License

MIT License - see LICENSE file for details.