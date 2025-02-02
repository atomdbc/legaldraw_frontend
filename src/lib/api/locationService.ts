const GEONAMES_USERNAME = process.env.NEXT_PUBLIC_GEONAMES_USERNAME;
const API_BASE_URL = '/api/geonames';

// Type definitions first
export interface GeoLocation {
  geonameId: string | number;
  countryCode?: string;
  countryName?: string;
  adminCode1?: string;
  adminName1?: string;
  toponymName: string;
  displayName: string;
  value: string;
}

interface GeoNamesCountry {
  geonameId: number;
  countryCode: string;
  countryName: string;
}

interface GeoNamesState {
  geonameId: number;
  adminCode1: string;
  adminName1: string;
  toponymName: string;
}

interface CacheEntry {
  data: GeoLocation[];
  timestamp: number;
}

// Default values
export const DEFAULT_LOCATION = {
  COUNTRY_ID: '6252001',
  COUNTRY_CODE: 'US',
  COUNTRY_NAME: 'United States',
  STATE: 'Delaware',
  STATE_CODE: 'DE'
} as const;

// Default countries list
const DEFAULT_COUNTRIES: GeoLocation[] = [
  {
    geonameId: DEFAULT_LOCATION.COUNTRY_ID,
    countryCode: DEFAULT_LOCATION.COUNTRY_CODE,
    countryName: DEFAULT_LOCATION.COUNTRY_NAME,
    toponymName: DEFAULT_LOCATION.COUNTRY_NAME,
    displayName: DEFAULT_LOCATION.COUNTRY_NAME,
    value: DEFAULT_LOCATION.COUNTRY_NAME
  },
  {
    geonameId: '2635167',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    toponymName: 'United Kingdom',
    displayName: 'United Kingdom',
    value: 'United Kingdom'
  },
  {
    geonameId: '2077456',
    countryCode: 'CA',
    countryName: 'Canada',
    toponymName: 'Canada',
    displayName: 'Canada',
    value: 'Canada'
  }
];

// Default states list
const DEFAULT_STATES: GeoLocation[] = [
  {
    geonameId: '4142224',
    adminCode1: 'DE',
    adminName1: 'Delaware',
    toponymName: 'Delaware',
    displayName: 'Delaware',
    value: 'Delaware'
  },
  {
    geonameId: '5128638',
    adminCode1: 'NY',
    adminName1: 'New York',
    toponymName: 'New York',
    displayName: 'New York',
    value: 'New York'
  },
  {
    geonameId: '5332921',
    adminCode1: 'CA',
    adminName1: 'California',
    toponymName: 'California',
    displayName: 'California',
    value: 'California'
  }
];

// Cache implementation
class LocationCache {
  private static instance: LocationCache;
  private cache: Map<string, CacheEntry>;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {
    this.cache = new Map();
    if (typeof window !== 'undefined') {
      try {
        const savedCache = localStorage.getItem('locationCache');
        if (savedCache) {
          const parsed = JSON.parse(savedCache);
          Object.entries(parsed).forEach(([key, value]) => {
            this.cache.set(key, value as CacheEntry);
          });
        }
      } catch (error) {
        console.error('Error loading cache from localStorage:', error);
      }
    }
  }

  static getInstance(): LocationCache {
    if (!LocationCache.instance) {
      LocationCache.instance = new LocationCache();
    }
    return LocationCache.instance;
  }

  set(key: string, data: GeoLocation[]): void {
    const entry = { data, timestamp: Date.now() };
    this.cache.set(key, entry);

    if (typeof window !== 'undefined') {
      try {
        const cacheObj = Object.fromEntries(this.cache.entries());
        localStorage.setItem('locationCache', JSON.stringify(cacheObj));
      } catch (error) {
        console.error('Error saving cache to localStorage:', error);
      }
    }
  }

  get(key: string): GeoLocation[] | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      if (typeof window !== 'undefined') {
        try {
          const cacheObj = Object.fromEntries(this.cache.entries());
          localStorage.setItem('locationCache', JSON.stringify(cacheObj));
        } catch (error) {
          console.error('Error updating cache in localStorage:', error);
        }
      }
      return null;
    }
    
    return cached.data;
  }

  clear(): void {
    this.cache.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('locationCache');
    }
  }
}

