
import { City, Location } from "@/types/locations";
import { fetchProvinces } from "./provinces";

// Fetch cities for a province from the new API
export const fetchCitiesForProvince = async (provinceValue: string, storageOnly: boolean = false): Promise<City[]> => {
  try {
    if (!provinceValue) {
      return [];
    }
    
    // Get the province label from the province value
    const provinces = await fetchProvinces();
    const province = provinces.find(p => p.value === provinceValue);
    
    if (!province) {
      console.error(`Province not found for value: ${provinceValue}`);
      return [];
    }
    
    // Create a cache key based on the province and storage filter
    const cacheKey = `cities-api-${provinceValue}-${storageOnly ? 'storage' : 'all'}`;
    
    // Check for cached data that's less than 15 minutes old
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
      if (Date.now() - timestamp < fifteenMinutes) {
        console.log(`Using cached cities data for ${province.label} (storage only: ${storageOnly})`);
        return data;
      }
    }
    
    // Construct the API URL with the province parameter
    let apiUrl = `https://script.google.com/macros/s/AKfycbw_VTuDSsRwpsRw__bNwWiK2SvKJ6AJhutNZx9mvFzEd40OmLF2qqIuY7Z-u3hPVqQJ/exec?province=${encodeURIComponent(province.label)}`;
    
    // Add the storage filter parameter if needed
    if (storageOnly) {
      apiUrl += `&soloConDeposito=si`;
    }
    
    console.log(`Fetching cities for ${province.label} from API (storage only: ${storageOnly})`);
    
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=900" // 15 minutes cache
      }
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Error al cargar las ciudades: ${response.status} ${response.statusText}`);
    }
    
    // Parse the JSON response
    const citiesArray: string[] = await response.json();
    console.log(`Received ${citiesArray.length} cities for ${province.label} from API`);
    
    // Transform the string array into City objects
    // For storage-only requests, all cities have storage=true
    const cities: City[] = citiesArray.map(cityName => ({
      value: cityName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-"),
      label: cityName,
      hasStorage: storageOnly ? true : false // All cities in storage-only request have storage
    })).sort((a, b) => a.label.localeCompare(b.label));
    
    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify({
      data: cities,
      timestamp: Date.now()
    }));
    
    return cities;
  } catch (error) {
    console.error(`Error fetching cities for province ${provinceValue}:`, error);
    // Return empty array if fetch fails
    return [];
  }
};

// Modified function to check if storage is available in a location
export const isStorageAvailable = async (provincia: string, ciudad: string): Promise<boolean> => {
  try {
    if (!provincia || !ciudad) {
      return false;
    }
    
    console.log(`Checking storage for ${ciudad}, ${provincia}`);
    
    // First try to get from cache
    const cacheKey = `storage-check-${provincia}-${ciudad}`;
    const cachedResult = localStorage.getItem(cacheKey);
    if (cachedResult) {
      const { hasStorage, timestamp } = JSON.parse(cachedResult);
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      if (Date.now() - timestamp < oneHour) {
        console.log(`Using cached storage check for ${ciudad}, ${provincia}: ${hasStorage}`);
        return hasStorage;
      }
    }
    
    // Get the province label from the province value
    const provinces = await fetchProvinces();
    const province = provinces.find(p => p.value === provincia);
    
    if (!province) {
      console.error(`Province not found for value: ${provincia}`);
      return false;
    }
    
    // Fetch cities with storage from the API
    const storageOnlyCities = await fetchCitiesForProvince(provincia, true);
    
    // Check if the selected city is in the list of cities with storage
    const cityHasStorage = storageOnlyCities.some(city => city.label === ciudad);
    
    console.log(`Storage check result for ${ciudad}, ${provincia}: ${cityHasStorage}`);
    
    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify({
      hasStorage: cityHasStorage,
      timestamp: Date.now()
    }));
    
    return cityHasStorage;
  } catch (error) {
    console.error(`Error checking storage availability for ${provincia}/${ciudad}:`, error);
    return false;
  }
};

// Legacy function for backward compatibility
export const getCiudades = async (provincia: string): Promise<Location[]> => {
  try {
    if (!provincia) {
      return [];
    }
    
    const provinces = await fetchProvinces();
    const normalizedProvinceName = provincia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
    
    // Try to find by value (normalized) first
    let selectedProvince = provinces.find(p => p.value === normalizedProvinceName);
    
    // If not found by value, try by label
    if (!selectedProvince) {
      selectedProvince = provinces.find(p => p.label.toLowerCase() === provincia.toLowerCase());
    }
    
    // If still not found, use the provided name directly
    const provinceValue = selectedProvince?.value || normalizedProvinceName;
    
    console.log(`Getting cities for province value: ${provinceValue}`);
    
    // Get all cities (not storage-only)
    const allCities = await fetchCitiesForProvince(provinceValue, false);
    
    // Get storage-only cities
    const storageCities = await fetchCitiesForProvince(provinceValue, true);
    
    // Create a set of city names with storage
    const storageCityNames = new Set(storageCities.map(city => city.label));
    
    // Merge the information: mark cities that have storage
    const cities: Location[] = allCities.map(city => ({
      ciudad: city.label,
      hasStorage: storageCityNames.has(city.label)
    }));
    
    return cities;
  } catch (error) {
    console.error(`Error in getCiudades for ${provincia}:`, error);
    return [];
  }
};
