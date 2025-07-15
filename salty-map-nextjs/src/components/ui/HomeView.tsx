'use client';

import React from 'react';
import { useAppContext } from '@/lib/context/AppContext';

export default function HomeView() {
  const { setSidebar } = useAppContext();

  return (
    <div 
      className="p-6 h-full flex flex-col"
      data-sidebar="home"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🏖️ Salty Beaches
        </h1>
        <p className="text-gray-600">
          Discover beautiful beaches and coastal attractions across the United States.
        </p>
      </div>

      <div className="flex-1 space-y-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Explore the Map
          </h3>
          <p className="text-blue-800 text-sm mb-3">
            Click on any beach or point of interest on the map to learn more about it.
          </p>
          <button
            onClick={() => setSidebar('beach-list')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            View All Beaches
          </button>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Features
          </h3>
          <ul className="text-green-800 text-sm space-y-1">
            <li>• Interactive map with beach locations</li>
            <li>• Weather and water conditions</li>
            <li>• Amenities and facilities information</li>
            <li>• Points of interest nearby</li>
          </ul>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            How to Use
          </h3>
          <p className="text-yellow-800 text-sm">
            Navigate the map to find beaches and coastal attractions. 
            Click on markers to see detailed information, weather data, and amenities.
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Powered by Mapbox • Data from Webflow CMS
        </p>
      </div>
    </div>
  );
}