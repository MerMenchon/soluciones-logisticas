
import { City } from "@/types/locations";
import { fetchProvinces } from "../provinces";

// Fetch cities for a province from the API
export const fetchCitiesFromApi = async (provinceLabel: string, storageOnly: boolean = false): Promise<string[]> => {
  try {
    // Construct the API URL with the province parameter
    let apiUrl = `https://script.google.com/macros/s/AKfycbzeKFfW18NESYzYKkfLOPYG7Jn9HeWwX41jXStcPClgl4vEiFJuqwyL8CSNwrZgUZxb/exec?province=${encodeURIComponent(provinceLabel)}`;

    // Add the storage filter parameter if needed
    if (storageOnly) {
      apiUrl += `&soloConDeposito=si`;
    }
    
    console.log(`Fetching cities for ${provinceLabel} from API (storage only: ${storageOnly})`);
    
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache" // Disable cache to get fresh data
      },
      mode: "cors" // Explicitly set CORS mode
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Error al cargar las ciudades: ${response.status} ${response.statusText}`);
    }
    
    // Parse the JSON response
    const citiesArray: string[] = await response.json();
    console.log(`Received ${citiesArray.length} cities for ${provinceLabel} from API (storage only: ${storageOnly})`);
    
    return citiesArray;
  } catch (error) {
    console.error(`Error fetching cities from API for province ${provinceLabel} (storage only: ${storageOnly}):`, error);
    
    // Return empty array if fetch fails
    return [];
  }
};
