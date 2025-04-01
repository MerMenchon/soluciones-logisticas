
import React from "react";
import { useLocationSelect } from "@/hooks/useLocationSelect";
import ProvinceSelector from "@/components/location/ProvinceSelector";
import CitySelector from "@/components/location/CitySelector";
import StorageCheckbox from "@/components/location/StorageCheckbox";
import StorageAlert from "@/components/location/StorageAlert";
import { LocationSelectorProps } from "@/types/location";

interface ExtendedLocationSelectorProps extends LocationSelectorProps {
  serviceType?: "storage" | "transport" | "both";
}

const LocationSelector = ({
  type,
  provinceValue,
  cityValue,
  onProvinceChange,
  onCityChange,
  label,
  useAsStorage,
  onUseAsStorageChange,
  serviceType,
}: ExtendedLocationSelectorProps) => {
  const {
    cities,
    provinces,
    hasStorage,
    isLoadingProvinces,
    isLoadingCities,
    handleCityChange
  } = useLocationSelect({
    type,
    provinceValue,
    cityValue,
    onCityChange,
  });

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

      {type !== "storage" && (
        <StorageCheckbox
          id={`use-as-storage-${type}`}
          checked={useAsStorage}
          hasStorage={hasStorage}
          cityValue={cityValue}
          onChange={onUseAsStorageChange}
        />
      )}

      {type === "storage" && !hasStorage && cityValue && (
        <StorageAlert show={true} />
      )}
    </div>
  );
};

export default LocationSelector;
