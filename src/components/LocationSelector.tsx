
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
  const { setFieldTouched, validateField, validateOnBlur, formSubmitted } = useFormContext();

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

  // Function to get the field name based on location type
  const getFieldName = (fieldType: 'province' | 'city' | 'time') => {
    let prefix = type;
    if (fieldType === 'time') {
      return "estimatedStorageTime";
    }
    return `${prefix}${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}`;
  };

  // Handle province change with field tracking and immediate validation
  const handleProvinceChange = (province: string) => {
    onProvinceChange(province);
    
    // Mark field as touched based on location type
    const fieldName = getFieldName('province');
    setFieldTouched(fieldName);
    
    // Clear city value when province changes
    if (onCityChange) {
      onCityChange("", false);
    }
    
    // Validate immediately if form has been submitted
    if (formSubmitted && validateField) {
      validateField(fieldName);
    }
  };

  // Handle province blur
  const handleProvinceBlur = () => {
    const fieldName = getFieldName('province');
    if (formSubmitted) {
      validateOnBlur(fieldName);
    }
  };

  // Handle city change with field tracking and immediate validation
  const handleLocalCityChange = (city: string, hasStorage: boolean) => {
    onCityChange(city, hasStorage);
    
    // Mark field as touched based on location type
    const fieldName = getFieldName('city');
    setFieldTouched(fieldName);
    
    // Validate immediately if form has been submitted
    if (formSubmitted && validateField) {
      validateField(fieldName);
    }
  };

  // Handle city blur
  const handleCityBlur = () => {
    const fieldName = getFieldName('city');
    if (formSubmitted) {
      validateOnBlur(fieldName);
    }
  };

  // Set default value for estimatedTime if it's empty
  React.useEffect(() => {
    if ((type === "storage" || useAsStorage) && cityValue && !estimatedTime && onEstimatedTimeChange) {
      onEstimatedTimeChange("30");
    }
  }, [type, useAsStorage, cityValue, estimatedTime, onEstimatedTimeChange]);

  // Handle natural numbers only in estimated time input with validation
  const handleEstimatedTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow empty string or natural numbers (positive integers)
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      onEstimatedTimeChange?.(value);
      
      // Mark the estimated storage time field as touched
      setFieldTouched("estimatedStorageTime");
      
      // Validate immediately if form has been submitted
      if (formSubmitted && validateField) {
        validateField("estimatedStorageTime");
      }
    }
  };

  // Handle time blur
  const handleTimeBlur = () => {
    if (formSubmitted) {
      validateOnBlur("estimatedStorageTime");
    }
  };

  return (
    <div className="grid gap-4">
      <ProvinceSelector
        id={`${type}-province`}
        value={provinceValue}
        provinces={provinces}
        isLoading={isLoadingProvinces}
        onChange={handleProvinceChange}
        error={errors?.province}
        onBlur={handleProvinceBlur}
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
        onBlur={handleCityBlur}
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
              onBlur={handleTimeBlur}
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
