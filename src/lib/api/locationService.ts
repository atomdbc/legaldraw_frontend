// src/lib/services/locationService.ts
const GEONAMES_USERNAME = process.env.NEXT_PUBLIC_GEONAMES_USERNAME;
const API_BASE_URL = 'http://api.geonames.org';

interface GeoNamesCountry {
  geonameId: number;
  countryCode: string;
  countryName: string;
}

export const locationService = {
  async getAllCountries() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/countryInfoJSON?username=${GEONAMES_USERNAME}`
      );
      const data = await response.json();
      return (data?.geonames || []).map((country: GeoNamesCountry) => ({
        geonameId: country.geonameId,
        countryCode: country.countryCode,
        countryName: country.countryName,
        toponymName: country.countryName,
        // The name that will be shown in the UI
        displayName: country.countryName,
        // This will be sent to the backend
        value: country.countryName
      }));
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  },

  async getStatesForCountry(geonameId: string) {
    try {
      console.log('Fetching states with geonameId:', geonameId);
      const response = await fetch(
        `${API_BASE_URL}/childrenJSON?geonameId=${geonameId}&username=${GEONAMES_USERNAME}`
      );
      const data = await response.json();
      return (data?.geonames || []).map((state: any) => ({
        geonameId: state.geonameId,
        adminCode1: state.adminCode1,
        adminName1: state.adminName1,
        toponymName: state.adminName1 || state.toponymName,
        // The name that will be shown in the UI
        displayName: state.adminName1 || state.toponymName,
        // This will be sent to the backend
        value: state.adminName1 || state.toponymName
      }));
    } catch (error) {
      console.error('Error fetching states:', error);
      return [];
    }
  }
};