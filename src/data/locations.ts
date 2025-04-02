
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

// Mock API call to fetch provinces and cities
export const fetchProvinces = async (): Promise<Province[]> => {
  // In a real app, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return [
    {
      value: "buenos-aires",
      label: "Buenos Aires",
      cities: [
        { value: "la-plata", label: "La Plata" },
        { value: "mar-del-plata", label: "Mar del Plata" },
        { value: "quilmes", label: "Quilmes" },
      ],
    },
    {
      value: "cordoba",
      label: "Córdoba",
      cities: [
        { value: "cordoba-capital", label: "Córdoba Capital" },
        { value: "rio-cuarto", label: "Río Cuarto" },
        { value: "villa-maria", label: "Villa María" },
      ],
    },
    {
      value: "santa-fe",
      label: "Santa Fe",
      cities: [
        { value: "rosario", label: "Rosario" },
        { value: "santa-fe-capital", label: "Santa Fe Capital" },
        { value: "venado-tuerto", label: "Venado Tuerto" },
      ],
    },
    {
      value: "mendoza",
      label: "Mendoza",
      cities: [
        { value: "mendoza-capital", label: "Mendoza Capital" },
        { value: "san-rafael", label: "San Rafael" },
        { value: "godoy-cruz", label: "Godoy Cruz" },
      ],
    },
  ];
};

// Legacy functions for compatibility with existing code
export const getProvincias = async (): Promise<string[]> => {
  const provinces = await fetchProvinces();
  return provinces.map(p => p.label);
};

export const getCiudades = async (provincia: string): Promise<Location[]> => {
  const provinces = await fetchProvinces();
  const selectedProvince = provinces.find(p => p.label === provincia);
  
  if (!selectedProvince) return [];
  
  // Convert to the expected Location format
  return selectedProvince.cities.map(city => ({
    ciudad: city.label,
    hasStorage: Math.random() > 0.5 // Random for demo purposes
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
      
      return selectedProvince?.cities || [];
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
