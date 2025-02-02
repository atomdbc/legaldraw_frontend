import { useState, useEffect, useCallback, useRef } from 'react';
import { locationService, GeoLocation, DEFAULT_LOCATION } from '@/lib/api/locationService';

const CACHE_KEY = 'preloaded-countries';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export interface LocationState {
  country: string;
  state: string;
  geonameId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface UseLocationOptions {
  persistKey?: string;
  initialCountry?: string;
  initialState?: string;
}

async function preloadCountries() {
  try {
    if (typeof window === 'undefined') return [];

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
    
    const countries = await locationService.getAllCountries();
    if (countries.length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: countries,
        timestamp: Date.now()
      }));
    }
    return countries;
  } catch (error) {
    console.error('Error preloading countries:', error);
    return [];
  }
}

export function useLocation(options: UseLocationOptions = {}) {
  const { 
    persistKey, 
    initialCountry = DEFAULT_LOCATION.COUNTRY_NAME, 
    initialState = DEFAULT_LOCATION.STATE 
  } = options;

  const initRef = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize state with USA as default
  const [locationState, setLocationState] = useState<LocationState>(() => {
    if (typeof window === 'undefined') {
      return {
        country: DEFAULT_LOCATION.COUNTRY_NAME,
        state: DEFAULT_LOCATION.STATE,
        geonameId: DEFAULT_LOCATION.COUNTRY_ID,
        isLoading: false,
        error: null
      };
    }

    // Check localStorage first
    if (persistKey) {
      const saved = localStorage.getItem(`location-${persistKey}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...parsed,
            isLoading: false,
            error: null
          };
        } catch (error) {
          console.error('Error parsing saved location:', error);
        }
      }
    }

    // Use initial values if provided, otherwise default to USA
    return {
      country: initialCountry || DEFAULT_LOCATION.COUNTRY_NAME,
      state: initialState || DEFAULT_LOCATION.STATE,
      geonameId: DEFAULT_LOCATION.COUNTRY_ID,
      isLoading: false,
      error: null
    };
  });

  // Initialize countries from cache if available
  const [countries, setCountries] = useState<GeoLocation[]>(() => {
    if (typeof window === 'undefined') return [];

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      } catch (error) {
        console.error('Error parsing cached countries:', error);
      }
    }
    return [];
  });

  const [states, setStates] = useState<GeoLocation[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingStates, setIsLoadingStates] = useState(false);

  // Load states for a country
  const loadStatesForCountry = useCallback(async (geonameId: string) => {
    if (!geonameId) return;
    
    setIsLoadingStates(true);
    try {
      const data = await locationService.getStatesForCountry(geonameId);
      setStates(data);
    } catch (error) {
      console.error('Error loading states:', error);
      setStates([]);
    } finally {
      setIsLoadingStates(false);
    }
  }, []);

  // Load or refresh countries and set USA as default
  useEffect(() => {
    async function loadCountries() {
      try {
        setIsLoadingCountries(true);
        const data = await preloadCountries();
        if (data.length > 0) {
          setCountries(data);
          // Find and set USA by default if no country is selected
          if (!locationState.country) {
            const usa = data.find(c => c.countryName === DEFAULT_LOCATION.COUNTRY_NAME);
            if (usa) {
              setLocationState(prev => ({
                ...prev,
                country: DEFAULT_LOCATION.COUNTRY_NAME,
                state: DEFAULT_LOCATION.STATE,
                geonameId: String(usa.geonameId)
              }));
            }
          }
        }
      } catch (error) {
        console.error('Error loading countries:', error);
      } finally {
        setIsLoadingCountries(false);
        setIsInitialized(true);
      }
    }

    loadCountries();
  }, []);

  // Handle initial/saved country and load states
  useEffect(() => {
    if (!isInitialized || !countries.length || initRef.current) return;

    async function initializeLocationState() {
      const countryToUse = locationState.country || initialCountry || DEFAULT_LOCATION.COUNTRY_NAME;
      const country = countries.find(c => c.countryName === countryToUse);
      
      if (country) {
        const geonameId = String(country.geonameId);
        
        setLocationState(prev => ({
          ...prev,
          country: country.countryName,
          geonameId,
          state: prev.state || initialState || (countryToUse === DEFAULT_LOCATION.COUNTRY_NAME ? DEFAULT_LOCATION.STATE : '')
        }));

        await loadStatesForCountry(geonameId);
      }
      
      initRef.current = true;
    }

    initializeLocationState();
  }, [
    countries, 
    isInitialized, 
    locationState.country, 
    initialCountry, 
    initialState,
    loadStatesForCountry
  ]);

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && persistKey && locationState.country) {
      const toSave = {
        country: locationState.country,
        state: locationState.state,
        geonameId: locationState.geonameId
      };
      localStorage.setItem(`location-${persistKey}`, JSON.stringify(toSave));
    }
  }, [locationState.country, locationState.state, locationState.geonameId, persistKey]);

  // Update location helper
  const updateLocation = useCallback(async (updates: Partial<Omit<LocationState, 'isLoading' | 'error'>>) => {
    setLocationState(prev => ({
      ...prev,
      ...updates,
      error: null
    }));

    if (updates.geonameId) {
      await loadStatesForCountry(updates.geonameId);
    }
  }, [loadStatesForCountry]);

  // Reset location helper (resets to USA)
  const resetLocation = useCallback(() => {
    setLocationState({
      country: DEFAULT_LOCATION.COUNTRY_NAME,
      state: DEFAULT_LOCATION.STATE,
      geonameId: DEFAULT_LOCATION.COUNTRY_ID,
      isLoading: false,
      error: null
    });
    if (persistKey) {
      localStorage.removeItem(`location-${persistKey}`);
    }
    initRef.current = false;
  }, [persistKey]);

  // Clear cache helper
  const clearCache = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
    }
  }, []);

  return {
    locationState,
    updateLocation,
    resetLocation,
    clearCache,
    countries,
    states,
    isLoadingCountries,
    isLoadingStates,
    isInitialized
  };
}