
import { Province } from "@/types/locations";
import { getFromCache, isCacheValid, setToCache } from "./cache/locationCache";

// Static fallback data in case the API is down
const FALLBACK_PROVINCES = [
  "Buenos Aires"
];

// Fetch provinces directly from the API endpoint
export const getProvincias = async (): Promise<string[]> => {
  try {
    // Updated API endpoint for provinces
    const apiUrl = "https://script.google.com/macros/s/AKfycbzEa6AT5cYmzaklM-Wmu6PU4VqLmVaXLgHZC8ZpGWHNcdQfR2psyhzvIKNwDNu-ytOR/exec";
    
    // Create a cache key
    const cacheKey = `provinces-names-api`;
    
    // Check for cached data
    const cachedItem = getFromCache<string[]>(cacheKey);
    if (cachedItem && isCacheValid(cachedItem.timestamp, 30 * 60 * 1000)) { // 30 minutes TTL
      console.log("Using cached province names");
      return cachedItem.data;
    }
    
    console.log("Fetching province names directly from API");
    
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    

   const response = await fetch(apiUrl, {
  signal: controller.signal,
  mode: "cors",
  headers: {
    "Cache-Control": "no-cache"
  }
});

    ///CODIGO PARA DEBUG
    // Clear the timeout
clearTimeout(timeoutId);

// Intenta leer el texto y parsearlo
const rawText = await response.text();
try {
  const provinceNames: string[] = JSON.parse(rawText);
  console.log("Parsed province names:", provinceNames);

  // Cachearlo y devolverlo
  setToCache(cacheKey, provinceNames);
  return provinceNames;
} catch (err) {
  console.error("No se pudo parsear JSON:", rawText);
  throw err;
}
////// HASTA ACA
    // Clear the timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`Failed to fetch province names: ${response.status} ${response.statusText}`);
      throw new Error("Error al cargar las provincias");
    }
    
    // The API returns a string array directly, use it as-is
    const provinceNames: string[] = await response.json();
    console.log(`Received ${provinceNames.length} province names from API`);
    
    // Cache the result
    setToCache(cacheKey, provinceNames);
    
    return provinceNames;
  } catch (error) {
    console.error("Error in getProvincias:", error);
    
    // Check if there's cached data we can use even if it's expired
    const cacheKey = `provinces-names-api`;
    const cachedItem = getFromCache<string[]>(cacheKey);
    if (cachedItem && cachedItem.data.length > 0) {
      console.log("Using expired cached provinces as fallback");
      return cachedItem.data;
    }
    
    // Return fallback data if API fails and no cache is available
    console.log("Using hardcoded fallback provinces");
    return FALLBACK_PROVINCES;
  }
};

// Keep fetchProvinces for backward compatibility
export const fetchProvinces = async (): Promise<Province[]> => {
  try {
    // Get province names directly
    const provinceNames = await getProvincias();
    
    // Transform the string array into Province objects
    const provinces: Province[] = provinceNames.map(provinceName => ({
      value: provinceName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-"),
      label: provinceName,
      cities: []
    })).sort((a, b) => a.label.localeCompare(b.label));
    
    return provinces;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return [];
  }
};
