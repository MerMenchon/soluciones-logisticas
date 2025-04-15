
import { City, Location } from "@/types/locations";

// Transform city names to city objects
export function transformCityNames(cityNames: string[], storageOnly: boolean): City[] {
  return cityNames
    .map(cityName => ({
      value: normalizeCityName(cityName),
      label: cityName,
      hasStorage: storageOnly ? true : false // All cities in storage-only request have storage
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

// Normalize city name for use as a value (URL-friendly)
export function normalizeCityName(cityName: string): string {
  return cityName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

// Convert City objects to Location objects (for backwards compatibility)
export function citiesToLocations(cities: City[], storageCities: City[]): Location[] {
  // Create a set of city names with storage
  const storageCityNames = new Set(storageCities.map(city => city.label));
  
  // Merge the information: mark cities that have storage
  return cities.map(city => ({
    ciudad: city.label,
    hasStorage: storageCityNames.has(city.label)
  }));
}
