'use client';

import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/lib/context/AppContext';
import { BeachData, POIData, WeatherData } from '@/lib/types';
import Image from 'next/image';

export default function BeachDetailView() {
  const { 
    state, 
    setSidebar, 
    getBeachById, 
    getPOIById, 
    getWeatherData
  } = useAppContext();
  
  const [detailData, setDetailData] = useState<BeachData | POIData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { id, type } = state.currentSelection;

  useEffect(() => {
    const loadDetailData = async () => {
      if (!id || !type) {
        setSidebar('home');
        return;
      }

      setIsLoading(true);
      try {
        let data: BeachData | POIData | undefined;
        
        if (type === 'poi') {
          data = getPOIById(id);
        } else {
          data = getBeachById(id);
        }

        if (!data) {
          console.error(`[BeachDetailView] Could not find ${type} with ID ${id} in cache.`);
          setSidebar('home');
          return;
        }

        setDetailData(data);

        // Load weather data if available
        const cachedWeather = getWeatherData(id);
        if (cachedWeather) {
          setWeatherData(cachedWeather);
        } else {
          // TODO: Fetch weather data from API
          // For now, we'll use mock data or leave it null
        }
      } catch (error) {
        console.error('Error loading detail data:', error);
        setSidebar('home');
      } finally {
        setIsLoading(false);
      }
    };

    loadDetailData();
  }, [id, type, getBeachById, getPOIById, getWeatherData, setSidebar]);

  const handleBackClick = () => {
    setSidebar('beach-list');
  };

  const handleCloseClick = () => {
    setSidebar('home');
  };

  if (isLoading || !detailData) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isPOI = type === 'poi';
  const beach = detailData as BeachData;
  const poi = detailData as POIData;

  const title = isPOI ? (poi.name || poi.Name || 'Point of Interest') : beach.Name;
  const imageUrl = isPOI 
    ? (poi.mainImageUrl || poi["Main Image"] || poi.imageUrl)
    : beach["Main Image"];
  const googleMapsUrl = isPOI
    ? (poi["google-maps-link"] || poi.googleMapsUrl)
    : (beach["google-maps-link"] || beach.googleMapsUrl);
  const websiteUrl = isPOI ? undefined : beach.websiteUrl;

  return (
    <div 
      className="h-full flex flex-col bg-white"
      data-sidebar="beach"
    >
      {/* Header */}
      <div className="relative">
        {imageUrl && (
          <div className="relative h-48 w-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              data-beach-data="image"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button
            onClick={handleBackClick}
            className="modal_back-button p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            aria-label="Back to list"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleCloseClick}
            className="modal_close-button p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Title overlay */}
        {imageUrl && (
          <div className="absolute bottom-4 left-4 right-4">
            <h1 
              className="text-2xl font-bold text-white mb-1"
              data-beach-data="title"
            >
              {title}
            </h1>
            {!isPOI && beach.State && (
              <p className="text-white/90 text-sm">
                {beach["Location Cluster"] && `${beach["Location Cluster"]}, `}{beach.State}
              </p>
            )}
            {isPOI && (poi.State || poi.state) && (
              <p className="text-white/90 text-sm">
                {poi.categoryName || poi.category || poi.type}{poi.State || poi.state ? `, ${poi.State || poi.state}` : ''}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Title (if no image) */}
        {!imageUrl && (
          <div className="mb-6">
                         <h1 
               className="text-2xl font-bold text-gray-900 mb-2"
               data-beach-data="title"
             >
              {title}
            </h1>
            {!isPOI && beach.State && (
              <p className="text-gray-600">
                {beach["Location Cluster"] && `${beach["Location Cluster"]}, `}{beach.State}
              </p>
            )}
            {isPOI && (poi.State || poi.state) && (
              <p className="text-gray-600">
                {poi.categoryName || poi.category || poi.type}{poi.State || poi.state ? `, ${poi.State || poi.state}` : ''}
              </p>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              data-beach-data="address-link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Directions</span>
            </a>
          )}
          
          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              data-beach-data="website-link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="text-sm font-medium">Website</span>
            </a>
          )}
        </div>

        {/* Amenities (for beaches) */}
        {!isPOI && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${beach.restrooms ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm" data-beach-data="restrooms">Restrooms</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${beach.showers ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm" data-beach-data="showers">Showers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${beach.pets ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm" data-beach-data="pets">Pet Friendly</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${beach.parking ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm" data-beach-data="parking">Parking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${beach.camping ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm" data-beach-data="camping">Camping</span>
              </div>
            </div>
          </div>
        )}

        {/* Weather Information */}
        {weatherData && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Conditions</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {weatherData.airTemp && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Air Temperature</span>
                                     <span className="text-sm font-medium" data-beach-data="air-temp">{weatherData.airTemp}°F</span>
                </div>
              )}
              {weatherData.waterTemp && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Water Temperature</span>
                                     <span className="text-sm font-medium" data-beach-data="water-temp">{weatherData.waterTemp}°F</span>
                </div>
              )}
              {weatherData.wind && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Wind</span>
                                     <span className="text-sm font-medium" data-beach-data="wind">{weatherData.wind} mph</span>
                </div>
              )}
              {weatherData.uvIndex && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">UV Index</span>
                                     <span className="text-sm font-medium" data-beach-data="uv-index">{weatherData.uvIndex}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Type indicator */}
        <div className="pt-4 border-t border-gray-200">
          <span className={`inline-block px-3 py-1 text-sm rounded-full ${
            isPOI 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {isPOI ? '📍 Point of Interest' : '🏖️ Beach'}
          </span>
        </div>
      </div>
    </div>
  );
}