'use client';

import React, { useEffect } from 'react';
import { useAppContext } from '@/lib/context/AppContext';
import { useDataInitialization } from '@/hooks/useDataInitialization';
import MapContainer from '@/components/map/MapContainer';
import SidebarContainer from '@/components/ui/SidebarContainer';
import { Config } from '@/lib/config';

export default function SaltyMapApp() {
  const { state, dispatch } = useAppContext();
  const { isInitialized, error } = useDataInitialization();

  // Handle responsive breakpoint
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= Config.MAP.MOBILE_BREAKPOINT;
      dispatch({ type: 'SET_MOBILE', payload: isMobile });
    };

    // Set initial mobile state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  // Error state
  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Failed to Load Map
            </h2>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (state.ui.isLoading || !isInitialized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            🗺️ Loading Salty Map...
          </h2>
          <p className="text-gray-600">
            Preparing your coastal adventure
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className={`
        ${state.ui.isMobile 
          ? 'absolute inset-y-0 left-0 z-50 w-full max-w-sm transform transition-transform duration-300 ease-in-out' +
            (state.ui.currentSidebar === 'home' ? ' translate-x-0' : ' -translate-x-full')
          : 'relative w-96 flex-shrink-0'
        }
      `}>
        <SidebarContainer className="h-full" />
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer />
        
        {/* Mobile overlay when sidebar is open */}
        {state.ui.isMobile && state.ui.currentSidebar !== 'home' && (
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => dispatch({ type: 'SET_SIDEBAR', payload: 'home' })}
          />
        )}
        
        {/* Mobile sidebar overlay */}
        {state.ui.isMobile && state.ui.currentSidebar !== 'home' && (
          <div className="absolute inset-y-0 left-0 z-50 w-full max-w-sm">
            <SidebarContainer className="h-full" />
          </div>
        )}
      </div>

      {/* Mobile menu button (when sidebar is closed) */}
      {state.ui.isMobile && state.ui.currentSidebar === 'home' && (
        <button
          onClick={() => dispatch({ type: 'SET_SIDEBAR', payload: 'beach-list' })}
          className="absolute top-4 left-4 z-30 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
    </div>
  );
}