// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

import { Map } from 'mapbox-gl';

// GeoJSON Types
export interface Feature {
  id?: string | number;
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: number[] | number[][];
  };
  properties: Record<string, any>;
}

export interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}

// Application State Types
export interface AppState {
  map: Map | null;
  selectedState: Feature | null;
  selectedRegion: Feature | null;
  selectedBeach: Feature | null;
  selectedPOI: Feature | null;
  weatherData: WeatherData | null;
  sidebarView: SidebarView;
  isLoading: boolean;
  error: string | null;
  beaches: Beach[];
  pois: POI[];
  featuresList: Feature[];
}

export type SidebarView = 'home' | 'state' | 'region' | 'beach' | 'poi' | 'list';

export interface Beach {
  id: string;
  name: string;
  state: string;
  locationCluster: string;
  coordinates: [number, number];
  mainImage?: string;
  address?: string;
  website?: string;
  restrooms?: boolean;
  showers?: boolean;
  pets?: boolean;
  parking?: boolean;
  camping?: boolean;
}

export interface POI {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  coordinates: [number, number];
  mainImageUrl?: string;
  address?: string;
  website?: string;
  customIconName?: string;
}

export interface WeatherData {
  airTemp?: number;
  feelsLike?: number;
  humidity?: number;
  windSpeed?: number;
  windDirection?: number;
  aqi?: number;
  rainfall?: number;
  pressure?: number;
  pm25?: number;
  pm10?: number;
  waterTemp?: number;
  waveHeight?: number;
  oceanCurrent?: number;
  uvIndex?: number;
  cloudCover?: number;
  sunset?: string;
}

// Action Types
export type ActionType =
  | 'SET_MAP_INSTANCE'
  | 'SELECT_STATE'
  | 'SELECT_REGION'
  | 'SELECT_BEACH'
  | 'SELECT_POI'
  | 'SET_WEATHER_DATA'
  | 'SET_SIDEBAR_VIEW'
  | 'SET_LOADING'
  | 'SET_ERROR'
  | 'SET_BEACHES'
  | 'SET_POIS'
  | 'SET_FEATURES_LIST'
  | 'RESET_SELECTION';

export interface Action {
  type: ActionType;
  payload?: any;
}

// Component Props Types
export interface MapProps {
  onFeatureClick?: (feature: Feature) => void;
  selectedFeature?: Feature | null;
}

export interface SidebarProps {
  view: SidebarView;
  selectedState?: Feature | null;
  selectedRegion?: Feature | null;
  selectedBeach?: Beach | null;
  selectedPOI?: POI | null;
  features?: Feature[];
  onBack?: () => void;
  onClose?: () => void;
  onFeatureSelect?: (feature: Feature) => void;
}

export interface FeatureListProps {
  features: Feature[];
  featureType: 'state' | 'region' | 'beach' | 'poi';
  onSelect: (feature: Feature) => void;
}

export interface DetailViewProps {
  feature: Beach | POI;
  weatherData?: WeatherData | null;
  onBack: () => void;
  onClose: () => void;
}

// API Response Types
export interface WebflowItem {
  _id: string;
  name: string;
  slug: string;
  [key: string]: any;
}

export interface WebflowResponse {
  items: WebflowItem[];
  count: number;
  limit: number;
  offset: number;
  total: number;
}