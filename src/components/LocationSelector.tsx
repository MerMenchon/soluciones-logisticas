
import React from "react";
import { useLocationSelect } from "@/hooks/useLocationSelect";
import ProvinceSelector from "@/components/location/ProvinceSelector";
import CitySelector from "@/components/location/CitySelector";
import StorageCheckbox from "@/components/location/StorageCheckbox";
import StorageAlert from "@/components/location/StorageAlert";
import { LocationSelectorProps } from "@/types/location";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "@/contexts/form";

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
  errors = { province: null, city: null, time: null }
}: LocationSelectorProps) => {
  const { setFieldTouched } = useFormContext();

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

  // Handle province change with field tracking
  const handleProvinceChange = (province: string) => {
    onProvinceChange(province);
    
    // Mark field as touched based on location type
    if (type === "storage") {
      setFieldTouched("storageProvince");
    } else if (type === "origin") {
      setFieldTouched("originProvince");
    } else if (type === "destination") {
      setFieldTouched("destinationProvince");
    }
  };

  // Handle city change with field tracking
  const handleLocalCityChange = (city: string, hasStorage: boolean) => {
    onCityChange(city, hasStorage);
    
    // Mark field as touched based on location type
    if (type === "storage") {
      setFieldTouched("storageCity");
    } else if (type === "origin") {
      setFieldTouched("originCity");
    } else if (type === "destination") {
      setFieldTouched("destinationCity");
    }
  };

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
      
      // Mark the estimated storage time field as touched
      setFieldTouched("estimatedStorageTime");
    }
  };

  return (
    <div className="grid gap-4">
      <ProvinceSelector
        id={`${type}-provincia`}
        value={provinceValue}
        provinces={provinces}
        isLoading={isLoadingProvinces}
        onChange={handleProvinceChange}
        error={errors?.province}
      />

      <CitySelector
        id={`${type}-ciudad`}
        value={cityValue}
        cities={cities}
        provinceValue={provinceValue}
        isLoading={isLoadingCities}
        type={type}
        onChange={handleLocalCityChange}
        error={errors?.city}
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
              className={`w-32 ${errors?.time ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">días</span>
          </div>
          {errors?.time && (
            <p className="text-sm text-red-500">{errors.time}</p>
          )}
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
