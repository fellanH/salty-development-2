# Salty Beaches - Next.js Application

🏖️ **Salty Beaches** is a modern, interactive web application for discovering beautiful beaches and coastal attractions across the United States. This is a complete refactor from vanilla JavaScript to Next.js, featuring an interactive Mapbox-powered map, responsive design, and comprehensive beach/POI information.

## ✨ Features

- **Interactive Map**: Powered by Mapbox GL JS with custom styled layers
- **Responsive Design**: Seamless experience across desktop and mobile devices
- **Beach & POI Discovery**: Detailed information about beaches and points of interest
- **Real-time Data**: Weather conditions, amenities, and facility information
- **Modern Architecture**: Built with Next.js, TypeScript, and Tailwind CSS
- **Performance Optimized**: Server-side rendering, image optimization, and efficient state management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd salty-map-nextjs
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional):
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   ```
   *Note: The application includes a default Mapbox token for development*

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture Overview

### Technology Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: Mapbox GL JS
- **State Management**: React Context + useReducer
- **HTTP Client**: Axios
- **Image Optimization**: Next.js Image component

### Project Structure

```
salty-map-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── beaches/       # Beach data endpoints
│   │   │   └── pois/          # POI data endpoints
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── app/              # Main app components
│   │   ├── map/              # Map-related components
│   │   └── ui/               # UI components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Core libraries
│   │   ├── config/           # Configuration files
│   │   ├── context/          # React Context
│   │   ├── services/         # API services
│   │   └── types/            # TypeScript definitions
│   └── utils/                # Utility functions
├── public/                   # Static assets
├── package.json
└── README.md
```

## 🔧 Configuration

### Map Configuration
Edit `src/lib/config/map.ts`:
```typescript
export const mapConfig = {
  ACCESS_TOKEN: "your_mapbox_access_token",
  STYLE: "mapbox://styles/your_style_url",
  DEFAULT_ZOOM: 2,
  DESKTOP_START_POSITION: [-123.046253, 33.837038],
  MOBILE_START_POSITION: [-140.3628729, 33.900661],
  // ... other config options
};
```

### API Configuration
Edit `src/lib/config/api.ts`:
```typescript
export const apiConfig = {
  BASE_URL: "https://your-api-base-url.com",
  WEATHER_PROXY_URL: "https://your-weather-api.com",
};
```

## 🎯 Key Components

### State Management
- **AppContext**: Centralized state management using React Context
- **useAppContext**: Custom hook for accessing application state
- **Actions**: Dispatched actions for state updates

### Map Integration
- **MapContainer**: Main map component with Mapbox GL integration
- **Layer Management**: Handles beaches, POIs, states, and regions layers
- **Event Handling**: Click events, hover effects, and feature selection

### UI Components
- **SidebarContainer**: Dynamic sidebar with different views
- **HomeView**: Landing page with app introduction
- **BeachListView**: List of all beaches and POIs
- **BeachDetailView**: Detailed information about selected features

### Data Management
- **DataService**: API integration and data fetching
- **Cache Management**: Efficient caching of beaches, POIs, and weather data
- **Type Safety**: Full TypeScript support with comprehensive type definitions

## 📱 Responsive Design

The application provides an optimal experience across all device types:

- **Desktop**: Side-by-side map and sidebar layout
- **Mobile**: Full-screen map with overlay sidebar
- **Tablet**: Adaptive layout based on screen size

## 🌐 API Endpoints

### Beaches
- `GET /api/beaches` - Fetch all beaches
- `GET /api/beaches?id={id}` - Fetch specific beach

### POIs (Points of Interest)
- `GET /api/pois` - Fetch all POIs
- `GET /api/pois?id={id}` - Fetch specific POI

## 🔄 Migration from Vanilla JavaScript

This application has been completely refactored from vanilla JavaScript to modern Next.js:

### What Was Migrated:
- ✅ **State Management**: Custom state management → React Context + useReducer
- ✅ **UI Controllers**: DOM manipulation → React components
- ✅ **Map Controller**: Vanilla Mapbox integration → React Mapbox component
- ✅ **Event System**: Custom event bus → React event handlers and context
- ✅ **API Integration**: Fetch calls → Axios with Next.js API routes
- ✅ **Configuration**: JS modules → TypeScript configuration system
- ✅ **Responsive Design**: CSS media queries → Tailwind responsive utilities

### Key Improvements:
- 🚀 **Performance**: Server-side rendering, code splitting, image optimization
- 🔒 **Type Safety**: Full TypeScript implementation
- 📱 **Mobile Experience**: Enhanced responsive design and touch interactions
- 🎨 **Modern UI**: Tailwind CSS with custom design system
- 🔧 **Developer Experience**: Hot reloading, better debugging, modern tooling
- 📦 **Bundle Optimization**: Automatic code splitting and tree shaking

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
npx vercel --prod
```

### Manual Deployment
```bash
npm run build
npm run start
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
WEBFLOW_API_KEY=your_webflow_api_key (if using real Webflow data)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Mapbox** for the amazing mapping platform
- **Next.js team** for the excellent React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Original vanilla JS codebase** for the foundation and requirements

---

**🏖️ Happy beach exploring with Salty Beaches!**
