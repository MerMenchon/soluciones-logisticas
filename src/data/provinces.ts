
import { Province } from "@/types/locations";
import { getFromCache, isCacheValid, setToCache } from "./cache/locationCache";

// Fetch provinces from the new API endpoint
export const fetchProvinces = async (): Promise<Province[]> => {
  try {
    // New API endpoint for provinces
    const apiUrl = "https://script.google.com/macros/s/AKfycbzeKFfW18NESYzYKkfLOPYG7Jn9HeWwX41jXStcPClgl4vEiFJuqwyL8CSNwrZgUZxb/exec";

    // Create a cache key
    const cacheKey = `provinces-api`;
    
    // Check for cached data
    const cachedItem = getFromCache<Province[]>(cacheKey);
    if (cachedItem && isCacheValid(cachedItem.timestamp, 30 * 60 * 1000)) { // 30 minutes TTL
      console.log("Using cached provinces data");
      return cachedItem.data;
    }
    
    console.log("Fetching provinces data from API");
    
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=1800" // 30 minutes cache
      }
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`Failed to fetch provinces: ${response.status} ${response.statusText}`);
      throw new Error("Error al cargar las provincias");
    }
    
    // Parse the JSON response - API returns a string array
    const provincesArray: string[] = await response.json();
    console.log(`Received ${provincesArray.length} provinces directly from API`);
    
    // Transform the string array into Province objects
    // Important: Use the exact province names from the API as labels
    const provinces: Province[] = provincesArray.map(provinceName => ({
      value: provinceName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-"),
      label: provinceName,
      cities: []
    })).sort((a, b) => a.label.localeCompare(b.label));
    
    // Cache the result
    setToCache(cacheKey, provinces);
    
    return provinces;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    // Return empty array when fetch fails
    return [];
  }
};

// Legacy function for backward compatibility
export const getProvincias = async (): Promise<string[]> => {
  try {
    // Direct API call to get province names without transformation
    const apiUrl = "https://script.google.com/macros/s/AKfycbw_VTuDSsRwpsRw__bNwWiK2SvKJ6AJhutNZx9mvFzEd40OmLF2qqIuY7Z-u3hPVqQJ/exec";
    
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
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=1800" // 30 minutes cache
      }
    });
    
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
    return [];
  }
};
