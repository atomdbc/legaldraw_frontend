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
  COUNTRY_ID: '6252001', // USA geonameId
  COUNTRY_CODE: 'US',
  COUNTRY_NAME: 'United States',
  STATE: 'Delaware',
  STATE_CODE: 'DE'
} as const;

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
      const response = await fetch(
        `${API_BASE_URL}/countryInfoJSON?username=${GEONAMES_USERNAME}`
      );
      
      if (!response.ok) {
        throw new LocationServiceError('Failed to fetch countries', response.status);
      }

      const data = await response.json();
      
      if (!data?.geonames) {
        throw new LocationServiceError('Invalid response format from GeoNames API');
      }

      const countries = data.geonames.map((country: GeoNamesCountry) => ({
        geonameId: country.geonameId,
        countryCode: country.countryCode,
        countryName: country.countryName,
        toponymName: country.countryName,
        displayName: country.countryName,
        value: country.countryName
      }));

      // Sort countries alphabetically
      countries.sort((a, b) => a.displayName.localeCompare(b.displayName));

      cache.set('countries', countries);
      return countries;
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  },


  async getStatesForCountry(geonameId: string): Promise<GeoLocation[]> {
    // Don't use cache for states to ensure fresh data
    try {
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
        .filter((state: GeoNamesState) => state.adminName1) // Only include actual states
        .map((state: GeoNamesState) => ({
          geonameId: state.geonameId,
          adminCode1: state.adminCode1,
          adminName1: state.adminName1,
          toponymName: state.toponymName,
          displayName: state.adminName1 || state.toponymName,
          value: state.adminName1 || state.toponymName
        }));

      // Simple alphabetical sort for all states
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
  }}