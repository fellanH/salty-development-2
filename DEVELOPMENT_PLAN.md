# Salty Development Plan - Sprint 3 & Sprint 4

## Overview
This development plan addresses critical requirements for Sprint 3 to prepare Salty for tourism board demos and business advertising capabilities, followed by Sprint 4 improvements.

---

## 🚨 SPRINT 3 - CRITICAL ITEMS (Current Priority)

### 1. MAP MARKER & ICONS 🎯

#### 1.1 Enable POI Marker Clickability in Dev
**Status:** HIGH PRIORITY  
**Estimated Effort:** 2-4 hours  
**File:** `js/mapController.js`

**Issue:** POI markers are not clickable in development environment, preventing testing of huntington-city-beach-lifeguard-tower-1 test content.

**Technical Investigation Required:**
- Check if `salty-pois` layer is properly included in `interactiveLayers` array
- Verify Mapbox Studio style configuration for POI layer visibility
- Test click event handlers for POI layer specifically

**Implementation Steps:**
1. Debug click handlers in `MapController.setupEventHandlers()`
2. Verify POI layer ID matches Mapbox Studio configuration
3. Test with huntington-city-beach-lifeguard-tower-1 specifically
4. Ensure proper action flow: `selectPOIFromMap` → `SHOW_POPUP` → `SHOW_SIDEBAR`

**Acceptance Criteria:**
- [x] POI markers are clickable in dev environment
- [x] Clicking huntington-city-beach-lifeguard-tower-1 shows popup with test content
- [x] POI detail view displays correctly

---

#### 1.2 Implement Universal Category-Based Icons
**Status:** MEDIUM PRIORITY  
**Estimated Effort:** 8-12 hours  
**Files:** `api/pois.js`, `js/mapController.js`, Mapbox Studio style

**Issue:** Currently requires manual icon assignment per POI. Need universal icons applied to entire categories.

**Current Implementation Analysis:**
- POI API already supports `categoryMap` and `iconMap` dynamic mapping
- Categories are transformed in `transformPOIs()` function
- Custom icons are mapped via `customIconName` field

**Implementation Plan:**
1. **API Enhancement** (`api/pois.js`):
   ```javascript
   // Add category-to-icon mapping logic
   const getCategoryIcon = (categoryName) => {
     const categoryIconMap = {
       'Safety & Emergency': 'lifeguard-tower',
       'Information & Services': 'info-center', 
       'Recreation & Sports': 'recreation',
       'Food & Dining': 'restaurant',
       'Lodging': 'hotel',
       'Shopping': 'shopping'
     };
     return categoryIconMap[categoryName] || 'default-poi';
   };
   ```

2. **Mapbox Studio Configuration**:
   - Define icon expressions based on category field
   - Create sprite sheet with standardized category icons
   - Update layer styling to use category-based icons

3. **Fallback Logic**:
   - Use custom icon if specified
   - Fall back to category icon
   - Default to generic POI icon

**Acceptance Criteria:**
- [x] POIs automatically inherit icons based on category
- [x] Manual icon override still works when specified
- [x] All major categories have appropriate icons
- [x] New POIs automatically get correct category icon

---

### 2. POPUP CONTENT ENHANCEMENTS 🎯

#### 2.1 Add Button Support to Popups
**Status:** HIGH PRIORITY  
**Estimated Effort:** 4-6 hours  
**File:** `js/mapController.js`

**Current State Analysis:**
- Popup HTML is hardcoded in `showPopup()` method
- "See Details" button exists but limited functionality
- Need support for both beaches and POIs

**Implementation Plan:**
1. **Enhanced Popup Template System**:
   ```javascript
   const generatePopupHTML = (feature, details, entityType) => {
     const buttons = [];
     
     if (entityType === 'beach') {
       buttons.push({
         text: 'View Beach Details',
         action: 'selectBeachFromPopup',
         style: 'primary'
       });
       
       if (details['beach-website']) {
         buttons.push({
           text: 'Visit Website', 
           action: 'openWebsite',
           url: details['beach-website'],
           style: 'secondary'
         });
       }
     }
     
     if (entityType === 'poi') {
       buttons.push({
         text: 'POI Details',
         action: 'selectPOIFromPopup', 
         style: 'primary'
       });
     }
     
     return renderPopupTemplate(details, buttons);
   };
   ```

