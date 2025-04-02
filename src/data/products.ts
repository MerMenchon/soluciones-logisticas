
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
    const sheetName = "CANTIDAD";
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
