// =============================================================================
// BEACHES API ROUTE
// =============================================================================

import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

// Cache for schema and maps
let cachedMaps: any = null;

async function fetchCollectionSchema() {
  const url = `https://api.webflow.com/v2/collections/${process.env.WEBFLOW_BEACHES_COLLECTION_ID || '6786e26d4438e40d5e56c085'}`;
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.WEBFLOW_API_KEY}`,
      accept: 'application/json',
    },
  };
  
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Failed to fetch collection schema. Status: ${response.status}`);
  }
  
  const data = await response.json();
  return data.fields;
}

async function buildDynamicMaps() {
  if (cachedMaps) return cachedMaps;
  
  const fields = await fetchCollectionSchema();
  const dynamicMaps = {
    amenityMap: new Map(),
    stateMap: new Map([["6786e2af9c6a2351063637c3", "California"]]),
    countryMap: new Map([["6786e284e2c900faabaa0a18", "USA"]]),
  };

  fields.forEach((field: any) => {
    if (field.type === 'Option' && field.validations?.options) {
      field.validations.options.forEach((option: any) => {
        dynamicMaps.amenityMap.set(option.id, option.name);
      });
    }
  });

  // Manually add IDs for boolean-like reference fields
  dynamicMaps.amenityMap.set("6b73d4e3d426194b7f9f6ea26c80ddc6", "Yes"); // Parking
  dynamicMaps.amenityMap.set("1532e5124d30cb244fee23fb09719cac", "Yes"); // Restrooms
  dynamicMaps.amenityMap.set("d87cb03c387b95f3e27e64bb0d0e2b23", "Yes"); // Showers
  dynamicMaps.amenityMap.set("bd8c8bb55a6f40ac3e4e47cc6f9be8e9", "Yes"); // Pets
  dynamicMaps.amenityMap.set("10a95f73c7c3c7e967a948b17f77a38e", "Yes"); // Camping

  cachedMaps = dynamicMaps;
  return dynamicMaps;
}

// Simplified field mapping focusing on key data
const beachFieldMapping = {
  'name': 'Name',
  'state': 'State',
  'locationCluster': 'Location Cluster',
  'mainImage': 'Main Image',
  'slug': 'slug',
  'mapboxId': 'Mapbox Feature ID',
  'longitude': 'Longitude',
  'latitude': 'Latitude',
  'restrooms': 'restrooms-2',
  'showers': 'showers-2',
  'pets': 'pets-2',
  'parking': 'parking-2',
  'camping': 'camping-2',
  'address': 'address',
  'website': 'website',
};

function transformWebflowBeach(webflowItem: any, dynamicMaps: any) {
  const transformed: any = {
    id: webflowItem._id,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [
        parseFloat(webflowItem.fieldData[beachFieldMapping.longitude]),
        parseFloat(webflowItem.fieldData[beachFieldMapping.latitude])
      ]
    },
    properties: {}
  };

  // Map basic fields
  Object.entries(beachFieldMapping).forEach(([key, webflowField]) => {
    const value = webflowItem.fieldData[webflowField];
    
    if (key === 'state' && value) {
      transformed.properties[key] = dynamicMaps.stateMap.get(value) || value;
    } else if (['restrooms', 'showers', 'pets', 'parking', 'camping'].includes(key) && value) {
      transformed.properties[key] = dynamicMaps.amenityMap.get(value) === "Yes";
    } else if (value !== undefined && value !== null && value !== '') {
      transformed.properties[key] = value;
    }
  });

  return transformed;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Build dynamic maps for transformations
    const dynamicMaps = await buildDynamicMaps();

    if (id === 'collection') {
      // Fetch all beaches
      const url = `https://api.webflow.com/v2/collections/${process.env.WEBFLOW_BEACHES_COLLECTION_ID || '6786e26d4438e40d5e56c085'}/items`;
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.WEBFLOW_API_KEY}`,
          accept: 'application/json',
        },
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Failed to fetch beaches. Status: ${response.status}`);
      }

      const data = await response.json();
      const geoJson = {
        type: 'FeatureCollection',
        features: data.items.map((item: any) => transformWebflowBeach(item, dynamicMaps))
      };

      return res.status(200).json(geoJson);
    } else {
      // Fetch single beach
      const url = `https://api.webflow.com/v2/collections/${process.env.WEBFLOW_BEACHES_COLLECTION_ID || '6786e26d4438e40d5e56c085'}/items/${id}`;
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.WEBFLOW_API_KEY}`,
          accept: 'application/json',
        },
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: 'Beach not found' });
        }
        throw new Error(`Failed to fetch beach. Status: ${response.status}`);
      }

      const data = await response.json();
      const transformed = transformWebflowBeach(data, dynamicMaps);

      return res.status(200).json(transformed);
    }
  } catch (error) {
    console.error('Beach API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}