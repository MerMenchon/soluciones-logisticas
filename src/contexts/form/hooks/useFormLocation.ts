
import { useState } from "react";

interface LocationState {
  storageProvince: string;
  storageCity: string;
  originProvince: string;
  originCity: string;
  useOriginAsStorage: boolean;
  destinationProvince: string;
  destinationCity: string;
  useDestinationAsStorage: boolean;
  estimatedStorageTime: string;
}

export const useFormLocation = (initialState: Partial<LocationState> = {}) => {
  const [locationState, setLocationState] = useState<LocationState>({
    storageProvince: "",
    storageCity: "",
    originProvince: "",
    originCity: "",
    useOriginAsStorage: false,
    destinationProvince: "",
    destinationCity: "",
    useDestinationAsStorage: false,
    estimatedStorageTime: "",
    ...initialState,
  });

  const updateLocationState = (updates: Partial<LocationState>) => {
    setLocationState(prev => ({ ...prev, ...updates }));
  };

  // Location setters
  const setStorageProvince = (province: string) => 
    updateLocationState({ storageProvince: province });
  
  const setStorageCity = (city: string) => 
    updateLocationState({ storageCity: city });
  
  const setOriginProvince = (province: string) => 
    updateLocationState({ originProvince: province });
  
  const setOriginCity = (city: string) => 
    updateLocationState({ originCity: city });
  
  const setDestinationProvince = (province: string) => 
    updateLocationState({ destinationProvince: province });
  
  const setDestinationCity = (city: string) => 
    updateLocationState({ destinationCity: city });
  
  const setEstimatedStorageTime = (time: string) => 
    updateLocationState({ estimatedStorageTime: time });

  // Boolean handlers
  const handleUseOriginAsStorageChange = (checked: boolean) => {
    updateLocationState({ 
      useOriginAsStorage: checked,
      storageProvince: checked ? locationState.originProvince : locationState.storageProvince,
      storageCity: checked ? locationState.originCity : locationState.storageCity
    });
  };

  const handleUseDestinationAsStorageChange = (checked: boolean) => {
    updateLocationState({ 
      useDestinationAsStorage: checked,
      storageProvince: checked ? locationState.destinationProvince : locationState.storageProvince,
      storageCity: checked ? locationState.destinationCity : locationState.storageCity
    });
  };

  const resetLocations = () => {
    updateLocationState({
      storageProvince: "",
      storageCity: "",
      originProvince: "",
      originCity: "",
      destinationProvince: "",
      destinationCity: "",
      useOriginAsStorage: false,
      useDestinationAsStorage: false,
      estimatedStorageTime: ""
    });
  };

  return {
    ...locationState,
    setStorageProvince,
    setStorageCity,
    setOriginProvince,
    setOriginCity,
    setDestinationProvince,
    setDestinationCity,
    handleUseOriginAsStorageChange,
    handleUseDestinationAsStorageChange,
    setEstimatedStorageTime,
    resetLocations,
  };
};
