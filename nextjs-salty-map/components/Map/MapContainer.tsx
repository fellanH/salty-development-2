// =============================================================================
// MAP CONTAINER COMPONENT
// =============================================================================

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useApp } from '@/contexts/AppContext';
import { Config } from '@/config';
import { Utils } from '@/utils';
import { Feature } from '@/types';
import styles from './Map.module.css';

export default function MapContainer() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const hoveredFeatureRef = useRef<Feature | null>(null);
  const { state, dispatch, selectState, selectRegion, selectBeach, selectPOI } = useApp();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = Config.MAP.ACCESS_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: Config.MAP.STYLE,
      center: Utils.isMobileView() 
        ? Config.MAP.MOBILE_START_POSITION 
        : Config.MAP.DESKTOP_START_POSITION,
      zoom: Config.MAP.DEFAULT_ZOOM,
      pitch: Config.MAP.START_PITCH,
    });

    map.current.on('load', () => {
      dispatch({ type: 'SET_MAP_INSTANCE', payload: map.current });
      setupEventHandlers();
    });

    return () => {
      map.current?.remove();
    };
  }, [dispatch]);

  // Setup map event handlers
  const setupEventHandlers = () => {
    if (!map.current) return;

    // Cursor change on hover
    const interactiveLayers = [
      Config.LAYER_IDS.STATES,
      Config.LAYER_IDS.REGIONS,
      Config.LAYER_IDS.BEACHES,
      Config.LAYER_IDS.POIS,
    ];

    interactiveLayers.forEach(layerId => {
      map.current!.on('mouseenter', layerId, () => {
        map.current!.getCanvas().style.cursor = 'pointer';
      });

      map.current!.on('mouseleave', layerId, () => {
        map.current!.getCanvas().style.cursor = '';
      });
    });

    // Click handlers
    map.current.on('click', Config.LAYER_IDS.STATES, handleStateClick);
    map.current.on('click', Config.LAYER_IDS.REGIONS, handleRegionClick);
    map.current.on('click', Config.LAYER_IDS.BEACHES, handleBeachClick);
    map.current.on('click', Config.LAYER_IDS.POIS, handlePOIClick);

    // Hover handlers for popups
    map.current.on('mousemove', handleMouseMove);
    map.current.on('mouseleave', 'map', handleMouseLeave);
  };

  // Handle state click
  const handleStateClick = (e: mapboxgl.MapLayerMouseEvent) => {
    e.originalEvent.stopPropagation();
    if (e.features && e.features.length > 0) {
      const feature = e.features[0] as unknown as Feature;
      selectState(feature);
      zoomToFeature(feature);
    }
  };

  // Handle region click
  const handleRegionClick = (e: mapboxgl.MapLayerMouseEvent) => {
    e.originalEvent.stopPropagation();
    if (e.features && e.features.length > 0) {
      const feature = e.features[0] as unknown as Feature;
      selectRegion(feature);
      zoomToFeature(feature);
    }
  };

  // Handle beach click
  const handleBeachClick = (e: mapboxgl.MapLayerMouseEvent) => {
    e.originalEvent.stopPropagation();
    if (e.features && e.features.length > 0) {
      const feature = e.features[0] as unknown as Feature;
      const beach = {
        id: feature.properties['Item ID'] || String(feature.id),
        name: feature.properties.Name || '',
        state: feature.properties.State || '',
        locationCluster: feature.properties['Location Cluster'] || '',
        coordinates: feature.geometry.coordinates as [number, number],
        mainImage: feature.properties['Main Image'],
        address: feature.properties.address,
        website: feature.properties.website,
        restrooms: feature.properties.restrooms,
        showers: feature.properties.showers,
        pets: feature.properties.pets,
        parking: feature.properties.parking,
        camping: feature.properties.camping,
      };
      selectBeach(beach);
      centerOnFeature(feature);
    }
  };

  // Handle POI click
  const handlePOIClick = (e: mapboxgl.MapLayerMouseEvent) => {
    e.originalEvent.stopPropagation();
    if (e.features && e.features.length > 0) {
      const feature = e.features[0] as unknown as Feature;
      const poi = {
        id: feature.properties['Item ID'] || String(feature.id),
        name: feature.properties.name || '',
        category: feature.properties.category || '',
        categoryName: feature.properties.categoryName || '',
        coordinates: feature.geometry.coordinates as [number, number],
        mainImageUrl: feature.properties.mainImageUrl,
        address: feature.properties.address,
        website: feature.properties.website,
        customIconName: feature.properties.customIconName,
      };
      selectPOI(poi);
      centerOnFeature(feature);
    }
  };

  // Handle mouse move for popups
  const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
    if (!map.current) return;

    const features = map.current.queryRenderedFeatures(e.point, {
      layers: [Config.LAYER_IDS.STATES, Config.LAYER_IDS.REGIONS, Config.LAYER_IDS.BEACHES, Config.LAYER_IDS.POIS]
    });

    if (features.length > 0) {
      const feature = features[0] as unknown as Feature;
      
      // Only update if hovering over a different feature
      if (hoveredFeatureRef.current?.id !== feature.id) {
        hoveredFeatureRef.current = feature;
        showPopup(feature, e.lngLat);
      }
    } else {
      handleMouseLeave();
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    hoveredFeatureRef.current = null;
    removePopup();
  };

  // Show popup
  const showPopup = (feature: Feature, lngLat: mapboxgl.LngLat) => {
    removePopup();

    const content = getPopupContent(feature);
    if (!content) return;

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: Config.UI.POPUP_OFFSET,
    })
      .setLngLat(lngLat)
      .setHTML(content)
      .addTo(map.current!);

    // Store popup reference for cleanup
    (map.current as any)._popup = popup;
  };

  // Remove popup
  const removePopup = () => {
    const popup = (map.current as any)?._popup;
    if (popup) {
      popup.remove();
      (map.current as any)._popup = null;
    }
  };

  // Get popup content based on feature type
  const getPopupContent = (feature: Feature): string => {
    const props = feature.properties;
    
    if (props.NAME) {
      // State
      return `<div class="${styles.popup}"><strong>${props.NAME}</strong></div>`;
    } else if (props.name && props.category) {
      // POI
      return `<div class="${styles.popup}">
        <strong>${props.name}</strong>
        <br>${props.categoryName || props.category}
      </div>`;
    } else if (props.Name) {
      // Beach or Region
      return `<div class="${styles.popup}">
        <strong>${props.Name}</strong>
        ${props['Location Cluster'] ? `<br>${props['Location Cluster']}` : ''}
      </div>`;
    }
    
    return '';
  };

  // Zoom to feature
  const zoomToFeature = (feature: Feature) => {
    if (!map.current) return;

    if (feature.geometry.type === 'Point') {
      map.current.flyTo({
        center: feature.geometry.coordinates as [number, number],
        zoom: Config.MAP.DETAIL_ZOOM,
        speed: Config.UI.MAP_FLY_SPEED,
      });
    } else if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
      const bounds = new mapboxgl.LngLatBounds();
      
      const addCoordinatesToBounds = (coords: any) => {
        if (Array.isArray(coords[0]) && typeof coords[0][0] === 'number') {
          coords.forEach((coord: [number, number]) => bounds.extend(coord));
        } else {
          coords.forEach((ring: any) => addCoordinatesToBounds(ring));
        }
      };
      
      addCoordinatesToBounds(feature.geometry.coordinates);
      
      map.current.fitBounds(bounds, {
        padding: 50,
        speed: Config.UI.MAP_FLY_SPEED,
      });
    }
  };

  // Center on feature
  const centerOnFeature = (feature: Feature) => {
    if (!map.current) return;

    map.current.flyTo({
      center: feature.geometry.coordinates as [number, number],
      zoom: map.current.getZoom(),
      speed: Config.UI.MAP_FLY_SPEED,
    });
  };

  // Handle responsive updates
  useEffect(() => {
    const handleResize = Utils.debounce(() => {
      if (map.current) {
        map.current.resize();
      }
    }, 300);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={mapContainer} 
      className={styles.mapContainer}
      id={Config.SELECTORS.MAP_CONTAINER}
    />
  );
}