# Salty Map Application

Salty Map is a modern, interactive web application designed to display geographical data, initially focused on beaches. It features a responsive design, a modular architecture, and a highly configurable event-driven system for user interactions. The application is built with vanilla JavaScript (ES6 Modules), Mapbox GL JS for the interactive map, and is designed to be easily integrated with a CMS like Webflow or used as a standalone project.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration (`config.js`)](#configuration-configjs)
- [Architecture Deep Dive](#architecture-deep-dive)
- [Working with the UI](#working-with-the-ui)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Interactive Map**: Utilizes Mapbox GL JS to display clustered and individual points of interest.
- **Modular & Maintainable**: Code is split into logical modules (UI, Map, State, etc.) for easy maintenance and scalability.
- **Event-Driven Architecture**: Modules communicate through a central Event Bus, promoting loose coupling and flexibility.
- **Configuration-Centric**: Core behaviors, UI elements, and map settings are defined in a central `config.js` file, allowing for easy customization without deep code changes.
- **Responsive Design**: A fluid user experience across desktop and mobile devices.
- **Dynamic Sidebars**: Multiple sidebar panels for displaying home content, lists of features, and detailed information.
- **Client-Side Data Fetching**: Asynchronously fetches and displays data from an API (currently mocked).

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Mapping**: Mapbox GL JS
- **Development Server**: Node.js / Express (for local development with CORS support)
- **Dependencies**: `axios` (for API requests), `cors`, `dotenv`, `express`.

## Project Structure

The project follows a modular structure, separating concerns into distinct files within the `js/` directory.

```
salty-map/
├── js/
│   ├── appState.js             # Manages global application state
│   ├── config.js               # Central configuration file
│   ├── mapController.js        # Handles all Mapbox logic and interactions
│   ├── uiController.js         # Manages all DOM manipulation and UI events
│   ├── navigationController.js # Handles high-level navigation logic
│   ├── actionController.js     # Executes action sequences from the config
│   ├── eventBus.js             # Simple Pub/Sub event bus for module communication
│   ├── utils.js                # General utility functions (debounce, etc.)
│   └── mockAPI.js              # Simulates a backend API for development
│
├── index.js                    # Main application entry point (initializes modules)
├── server.js                   # Optional Express server for local development
└── README.md                   # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- npm (usually comes with Node.js)
- A Mapbox Access Token

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/salty-map.git
    cd salty-map
    ```

2.  **Install dependencies:**
    The `package.json` file lists the dependencies for the local development server.

    ```bash
    npm install
    ```

3.  **Configure the application:**
    Open `js/config.js` and update the following values:

    - `MAP.ACCESS_TOKEN`: Add your Mapbox access token here.
    - `MAP.STYLE`: Set this to your Mapbox Studio style URL.

4.  **Start the development server:**
    The provided `server.js` uses Express to serve the files and enable CORS.
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000`.

## Configuration (`config.js`)

This is the most important file for customizing the application's behavior.

### Map Configuration

The `MAP` object contains all settings for the Mapbox instance (token, style URL, initial camera position, zoom levels, etc.).

### Event Actions

`EVENT_ACTIONS` is the core of the application's interactivity. It defines named sequences of actions that can be triggered by user interactions.

**Example:**

```javascript
selectBeach: {
  description: "Action when a single beach is clicked.",
  actions: [
    { type: "FLY_TO", zoomLevel: 14, speed: 1.5 },
    { type: "UPDATE_APP_STATE" },
    { type: "SHOW_SIDEBAR", sidebar: "detail" },
    { type: "SHOW_POPUP", delay: 100 },
  ],
},
```

When the `selectBeach` action is executed, it will trigger a series of events to:

1.  Animate the map to the selected beach's coordinates (`FLY_TO`).
2.  Update the global application state with the selection (`UPDATE_APP_STATE`).
3.  Switch the visible sidebar to the "detail" panel (`SHOW_SIDEBAR`).
4.  Show a Mapbox popup after a 100ms delay (`SHOW_POPUP`).

### DOM Selectors

The `SELECTORS` object maps logical names to CSS selectors. It is highly recommended to use `data-` attributes (e.g., `[sidebar="wrapper"]`) instead of Webflow's default IDs for stability.

### List Item Templates

`LIST_ITEM_TEMPLATES` defines how to render different types of features (states, regions, beaches) in the sidebar list, mapping data from a feature's properties to elements within a `<template>`.

## Architecture Deep Dive

### Core Principles

- **Separation of Concerns**: Each module has a single, well-defined responsibility. (`MapController` only touches the map, `UIController` only touches the DOM, `AppState` only manages state).
- **Single Source of Truth**: `AppState` holds the current state of the application. All modules read from this state to make decisions.
- **Loose Coupling via Events**: Modules do not call each other's methods directly. Instead, they publish messages to the `EventBus`. This means you can replace or modify a module without breaking others.

### Application Flow: A User Click

Understanding the flow of a single interaction is key to understanding the new event-driven architecture.

1.  **User Interaction**: The user clicks on a beach feature on the map.
2.  **MapController**: The Mapbox `click` event listener fires. It identifies the feature and calls `NavigationController`.
3.  **NavigationController**: It determines the correct action name (e.g., `selectBeach`) and calls `ActionController.execute()`.
4.  **ActionController**: This is the "conductor." It looks up the `selectBeach` sequence in the config and iterates through its actions, **publishing an event to the EventBus for each step**:
    - Action: `{ type: "FLY_TO", ... }` -> Publishes a `map:flyTo` event.
    - Action: `{ type: "UPDATE_APP_STATE" }` -> Calls `AppState.setSelection()`.
    - Action: `{ type: "SHOW_SIDEBAR", ... }` -> Publishes a `ui:showSidebar` event.
    - Action: `{ type: "SHOW_POPUP", ... }` -> Publishes a `map:showPopup` event.
5.  **Event Subscriptions & State Changes**:
    - `MapController` is subscribed to `map:flyTo` and `map:showPopup` and calls its internal methods to animate the map and show a popup.
    - `UIController` is subscribed to `ui:showSidebar` and calls its internal method to change the visible sidebar panel.
    - The `AppState.setSelection()` method publishes its own `state:selectionChanged` event. `UIController` is subscribed to this and knows when to update the detail sidebar with new data.

### The Event Bus (`eventBus.js`)

A simple but powerful publish/subscribe system.

- `EventBus.subscribe(eventName, callback)`: Listens for an event.
- `EventBus.publish(eventName, data)`: Fires an event, passing data to all subscribers.

**Key Events**:

- `map:flyTo`: Tells the map to fly to a location.
- `map:showPopup`: Tells the map to show a popup for a feature.
- `ui:showSidebar`: Tells the UI to switch the active sidebar panel.
- `ui:toggleFullscreen`: Tells the UI to toggle the map/sidebar view.
- `state:selectionChanged`: Notifies the app that the selected item has changed.

### Module Breakdown

- `index.js`: Initializes the application.
- `appState.js`: The brain. Holds all shared data and UI state. Publishes an event when the selection changes.
- `config.js`: The rulebook. Defines how the application looks and behaves.
- `mapController.js`: The cartographer. Manages the Mapbox map and subscribes to map-related events.
- `uiController.js`: The interior designer. Manages the DOM and subscribes to UI and state-change events.
- `navigationController.js`: The navigator. Decides which action sequence to run.
- `actionController.js`: The conductor. Executes action sequences by publishing events.
- `eventBus.js`: The messenger. Allows modules to talk to each other without being directly connected.
- `utils.js`: The toolbox. Provides reusable helper functions like `debounce` and the critical `getFeatureEntityId` for consistent ID handling.
- `mockAPI.js`: The stand-in. Pretends to be a server for development.

## Working with the UI

### Action-Driven Event Handling

To make an element clickable, simply add a `data-action` attribute to your HTML element.

```html
<button class="modal_back-button" data-action="backToList">Back</button>
```

The `UIController` has a single, global click listener that looks for this attribute. When the button is clicked, it will find the `backToList` action in `Config.EVENT_ACTIONS` and execute its defined sequence.

### Managing Sidebars

To switch sidebars, trigger an action that includes `{ type: "SHOW_SIDEBAR", sidebar: "list" }`. The `UIController` will hear the resulting event and handle the DOM changes.

## Working with the Map

The `MapController` is responsible for all map-related functionality.

- **Layers**: The interactive layer IDs (`STATES`, `REGIONS`, `BEACHES`) must match the layer IDs in your Mapbox Studio style.
- **Interactions**: Click and hover events are handled for these layers.
- **Updating the List**: On `moveend`, the map queries for visible features and tells the `UIController` to render them.

## API Integration

The application uses `mockAPI.js` for development. To connect to a real backend:

1.  Update `config.js` with your live API endpoints.
2.  Create a new `js/apiService.js` to handle `fetch` or `axios` requests.
3.  In `uiController.js`, import and use your new `ApiService` instead of `MockAPI` in methods like `updateDetailSidebar`.

## Deployment

This is a static frontend project and can be deployed to any static web hosting service like Netlify, Vercel, or GitHub Pages. There is no build step required.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a pull request.

## License

This project is licensed under the MIT License.
