// =============================================================================
// DETAIL VIEW COMPONENT
// =============================================================================

import React from 'react';
import Image from 'next/image';
import { Beach, POI, WeatherData } from '@/types';
import styles from './DetailView.module.css';

interface DetailViewProps {
  feature: Beach | POI;
  weatherData?: WeatherData | null;
  onBack: () => void;
  onClose: () => void;
}

export default function DetailView({ feature, weatherData, onBack, onClose }: DetailViewProps) {
  const isBeach = 'locationCluster' in feature;
  
  const getImageUrl = () => {
    if (isBeach) {
      return (feature as Beach).mainImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800';
    } else {
      return (feature as POI).mainImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
    }
  };

  const formatAddress = (address?: string) => {
    if (!address) return 'Address not available';
    return address;
  };

  return (
    <div className={styles.detailView}>
      {/* Image */}
      <div className={styles.imageWrapper}>
        <Image
          src={getImageUrl()}
          alt={feature.name}
          width={400}
          height={250}
          className={styles.image}
          unoptimized
        />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h1 className={styles.title}>{feature.name}</h1>
        
        {/* Location Info */}
        <div className={styles.section}>
          <h3>Location</h3>
          <p className={styles.address}>{formatAddress(feature.address)}</p>
          {feature.address && (
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(feature.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              View on Google Maps →
            </a>
          )}
        </div>

        {/* Website */}
        {feature.website && (
          <div className={styles.section}>
            <h3>Website</h3>
            <a 
              href={feature.website}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Visit Website →
            </a>
          </div>
        )}

        {/* Beach Amenities */}
        {isBeach && (
          <div className={styles.section}>
            <h3>Amenities</h3>
            <div className={styles.amenities}>
              <AmenityItem label="Restrooms" value={(feature as Beach).restrooms} />
              <AmenityItem label="Showers" value={(feature as Beach).showers} />
              <AmenityItem label="Pets Allowed" value={(feature as Beach).pets} />
              <AmenityItem label="Parking" value={(feature as Beach).parking} />
              <AmenityItem label="Camping" value={(feature as Beach).camping} />
            </div>
          </div>
        )}

        {/* POI Category */}
        {!isBeach && (
          <div className={styles.section}>
            <h3>Category</h3>
            <p>{(feature as POI).categoryName || (feature as POI).category}</p>
          </div>
        )}

        {/* Weather Data (for beaches) */}
        {isBeach && weatherData && (
          <div className={styles.section}>
            <h3>Current Weather</h3>
            <div className={styles.weather}>
              {weatherData.airTemp && <WeatherItem label="Air Temp" value={`${weatherData.airTemp}°F`} />}
              {weatherData.waterTemp && <WeatherItem label="Water Temp" value={`${weatherData.waterTemp}°F`} />}
              {weatherData.windSpeed && <WeatherItem label="Wind" value={`${weatherData.windSpeed} mph`} />}
              {weatherData.waveHeight && <WeatherItem label="Wave Height" value={`${weatherData.waveHeight} ft`} />}
              {weatherData.uvIndex && <WeatherItem label="UV Index" value={weatherData.uvIndex} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AmenityItem({ label, value }: { label: string; value?: boolean }) {
  return (
    <div className={styles.amenityItem}>
      <span className={styles.amenityLabel}>{label}:</span>
      <span className={`${styles.amenityValue} ${value ? styles.yes : styles.no}`}>
        {value ? 'Yes' : 'No'}
      </span>
    </div>
  );
}

function WeatherItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={styles.weatherItem}>
      <span className={styles.weatherLabel}>{label}:</span>
      <span className={styles.weatherValue}>{value}</span>
    </div>
  );
}