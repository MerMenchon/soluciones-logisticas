
// Fetch presentations from Google Sheets
export const fetchPresentations = async (): Promise<string[]> => {
  try {
    // Google Sheets needs to be published to the web as CSV
    // Using the shared sheet with the correct sheet name
    const sheetId = "1VYDCQfaz3-7IrhPUGpAO4UBLMDR1mEyl6UCHU1hznwQ";
    const sheetName = "PRESENTACION"; // Using the PRESENTACION sheet
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    
    const response = await fetch(sheetUrl);
    
    if (!response.ok) {
      throw new Error("Error al cargar los tipos de presentación");
    }
    
    const csvText = await response.text();
    
    // Parse CSV to extract presentations
    const rows = csvText.split('\n');
    
    // Check if rows exist
    if (rows.length === 0) {
      throw new Error("No se encontraron datos en la hoja");
    }
    
    // Extract all data from the first column (assuming the first column contains the presentations)
    const presentations = rows
      .slice(1) // Skip header row
      .map(row => {
        const columns = row.split(',');
        return columns[0]?.replace(/"/g, '').trim();
      })
      .filter(presentation => presentation && presentation.length > 0) // Filter out empty values
      .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
    
    return presentations;
  } catch (error) {
    console.error("Error fetching presentations:", error);
    // Fallback to default options if fetch fails
    return [
      "Bolsas",
      "Cajas",
      "A granel",
      "Envases",
      "Tambores",
      "Paquetes",
      "Otro"
    ];
  }
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
    
    // Check if rows exist
    if (rows.length === 0) {
      throw new Error("No se encontraron datos en la hoja");
    }
    
    // Find the column index that contains "CANTIDAD" header
    const headers = rows[0].split(',');
    const quantityColumnIndex = headers.findIndex(
      header => header.trim().replace(/"/g, '').toUpperCase() === 'CANTIDAD'
    );
    
    // If column is not found, fallback to first column
    const columnIndex = quantityColumnIndex !== -1 ? quantityColumnIndex : 0;
    
    // Extract all data from the quantity column
    const units = rows
      .slice(1) // Skip header row
      .map(row => {
        const columns = row.split(',');
        return columnIndex < columns.length ? columns[columnIndex]?.replace(/"/g, '').trim() : null;
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
