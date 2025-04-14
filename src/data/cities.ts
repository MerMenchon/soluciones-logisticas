
import { City, Location } from "@/types/locations";
import { fetchProvinces } from "./provinces";
import { fetchCitiesFromApi } from "./api/cityApi";
import { 
  CACHE_DURATIONS, 
  getCitiesCacheKey,
  getStorageCheckCacheKey,
  getFromCache,
  setToCache,
  isCacheValid
} from "./cache/locationCache";
import { transformCityNames, citiesToLocations } from "./utils/cityUtils";

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
    const cacheKey = getCitiesCacheKey(provinceValue, storageOnly);
    
    // Check for cached data that's less than 15 minutes old
    const cachedData = getFromCache<City[]>(cacheKey);
    if (cachedData && isCacheValid(cachedData.timestamp, CACHE_DURATIONS.CITIES)) {
      console.log(`Using cached cities data for ${province.label} (storage only: ${storageOnly})`);
      return cachedData.data;
    }
    
    // Fetch cities from API
    console.log(`Fetching cities for ${province.label} from API (storage only: ${storageOnly})`);
    const citiesArray = await fetchCitiesFromApi(province.label, storageOnly);
    
    // Transform the string array into City objects
    const cities = transformCityNames(citiesArray, storageOnly);
    
    // Cache the result
    setToCache(cacheKey, cities);
    
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
    const cacheKey = getStorageCheckCacheKey(provincia, ciudad);
    const cachedResult = getFromCache<boolean>(cacheKey);
    if (cachedResult && isCacheValid(cachedResult.timestamp, CACHE_DURATIONS.STORAGE_CHECK)) {
      console.log(`Using cached storage check for ${ciudad}, ${provincia}: ${cachedResult.data}`);
      return cachedResult.data;
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
    setToCache(cacheKey, cityHasStorage);
    
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
    
    // Convert to Location objects for backwards compatibility
    return citiesToLocations(allCities, storageCities);
  } catch (error) {
    console.error(`Error in getCiudades for ${provincia}:`, error);
    return [];
  }
};
