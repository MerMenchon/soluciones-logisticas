
import { useProvinceData } from "@/hooks/useProvinceData";
import { useCityData } from "@/hooks/useCityData";
import { useStorageAvailability } from "@/hooks/useStorageAvailability";
import { UseLocationSelectHookParams } from "@/types/location";

export const useLocationSelect = ({
  type,
  provinceValue,
  cityValue,
  onCityChange,
}: UseLocationSelectHookParams) => {
  const { provinces, isLoadingProvinces } = useProvinceData();
  const { cities, isLoadingCities } = useCityData(provinceValue, type);
  const { hasStorage, hasInitialCheck } = useStorageAvailability(provinceValue, cityValue);

  const handleCityChange = (value: string) => {
    const selectedLocation = cities.find(city => city.ciudad === value);
    onCityChange(value, selectedLocation?.hasStorage || false);
  };

  return {
    cities,
    provinces,
    hasStorage,
    hasInitialCheck,
    isLoadingProvinces,
    isLoadingCities,
    handleCityChange
  };
};
