
import { useQuery } from "@tanstack/react-query";
import { fetchProvinces } from "@/data/provinces";
import { fetchCitiesForProvince } from "@/data/cities";
import { fetchQuantityUnits, fetchCategories, fetchPresentations } from "@/data/products";

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

// React Query hook for categories
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};

// React Query hook for product types
export const useProductTypes = () => {
  return useQuery({
    queryKey: ["productTypes"],
    queryFn: async () => {
      // Since we don't have a specific fetch function for product types,
      // we'll use categories as product types for now
      // This can be replaced with a specific API call later
      return fetchCategories();
    },
  });
};

// React Query hook for presentations
export const usePresentations = () => {
  return useQuery({
    queryKey: ["presentations"],
    queryFn: fetchPresentations,
  });
};
