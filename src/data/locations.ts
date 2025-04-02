
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

// Fetch quantity units
export const fetchQuantityUnits = async (): Promise<{ value: string; label: string }[]> => {
  // In a real app, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return [
    { value: "kg", label: "Kilogramos (Kg)" },
    { value: "ton", label: "Toneladas (Ton)" },
    { value: "lt", label: "Litros (Lt)" },
    { value: "m3", label: "Metros cúbicos (m³)" },
    { value: "unidades", label: "Unidades" },
    { value: "pallets", label: "Pallets" },
    { value: "bultos", label: "Bultos" },
  ];
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
