
import { City, Location } from "@/types/locations";
import { fetchProvinces } from "./provinces";

// Fetch cities for a province from Google Sheets
export const fetchCitiesForProvince = async (provinceValue: string): Promise<City[]> => {
  try {
    if (!provinceValue) {
      return [];
    }
    
    const sheetId = "1bI2xqgZ9-ooLHCH8ublDX7mfg25sV-tw3fTEdm1hZp4";
    const sheetName = "LOCALIDADES";
    
    // Create a cache key based on the sheet ID, name and province
    const cacheKey = `cities-${sheetId}-${sheetName}-${provinceValue}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    // Check if we have cached data that's less than 1 hour old
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      if (Date.now() - timestamp < oneHour) {
        console.log(`Using cached cities data for ${provinceValue}`);
        return data;
      }
    }
    
    console.log(`Fetching cities data for province: ${provinceValue}`);
    
    // Get the province label from the province value
    const provinces = await fetchProvinces();
    const provinceLabel = provinces.find(p => p.value === provinceValue)?.label || provinceValue;
    
    // Build URL with CSV output format
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    
    const response = await fetch(sheetUrl, {
      headers: {
        "Content-Type": "text/csv",
        // Add cache control headers
        "Cache-Control": "max-age=3600"
      }
    });
    
    if (!response.ok) {
      throw new Error("Error al cargar las ciudades");
    }
    
    const csvText = await response.text();
    
    // Parse CSV more efficiently and filter by province
    const cities = parseCitiesFromCSV(csvText, provinceLabel);
    
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

// More efficient CSV parsing function for cities, filtering by province
function parseCitiesFromCSV(csvText: string, provinceLabel: string): City[] {
  console.log(`Starting to parse cities for province: ${provinceLabel}`);
  // Split by newlines
  const lines = csvText.split('\n');
  if (lines.length <= 1) {
    console.error("CSV data is empty or invalid");
    throw new Error("CSV data is empty or invalid");
  }
  
  console.log(`Total lines in CSV: ${lines.length}`);
  
  // Find the header row and locate the province, city and storage columns
  const headerRow = lines[0];
  const headers = headerRow.split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
  
  console.log(`CSV headers: ${headers.join(', ')}`);
  
  const provinceColumnIndex = headers.indexOf('province');
  const cityColumnIndex = headers.indexOf('city');
  const storageColumnIndex = headers.indexOf('storage');
  
  if (provinceColumnIndex === -1 || cityColumnIndex === -1) {
    console.error(`Required columns not found. Province: ${provinceColumnIndex}, City: ${cityColumnIndex}`);
    throw new Error("No se encontraron las columnas necesarias en la hoja");
  }
  
  // Normalize the province label for comparison
  const normalizedProvinceLabel = provinceLabel.toLowerCase();
  
  // Process in batches to avoid blocking the UI thread
  const cities: (City & { hasStorage: boolean })[] = [];
  const citySet = new Set<string>(); // To ensure unique city names
  
  const batchSize = 1000; // Increased batch size for performance
  let matchCount = 0;
  
  for (let i = 1; i < lines.length; i += batchSize) {
    const endIndex = Math.min(i + batchSize, lines.length);
    let batchMatches = 0;
    
    for (let j = i; j < endIndex; j++) {
      const line = lines[j];
      if (!line.trim()) continue; // Skip empty lines
      
      // More robust CSV parsing
      let fields: string[] = [];
      let inQuotes = false;
      let currentField = '';
      
      for (let k = 0; k < line.length; k++) {
        const char = line[k];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          fields.push(currentField.replace(/"/g, '').trim());
          currentField = '';
        } else {
          currentField += char;
        }
      }
      
      // Add the last field
      fields.push(currentField.replace(/"/g, '').trim());
      
      // Get province, city and storage values if the fields exist
      if (fields.length > Math.max(provinceColumnIndex, cityColumnIndex)) {
        const rowProvince = fields[provinceColumnIndex].toLowerCase();
        const cityName = fields[cityColumnIndex];
        
        // Only process if province matches and city name is valid
        if (rowProvince === normalizedProvinceLabel && cityName && !citySet.has(cityName)) {
          const hasStorage = storageColumnIndex !== -1 && fields.length > storageColumnIndex ? 
            fields[storageColumnIndex].toLowerCase() === 'yes' || 
            fields[storageColumnIndex].toLowerCase() === 'si' || 
            fields[storageColumnIndex].toLowerCase() === 'sí' : 
            false;
          
          cities.push({
            value: cityName.toLowerCase().replace(/\s+/g, '-'),
            label: cityName,
            hasStorage
          });
          
          citySet.add(cityName); // Mark as seen
          batchMatches++;
          matchCount++;
        }
      }
    }
    
    console.log(`Processed batch ${i}-${endIndex}: Found ${batchMatches} matches for province ${provinceLabel}`);
  }
  
  // Sort alphabetically
  cities.sort((a, b) => a.label.localeCompare(b.label));
  
  console.log(`Parsed ${cities.length} unique cities for province ${provinceLabel} (total matches: ${matchCount})`);
  return cities;
};

// Legacy function for backward compatibility
export const getCiudades = async (provincia: string): Promise<Location[]> => {
  try {
    const provinces = await fetchProvinces();
    const normalizedProvinceName = provincia.toLowerCase().replace(/\s+/g, '-');
    
    // Try to find by value (normalized) first
    let selectedProvince = provinces.find(p => p.value === normalizedProvinceName);
    
    // If not found by value, try by label
    if (!selectedProvince) {
      selectedProvince = provinces.find(p => p.label.toLowerCase() === provincia.toLowerCase());
    }
    
    // If still not found, use the provided name directly
    const provinceValue = selectedProvince?.value || normalizedProvinceName;
    
    console.log(`Getting cities for province value: ${provinceValue}`);
    const cities = await fetchCitiesForProvince(provinceValue);
    
    // Convert to the expected Location format
    return cities.map(city => ({
      ciudad: city.label,
      hasStorage: (city as any).hasStorage || false
    }));
  } catch (error) {
    console.error(`Error in getCiudades for ${provincia}:`, error);
    return [];
  }
};

// Check if storage is available in a location
export const isStorageAvailable = async (provincia: string, ciudad: string): Promise<boolean> => {
  try {
    const cities = await getCiudades(provincia);
    const selectedCity = cities.find(c => c.ciudad === ciudad);
    return selectedCity?.hasStorage || false;
  } catch (error) {
    console.error(`Error checking storage availability for ${provincia}/${ciudad}:`, error);
    return false;
  }
};
