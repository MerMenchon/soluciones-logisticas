
import { useQuery } from "@tanstack/react-query";
import { fetchProvinces } from "@/data/provinces";
import { fetchCitiesForProvince } from "@/data/cities";
import { fetchQuantityUnits, fetchCategories } from "@/data/products";

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
