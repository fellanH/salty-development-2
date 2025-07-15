// =============================================================================
// POI API ROUTE
// =============================================================================

import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

// Cache for schema and maps
let cachedMaps: any = null;

async function fetchCollectionSchema() {
  const url = `https://api.webflow.com/v2/collections/${process.env.WEBFLOW_POI_COLLECTION_ID || '6786de91c5b6dbbb511c16df'}`;
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
    categoryMap: new Map(),
    iconMap: new Map(),
  };

  fields.forEach((field: any) => {
    if (field.type === 'Option' && field.validations?.options) {
      field.validations.options.forEach((option: any) => {
        if (field.slug === 'category') {
          dynamicMaps.categoryMap.set(option.id, option.name);
        } else if (field.slug === 'custom-icon') {
          dynamicMaps.iconMap.set(option.id, option.name);
        } else {
          dynamicMaps.categoryMap.set(option.id, option.name);
        }
      });
    }
  });

  cachedMaps = dynamicMaps;
  return dynamicMaps;
}

// POI field mapping
const poiFieldMapping = {
  'name': 'name',
  'mainImageUrl': 'main-image',
  'slug': 'slug',
  'mapboxId': 'mapbox-feature-id',
  'longitude': 'longitude',
  'latitude': 'latitude',
  'category': 'category',
  'customIconName': 'custom-icon',
  'categoryName': 'category-name',
  'address': 'address',
  'website': 'website',
};

function transformWebflowPOI(webflowItem: any, dynamicMaps: any) {
  const transformed: any = {
    id: webflowItem._id,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [
        parseFloat(webflowItem.fieldData[poiFieldMapping.longitude]),
        parseFloat(webflowItem.fieldData[poiFieldMapping.latitude])
      ]
    },
    properties: {}
  };

  // Map basic fields
  Object.entries(poiFieldMapping).forEach(([key, webflowField]) => {
    const value = webflowItem.fieldData[webflowField];
    
    if (key === 'category' && value) {
      transformed.properties[key] = dynamicMaps.categoryMap.get(value) || value;
    } else if (key === 'customIconName' && value) {
      transformed.properties[key] = dynamicMaps.iconMap.get(value) || value;
    } else if (value !== undefined && value !== null && value !== '') {
      transformed.properties[key] = value;
    }
  });

  // Add fallback for categoryName if not present
  if (!transformed.properties.categoryName && transformed.properties.category) {
    transformed.properties.categoryName = transformed.properties.category;
  }

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
      // Fetch all POIs
      const url = `https://api.webflow.com/v2/collections/${process.env.WEBFLOW_POI_COLLECTION_ID || '6786de91c5b6dbbb511c16df'}/items`;
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.WEBFLOW_API_KEY}`,
          accept: 'application/json',
        },
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Failed to fetch POIs. Status: ${response.status}`);
      }

      const data = await response.json();
      const geoJson = {
        type: 'FeatureCollection',
        features: data.items.map((item: any) => transformWebflowPOI(item, dynamicMaps))
      };

      return res.status(200).json(geoJson);
    } else {
      // Fetch single POI
      const url = `https://api.webflow.com/v2/collections/${process.env.WEBFLOW_POI_COLLECTION_ID || '6786de91c5b6dbbb511c16df'}/items/${id}`;
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
          return res.status(404).json({ error: 'POI not found' });
        }
        throw new Error(`Failed to fetch POI. Status: ${response.status}`);
      }

      const data = await response.json();
      const transformed = transformWebflowPOI(data, dynamicMaps);

      return res.status(200).json(transformed);
    }
  } catch (error) {
    console.error('POI API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}