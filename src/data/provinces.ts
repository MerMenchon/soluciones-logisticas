
import { Province } from "@/types/locations";

// Fetch provinces from Google Sheets with pagination
export const fetchProvinces = async (): Promise<Province[]> => {
  try {
    const sheetId = "1bI2xqgZ9-ooLHCH8ublDX7mfg25sV-tw3fTEdm1hZp4";
    const sheetName = "LOCALIDADES";
    
    // Create a cache key based on the sheet ID and name
    const cacheKey = `provinces-${sheetId}-${sheetName}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    // Check if we have cached data that's less than 1 hour old
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      if (Date.now() - timestamp < oneHour) {
        console.log("Using cached provinces data");
        return data;
      }
    }
    
    console.log("Fetching provinces data from Google Sheets");
    
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
      throw new Error("Error al cargar las provincias");
    }
    
    const csvText = await response.text();
    
    // Parse CSV more efficiently
    const provinces = parseProvincesFromCSV(csvText);
    
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

// More efficient CSV parsing function for provinces
function parseProvincesFromCSV(csvText: string): Province[] {
  // Split by newlines
  const lines = csvText.split('\n');
  if (lines.length <= 1) {
    throw new Error("CSV data is empty or invalid");
  }
  
  // Find the header row and locate the province column
  const headerRow = lines[0];
  const headers = headerRow.split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
  const provinceColumnIndex = headers.indexOf('province');
  
  if (provinceColumnIndex === -1) {
    throw new Error("No se encontró la columna 'province' en la hoja");
  }
  
  // Extract provinces using a Set for uniqueness
  const provinceSet = new Set<string>();
  
  // Process in batches to avoid blocking the UI thread
  const batchSize = 500;
  for (let i = 1; i < lines.length; i += batchSize) {
    const endIndex = Math.min(i + batchSize, lines.length);
    
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
      
      // Get province value if the field exists
      if (fields.length > provinceColumnIndex) {
        const provinceName = fields[provinceColumnIndex];
        if (provinceName) {
          provinceSet.add(provinceName);
        }
      }
    }
  }
  
  // Convert Set to array of Province objects
  const provinces: Province[] = Array.from(provinceSet).map(provinceName => ({
    value: provinceName.toLowerCase().replace(/\s+/g, '-'),
    label: provinceName,
    cities: []
  })).sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically
  
  console.log(`Parsed ${provinces.length} unique provinces`);
  return provinces;
};

// Legacy function for backward compatibility
export const getProvincias = async (): Promise<string[]> => {
  const provinces = await fetchProvinces();
  return [...new Set(provinces.map(p => p.label))]; // Ensure unique values
};
