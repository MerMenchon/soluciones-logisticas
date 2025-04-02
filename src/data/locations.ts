
// This file now re-exports everything from the new files for backward compatibility
import { fetchProvinces, getProvincias } from "@/data/provinces";
import { fetchCitiesForProvince, getCiudades, isStorageAvailable } from "@/data/cities";
import { fetchPresentations, fetchQuantityUnits } from "@/data/products";
import { useProvinces, useCities, useQuantityUnits } from "@/hooks/useLocationData";
import { Province, City, Location } from "@/types/locations";

// Re-export types
export type { Province, City, Location };

// Re-export functions
export {
  fetchProvinces,
  fetchCitiesForProvince,
  fetchPresentations,
  fetchQuantityUnits,
  getProvincias,
  getCiudades,
  isStorageAvailable,
  useProvinces,
  useCities,
  useQuantityUnits
};
