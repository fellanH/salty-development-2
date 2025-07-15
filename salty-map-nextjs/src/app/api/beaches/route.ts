import { NextRequest, NextResponse } from 'next/server';

// Future use for Webflow integration
// interface WebflowBeach {
//   id: string;
//   name: string;
//   slug: string;
//   "main-image"?: {
//     url: string;
//     alt?: string;
//   };
//   state?: string;
//   "location-cluster"?: string;
//   "google-maps-link"?: string;
//   "website-url"?: string;
//   restrooms?: boolean;
//   showers?: boolean;
//   pets?: boolean;
//   parking?: boolean;
//   camping?: boolean;
//   coordinates?: {
//     lat: number;
//     lng: number;
//   };
// }

interface TransformedBeach {
  id: string;
  Name: string;
  "Main Image"?: string;
  State?: string;
  "Location Cluster"?: string;
  "google-maps-link"?: string;
  googleMapsUrl?: string;
  websiteUrl?: string;
  restrooms?: boolean;
  showers?: boolean;
  pets?: boolean;
  parking?: boolean;
  camping?: boolean;
  coordinates?: [number, number];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // If ID is provided, fetch single beach
    if (id) {
      return await fetchSingleBeach(id);
    }

    // Otherwise, fetch all beaches
    return await fetchAllBeaches();
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch beach data' },
      { status: 500 }
    );
  }
}

async function fetchAllBeaches() {
  try {
    // This would typically fetch from Webflow API
    // For now, we'll return mock data that matches the expected structure
    const mockBeaches: TransformedBeach[] = [
      {
        id: "beach-1",
        Name: "Santa Monica Beach",
        "Main Image": "https://images.unsplash.com/photo-1582687036630-d9b7b95f0e4e?w=400",
        State: "California",
        "Location Cluster": "Los Angeles County",
        "google-maps-link": "https://maps.google.com/?q=Santa+Monica+Beach",
        googleMapsUrl: "https://maps.google.com/?q=Santa+Monica+Beach",
        websiteUrl: "https://www.santamonica.com/beaches/",
        restrooms: true,
        showers: true,
        pets: false,
        parking: true,
        camping: false,
        coordinates: [-118.4912, 34.0195],
      },
      {
        id: "beach-2",
        Name: "Malibu Beach",
        "Main Image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
        State: "California",
        "Location Cluster": "Los Angeles County",
        "google-maps-link": "https://maps.google.com/?q=Malibu+Beach",
        googleMapsUrl: "https://maps.google.com/?q=Malibu+Beach",
        restrooms: true,
        showers: false,
        pets: true,
        parking: true,
        camping: false,
        coordinates: [-118.6919, 34.0259],
      },
      {
        id: "beach-3",
        Name: "Venice Beach",
        "Main Image": "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400",
        State: "California",
        "Location Cluster": "Los Angeles County",
        "google-maps-link": "https://maps.google.com/?q=Venice+Beach",
        googleMapsUrl: "https://maps.google.com/?q=Venice+Beach",
        restrooms: true,
        showers: true,
        pets: false,
        parking: true,
        camping: false,
        coordinates: [-118.4694, 33.9850],
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockBeaches,
      count: mockBeaches.length
    });
  } catch (error) {
    console.error('Error fetching all beaches:', error);
    throw error;
  }
}

async function fetchSingleBeach(id: string) {
  try {
    // Fetch single beach - this would typically call Webflow API
    // For now, return mock data
    const mockBeach: TransformedBeach = {
      id: id,
      Name: "Sample Beach",
      "Main Image": "https://images.unsplash.com/photo-1582687036630-d9b7b95f0e4e?w=400",
      State: "California",
      "Location Cluster": "Sample County",
      "google-maps-link": "https://maps.google.com/?q=Sample+Beach",
      googleMapsUrl: "https://maps.google.com/?q=Sample+Beach",
      restrooms: true,
      showers: true,
      pets: false,
      parking: true,
      camping: false,
      coordinates: [-118.4912, 34.0195],
    };

    return NextResponse.json({
      success: true,
      data: mockBeach
    });
  } catch (error) {
    console.error('Error fetching single beach:', error);
    throw error;
  }
}