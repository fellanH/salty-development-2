# Salty Map - Next.js Application

A modern, performant mapping application built with Next.js, React, and Mapbox GL JS. This application allows users to explore beaches and points of interest with an interactive map interface.

## Features

- 🗺️ Interactive map powered by Mapbox GL JS
- 🏖️ Browse beaches with detailed information
- 📍 Discover points of interest (POIs)
- 📱 Fully responsive design
- ⚡ Server-side rendering with Next.js
- 🔄 Real-time data fetching with SWR
- 🎨 Modern UI with CSS Modules

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **UI Library**: React 18
- **Map**: Mapbox GL JS
- **State Management**: React Context API + useReducer
- **Data Fetching**: SWR
- **Styling**: CSS Modules
- **API**: Next.js API Routes

## Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Mapbox account (for access token)
- Webflow account (for API access)

## Installation

1. Clone the repository:
```bash
cd nextjs-salty-map
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your credentials:
```
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
WEBFLOW_API_KEY=your_webflow_api_key
```

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
nextjs-salty-map/
├── components/          # React components
│   ├── Map/            # Map-related components
│   ├── UI/             # UI components (Sidebar, etc.)
│   └── Layout/         # Layout components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Next.js pages and API routes
│   ├── api/            # API endpoints
│   └── index.tsx       # Home page
├── public/             # Static assets
├── styles/             # Global styles and CSS modules
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── config/             # Configuration files
```

## API Routes

- `GET /api/beaches/collection` - Fetch all beaches
- `GET /api/beaches/[id]` - Fetch a specific beach
- `GET /api/pois/collection` - Fetch all POIs
- `GET /api/pois/[id]` - Fetch a specific POI

## Building for Production

```bash
npm run build
npm start
```

## Deployment

The application can be deployed to any platform that supports Next.js:

### Vercel (Recommended)
```bash
vercel
```

### Other Platforms
Follow the deployment guide for your chosen platform:
- [AWS](https://nextjs.org/docs/deployment#aws)
- [Netlify](https://nextjs.org/docs/deployment#netlify)
- [Docker](https://nextjs.org/docs/deployment#docker)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox API access token | Yes |
| `NEXT_PUBLIC_WEBFLOW_SITE_ID` | Webflow site ID | Yes |
| `NEXT_PUBLIC_WEBFLOW_BEACHES_COLLECTION_ID` | Webflow beaches collection ID | Yes |
| `NEXT_PUBLIC_WEBFLOW_POI_COLLECTION_ID` | Webflow POI collection ID | Yes |
| `WEBFLOW_API_KEY` | Webflow API key (server-side) | Yes |

## Performance Optimizations

- Dynamic imports for Mapbox GL to avoid SSR issues
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- SWR for efficient data fetching and caching
- CSS Modules for scoped styling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.