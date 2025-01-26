// src/hooks/useLocation.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { locationService, GeoLocation } from '@/lib/api/locationService';

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

export function useLocation(options: UseLocationOptions = {}) {
  const {
    persistKey,
    initialCountry,
    initialState
  } = options;

  const initRef = useRef(false);

  // Initialize state from localStorage or provided values
  const [locationState, setLocationState] = useState<LocationState>(() => {
    if (typeof window === 'undefined') {
      return {
        country: '',
        state: '',
        geonameId: null,
        isLoading: false,
        error: null
      };
    }

    // First check localStorage
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

    // Then use initial values if provided
    if (initialCountry) {
      return {
        country: initialCountry,
        state: initialState || '',
        geonameId: null,
        isLoading: false,
        error: null
      };
    }

    return {
      country: '',
      state: '',
      geonameId: null,
      isLoading: false,
      error: null
    };
  });

  const [countries, setCountries] = useState<GeoLocation[]>([]);
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

  // Load countries first
  useEffect(() => {
    async function loadCountries() {
      try {
        const data = await locationService.getAllCountries();
        setCountries(data);
        return data;
      } catch (error) {
        console.error('Error loading countries:', error);
        return [];
      } finally {
        setIsLoadingCountries(false);
      }
    }
    loadCountries();
  }, []);

  // Handle initial/saved country and load states
  useEffect(() => {
    if (!countries.length || initRef.current) return;

    async function initializeLocationState() {
      const countryToUse = locationState.country || initialCountry;
      if (!countryToUse) return;

      const country = countries.find(c => c.countryName === countryToUse);
      if (!country) return;

      const geonameId = String(country.geonameId);
      
      // Set the geonameId first
      setLocationState(prev => ({
        ...prev,
        country: country.countryName,
        geonameId
      }));

      // Immediately load states
      await loadStatesForCountry(geonameId);
    }

    initializeLocationState();
    initRef.current = true;
  }, [countries, locationState.country, initialCountry, loadStatesForCountry]);

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

  // Reset location helper
  const resetLocation = useCallback(() => {
    setLocationState({
      country: '',
      state: '',
      geonameId: null,
      isLoading: false,
      error: null
    });
    setStates([]);
    if (persistKey) {
      localStorage.removeItem(`location-${persistKey}`);
    }
    initRef.current = false;
  }, [persistKey]);

  return {
    locationState,
    updateLocation,
    resetLocation,
    countries,
    states,
    isLoadingCountries,
    isLoadingStates
  };
}