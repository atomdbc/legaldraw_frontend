// src/app/api/geonames/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams, pathname } = request.nextUrl;
    const path = pathname.replace('/api/geonames/', '');
    
    // Create URL to geonames secure endpoint
    const targetUrl = new URL(`https://secure.geonames.org/${path}`);
    searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value);
    });


    const response = await fetch(targetUrl.toString(), {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Geonames API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Geonames proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from Geonames', geonames: [] },
      { status: 500 }
    );
  }
}