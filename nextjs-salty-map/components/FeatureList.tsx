// =============================================================================
// FEATURE LIST COMPONENT
// =============================================================================

import React from 'react';
import Image from 'next/image';
import { Feature } from '@/types';
import styles from './FeatureList.module.css';

interface FeatureListProps {
  features: Feature[];
  featureType: 'state' | 'region' | 'beach' | 'poi';
  onSelect: (feature: Feature) => void;
}

export default function FeatureList({ features, featureType, onSelect }: FeatureListProps) {
  if (features.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No items in view. Pan or zoom the map to find some.</p>
      </div>
    );
  }

  // Sort features by name
  const sortedFeatures = [...features].sort((a, b) => {
    const nameA = a.properties.Name || a.properties.name || '';
    const nameB = b.properties.Name || b.properties.name || '';
    return nameA.localeCompare(nameB);
  });

  // Remove duplicates based on ID
  const uniqueFeatures = sortedFeatures.filter((feature, index, array) => {
    const id = feature.properties['Item ID'] || feature.id;
    return array.findIndex(f => (f.properties['Item ID'] || f.id) === id) === index;
  });

  return (
    <div className={styles.list}>
      {uniqueFeatures.map((feature) => (
        <FeatureListItem
          key={feature.properties['Item ID'] || feature.id}
          feature={feature}
          featureType={featureType}
          onClick={() => onSelect(feature)}
        />
      ))}
    </div>
  );
}

interface FeatureListItemProps {
  feature: Feature;
  featureType: string;
  onClick: () => void;
}

function FeatureListItem({ feature, featureType, onClick }: FeatureListItemProps) {
  const props = feature.properties;
  
  const getImageUrl = () => {
    return props['Main Image'] || props.mainImageUrl || props.IMAGE || 
      'https://cdn.prod.website-files.com/677e87dd7e4a4c73cbae4e0e/677e87dd7e4a4c73cbae4ee3_placeholder-image.svg';
  };

  const getName = () => {
    return props.Name || props.name || 'Unnamed';
  };

  const getSubtitle = () => {
    if (featureType === 'beach') {
      return (
        <>
          <span>{props['Location Cluster'] || ''}</span>
          {props['Location Cluster'] && props.State && <span className={styles.delimiter}> • </span>}
          <span>{props.State || ''}</span>
        </>
      );
    } else if (featureType === 'poi') {
      return (
        <>
          <span>{props.categoryName || props.category || 'POI'}</span>
          {props.customIconName && <span className={styles.delimiter}> • </span>}
          <span>{props.customIconName || ''}</span>
        </>
      );
    }
    return null;
  };

  return (
    <div className={styles.item} onClick={onClick}>
      <div className={styles.imageWrapper}>
        <Image
          src={getImageUrl()}
          alt={getName()}
          width={80}
          height={80}
          className={styles.image}
          unoptimized // For external images
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{getName()}</h3>
        <p className={styles.subtitle}>{getSubtitle()}</p>
      </div>
    </div>
  );
}