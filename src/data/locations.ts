import { useQuery } from "@tanstack/react-query";

// Define types for locations
export interface Province {
  value: string;
  label: string;
  cities: City[];
}

export interface City {
  value: string;
  label: string;
}

// Define location type for backward compatibility
export interface Location {
  ciudad: string;
  hasStorage: boolean;
}

// Fetch provinces from Google Sheets
export const fetchProvinces = async (): Promise<Province[]> => {
  try {
    const sheetId = "1VYDCQfaz3-7IrhPUGpAO4UBLMDR1mEyl6UCHU1hznwQ";
    const sheetName = "PROVINCIAS"; // Sheet name for provinces
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    
    const response = await fetch(sheetUrl);
    
    if (!response.ok) {
      throw new Error("Error al cargar las provincias");
    }
    
    const csvText = await response.text();
    
    // Parse CSV to extract provinces
    const rows = csvText.split('\n');
    
    // Skip header row and extract unique province names
    // Assuming the CSV structure has province names in the first column
    const provinceSet = new Set<string>();
    
    rows.slice(1).forEach(row => {
      const columns = row.split(',');
      const provinceName = columns[0]?.replace(/"/g, '').trim();
      if (provinceName) {
        provinceSet.add(provinceName);
      }
    });
    
    // Convert the set to an array of Province objects
    const provinces = Array.from(provinceSet).map(provinceName => ({
      value: provinceName.toLowerCase().replace(/\s+/g, '-'),
      label: provinceName,
      cities: [] // Cities will be fetched separately
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

// Fetch cities for a province from Google Sheets
export const fetchCitiesForProvince = async (provinceValue: string): Promise<City[]> => {
  try {
    const sheetId = "1VYDCQfaz3-7IrhPUGpAO4UBLMDR1mEyl6UCHU1hznwQ";
    const sheetName = "CIUDADES"; // Sheet name for cities
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
      header => header.trim().replace(/"/g, '').toUpperCase() === 'ALMACENAMIENTO'
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
        const hasStorage = columns[storageColumnIndex]?.replace(/"/g, '').trim().toLowerCase() === 'si';
        
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

// Legacy functions for compatibility with existing code
export const getProvincias = async (): Promise<string[]> => {
  const provinces = await fetchProvinces();
  return [...new Set(provinces.map(p => p.label))]; // Ensure unique values
};

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

// Fetch presentations
export const fetchPresentations = async (): Promise<string[]> => {
  // In a real app, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return [
    "Bolsas",
    "Cajas",
    "A granel",
    "Envases",
    "Tambores",
    "Paquetes",
    "Otro"
  ];
};

// Fetch quantity units from Google Sheets
export const fetchQuantityUnits = async (): Promise<string[]> => {
  try {
    // Google Sheets needs to be published to the web as CSV
    // Using the shared sheet with the correct sheet name
    const sheetId = "1VYDCQfaz3-7IrhPUGpAO4UBLMDR1mEyl6UCHU1hznwQ";
    const sheetName = "CANTIDAD"; // Sheet name for quantity units
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    
    const response = await fetch(sheetUrl);
    
    if (!response.ok) {
      throw new Error("Error al cargar las unidades de cantidad");
    }
    
    const csvText = await response.text();
    
    // Parse CSV to extract quantity units
    const rows = csvText.split('\n');
    
    // Find the column index for "CANTIDAD"
    const headers = rows[0].split(',');
    const quantityColumnIndex = headers.findIndex(
      header => header.trim().replace(/"/g, '').toUpperCase() === 'CANTIDAD'
    );
    
    if (quantityColumnIndex === -1) {
      throw new Error("No se encontró la columna 'CANTIDAD' en la hoja");
    }
    
    // Extract quantity units
    const units = rows
      .slice(1) // Skip header row
      .map(row => {
        const columns = row.split(',');
        return columns[quantityColumnIndex]?.replace(/"/g, '').trim();
      })
      .filter(unit => unit && unit.length > 0) // Filter out empty values
      .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
    
    return units;
  } catch (error) {
    console.error("Error fetching quantity units:", error);
    // Fallback to default options if fetch fails
    return [
      "Kilogramos (Kg)",
      "Toneladas (Ton)",
      "Litros (Lt)",
      "Metros cúbicos (m³)",
      "Unidades",
      "Pallets",
      "Bultos"
    ];
  }
};

// React Query hook for provinces
export const useProvinces = () => {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: fetchProvinces,
  });
};

// React Query hook for cities based on selected province
export const useCities = (provinceValue: string) => {
  const { data: provinces } = useProvinces();
  
  return useQuery({
    queryKey: ["cities", provinceValue],
    queryFn: async () => {
      if (!provinceValue) return [];
      
      // Find the selected province to get its cities
      const selectedProvince = provinces?.find(
        (province) => province.value === provinceValue
      );
      
      const cities = await fetchCitiesForProvince(provinceValue);
      return cities;
    },
    enabled: !!provinces && !!provinceValue,
  });
};

// React Query hook for quantity units
export const useQuantityUnits = () => {
  return useQuery({
    queryKey: ["quantityUnits"],
    queryFn: fetchQuantityUnits,
  });
};
