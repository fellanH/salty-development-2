// =============================================================================
// SIDEBAR COMPONENT
// =============================================================================

import React from 'react';
import { useApp } from '@/contexts/AppContext';
import FeatureList from '@/components/FeatureList';
import DetailView from '@/components/DetailView';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const { state, resetSelection, setSidebarView } = useApp();
  const { sidebarView, selectedState, selectedRegion, selectedBeach, selectedPOI, featuresList } = state;

  const handleBack = () => {
    if (sidebarView === 'beach' || sidebarView === 'poi') {
      setSidebarView('list');
    } else if (sidebarView === 'list' && selectedRegion) {
      setSidebarView('region');
    } else if (sidebarView === 'region' && selectedState) {
      setSidebarView('state');
    } else {
      setSidebarView('home');
    }
  };

  const handleClose = () => {
    resetSelection();
  };

  return (
    <div className={styles.sidebar}>
      {/* Header */}
      {sidebarView !== 'home' && (
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            ← Back
          </button>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>
      )}

      {/* Content */}
      <div className={styles.content}>
        {sidebarView === 'home' && (
          <div className={styles.home}>
            <h1>Salty Map</h1>
            <p>Click on a state to start exploring beaches and points of interest.</p>
          </div>
        )}

        {sidebarView === 'state' && selectedState && (
          <div className={styles.stateView}>
            <h2>{selectedState.properties.NAME}</h2>
            <p>Select a region to see beaches and POIs</p>
          </div>
        )}

        {sidebarView === 'region' && selectedRegion && (
          <div className={styles.regionView}>
            <h2>{selectedRegion.properties.name || selectedRegion.properties.Name}</h2>
            <p>Select beaches and POIs to explore</p>
          </div>
        )}

        {sidebarView === 'list' && (
          <FeatureList 
            features={featuresList}
            featureType={featuresList[0]?.properties.category ? 'poi' : 'beach'}
            onSelect={(feature) => {
              // Feature selection is handled by the map clicks
            }}
          />
        )}

        {sidebarView === 'beach' && selectedBeach && (
          <DetailView 
            feature={selectedBeach}
            weatherData={state.weatherData}
            onBack={handleBack}
            onClose={handleClose}
          />
        )}

        {sidebarView === 'poi' && selectedPOI && (
          <DetailView 
            feature={selectedPOI}
            weatherData={null}
            onBack={handleBack}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
}