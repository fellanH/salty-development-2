import { NextRequest, NextResponse } from 'next/server';

// Future use for Webflow integration
// interface WebflowPOI {
//   id: string;
//   name: string;
//   slug: string;
//   "main-image"?: {
//     url: string;
//     alt?: string;
//   };
//   "category-name"?: string;
//   category?: string;
//   type?: string;
//   "custom-icon"?: string;
//   state?: string;
//   "google-maps-link"?: string;
//   coordinates?: {
//     lat: number;
//     lng: number;
//   };
// }

interface TransformedPOI {
  id: string;
  name: string;
  Name?: string;
  mainImageUrl?: string;
  "Main Image"?: string;
  imageUrl?: string;
  categoryName?: string;
  category?: string;
  type?: string;
  customIconName?: string;
  "Custom Icon"?: string;
  State?: string;
  state?: string;
  "google-maps-link"?: string;
  googleMapsUrl?: string;
  coordinates?: [number, number];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // If ID is provided, fetch single POI
    if (id) {
      return await fetchSinglePOI(id);
    }

    // Otherwise, fetch all POIs
    return await fetchAllPOIs();
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch POI data' },
      { status: 500 }
    );
  }
}

async function fetchAllPOIs() {
  try {
    // This would typically fetch from Webflow API
    // For now, we'll return mock data that matches the expected structure
    const mockPOIs: TransformedPOI[] = [
      {
        id: "poi-1",
        name: "Santa Monica Pier",
        Name: "Santa Monica Pier",
        mainImageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400",
        "Main Image": "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400",
        categoryName: "Amusement Park",
        category: "Entertainment",
        type: "Attraction",
        State: "California",
        state: "California",
        "google-maps-link": "https://maps.google.com/?q=Santa+Monica+Pier",
        googleMapsUrl: "https://maps.google.com/?q=Santa+Monica+Pier",
        coordinates: [-118.4981, 34.0092],
      },
      {
        id: "poi-2",
        name: "Griffith Observatory",
        Name: "Griffith Observatory",
        mainImageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
        "Main Image": "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
        categoryName: "Observatory",
        category: "Science",
        type: "Museum",
        State: "California",
        state: "California",
        "google-maps-link": "https://maps.google.com/?q=Griffith+Observatory",
        googleMapsUrl: "https://maps.google.com/?q=Griffith+Observatory",
        coordinates: [-118.3004, 34.1184],
      },
      {
        id: "poi-3",
        name: "Venice Beach Boardwalk",
        Name: "Venice Beach Boardwalk",
        mainImageUrl: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=400",
        "Main Image": "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=400",
        categoryName: "Boardwalk",
        category: "Recreation",
        type: "Attraction",
        State: "California",
        state: "California",
        "google-maps-link": "https://maps.google.com/?q=Venice+Beach+Boardwalk",
        googleMapsUrl: "https://maps.google.com/?q=Venice+Beach+Boardwalk",
        coordinates: [-118.4735, 33.9850],
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockPOIs,
      count: mockPOIs.length
    });
  } catch (error) {
    console.error('Error fetching all POIs:', error);
    throw error;
  }
}

async function fetchSinglePOI(id: string) {
  try {
    // Fetch single POI - this would typically call Webflow API
    // For now, return mock data
    const mockPOI: TransformedPOI = {
      id: id,
      name: "Sample POI",
      Name: "Sample POI",
      mainImageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
      "Main Image": "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
      categoryName: "Sample Category",
      category: "Sample",
      type: "Attraction",
      State: "California",
      state: "California",
      "google-maps-link": "https://maps.google.com/?q=Sample+POI",
      googleMapsUrl: "https://maps.google.com/?q=Sample+POI",
      coordinates: [-118.4981, 34.0092],
    };

    return NextResponse.json({
      success: true,
      data: mockPOI
    });
  } catch (error) {
    console.error('Error fetching single POI:', error);
    throw error;
  }
}