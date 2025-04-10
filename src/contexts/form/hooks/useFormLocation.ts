
import { useState, useEffect } from "react";

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

  // This effect synchronizes the storage province and city with origin/destination
  // when useOriginAsStorage or useDestinationAsStorage changes
  useEffect(() => {
    if (locationState.useOriginAsStorage) {
      setLocationState(prev => ({
        ...prev,
        storageProvince: prev.originProvince,
        storageCity: prev.originCity
      }));
    } else if (locationState.useDestinationAsStorage) {
      setLocationState(prev => ({
        ...prev,
        storageProvince: prev.destinationProvince,
        storageCity: prev.destinationCity
      }));
    }
  }, [
    locationState.useOriginAsStorage, 
    locationState.useDestinationAsStorage, 
    locationState.originProvince, 
    locationState.originCity,
    locationState.destinationProvince,
    locationState.destinationCity
  ]);

  const updateLocationState = (updates: Partial<LocationState>) => {
    setLocationState(prev => ({ ...prev, ...updates }));
  };

  // Location setters
  const setStorageProvince = (province: string) => 
    updateLocationState({ storageProvince: province });
  
  const setStorageCity = (city: string) => 
    updateLocationState({ storageCity: city });
  
  const setOriginProvince = (province: string) => {
    const updates: Partial<LocationState> = { originProvince: province };
    
    // If using origin as storage, update storage province too
    if (locationState.useOriginAsStorage) {
      updates.storageProvince = province;
    }
    
    updateLocationState(updates);
  };
  
  const setOriginCity = (city: string) => {
    const updates: Partial<LocationState> = { originCity: city };
    
    // If using origin as storage, update storage city too
    if (locationState.useOriginAsStorage) {
      updates.storageCity = city;
    }
    
    updateLocationState(updates);
  };
  
  const setDestinationProvince = (province: string) => {
    const updates: Partial<LocationState> = { destinationProvince: province };
    
    // If using destination as storage, update storage province too
    if (locationState.useDestinationAsStorage) {
      updates.storageProvince = province;
    }
    
    updateLocationState(updates);
  };
  
  const setDestinationCity = (city: string) => {
    const updates: Partial<LocationState> = { destinationCity: city };
    
    // If using destination as storage, update storage city too
    if (locationState.useDestinationAsStorage) {
      updates.storageCity = city;
    }
    
    updateLocationState(updates);
  };
  
  const setEstimatedStorageTime = (time: string) => 
    updateLocationState({ estimatedStorageTime: time });

  // Boolean handlers with mutual exclusivity
  const handleUseOriginAsStorageChange = (checked: boolean) => {
    console.log(`Setting useOriginAsStorage to: ${checked}`);
    updateLocationState({ 
      useOriginAsStorage: checked,
      // If we're enabling origin as storage, disable destination as storage
      useDestinationAsStorage: checked ? false : locationState.useDestinationAsStorage,
      // Update storage location to match origin
      storageProvince: checked ? locationState.originProvince : locationState.storageProvince,
      storageCity: checked ? locationState.originCity : locationState.storageCity
    });
  };

  const handleUseDestinationAsStorageChange = (checked: boolean) => {
    console.log(`Setting useDestinationAsStorage to: ${checked}`);
    updateLocationState({ 
      useDestinationAsStorage: checked,
      // If we're enabling destination as storage, disable origin as storage
      useOriginAsStorage: checked ? false : locationState.useOriginAsStorage,
      // Update storage location to match destination
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
