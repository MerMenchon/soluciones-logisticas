
import React from "react";
import { useLocationSelect } from "@/hooks/useLocationSelect";
import ProvinceSelector from "@/components/location/ProvinceSelector";
import CitySelector from "@/components/location/CitySelector";
import StorageCheckbox from "@/components/location/StorageCheckbox";
import StorageAlert from "@/components/location/StorageAlert";
import { LocationSelectorProps } from "@/types/location";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStorageProvinces } from "@/hooks/useStorageProvinces";
import { useProvinceData } from "@/hooks/useProvinceData";

const LocationSelector = ({
  type,
  provinceValue,
  cityValue,
  onProvinceChange,
  onCityChange,
  label,
  useAsStorage,
  onUseAsStorageChange,
  estimatedTime,
  onEstimatedTimeChange,
  disableStorageOption = false,
}: LocationSelectorProps) => {
  // Use the appropriate hook for provinces based on type
  const { provinces: regularProvinces, isLoadingProvinces: isLoadingRegularProvinces } = useProvinceData();
  const { provinces: storageProvinces, isLoadingProvinces: isLoadingStorageProvinces } = useStorageProvinces(type);
  
  // Use the appropriate provinces and loading state based on the selector type
  const provinces = type === "storage" ? storageProvinces : regularProvinces;
  const isLoadingProvinces = type === "storage" ? isLoadingStorageProvinces : isLoadingRegularProvinces;
  
  const {
    cities,
    hasStorage,
    hasInitialCheck,
    isLoadingCities,
    handleCityChange
  } = useLocationSelect({
    type,
    provinceValue,
    cityValue,
    onCityChange,
  });

  // Set default value for estimatedTime if it's empty
  React.useEffect(() => {
    if ((type === "storage" || useAsStorage) && cityValue && !estimatedTime && onEstimatedTimeChange) {
      onEstimatedTimeChange("30");
    }
  }, [type, useAsStorage, cityValue, estimatedTime, onEstimatedTimeChange]);

  // Handle natural numbers only in estimated time input
  const handleEstimatedTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow empty string or natural numbers (positive integers)
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      onEstimatedTimeChange?.(value);
    }
  };

  return (
    <div className="grid gap-4">
      <ProvinceSelector
        id={`${type}-provincia`}
        value={provinceValue}
        provinces={provinces || []}
        isLoading={isLoadingProvinces}
        onChange={onProvinceChange}
      />

      <CitySelector
        id={`${type}-ciudad`}
        value={cityValue}
        cities={cities || []}
        provinceValue={provinceValue}
        isLoading={isLoadingCities}
        type={type}
        onChange={handleCityChange}
      />

      {(type === "storage" || (useAsStorage && cityValue)) && (
        <div className="grid gap-2">
          <Label htmlFor={`${type}-estimated-time`}>Tiempo estimado</Label>
          <div className="flex items-center gap-2">
            <Input
              id={`${type}-estimated-time`}
              type="text"
              inputMode="numeric"
              value={estimatedTime || ''}
              onChange={handleEstimatedTimeChange}
              placeholder="30"
              className="w-32"
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">días</span>
          </div>
        </div>
      )}

      {type !== "storage" && (
        <StorageCheckbox
          id={`use-as-storage-${type}`}
          checked={useAsStorage}
          hasStorage={hasStorage}
          cityValue={cityValue}
          onChange={onUseAsStorageChange}
          disabled={disableStorageOption}
        />
      )}

      {type === "storage" && !hasStorage && cityValue && hasInitialCheck && (
        <StorageAlert show={true} />
      )}
    </div>
  );
};

export default LocationSelector;
