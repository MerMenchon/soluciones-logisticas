
// This file handles fetching location and shipping time data from Google Sheets

export interface Location {
  provincia: string;
  ciudad: string;
  hasStorage: boolean;
}

// Cache for locations once fetched
let cachedLocations: Location[] = [];
let cachedShippingTimes: string[] = [];

// Google Sheets ID and endpoints
const SHEET_ID = "1VYDCQfaz3-7IrhPUGpAO4UBLMDR1mEyl6UCHU1hznwQ";

export const fetchLocationsFromSheet = async (): Promise<Location[]> => {
  if (cachedLocations.length > 0) {
    return cachedLocations;
  }
  
  try {
    const sheetName = "LOCALIDADES";
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    
    const response = await fetch(sheetUrl);
    
    if (!response.ok) {
      throw new Error("Error al cargar las localidades");
    }
    
    const csvText = await response.text();
    const rows = csvText.split('\n');
    
    // Find column indexes
    const headers = rows[0].split(',').map(header => header.trim().replace(/"/g, '').toUpperCase());
    const provinciaColIndex = headers.findIndex(h => h === 'PROVINCIA');
    const ciudadColIndex = headers.findIndex(h => h === 'CIUDAD');
    const depositoColIndex = headers.findIndex(h => h === 'DEPOSITO');
    
    if (provinciaColIndex === -1 || ciudadColIndex === -1 || depositoColIndex === -1) {
      throw new Error("No se encontraron las columnas necesarias en la hoja de localidades");
    }
    
    // Parse locations
    const locations: Location[] = [];
    
    for (let i = 1; i < rows.length; i++) {
      const columns = rows[i].split(',').map(col => col.trim().replace(/"/g, ''));
      
      if (columns.length > Math.max(provinciaColIndex, ciudadColIndex, depositoColIndex)) {
        const provincia = columns[provinciaColIndex];
        const ciudad = columns[ciudadColIndex];
        const hasStorage = columns[depositoColIndex].toUpperCase() === 'SI';
        
        if (provincia && ciudad) {
          locations.push({
            provincia,
            ciudad,
            hasStorage
          });
        }
      }
    }
    
    cachedLocations = locations;
    return locations;
  } catch (error) {
    console.error("Error fetching locations:", error);
    
    // Fallback to hardcoded locations
    cachedLocations = [
      { provincia: "Buenos Aires", ciudad: "La Plata", hasStorage: true },
      { provincia: "Buenos Aires", ciudad: "Mar del Plata", hasStorage: true },
      { provincia: "Córdoba", ciudad: "Córdoba Capital", hasStorage: true },
      { provincia: "Santa Fe", ciudad: "Rosario", hasStorage: true },
      { provincia: "Mendoza", ciudad: "Mendoza Capital", hasStorage: true }
    ];
    
    return cachedLocations;
  }
};

export const fetchShippingTimes = async (): Promise<string[]> => {
  if (cachedShippingTimes.length > 0) {
    return cachedShippingTimes;
  }
  
  try {
    const sheetName = "TIEMPO DE ENVIO";
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    
    const response = await fetch(sheetUrl);
    
    if (!response.ok) {
      throw new Error("Error al cargar los tiempos de envío");
    }
    
    const csvText = await response.text();
    const rows = csvText.split('\n');
    
    // Find column index for shipping times
    const headers = rows[0].split(',').map(header => header.trim().replace(/"/g, '').toUpperCase());
    const timeColIndex = headers.findIndex(h => h === 'TIEMPO DE ENVIO');
    
    if (timeColIndex === -1) {
      throw new Error("No se encontró la columna 'TIEMPO DE ENVIO'");
    }
    
    // Extract shipping times
    const shippingTimes = rows
      .slice(1) // Skip header row
      .map(row => {
        const columns = row.split(',');
        return columns[timeColIndex]?.replace(/"/g, '').trim();
      })
      .filter(time => time && time.length > 0) // Filter out empty values
      .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
    
    cachedShippingTimes = shippingTimes;
    return shippingTimes;
  } catch (error) {
    console.error("Error fetching shipping times:", error);
    
    // Fallback to hardcoded shipping times
    cachedShippingTimes = [
      "Menos de 24 horas",
      "24-48 horas",
      "2-3 días",
      "3-5 días",
      "1 semana",
      "Más de 1 semana"
    ];
    
    return cachedShippingTimes;
  }
};

// Helper functions to work with the fetched data
export const getProvincias = async (): Promise<string[]> => {
  const locations = await fetchLocationsFromSheet();
  const provincias = new Set<string>();
  
  locations.forEach((location) => {
    provincias.add(location.provincia);
  });
  
  return Array.from(provincias).sort();
};

export const getCiudades = async (provincia: string): Promise<Location[]> => {
  const locations = await fetchLocationsFromSheet();
  return locations
    .filter((location) => location.provincia === provincia)
    .sort((a, b) => a.ciudad.localeCompare(b.ciudad));
};

export const getStorageCities = async (): Promise<Location[]> => {
  const locations = await fetchLocationsFromSheet();
  return locations.filter((location) => location.hasStorage);
};

export const isStorageAvailable = async (provincia: string, ciudad: string): Promise<boolean> => {
  const locations = await fetchLocationsFromSheet();
  const location = locations.find(
    (loc) => loc.provincia === provincia && loc.ciudad === ciudad
  );
  return location ? location.hasStorage : false;
};
