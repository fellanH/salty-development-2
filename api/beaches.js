import fetch from 'node-fetch';

async function retrieveCollectionSchema() {
    const url = `https://api.webflow.com/v2/collections/${process.env.BEACHES_COLLECTION_ID}`;
    const options = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.WEBFLOW_API_TOKEN}`,
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

async function createDynamicMaps() {
    const fields = await retrieveCollectionSchema();
    const dynamicMaps = {
        amenityMap: new Map(),
        stateMap: new Map(),
        countryMap: new Map(),
        facilityMap: new Map(),
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
        'restrooms': dynamicMaps.amenityMap,
        'showers': dynamicMaps.amenityMap,
        'pets-allowed': dynamicMaps.amenityMap,
        'parking-lot-nearby': dynamicMaps.amenityMap,
        'camping': dynamicMaps.amenityMap,
        'bonfire': dynamicMaps.amenityMap,
        'pier': dynamicMaps.facilityMap,
        'fishing': dynamicMaps.facilityMap,
        'picnic': dynamicMaps.facilityMap,
        'surfing': dynamicMaps.facilityMap,
        'recreation': dynamicMaps.facilityMap,
        'state': dynamicMaps.stateMap,
        'country': dynamicMaps.countryMap,
    };
    return slugToMapMapping[fieldSlug] || null;
}

// Helper to safely parse floats from strings like "51.4℉"
const parseFloatFromString = (str) => {
    if (typeof str !== 'string') return str;
    return parseFloat(str);
};

function transformBeaches(beaches, maps) {
    return beaches.map(beach => {
        const beachData = { ...beach };
        
        // Transform all the choice fields to their display names
        Object.keys(beachData).forEach(key => {
            const value = beachData[key];
            if (value && typeof value === 'string') {
                // Check each map for a matching ID
                for (const [mapName, mapData] of Object.entries(maps)) {
                    if (mapData.has(value)) {
                        beachData[key] = mapData.get(value);
                        break;
                    }
                }
            }
        });

        // Transform coordinates if they exist
        if (beachData.longitude && beachData.latitude) {
            beachData.geometry = {
                type: 'Point',
                coordinates: [parseFloat(beachData.longitude), parseFloat(beachData.latitude)]
            };
        }

        return beachData;
    });
}

async function retrieveAllBeaches() {
    const allBeaches = [];
    let offset = 0;
    const limitPerRequest = 100;

    while (true) {
        console.log(`[API] Fetching beaches: offset=${offset}, limit=${limitPerRequest}`);
        
        const url = `https://api.webflow.com/v2/collections/${process.env.BEACHES_COLLECTION_ID}/items?limit=${limitPerRequest}&offset=${offset}`;
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
            console.error('[API] Error response:', errorData);
            throw new Error(`Failed to fetch beaches. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`[API] Fetched ${data.items?.length || 0} beaches in this batch`);
        
        if (!data.items || data.items.length === 0) {
            break;
        }

        allBeaches.push(...data.items);
        offset += limitPerRequest;
    }

    console.log(`[API] Total beaches fetched: ${allBeaches.length}`);
    return allBeaches;
}

export default async function handleBeachesRequest(req, res) {
    try {
        const maps = await createDynamicMaps();
        const rawBeaches = await retrieveAllBeaches();
        const processedBeaches = transformBeaches(rawBeaches, maps);
        
        res.json(processedBeaches);
    } catch (error) {
        console.error('Error in beaches API:', error);
        res.status(500).json({ error: 'Failed to fetch beaches' });
    }
} 