
// This simulates loading data from an Excel file
// In a production environment, you would load this from an API or external source

export interface Location {
  provincia: string;
  ciudad: string;
  hasStorage: boolean;
}

export const locations: Location[] = [
  // Buenos Aires
  { provincia: "Buenos Aires", ciudad: "La Plata", hasStorage: true },
  { provincia: "Buenos Aires", ciudad: "Mar del Plata", hasStorage: true },
  { provincia: "Buenos Aires", ciudad: "Bahía Blanca", hasStorage: true },
  { provincia: "Buenos Aires", ciudad: "Tandil", hasStorage: false },
  { provincia: "Buenos Aires", ciudad: "Junín", hasStorage: true },
  
  // Córdoba
  { provincia: "Córdoba", ciudad: "Córdoba Capital", hasStorage: true },
  { provincia: "Córdoba", ciudad: "Río Cuarto", hasStorage: true },
  { provincia: "Córdoba", ciudad: "Villa María", hasStorage: false },
  { provincia: "Córdoba", ciudad: "San Francisco", hasStorage: true },
  
  // Santa Fe
  { provincia: "Santa Fe", ciudad: "Rosario", hasStorage: true },
  { provincia: "Santa Fe", ciudad: "Santa Fe Capital", hasStorage: true },
  { provincia: "Santa Fe", ciudad: "Venado Tuerto", hasStorage: true },
  { provincia: "Santa Fe", ciudad: "Rafaela", hasStorage: false },
  
  // Entre Ríos
  { provincia: "Entre Ríos", ciudad: "Paraná", hasStorage: true },
  { provincia: "Entre Ríos", ciudad: "Concordia", hasStorage: false },
  { provincia: "Entre Ríos", ciudad: "Gualeguaychú", hasStorage: true },
  
  // La Pampa
  { provincia: "La Pampa", ciudad: "Santa Rosa", hasStorage: true },
  { provincia: "La Pampa", ciudad: "General Pico", hasStorage: false },
  
  // Tucumán
  { provincia: "Tucumán", ciudad: "San Miguel de Tucumán", hasStorage: true },
  
  // Mendoza
  { provincia: "Mendoza", ciudad: "Mendoza Capital", hasStorage: true },
  { provincia: "Mendoza", ciudad: "San Rafael", hasStorage: false },
];

export const getProvincias = (): string[] => {
  const provincias = new Set<string>();
  locations.forEach((location) => {
    provincias.add(location.provincia);
  });
  return Array.from(provincias).sort();
};

export const getCiudades = (provincia: string): Location[] => {
  return locations.filter((location) => location.provincia === provincia).sort((a, b) => a.ciudad.localeCompare(b.ciudad));
};

export const getStorageCities = (): Location[] => {
  return locations.filter((location) => location.hasStorage);
};

export const isStorageAvailable = (provincia: string, ciudad: string): boolean => {
  const location = locations.find(
    (loc) => loc.provincia === provincia && loc.ciudad === ciudad
  );
  return location ? location.hasStorage : false;
};
