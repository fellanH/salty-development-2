import { Map as MapboxMap } from 'mapbox-gl';

export interface AppState {
  map: MapboxMap | null;
  currentSelection: {
    id: string | null;
    type: 'beach' | 'poi' | 'state' | 'region' | null;
    feature: unknown | null;
  };
  cache: {
    weatherData: Map<string, WeatherData>;
    visibleFeatures: Map<string, unknown>;
    beachData: Map<string, BeachData>;
    poiData: Map<string, POIData>;
  };
  ui: {
    currentSidebar: 'home' | 'beach-list' | 'beach';
    isMobile: boolean;
    isLoading: boolean;
    elements: Record<string, HTMLElement>;
    openPopups: unknown[];
  };
}

export interface BeachData {
  id: string;
  Name: string;
  "Main Image"?: string;
  State?: string;
  "Location Cluster"?: string;
  "google-maps-link"?: string;
  googleMapsUrl?: string;
  websiteUrl?: string;
  restrooms?: boolean;
  showers?: boolean;
  pets?: boolean;
  parking?: boolean;
  camping?: boolean;
  coordinates?: [number, number];
}

export interface POIData {
  id: string;
  name: string;
  Name?: string;
  mainImageUrl?: string;
  "Main Image"?: string;
  imageUrl?: string;
  categoryName?: string;
  category?: string;
  type?: string;
  customIconName?: string;
  "Custom Icon"?: string;
  State?: string;
  state?: string;
  "google-maps-link"?: string;
  googleMapsUrl?: string;
  coordinates?: [number, number];
}

export interface WeatherData {
  airTemp?: number;
  feelsLike?: number;
  humidity?: number;
  wind?: number;
  windDirection?: string;
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

export interface FeatureListItem {
  id: string;
  type: 'beach' | 'poi' | 'state' | 'region';
  title: string;
  imageUrl: string;
  subtitle?: string;
  locationCluster?: string;
  state?: string;
}

export interface MapFeature {
  id: string;
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: Record<string, unknown>;
}

export interface ActionPayload {
  type: string;
  payload?: unknown;
}

export type SidebarType = 'home' | 'beach-list' | 'beach';
export type FeatureType = 'beach' | 'poi' | 'state' | 'region';