
import { Province } from "@/types/locations";

// Fetch provinces from Google Sheets
export const fetchProvinces = async (): Promise<Province[]> => {
  try {
    const sheetId = "1VYDCQfaz3-7IrhPUGpAO4UBLMDR1mEyl6UCHU1hznwQ";
    const sheetName = "LOCALIDADES";
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    
    const response = await fetch(sheetUrl);
    
    if (!response.ok) {
      throw new Error("Error al cargar las provincias");
    }
    
    const csvText = await response.text();
    
    // Parse CSV to extract provinces
    const rows = csvText.split('\n');
    
    // Find the column index for "PROVINCIA"
    const headers = rows[0].split(',');
    const provinceColumnIndex = headers.findIndex(
      header => header.trim().replace(/"/g, '').toUpperCase() === 'PROVINCIA'
    );
    
    if (provinceColumnIndex === -1) {
      throw new Error("No se encontró la columna 'PROVINCIA' en la hoja");
    }
    
    // Extract unique province names from the specified column
    const provinceSet = new Set<string>();
    
    rows.slice(1).forEach(row => {
      const columns = row.split(',');
      if (columns.length > provinceColumnIndex) {
        const provinceName = columns[provinceColumnIndex]?.replace(/"/g, '').trim();
        if (provinceName) {
          provinceSet.add(provinceName);
        }
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

// Legacy function for backward compatibility
export const getProvincias = async (): Promise<string[]> => {
  const provinces = await fetchProvinces();
  return [...new Set(provinces.map(p => p.label))]; // Ensure unique values
};
