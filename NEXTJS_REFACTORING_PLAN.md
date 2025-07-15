# Next.js Refactoring Plan for Salty Map Application

## Current Architecture Analysis

### Application Overview
- **Name**: Salty Map Application
- **Type**: Interactive mapping application showing beaches and POIs
- **Stack**: Vanilla JavaScript (ES6 modules), Express backend, Mapbox GL JS
- **Data Sources**: Webflow CMS, Mock API, External weather API

### Current Structure
```
/
├── api/                    # Backend API endpoints
│   ├── beaches.js         # Beach data endpoint
│   └── pois.js           # POI data endpoint
├── js/                    # Frontend JavaScript modules
│   ├── config/           # Configuration files
│   ├── services/         # Service modules
│   ├── views/           # View components
│   ├── mapController.js  # Map management
│   ├── uiController.js   # UI management
│   ├── dataController.js # Data fetching
│   ├── appState.js      # State management
│   ├── eventBus.js      # Event system
│   └── ...other modules
├── sprite_images/        # Map sprite images
├── index.js             # Frontend entry point
└── server.js            # Express server
```

### Key Components to Migrate

1. **Controllers**
   - MapController → Map component with hooks
   - UIController → UI components
   - DataController → API routes + data fetching hooks
   - ActionController → Event handlers in components

2. **State Management**
   - AppState → React Context + useReducer
   - EventBus → React Context + custom hooks

3. **Views**
   - DetailView → DetailView component
   - FeatureListView → FeatureList component

4. **API Endpoints**
   - /api/beaches/:id → Next.js API route
   - /api/pois/:id → Next.js API route

## Migration Strategy

### Phase 1: Project Setup
1. Initialize Next.js project with TypeScript support
2. Install required dependencies
3. Set up project structure

### Phase 2: Component Migration
1. Convert vanilla JS modules to React components
2. Implement React hooks for state management
3. Create reusable UI components

### Phase 3: Data Layer
1. Migrate API endpoints to Next.js API routes
2. Implement data fetching with getServerSideProps/getStaticProps
3. Set up client-side data fetching with SWR

### Phase 4: Map Integration
1. Create Map component with Mapbox GL JS
2. Implement map interactions with React hooks
3. Handle map events and state updates

### Phase 5: Styling & Assets
1. Migrate existing CSS to CSS modules
2. Copy sprite images and static assets
3. Implement responsive design

### Phase 6: Testing & Optimization
1. Test all functionality
2. Implement Next.js image optimization
3. Add error boundaries

## File Mapping

| Original File | Next.js Location |
|--------------|------------------|
| index.js | pages/index.tsx |
| js/mapController.js | components/Map/MapContainer.tsx |
| js/uiController.js | components/UI/*.tsx |
| js/appState.js | contexts/AppContext.tsx |
| js/views/DetailView.js | components/DetailView.tsx |
| js/views/FeatureListView.js | components/FeatureList.tsx |
| api/beaches.js | pages/api/beaches/[id].ts |
| api/pois.js | pages/api/pois/[id].ts |
| js/config.js | config/index.ts |
| js/utils.js | utils/index.ts |

## Dependencies to Install

```json
{
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "mapbox-gl": "^2.15.0",
    "@turf/turf": "^7.2.0",
    "axios": "^1.10.0",
    "swr": "^2.2.0"
  },
  "devDependencies": {
    "@types/react": "latest",
    "@types/node": "latest",
    "typescript": "latest",
    "@types/mapbox-gl": "^2.7.0"
  }
}
```

## Environment Variables
- NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
- NEXT_PUBLIC_WEBFLOW_SITE_ID
- NEXT_PUBLIC_WEBFLOW_BEACHES_COLLECTION_ID
- NEXT_PUBLIC_WEBFLOW_POI_COLLECTION_ID
- WEBFLOW_API_KEY (server-side only)