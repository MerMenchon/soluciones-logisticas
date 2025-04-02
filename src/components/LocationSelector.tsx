
import React from "react";
import { useLocationSelect } from "@/hooks/useLocationSelect";
import ProvinceSelector from "@/components/location/ProvinceSelector";
import CitySelector from "@/components/location/CitySelector";
import StorageCheckbox from "@/components/location/StorageCheckbox";
import StorageAlert from "@/components/location/StorageAlert";
import { LocationSelectorProps } from "@/types/location";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
}: LocationSelectorProps) => {
  const {
    cities,
    provinces,
    hasStorage,
    hasInitialCheck,
    isLoadingProvinces,
    isLoadingCities,
    handleCityChange
  } = useLocationSelect({
    type,
    provinceValue,
    cityValue,
    onCityChange,
  });

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
        label={label}
        value={provinceValue}
        provinces={provinces}
        isLoading={isLoadingProvinces}
        onChange={onProvinceChange}
      />

      <CitySelector
        id={`${type}-ciudad`}
        label={label}
        value={cityValue}
        cities={cities}
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
              placeholder="Ingrese tiempo estimado"
              className="flex-1"
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
        />
      )}

      {type === "storage" && !hasStorage && cityValue && hasInitialCheck && (
        <StorageAlert show={true} />
      )}
    </div>
  );
};

export default LocationSelector;
