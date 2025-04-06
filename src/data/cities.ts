
import { City, Location } from "@/types/locations";
import { fetchProvinces } from "./provinces";

// Fetch cities for a province from Google Sheets
export const fetchCitiesForProvince = async (provinceValue: string): Promise<City[]> => {
  try {
    const sheetId = "1bI2xqgZ9-ooLHCH8ublDX7mfg25sV-tw3fTEdm1hZp4";
    const sheetName = "CIUDADES";
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    
    const response = await fetch(sheetUrl);
    
    if (!response.ok) {
      throw new Error("Error al cargar las ciudades");
    }
    
    const csvText = await response.text();
    
    // Parse CSV to extract cities
    const rows = csvText.split('\n');
    
    // Find the column indices for province, city and storage availability
    const headers = rows[0].split(',');
    const provinceColumnIndex = headers.findIndex(
      header => header.trim().replace(/"/g, '').toUpperCase() === 'PROVINCIA'
    );
    const cityColumnIndex = headers.findIndex(
      header => header.trim().replace(/"/g, '').toUpperCase() === 'CIUDAD'
    );
    const storageColumnIndex = headers.findIndex(
      header => header.trim().replace(/"/g, '').toUpperCase() === 'DEPOSITO'
    );
    
    if (provinceColumnIndex === -1 || cityColumnIndex === -1) {
      throw new Error("No se encontraron las columnas necesarias en la hoja");
    }
    
    // Get the province label from the province value
    const provinces = await fetchProvinces();
    const provinceLabel = provinces.find(p => p.value === provinceValue)?.label;
    
    if (!provinceLabel) {
      throw new Error(`No se encontró la provincia con valor ${provinceValue}`);
    }
    
    // Extract cities for the selected province
    const cities = rows
      .slice(1) // Skip header row
      .map(row => {
        const columns = row.split(',');
        const rowProvince = columns[provinceColumnIndex]?.replace(/"/g, '').trim();
        const cityName = columns[cityColumnIndex]?.replace(/"/g, '').trim();
        const hasStorage = columns[storageColumnIndex]?.replace(/"/g, '').trim().toUpperCase() === 'SI';
        
        // Only include cities for the selected province
        if (rowProvince.toLowerCase() === provinceLabel.toLowerCase() && cityName) {
          return {
            value: cityName.toLowerCase().replace(/\s+/g, '-'),
            label: cityName,
            hasStorage
          };
        }
        return null;
      })
      .filter(Boolean) as (City & { hasStorage: boolean })[];
    
    return cities;
  } catch (error) {
    console.error(`Error fetching cities for province ${provinceValue}:`, error);
    // Return empty array if fetch fails
    return [];
  }
};

// Legacy function for backward compatibility
export const getCiudades = async (provincia: string): Promise<Location[]> => {
  const provinces = await fetchProvinces();
  const selectedProvince = provinces.find(p => p.label === provincia);
  
  if (!selectedProvince) return [];
  
  const cities = await fetchCitiesForProvince(selectedProvince.value);
  
  // Convert to the expected Location format
  return cities.map(city => ({
    ciudad: city.label,
    hasStorage: (city as any).hasStorage || false
  }));
};

// Check if storage is available in a location
export const isStorageAvailable = async (provincia: string, ciudad: string): Promise<boolean> => {
  const cities = await getCiudades(provincia);
  const selectedCity = cities.find(c => c.ciudad === ciudad);
  return selectedCity?.hasStorage || false;
};
