
import { useMemo, useEffect } from "react";
import { useStorageAvailability } from "@/hooks/useStorageAvailability";

interface UseStorageOptionsParams {
  selectedService: string;
  originProvince: string;
  originCity: string;
  destinationProvince: string;
  destinationCity: string;
  useOriginAsStorage: boolean;
  useDestinationAsStorage: boolean;
}

export const useStorageOptions = ({
  selectedService,
  originProvince,
  originCity,
  destinationProvince,
  destinationCity,
  useOriginAsStorage,
  useDestinationAsStorage
}: UseStorageOptionsParams) => {
  // Check storage availability for origin and destination
  const { 
    hasStorage: hasOriginStorage, 
    hasInitialCheck: originChecked, 
    isChecking: isCheckingOrigin 
  } = useStorageAvailability(originProvince, originCity);
  
  const { 
    hasStorage: hasDestinationStorage, 
    hasInitialCheck: destinationChecked, 
    isChecking: isCheckingDestination 
  } = useStorageAvailability(destinationProvince, destinationCity);

  // Log changes to storage availability for debugging
  useEffect(() => {
    if (originCity && originProvince && originChecked) {
      // console.log(`Origin storage (${originCity}, ${originProvince}): ${hasOriginStorage}`);
      // console.log(`useOriginAsStorage: ${useOriginAsStorage}`);
    }
  }, [originCity, originProvince, hasOriginStorage, originChecked, useOriginAsStorage]);

  useEffect(() => {
    if (destinationCity && destinationProvince && destinationChecked) {
      // console.log(`Destination storage (${destinationCity}, ${destinationProvince}): ${hasDestinationStorage}`);
      // console.log(`useDestinationAsStorage: ${useDestinationAsStorage}`);
    }
  }, [destinationCity, destinationProvince, hasDestinationStorage, destinationChecked, useDestinationAsStorage]);

  // Determine if options should be enabled based on storage availability
  const canUseOriginStorage = originCity && hasOriginStorage && originChecked;
  const canUseDestinationStorage = destinationCity && hasDestinationStorage && destinationChecked;

  // Determine the current storage location selection
  const storageLocation = useOriginAsStorage ? "origin" : useDestinationAsStorage ? "destination" : "";

  // Determine if we show the "no storage available" message
  const noStorageAvailable = useMemo(() => {
    // Only show the message if both cities are selected and checked for storage
    const bothCitiesSelected = originCity && destinationCity;
    const bothCitiesChecked = originChecked && destinationChecked;
    const noStorageInEither = !hasOriginStorage && !hasDestinationStorage;
    
    return selectedService === "both" && 
           bothCitiesSelected && 
           bothCitiesChecked &&
           noStorageInEither;
  }, [selectedService, originCity, destinationCity, hasOriginStorage, hasDestinationStorage, originChecked, destinationChecked]);

  return {
    hasOriginStorage,
    hasDestinationStorage,
    originChecked,
    destinationChecked,
    isCheckingOrigin,
    isCheckingDestination,
    canUseOriginStorage,
    canUseDestinationStorage,
    storageLocation,
    noStorageAvailable
  };
};