2. **Button Event Handling**:
   - Extend popup click listeners for multiple buttons
   - Add support for external links (new window)
   - Integrate with ActionController for consistent behavior

**Acceptance Criteria:**
- [x] Popups support multiple buttons
- [x] Beach popups have "View Details" and "Visit Website" buttons
- [x] POI popups have appropriate action buttons
- [x] Buttons integrate with existing action system
- [x] External links open in new window

---

#### 2.2 Move Paid Partners Toggle to POI Field
**Status:** MEDIUM PRIORITY  
**Estimated Effort:** 2-3 hours  
**Files:** `js/mapController.js`, `js/views/DetailView.js`

**Issue:** Paid partners toggle currently appears for beaches, should be POI-specific field.

**Implementation Steps:**
1. Remove `isPaidPartner` logic from beach popup template
2. Add `paid-partner` field handling to POI popup template  
3. Update DetailView POI data mapping to include paid partner status
4. Verify Webflow CMS field configuration for POIs

**Acceptance Criteria:**
- [x] Paid partner badge removed from beach popups
- [x] Paid partner badge shows for POIs when applicable
- [x] POI detail view displays paid partner status

---

#### 2.3 Multi-Image Carousel Support
**Status:** MEDIUM PRIORITY  
**Estimated Effort:** 6-8 hours  
**Files:** `js/mapController.js`, `js/views/DetailView.js`, `api/pois.js`, `api/beaches.js`

**Implementation Plan:**
1. **API Enhancement**: Support multiple image fields in data transformation
2. **Popup Carousel**: Implement image carousel in popup HTML
3. **Detail View Carousel**: Add carousel to detail sidebar
4. **UI Components**: Create reusable carousel component

**Technical Considerations:**
- Ensure mobile-responsive carousel behavior
- Add touch/swipe support for mobile
- Fallback to single image if only one available
- Loading states for images

**Acceptance Criteria:**
- [x] Popups display image carousel when multiple images available
- [x] Detail view supports image carousel
- [x] Mobile-optimized touch controls
- [x] Graceful fallback for single images

---

#### 2.4 Implement Hover-to-Open Behavior
**Status:** HIGH PRIORITY  
**Estimated Effort:** 4-6 hours  
**File:** `js/mapController.js`

**Current Behavior:** Popups only open on click  
**Required Behavior:** Open on hover, close when not hovered or different area clicked

**Implementation Plan:**
1. **Event Handler Updates**:
   ```javascript
   // Add hover events to map layers
   map.on('mouseenter', interactiveLayers, showPopupOnHover);
   map.on('mouseleave', interactiveLayers, hidePopupOnLeave);
   
   // Popup hover persistence
   popup.on('mouseenter', maintainPopup);
   popup.on('mouseleave', closePopup);
   ```

2. **Hover Delay Management**:
   - Add 200ms delay before showing popup on hover
   - Cancel hover popup if mouse leaves quickly
   - Maintain popup when hovering over popup content

3. **Click Behavior Preservation**:
   - Keep click-to-open functionality
   - Click should persist popup (not close on mouse leave)
   - Add visual indicator for persistent vs hover popups

**Acceptance Criteria:**
- [x] Popups open on mouse hover with appropriate delay
- [x] Popups close when mouse leaves marker and popup area
- [x] Click behavior opens persistent popup
- [x] Behavior matches Yelp/Google Maps user experience
- [x] Close (X) button removed as no longer needed

---

#### 2.5 Text Color Customization
**Status:** LOW PRIORITY  
**Estimated Effort:** 2-3 hours  
**File:** `js/mapController.js`

