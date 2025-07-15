// =============================================================================
// APP CONTEXT - State Management
// =============================================================================

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Map } from 'mapbox-gl';
import { AppState, Action, Feature, Beach, POI, WeatherData, SidebarView } from '@/types';

// Initial state
const initialState: AppState = {
  map: null,
  selectedState: null,
  selectedRegion: null,
  selectedBeach: null,
  selectedPOI: null,
  weatherData: null,
  sidebarView: 'home',
  isLoading: false,
  error: null,
  beaches: [],
  pois: [],
  featuresList: [],
};

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_MAP_INSTANCE':
      return { ...state, map: action.payload };
      
    case 'SELECT_STATE':
      return { 
        ...state, 
        selectedState: action.payload,
        selectedRegion: null,
        selectedBeach: null,
        selectedPOI: null,
        sidebarView: 'state'
      };
      
    case 'SELECT_REGION':
      return { 
        ...state, 
        selectedRegion: action.payload,
        selectedBeach: null,
        selectedPOI: null,
        sidebarView: 'region'
      };
      
    case 'SELECT_BEACH':
      return { 
        ...state, 
        selectedBeach: action.payload,
        sidebarView: 'beach'
      };
      
    case 'SELECT_POI':
      return { 
        ...state, 
        selectedPOI: action.payload,
        sidebarView: 'poi'
      };
      
    case 'SET_WEATHER_DATA':
      return { ...state, weatherData: action.payload };
      
    case 'SET_SIDEBAR_VIEW':
      return { ...state, sidebarView: action.payload };
      
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'SET_BEACHES':
      return { ...state, beaches: action.payload };
      
    case 'SET_POIS':
      return { ...state, pois: action.payload };
      
    case 'SET_FEATURES_LIST':
      return { ...state, featuresList: action.payload };
      
    case 'RESET_SELECTION':
      return {
        ...state,
        selectedState: null,
        selectedRegion: null,
        selectedBeach: null,
        selectedPOI: null,
        weatherData: null,
        sidebarView: 'home',
        featuresList: [],
      };
      
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  
  // Helper methods
  selectState: (state: Feature) => void;
  selectRegion: (region: Feature) => void;
  selectBeach: (beach: Beach) => void;
  selectPOI: (poi: POI) => void;
  setWeatherData: (data: WeatherData) => void;
  setSidebarView: (view: SidebarView) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetSelection: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper methods
  const selectState = (stateFeature: Feature) => {
    dispatch({ type: 'SELECT_STATE', payload: stateFeature });
  };

  const selectRegion = (region: Feature) => {
    dispatch({ type: 'SELECT_REGION', payload: region });
  };

  const selectBeach = (beach: Beach) => {
    dispatch({ type: 'SELECT_BEACH', payload: beach });
  };

  const selectPOI = (poi: POI) => {
    dispatch({ type: 'SELECT_POI', payload: poi });
  };

  const setWeatherData = (data: WeatherData) => {
    dispatch({ type: 'SET_WEATHER_DATA', payload: data });
  };

  const setSidebarView = (view: SidebarView) => {
    dispatch({ type: 'SET_SIDEBAR_VIEW', payload: view });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const resetSelection = () => {
    dispatch({ type: 'RESET_SELECTION' });
  };

  const value = {
    state,
    dispatch,
    selectState,
    selectRegion,
    selectBeach,
    selectPOI,
    setWeatherData,
    setSidebarView,
    setLoading,
    setError,
    resetSelection,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use the App context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}