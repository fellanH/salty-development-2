import fetch from 'node-fetch';

// Fetch Collection Schema dynamically to identify Option fields
async function retrieveCollectionSchema() {
  const url = `https://api.webflow.com/v2/collections/${process.env.POI_COLLECTION_ID}`;
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.WEBFLOW_API_TOKEN}`,
      accept: 'application/json',
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Webflow API error: ${response.status}`);
    }
    const data = await response.json();
    return data.fields;
  } catch (error) {
    console.error('[POI API] Error fetching collection schema:', error.message);
    throw error;
  }
}

async function createDynamicMaps() {
  const fields = await retrieveCollectionSchema();
  const dynamicMaps = {
    categoryMap: new Map(),
    iconMap: new Map(),
    typeMap: new Map(),
  };

  fields.forEach(field => {
    if (field.type === 'Option' && field.options && field.options.choices) {
      const mapToUpdate = getMapForFieldSlug(field.slug, dynamicMaps);
      if (mapToUpdate) {
        field.options.choices.forEach(choice => {
          mapToUpdate.set(choice.id, choice.name || choice);
        });
      }
    }
  });

  return dynamicMaps;
}

function getMapForFieldSlug(fieldSlug, dynamicMaps) {
  const slugToMapMapping = {
    'category-name': dynamicMaps.categoryMap,
    'custom-icon-name': dynamicMaps.iconMap,
    'type': dynamicMaps.typeMap,
  };
  return slugToMapMapping[fieldSlug] || null;
}

function transformPOIs(pois, maps) {
  return pois.map(poi => {
    const poiData = { ...poi };
    
    // Transform all the choice fields to their display names
    Object.keys(poiData).forEach(key => {
      const value = poiData[key];
      if (value && typeof value === 'string') {
        // Check each map for a matching ID
        for (const [mapName, mapData] of Object.entries(maps)) {
          if (mapData.has(value)) {
            poiData[key] = mapData.get(value);
            break;
          }
        }
      }
    });

    // Transform coordinates if they exist
    if (poiData.longitude && poiData.latitude) {
      poiData.geometry = {
        type: 'Point',
        coordinates: [parseFloat(poiData.longitude), parseFloat(poiData.latitude)]
      };
    }

    return poiData;
  });
}

async function retrieveAllPOIs() {
  const allPOIs = [];
  let offset = 0;
  const limitPerRequest = 100;

  while (true) {
    console.log(`[POI API] Fetching POIs: offset=${offset}, limit=${limitPerRequest}`);
    
    const url = `https://api.webflow.com/v2/collections/${process.env.POI_COLLECTION_ID}/items?limit=${limitPerRequest}&offset=${offset}`;
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.WEBFLOW_API_TOKEN}`,
        accept: 'application/json',
      },
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.text();
      console.error('[POI API] Error response:', errorData);
      throw new Error(`Failed to fetch POIs. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[POI API] Fetched ${data.items?.length || 0} POIs in this batch`);
    
    if (!data.items || data.items.length === 0) {
      break;
    }

    allPOIs.push(...data.items);
    offset += limitPerRequest;
  }

  console.log(`[POI API] Total POIs fetched: ${allPOIs.length}`);
  return allPOIs;
}

export default async function handlePOIsRequest(req, res) {
  try {
    const maps = await createDynamicMaps();
    const rawPOIs = await retrieveAllPOIs();
    const processedPOIs = transformPOIs(rawPOIs, maps);
    
    res.json(processedPOIs);
  } catch (error) {
    console.error('Error in POIs API:', error);
    res.status(500).json({ error: 'Failed to fetch POIs' });
  }
} 