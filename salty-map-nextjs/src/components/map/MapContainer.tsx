'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { Config } from '@/lib/config';
import { useAppContext } from '@/lib/context/AppContext';

interface MapContainerProps {
  className?: string;
}

export default function MapContainer({ className = '' }: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { setMapInstance, setSelection, setSidebar } = useAppContext();

  // Initialize map
  const setupEventHandlers = useCallback((mapInstance: mapboxgl.Map) => {
    const LAYER_IDS_LOCAL = {
      STATES: "salty-state",
      CALIFORNIA: "California", 
      HAWAII: "Hawaii",
      REGIONS: "salty-city",
      BEACHES: "salty-beaches",
      POIS: "salty-pois",
    };

    // Click handlers for different layers
    const setupLayerClick = (layerId: string, featureType: 'beach' | 'poi' | 'state' | 'region') => {
      mapInstance.on('click', layerId, (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const id = feature.properties?.id || feature.id;
          
          console.log(`[MapContainer] Clicked ${featureType}:`, id, feature.properties);
          
          setSelection(id, featureType, feature);
          
          if (featureType === 'beach' || featureType === 'poi') {
            setSidebar('beach');
            // Fly to the feature
            if (feature.geometry.type === 'Point') {
              mapInstance.flyTo({
                center: feature.geometry.coordinates as [number, number],
                zoom: Config.MAP.DETAIL_ZOOM,
                speed: Config.UI.MAP_FLY_SPEED,
              });
            }
          }
        }
      });

      // Change cursor on hover
      mapInstance.on('mouseenter', layerId, () => {
        mapInstance.getCanvas().style.cursor = 'pointer';
      });

      mapInstance.on('mouseleave', layerId, () => {
        mapInstance.getCanvas().style.cursor = '';
      });
    };

    // Setup click handlers for all layers
    setupLayerClick(LAYER_IDS_LOCAL.BEACHES, 'beach');
    setupLayerClick(LAYER_IDS_LOCAL.POIS, 'poi');
    setupLayerClick(LAYER_IDS_LOCAL.STATES, 'state');
    setupLayerClick(LAYER_IDS_LOCAL.REGIONS, 'region');

    // General map click handler (for clearing selection)
    mapInstance.on('click', (e) => {
      // Only clear selection if we didn't click on a feature
      if (!e.defaultPrevented) {
        // Small delay to allow feature clicks to be processed first
        setTimeout(() => {
          const features = mapInstance.queryRenderedFeatures(e.point);
          const relevantFeatures = features.filter(f => 
            f.layer && Object.values(LAYER_IDS_LOCAL).includes(f.layer.id)
          );
          
          if (relevantFeatures.length === 0) {
            setSelection('', 'beach'); // Clear selection
            setSidebar('home');
          }
        }, 50);
      }
    });
  }, [setSelection, setSidebar]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = Config.MAP.ACCESS_TOKEN;

    const isMobile = window.innerWidth <= Config.MAP.MOBILE_BREAKPOINT;
    
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: Config.MAP.STYLE,
      center: isMobile 
        ? Config.MAP.MOBILE_START_POSITION 
        : Config.MAP.DESKTOP_START_POSITION,
      zoom: Config.MAP.DEFAULT_ZOOM,
      pitch: Config.MAP.START_PITCH,
    });

    map.current = mapInstance;

    mapInstance.on('load', () => {
      setMapInstance(mapInstance);
      setupEventHandlers(mapInstance);
      console.log('✅ Map initialized with cloud-hosted data and styles.');
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [setMapInstance, setupEventHandlers]);

  // Handle responsive changes
  useEffect(() => {
    const handleResize = () => {
      if (map.current) {
        map.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={mapContainer} 
      id="map-container"
      className={`w-full h-full ${className}`}
      style={{ position: 'relative' }}
    />
  );
}