// API request helper
async function makeApiRequest(endpoint: string, params: Record<string, string>) {
  const searchParams = new URLSearchParams({
    ...params,
    username: GEONAMES_USERNAME || ''
  });
  
  try {
    // Use relative URL to ensure it goes through our proxy
    const url = `/api/geonames/${endpoint}?${searchParams.toString()}`;
    console.log('Making request to:', url); // Debug log
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      console.error('API response not ok:', response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('API request failed:', endpoint, error);
    // Return default data instead of throwing
    return new Response(JSON.stringify({ geonames: [] }), {
      headers: { 'content-type': 'application/json' },
    });
  }
}


// Location service class
class LocationService {
  private cache: LocationCache;

  constructor() {
    this.cache = LocationCache.getInstance();
  }

  async getAllCountries(): Promise<GeoLocation[]> {
    const cachedCountries = this.cache.get('countries');
    if (cachedCountries) return cachedCountries;
  
    try {
      if (!GEONAMES_USERNAME) {
        console.warn('GEONAMES_USERNAME not configured, using default countries');
        return DEFAULT_COUNTRIES;
      }

      const response = await makeApiRequest('countryInfoJSON', {});
      const data = await response.json();
      
      if (!data?.geonames) {
        return DEFAULT_COUNTRIES;
      }

      const countries = data.geonames
        .map((country: GeoNamesCountry) => ({
          geonameId: country.geonameId,
          countryCode: country.countryCode,
          countryName: country.countryName,
          toponymName: country.countryName,
          displayName: country.countryName,
          value: country.countryName
        }))
        .filter(country => country.countryName && country.geonameId);

      countries.sort((a, b) => a.displayName.localeCompare(b.displayName));

      // Ensure USA is first
      const usaIndex = countries.findIndex(c => c.countryCode === DEFAULT_LOCATION.COUNTRY_CODE);
      if (usaIndex === -1) {
        countries.unshift(DEFAULT_COUNTRIES[0]);
      } else if (usaIndex > 0) {
        const [usa] = countries.splice(usaIndex, 1);
        countries.unshift(usa);
      }

      this.cache.set('countries', countries);
      return countries;
    } catch (error) {
      console.error('Error fetching countries:', error);
      return DEFAULT_COUNTRIES;
    }
  }

  async getStatesForCountry(geonameId: string): Promise<GeoLocation[]> {
    if (!geonameId) return [];
  
    const cacheKey = `states_${geonameId}`;
    const cachedStates = this.cache.get(cacheKey);
    if (cachedStates) return cachedStates;
  
    try {
      const response = await makeApiRequest('childrenJSON', { 
        geonameId,
        // Add these additional parameters for better results
        maxRows: '1000',
        featureClass: 'A',
        featureCode: 'ADM1'
      });
      
      const data = await response.json();
      
      if (!data?.geonames) {
        const defaultStates = geonameId === DEFAULT_LOCATION.COUNTRY_ID ? DEFAULT_STATES : [];
        this.cache.set(cacheKey, defaultStates);
        return defaultStates;
      }
  
      const states = data.geonames
        .filter((state: GeoNamesState) => state.adminName1)
        .map((state: GeoNamesState) => ({
          geonameId: state.geonameId,
          adminCode1: state.adminCode1,
          adminName1: state.adminName1,
          toponymName: state.toponymName,
          displayName: state.adminName1 || state.toponymName,
          value: state.adminName1 || state.toponymName
        }));
  
      if (geonameId === DEFAULT_LOCATION.COUNTRY_ID && 
          !states.some(s => s.adminCode1 === DEFAULT_LOCATION.STATE_CODE)) {
        states.unshift(DEFAULT_STATES[0]);
      }
  
      states.sort((a, b) => a.displayName.localeCompare(b.displayName));
      this.cache.set(cacheKey, states);
      return states;
    } catch (error) {
      console.error('Error fetching states:', error);
      const defaultStates = geonameId === DEFAULT_LOCATION.COUNTRY_ID ? DEFAULT_STATES : [];
      this.cache.set(cacheKey, defaultStates);
      return defaultStates;
    }
  }


  getDefaultLocations() {
    return {
      countryId: DEFAULT_LOCATION.COUNTRY_ID,
      country: DEFAULT_LOCATION.COUNTRY_NAME,
      state: DEFAULT_LOCATION.STATE
    };
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const locationService = new LocationService();