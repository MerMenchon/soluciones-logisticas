
import { City } from "@/types/locations";
import { fetchProvinces } from "../provinces";

// Fetch cities for a province from the API
export const fetchCitiesFromApi = async (provinceLabel: string, storageOnly: boolean = false): Promise<string[]> => {
  try {
    // Construct the API URL with the province parameter
    let apiUrl = `https://script.google.com/macros/s/AKfycbw_VTuDSsRwpsRw__bNwWiK2SvKJ6AJhutNZx9mvFzEd40OmLF2qqIuY7Z-u3hPVqQJ/exec?province=${encodeURIComponent(provinceLabel)}`;
    
    // Add the storage filter parameter if needed
    if (storageOnly) {
      apiUrl += `&soloConDeposito=si`;
    }
    
    console.log(`Fetching cities for ${provinceLabel} from API (storage only: ${storageOnly})`);
    
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
    console.log(`Received ${citiesArray.length} cities for ${provinceLabel} from API`);
    
    return citiesArray;
  } catch (error) {
    console.error(`Error fetching cities from API for province ${provinceLabel}:`, error);
    // Return empty array if fetch fails
    return [];
  }
};
