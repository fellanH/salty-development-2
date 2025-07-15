'use client';

import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { AppState, BeachData, POIData, WeatherData, ActionPayload } from '@/lib/types';
import { Map as MapboxMap } from 'mapbox-gl';

// Initial state
const initialState: AppState = {
  map: null,
  currentSelection: {
    id: null,
    type: null,
    feature: null,
  },
  cache: {
    weatherData: new Map(),
    visibleFeatures: new Map(),
    beachData: new Map(),
    poiData: new Map(),
  },
  ui: {
    currentSidebar: 'home',
    isMobile: false,
    isLoading: false,
    elements: {},
    openPopups: [],
  },
};

// Reducer function
function appReducer(state: AppState, action: ActionPayload): AppState {
  switch (action.type) {
    case 'SET_MAP_INSTANCE':
      return { ...state, map: action.payload as MapboxMap };

    case 'SET_SELECTION':
      console.log('[DEBUG] SET_SELECTION payload:', action.payload);
      const selectionPayload = action.payload as { id: string; type: 'beach' | 'poi' | 'state' | 'region'; feature?: unknown };
      // Avoid unnecessary updates if selection is the same
      if (
        state.currentSelection.id === selectionPayload.id &&
        state.currentSelection.type === selectionPayload.type
      ) {
        return state;
      }
      return {
        ...state,
        currentSelection: {
          id: selectionPayload.id,
          type: selectionPayload.type,
          feature: selectionPayload.feature || null,
        },
      };

    case 'CLEAR_SELECTION':
      return {
        ...state,
        currentSelection: {
          id: null,
          type: null,
          feature: null,
        },
      };

    case 'SET_SIDEBAR':
      return {
        ...state,
        ui: {
          ...state.ui,
          currentSidebar: action.payload as 'home' | 'beach-list' | 'beach',
        },
      };

    case 'SET_MOBILE':
      return {
        ...state,
        ui: {
          ...state.ui,
          isMobile: action.payload as boolean,
        },
      };

    case 'SET_LOADING':
      return {
        ...state,
        ui: {
          ...state.ui,
          isLoading: action.payload as boolean,
        },
      };

    case 'SET_UI_STATE':
      return {
        ...state,
        ui: {
          ...state.ui,
          ...(action.payload as Partial<AppState['ui']>),
        },
      };

    case 'CACHE_BEACH_DATA':
      const beachPayload = action.payload as { id: string; data: BeachData };
      const newBeachCache = new Map(state.cache.beachData);
      newBeachCache.set(beachPayload.id, beachPayload.data);
      return {
        ...state,
        cache: {
          ...state.cache,
          beachData: newBeachCache,
        },
      };

    case 'CACHE_POI_DATA':
      const poiPayload = action.payload as { id: string; data: POIData };
      const newPOICache = new Map(state.cache.poiData);
      newPOICache.set(poiPayload.id, poiPayload.data);
      return {
        ...state,
        cache: {
          ...state.cache,
          poiData: newPOICache,
        },
      };

    case 'CACHE_WEATHER_DATA':
      const weatherPayload = action.payload as { id: string; data: WeatherData };
      const newWeatherCache = new Map(state.cache.weatherData);
      newWeatherCache.set(weatherPayload.id, weatherPayload.data);
      return {
        ...state,
        cache: {
          ...state.cache,
          weatherData: newWeatherCache,
        },
      };

    case 'BULK_CACHE_BEACHES':
      const beachMap = new Map(state.cache.beachData);
      (action.payload as BeachData[]).forEach((beach: BeachData) => {
        beachMap.set(beach.id, beach);
      });
      return {
        ...state,
        cache: {
          ...state.cache,
          beachData: beachMap,
        },
      };

    case 'BULK_CACHE_POIS':
      const poiMap = new Map(state.cache.poiData);
      (action.payload as POIData[]).forEach((poi: POIData) => {
        poiMap.set(poi.id, poi);
      });
      return {
        ...state,
        cache: {
          ...state.cache,
          poiData: poiMap,
        },
      };

    default:
      return state;
  }
}

// Context types
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<ActionPayload>;
  // Helper functions
  getCurrentSelection: () => { id: string | null; type: string | null; feature: unknown | null };
  getBeachById: (id: string) => BeachData | undefined;
  getPOIById: (id: string) => POIData | undefined;
  getWeatherData: (id: string) => WeatherData | undefined;
  setMapInstance: (map: MapboxMap) => void;
  setSelection: (id: string, type: 'beach' | 'poi' | 'state' | 'region', feature?: unknown) => void;
  clearSelection: () => void;
  setSidebar: (sidebar: 'home' | 'beach-list' | 'beach') => void;
  setLoading: (loading: boolean) => void;
  cacheBeachData: (id: string, data: BeachData) => void;
  cachePOIData: (id: string, data: POIData) => void;
  cacheWeatherData: (id: string, data: WeatherData) => void;
  bulkCacheBeaches: (beaches: BeachData[]) => void;
  bulkCachePOIs: (pois: POIData[]) => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper functions
  const getCurrentSelection = useCallback(() => state.currentSelection, [state.currentSelection]);

  const getBeachById = useCallback((id: string) => {
    return state.cache.beachData.get(id);
  }, [state.cache.beachData]);

  const getPOIById = useCallback((id: string) => {
    return state.cache.poiData.get(id);
  }, [state.cache.poiData]);

  const getWeatherData = useCallback((id: string) => {
    return state.cache.weatherData.get(id);
  }, [state.cache.weatherData]);

  const setMapInstance = useCallback((map: MapboxMap) => {
    dispatch({ type: 'SET_MAP_INSTANCE', payload: map });
  }, []);

  const setSelection = useCallback((id: string, type: 'beach' | 'poi' | 'state' | 'region', feature?: unknown) => {
    dispatch({ type: 'SET_SELECTION', payload: { id, type, feature } });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' });
  }, []);

  const setSidebar = useCallback((sidebar: 'home' | 'beach-list' | 'beach') => {
    dispatch({ type: 'SET_SIDEBAR', payload: sidebar });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const cacheBeachData = useCallback((id: string, data: BeachData) => {
    dispatch({ type: 'CACHE_BEACH_DATA', payload: { id, data } });
  }, []);

  const cachePOIData = useCallback((id: string, data: POIData) => {
    dispatch({ type: 'CACHE_POI_DATA', payload: { id, data } });
  }, []);

  const cacheWeatherData = useCallback((id: string, data: WeatherData) => {
    dispatch({ type: 'CACHE_WEATHER_DATA', payload: { id, data } });
  }, []);

  const bulkCacheBeaches = useCallback((beaches: BeachData[]) => {
    dispatch({ type: 'BULK_CACHE_BEACHES', payload: beaches });
  }, []);

  const bulkCachePOIs = useCallback((pois: POIData[]) => {
    dispatch({ type: 'BULK_CACHE_POIS', payload: pois });
  }, []);

  const value: AppContextType = {
    state,
    dispatch,
    getCurrentSelection,
    getBeachById,
    getPOIById,
    getWeatherData,
    setMapInstance,
    setSelection,
    clearSelection,
    setSidebar,
    setLoading,
    cacheBeachData,
    cachePOIData,
    cacheWeatherData,
    bulkCacheBeaches,
    bulkCachePOIs,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}