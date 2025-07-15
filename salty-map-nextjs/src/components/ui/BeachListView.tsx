'use client';

import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/lib/context/AppContext';
import { FeatureListItem } from '@/lib/types';
import Image from 'next/image';

export default function BeachListView() {
  const { state, setSidebar, setSelection } = useAppContext();
  const [features, setFeatures] = useState<FeatureListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeatures = async () => {
      setIsLoading(true);
      try {
        // Convert cached data to display format
        const beachItems: FeatureListItem[] = Array.from(state.cache.beachData.values()).map(beach => ({
          id: beach.id,
          type: 'beach' as const,
          title: beach.Name || 'Unnamed Beach',
          imageUrl: beach["Main Image"] || "https://cdn.prod.website-files.com/677e87dd7e4a4c73cbae4e0e/677e87dd7e4a4c73cbae4ee3_placeholder-image.svg",
          locationCluster: beach["Location Cluster"],
          state: beach.State,
        }));

        const poiItems: FeatureListItem[] = Array.from(state.cache.poiData.values()).map(poi => ({
          id: poi.id,
          type: 'poi' as const,
          title: poi.name || poi.Name || 'Point of Interest',
          imageUrl: poi.mainImageUrl || poi["Main Image"] || poi.imageUrl || "https://cdn.prod.website-files.com/677e87dd7e4a4c73cbae4e0e/677e87dd7e4a4c73cbae4ee3_placeholder-image.svg",
          locationCluster: poi.categoryName || poi.category || poi.type,
          state: poi.State || poi.state,
        }));

        const allFeatures = [...beachItems, ...poiItems].sort((a, b) => a.title.localeCompare(b.title));
        setFeatures(allFeatures);
      } catch (error) {
        console.error('Error loading features:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeatures();
  }, [state.cache.beachData, state.cache.poiData]);

  const handleFeatureClick = (feature: FeatureListItem) => {
    setSelection(feature.id, feature.type);
    setSidebar('beach');
  };

  const handleBackClick = () => {
    setSidebar('home');
  };

  if (isLoading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div 
      className="h-full flex flex-col"
      data-sidebar="beach-list"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleBackClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Back to home"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Beaches & Attractions</h2>
            <p className="text-sm text-gray-600">{features.length} locations</p>
          </div>
        </div>
      </div>

      {/* Feature List */}
      <div className="flex-1 overflow-y-auto">
        <div className="beach-list_list space-y-1 p-2">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="beach-list-item bg-white hover:bg-gray-50 rounded-lg border border-gray-200 cursor-pointer transition-colors"
              onClick={() => handleFeatureClick(feature)}
            >
              <div className="beach-info-small_wrapper p-4 flex space-x-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={feature.imageUrl}
                                         alt={feature.title}
                     fill
                     className="object-cover rounded-lg"
                     data-beach-list-item="image"
                     sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                                     <h3 
                     className="font-semibold text-gray-900 truncate"
                     data-beach-list-item="title"
                   >
                    {feature.title}
                  </h3>
                                     <div 
                     className="flex items-center text-sm text-gray-600 mt-1"
                     data-beach-list-item="location-wrapper"
                   >
                    {feature.locationCluster && (
                      <>
                                                 <span data-beach-list-item="location-cluster">
                           {feature.locationCluster}
                         </span>
                        {feature.state && (
                          <>
                            <span className="delimiter mx-2">•</span>
                            <span data-beach-list-item="state">{feature.state}</span>
                          </>
                        )}
                      </>
                    )}
                    {!feature.locationCluster && feature.state && (
                                             <span data-beach-list-item="state">{feature.state}</span>
                    )}
                  </div>
                  <div className="mt-1">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      feature.type === 'beach' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {feature.type === 'beach' ? '🏖️ Beach' : '📍 POI'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {features.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No beaches or attractions found.</p>
            <p className="text-sm mt-2">Try exploring the map to discover locations.</p>
          </div>
        )}
      </div>
    </div>
  );
}