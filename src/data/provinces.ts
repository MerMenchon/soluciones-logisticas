
import { Province } from "@/types/locations";

// Fetch provinces from the new API endpoint
export const fetchProvinces = async (): Promise<Province[]> => {
  try {
    // New API endpoint for provinces
    const apiUrl = "https://script.google.com/macros/s/AKfycbw_VTuDSsRwpsRw__bNwWiK2SvKJ6AJhutNZx9mvFzEd40OmLF2qqIuY7Z-u3hPVqQJ/exec";
    
    // Create a cache key
    const cacheKey = `provinces-api`;
    
    // Check for cached data that's less than 30 minutes old (reduced TTL for live API)
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
      if (Date.now() - timestamp < thirtyMinutes) {
        console.log("Using cached provinces data");
        return data;
      }
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
    console.log(`Received ${provincesArray.length} provinces from API`);
    
    // Transform the string array into Province objects
    const provinces: Province[] = provincesArray.map(provinceName => ({
      value: provinceName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-"),
      label: provinceName,
      cities: []
    })).sort((a, b) => a.label.localeCompare(b.label));
    
    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify({
      data: provinces,
      timestamp: Date.now()
    }));
    
    return provinces;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    // Return fallback provinces if fetch fails
    return [
      {
        value: "buenos-aires",
        label: "Buenos Aires",
        cities: [],
      },
      {
        value: "cordoba",
        label: "Córdoba",
        cities: [],
      },
      {
        value: "santa-fe",
        label: "Santa Fe",
        cities: [],
      },
      {
        value: "mendoza",
        label: "Mendoza",
        cities: [],
      },
    ];
  }
};

// Legacy function for backward compatibility
export const getProvincias = async (): Promise<string[]> => {
  try {
    const provinces = await fetchProvinces();
    const provinceNames = provinces.map(p => p.label);
    console.log(`Returning ${provinceNames.length} province names`);
    return provinceNames;
  } catch (error) {
    console.error("Error in getProvincias:", error);
    return [];
  }
};
