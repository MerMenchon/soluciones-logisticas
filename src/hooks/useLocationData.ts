import { fetchCities, fetchProvinces } from "@/data/locations";
import { useQuery } from "@tanstack/react-query";
import { fetchQuantityUnits, fetchCategories } from "@/data/products";

// Hook for provinces
export const useProvinces = () => {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: fetchProvinces,
  });
};

// Hook to fetch cities based on a province
export const useCities = (province: string) => {
  return useQuery({
    queryKey: ["cities", province],
    queryFn: () => fetchCities(province),
    enabled: !!province, // Only run the query if province is not empty
  });
};

// Hook for fetching quantity units
export const useQuantityUnits = () => {
  return useQuery({
    queryKey: ["quantityUnits"],
    queryFn: fetchQuantityUnits,
  });
};

// Hook for fetching categories
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};