**Requirement:** Ability to customize text color, especially grey text for secondary content

**Implementation:**
1. **CSS Class System**: Create semantic classes for primary/secondary text
2. **Popup Template Updates**: Apply appropriate classes to different content types
3. **Theme Integration**: Ensure colors work with overall design system

**CSS Classes:**
```css
.popup-text-primary { color: #333; font-weight: 500; }
.popup-text-secondary { color: #666; font-weight: 400; }
.popup-text-tertiary { color: #999; font-size: 0.9em; }
```

**Acceptance Criteria:**
- [x] Primary text (titles) uses dark color
- [x] Secondary text (address, hours) uses grey color  
- [x] Clear visual hierarchy in popup content

---

#### 2.6 Fix Hyperlink Colors
**Status:** LOW PRIORITY  
**Estimated Effort:** 1 hour  
**File:** `js/mapController.js`

**Issue:** Hyperlink color currently #005759, should be #00748C

**Implementation:**
```css
.salty-link { color: #00748C; }
```

**Acceptance Criteria:**
- [x] All popup links use #00748C color
- [x] Color matches button and header text
- [x] Hover states appropriately styled

---

#### 2.7 Website URL Display vs Link Separation
**Status:** MEDIUM PRIORITY  
**Estimated Effort:** 2-3 hours  
**File:** `js/mapController.js`

**Requirement:** Ability to specify display text separate from actual URL

**Implementation:**
1. **Data Structure**: Support separate `website-display-text` and `website-url` fields
2. **Template Logic**: Use display text if available, fallback to URL
3. **Link Generation**: Always use actual URL for href attribute

**Example:**
```javascript
const websiteDisplay = details['website-display-text'] || 
                      details['website-url']?.replace(/^https?:\/\//, '') ||
                      'Visit Website';
const websiteUrl = details['website-url'];
```

**Acceptance Criteria:**
- [x] Display text can be customized separate from URL
- [x] Fallback to URL domain if no display text
- [x] Links work correctly regardless of display text

---

#### 2.8 Beach Button New Window Behavior
**Status:** LOW PRIORITY  
**Estimated Effort:** 1 hour  
**File:** `js/mapController.js`

**Requirement:** Beach detail button opens in new window to preserve map view

**Implementation:**
```javascript
// Add target="_blank" to beach detail links
if (entityType === 'beach') {
  buttons.push({
    text: 'View Beach Details',
    action: 'openBeachDetails',
    target: '_blank',
    style: 'primary'
  });
}
```

**Acceptance Criteria:**
- [x] Beach detail links open in new window/tab
- [x] User retains current map view
- [x] Back button functionality preserved

---

### 3. BEACH LIST IMPROVEMENTS 🎯

#### 3.1 Fix New Location Cluster Population
**Status:** HIGH PRIORITY  
**Estimated Effort:** 4-6 hours  
**Files:** `js/mapController.js`, `js/views/FeatureListView.js`

**Issue:** Orange County location cluster not appearing in beach list when California counties shown

**Investigation Required:**
1. **Data Flow Analysis**:
   - Check if Orange County beaches are in API response
   - Verify cluster generation in Mapbox Studio
   - Test `updateSidebarListFromMap()` query logic

2. **Debugging Steps**:
   ```javascript
   // Add debugging to updateSidebarListFromMap
   console.log('Available region features:', regionFeatures.map(f => f.properties));
   console.log('Beach features in view:', beachFeatures.map(f => f.properties));
   ```

**Potential Solutions:**
1. **Auto-refresh on CMS changes**: Implement cache invalidation when new locations added
2. **Manual refresh endpoint**: Add ability to refresh location data
3. **Dev environment sync**: Ensure dev environment sees latest CMS data

**Acceptance Criteria:**
- [x] New location clusters appear automatically in beach list
- [x] Orange County shows when California counties displayed
- [x] No manual refresh required for new locations
- [x] Works consistently in dev and production

---

