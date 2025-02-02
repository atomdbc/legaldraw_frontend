import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    // Build the target URL
    const { path } = params;
    const { searchParams } = request.nextUrl;
    
    // Create the target URL with HTTPS
    const targetUrl = new URL(`https://secure.geonames.org/${path.join('/')}`);
    
    // Add all search params to the target URL
    searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value);
    });

    // Make the request to Geonames
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Geonames API error: ${response.status}`);
    }

    const data = await response.json();

    // Return the response with CORS headers
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('Geonames proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from Geonames' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}