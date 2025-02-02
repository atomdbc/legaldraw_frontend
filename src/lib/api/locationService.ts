// src/lib/services/locationService.ts

const GEONAMES_USERNAME = process.env.NEXT_PUBLIC_GEONAMES_USERNAME;
const API_BASE_URL = 'http://api.geonames.org';

// Type definitions
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

// Default countries list for fallback
const DEFAULT_COUNTRIES: GeoLocation[] = [
  {
    geonameId: DEFAULT_LOCATION.COUNTRY_ID,
    countryCode: DEFAULT_LOCATION.COUNTRY_CODE,
    countryName: DEFAULT_LOCATION.COUNTRY_NAME,
    toponymName: DEFAULT_LOCATION.COUNTRY_NAME,
    displayName: DEFAULT_LOCATION.COUNTRY_NAME,
    value: DEFAULT_LOCATION.COUNTRY_NAME
  }
];

// Default states list for USA fallback
const DEFAULT_STATES: GeoLocation[] = [
  {
    geonameId: '4142224',
    adminCode1: 'DE',
    adminName1: 'Delaware',
    toponymName: 'Delaware',
    displayName: 'Delaware',
    value: 'Delaware'
  }
];

// Cache implementation
class LocationCache {
  private static instance: LocationCache;
  private cache: Map<string, CacheEntry>;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {
    this.cache = new Map();
    // Initialize from localStorage if available
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
    const entry = {
      data,
      timestamp: Date.now()
    };
    this.cache.set(key, entry);

    // Save to localStorage
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

// Error handling
class LocationServiceError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'LocationServiceError';
  }
}

// Main service
export const locationService = {
  async getAllCountries(): Promise<GeoLocation[]> {
    const cache = LocationCache.getInstance();
    const cachedCountries = cache.get('countries');
    if (cachedCountries) return cachedCountries;

    try {
      if (!GEONAMES_USERNAME) {
        console.warn('GEONAMES_USERNAME not configured, using default countries');
        return DEFAULT_COUNTRIES;
      }

      const response = await fetch(
        `${API_BASE_URL}/countryInfoJSON?username=${GEONAMES_USERNAME}`
      );
      
      if (!response.ok) {
        console.warn('Failed to fetch countries, using defaults');
        return DEFAULT_COUNTRIES;
      }

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
        .filter(country => country.countryName && country.geonameId); // Filter out invalid entries

      // Sort countries alphabetically
      countries.sort((a, b) => a.displayName.localeCompare(b.displayName));

      // Ensure USA is included
      if (!countries.some(c => c.countryCode === DEFAULT_LOCATION.COUNTRY_CODE)) {
        countries.unshift(DEFAULT_COUNTRIES[0]);
      }

      cache.set('countries', countries);
      return countries;
    } catch (error) {
      console.error('Error fetching countries:', error);
      return DEFAULT_COUNTRIES;
    }
  },

  async getStatesForCountry(geonameId: string): Promise<GeoLocation[]> {
    try {
      // For USA, return states immediately if API fails
      if (geonameId === DEFAULT_LOCATION.COUNTRY_ID) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/childrenJSON?geonameId=${geonameId}&username=${GEONAMES_USERNAME}`
          );
          
          if (!response.ok) {
            return DEFAULT_STATES;
          }

          const data = await response.json();
          
          if (!data?.geonames) {
            return DEFAULT_STATES;
          }

          const states = data.geonames
            .filter((state: GeoNamesState) => state.adminName1) // Only include actual states
            .map((state: GeoNamesState) => ({
              geonameId: state.geonameId,
              adminCode1: state.adminCode1,
              adminName1: state.adminName1,
              toponymName: state.toponymName,
              displayName: state.adminName1 || state.toponymName,
              value: state.adminName1 || state.toponymName
            }));

          // Ensure Delaware is included for USA
          if (geonameId === DEFAULT_LOCATION.COUNTRY_ID && 
              !states.some(s => s.adminCode1 === DEFAULT_LOCATION.STATE_CODE)) {
            states.unshift(DEFAULT_STATES[0]);
          }

          // Simple alphabetical sort for all states
          states.sort((a, b) => a.displayName.localeCompare(b.displayName));

          return states;
        } catch (error) {
          console.error('Error fetching USA states:', error);
          return DEFAULT_STATES;
        }
      }

      // For other countries
      const response = await fetch(
        `${API_BASE_URL}/childrenJSON?geonameId=${geonameId}&username=${GEONAMES_USERNAME}`
      );
      
      if (!response.ok) {
        throw new LocationServiceError('Failed to fetch states', response.status);
      }

      const data = await response.json();
      
      if (!data?.geonames) {
        throw new LocationServiceError('Invalid response format from GeoNames API');
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

      states.sort((a, b) => a.displayName.localeCompare(b.displayName));
      return states;
    } catch (error) {
      console.error('Error fetching states:', error);
      return [];
    }
  },

  getDefaultLocations(): { countryId: string; country: string; state: string } {
    return {
      countryId: DEFAULT_LOCATION.COUNTRY_ID,
      country: DEFAULT_LOCATION.COUNTRY_NAME,
      state: DEFAULT_LOCATION.STATE
    };
  },

  clearCache(): void {
    LocationCache.getInstance().clear();
  }
};