#### 3.2 Replace "No Items" Error with Location Hierarchy
**Status:** HIGH PRIORITY  
**Estimated Effort:** 6-8 hours  
**File:** `js/views/FeatureListView.js`

**Current Behavior:** Shows "No items in view. Pan or zoom the map to find some."  
**Required Behavior:** Show countries, states, counties, cities based on current map view

**Implementation Plan:**
1. **Hierarchical Query System**:
   ```javascript
   async buildLocationHierarchy() {
     const bounds = map.getBounds();
     const zoom = map.getZoom();
     
     if (zoom < 4) return this.getCountries(bounds);
     if (zoom < 6) return this.getStates(bounds); 
     if (zoom < 8) return this.getCounties(bounds);
     if (zoom < 10) return this.getCities(bounds);
     return this.getBeaches(bounds);
   }
   ```

2. **Fallback Logic Enhancement**:
   ```javascript
   renderFeatureList(features = [], type = "beach") {
     if (features.length === 0) {
       // Instead of error message, show location hierarchy
       const hierarchy = await this.buildLocationHierarchy();
       this.renderLocationHierarchy(hierarchy);
       return;
     }
     // ... existing logic
   }
   ```

3. **Location Hierarchy Component**:
   - Reuse existing list item templates
   - Show appropriate data for each hierarchy level
   - Enable drill-down navigation

**Acceptance Criteria:**
- [x] "No items" error replaced with location options
- [x] Shows countries/states/counties/cities based on zoom level
- [x] Users can navigate through location hierarchy
- [x] Maintains existing list item styling and behavior

---

#### 3.3 Fix "Explore Beaches" Button Behavior
**Status:** MEDIUM PRIORITY  
**Estimated Effort:** 2-3 hours  
**File:** Identify button handler location

**Issue:** "Explore beaches" button from initial map view shows "No items in view" error

**Investigation Required:**
1. Find "Explore Beaches" button click handler
2. Check what map state/zoom it triggers
3. Verify list population after button action

**Expected Fix:**
1. Ensure button navigates to appropriate zoom level with beaches visible
2. Integrate with location hierarchy fallback system
3. Test with various geographic regions

**Acceptance Criteria:**
- [x] "Explore Beaches" button shows beaches or location hierarchy
- [x] No "No items in view" error appears
- [x] Consistent behavior across different starting locations

---

### 4. OTHER CRITICAL FIXES 🎯

#### 4.1 Disable Mapbox POIs
**Status:** HIGH PRIORITY  
**Estimated Effort:** 1-2 hours  
**File:** Mapbox Studio style configuration

**Issue:** Mapbox POIs appearing when they should be turned off (regression)

**Implementation:**
1. **Mapbox Studio**: 
   - Check all Mapbox default POI layers are disabled
   - Verify no conflicting layer configurations
   - Test layer visibility rules

2. **Code Verification**:
   - Ensure no code is programmatically enabling POI layers
   - Check for any dynamic layer manipulation

**Acceptance Criteria:**
- [x] No unwanted Mapbox POIs visible on map
- [x] Only custom Salty POIs display
- [x] Behavior consistent across zoom levels

---

#### 4.2 Fix or Hide Beaches Main Menu
**Status:** MEDIUM PRIORITY  
**Estimated Effort:** 2-3 hours  
**Files:** Main menu configuration

**Issue:** Beaches page in main menu doesn't behave like "Explore beaches" button

**Options:**
1. **Fix Behavior**: Make menu item trigger same action as "Explore beaches" button
2. **Hide Menu Item**: Remove from menu until fixed properly

**Recommendation**: Hide for Sprint 3, fix in Sprint 4

**Implementation** (Hide option):
```css
/* Temporarily hide beaches menu item */
.menu-item[href="/beaches"] { display: none; }
```

**Acceptance Criteria:**
- [x] Beaches menu item hidden or behaves correctly
- [x] No user confusion about non-functional menu items
- [x] Alternative access to beaches functionality available

---

## 📋 SPRINT 4 - PLANNED IMPROVEMENTS

