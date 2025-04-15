
import { useProvinceData } from "@/hooks/useProvinceData";
import { useCityData } from "@/hooks/useCityData";
import { useStorageAvailability } from "@/hooks/useStorageAvailability";
import { UseLocationSelectHookParams } from "@/types/location";
import { Location } from "@/types/locations"; // Import the correct Location type

export const useLocationSelect = ({
  type,
  provinceValue,
  cityValue,
  onCityChange,
}: UseLocationSelectHookParams) => {
  const { provinces, isLoadingProvinces } = useProvinceData();
  const { cities, isLoadingCities } = useCityData(provinceValue, type);
  const { hasStorage, hasInitialCheck, isChecking } = useStorageAvailability(provinceValue, cityValue);

  const handleCityChange = (value: string) => {
    // Find the selected city to check if it has storage
    const selectedLocation = cities.find(city => city.ciudad === value);
    
    // Pass the storage information to the parent component
    onCityChange(value, selectedLocation?.hasStorage || false);
    
    // Log for debugging
    console.log(`City changed to ${value}, hasStorage: ${selectedLocation?.hasStorage || false}`);
  };

  return {
    cities,
    provinces,
    hasStorage,
    hasInitialCheck,
    isChecking,
    isLoadingProvinces,
    isLoadingCities,
    handleCityChange
  };
};