### 1. Information Architecture Improvements
**Estimated Effort:** 2-3 weeks

#### 1.1 Navigation Structure Overhaul
- Improve menu organization and hierarchy
- Add breadcrumb navigation
- Enhance mobile navigation patterns

#### 1.2 Content Organization
- Standardize beach and POI data presentation
- Improve categorization and tagging system
- Add advanced filtering capabilities

---

### 2. UI Redesign for Dedicated Beach Pages
**Estimated Effort:** 3-4 weeks

#### 2.1 Beach Detail Page Redesign
- Modern, mobile-first design approach
- Enhanced image galleries and carousel
- Improved typography and spacing
- Better amenity and weather data presentation

#### 2.2 Responsive Design Improvements
- Touch-optimized interactions
- Improved tablet experience
- Enhanced accessibility features

---

### 3. CMS Migration and Data Management
**Estimated Effort:** 4-5 weeks

#### 3.1 Mapbox to CMS Migration
- Extract beaches and POIs from Mapbox database
- Migrate to Webflow CMS for easier management
- Develop bulk import/export tools

#### 3.2 Global Beach Database
- Expand coverage beyond current regions
- Implement automated data validation
- Add data quality monitoring

#### 3.3 Content Management Workflow
- Create editorial workflow for beach data
- Add approval process for new beaches/POIs
- Implement change tracking and versioning

---

### 4. Search Functionality
**Estimated Effort:** 2-3 weeks

#### 4.1 Map Search Box
- Add search input to map interface
- Implement autocomplete functionality
- Support beach and POI search

#### 4.2 Search Implementation
- Integrate with existing data sources
- Add search result highlighting
- Implement search analytics

#### 4.3 Advanced Search Features
- Filter by amenities, activities, weather
- Location-based search with radius
- Saved searches and favorites

---

## 🔧 TECHNICAL DEBT & IMPROVEMENTS

### Code Quality
- [ ] Add comprehensive unit tests
- [ ] Implement error boundary components
- [ ] Add performance monitoring
- [ ] Improve TypeScript adoption

### Performance Optimization
- [ ] Implement lazy loading for images
- [ ] Add map tile caching strategy
- [ ] Optimize bundle size and code splitting
- [ ] Add service worker for offline functionality

### Documentation
- [ ] Complete API documentation
- [ ] Add component documentation
- [ ] Create deployment guides
- [ ] Add troubleshooting documentation

---

## 🎯 DEFINITION OF DONE

### Sprint 3 Completion Criteria:
- [x] All POI markers clickable and functional in dev environment
- [x] Category-based icons working for all POI types
- [x] Popup hover behavior matches Yelp/Google Maps
- [x] Multi-button popup support implemented
- [x] Beach list shows location hierarchy instead of errors
- [x] New location clusters populate automatically
- [x] Mapbox POIs completely disabled
- [x] All hyperlink colors use brand color #00748C
- [x] Website display text separate from URLs
- [x] Paid partner toggle moved to POI field
- [x] Main menu beaches item fixed or hidden

### Success Metrics:
- Tourism board demo readiness achieved
- Business advertising capabilities functional
- Zero critical bugs in core map functionality
- User experience consistent with modern map applications

---

## 📝 NOTES & CONSIDERATIONS

### Development Environment Setup
- Ensure dev environment has latest CMS data
- Test with huntington-city-beach-lifeguard-tower-1 POI specifically
- Verify all API endpoints working in dev

### Testing Strategy
- Manual testing of all popup behaviors
- Cross-browser testing (Chrome, Safari, Firefox)
- Mobile device testing (iOS Safari, Android Chrome)
- Accessibility testing with keyboard navigation

### Deployment Considerations
- Stage changes in development environment first
- Test with real tourism board demo scenarios
- Plan rollback strategy for critical issues
- Monitor performance impact of new features

### Future Considerations
- Plan for internationalization (multiple languages)
- Consider offline functionality for mobile users
- Evaluate need for push notifications
- Plan for analytics and user behavior tracking