
import { useState, useEffect, useRef } from "react";
import { isStorageAvailable } from "@/data/locations";

export const useStorageAvailability = (provinceValue: string, cityValue: string) => {
  const [hasStorage, setHasStorage] = useState(false);
  const [hasInitialCheck, setHasInitialCheck] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  // Use a ref to track previous values to avoid unnecessary checks
  const prevValuesRef = useRef({ province: "", city: "" });

  useEffect(() => {
    let isMounted = true;
    
    // Skip the check if nothing changed
    if (
      provinceValue === prevValuesRef.current.province && 
      cityValue === prevValuesRef.current.city
    ) {
      return;
    }
    
    // Update the ref with current values
    prevValuesRef.current = { province: provinceValue, city: cityValue };
    
    const checkStorageAvailability = async () => {
      // Only check if both province and city are provided
      if (provinceValue && cityValue) {
        setIsChecking(true);
        setHasInitialCheck(false); // Reset initial check while loading
        
        try {
          console.log(`Checking storage availability for ${cityValue}, ${provinceValue}`);
          const storageAvailable = await isStorageAvailable(provinceValue, cityValue);
          
          if (isMounted) {
            console.log(`Storage availability result for ${cityValue}: ${storageAvailable}`);
            setHasStorage(storageAvailable);
            setHasInitialCheck(true);
            setIsChecking(false);
          }
        } catch (error) {
          console.error("Error checking storage availability:", error);
          if (isMounted) {
            setHasStorage(false);
            setHasInitialCheck(true);
            setIsChecking(false);
          }
        }
      } else {
        // Reset hasStorage if inputs are incomplete
        if ((provinceValue === '' || cityValue === '') && hasStorage) {
          setHasStorage(false);
        }
        
        // Reset the initial check flag when there's no city selected
        if (cityValue === '' && hasInitialCheck) {
          setHasInitialCheck(false);
        }
        
        // Make sure we're not in checking state
        setIsChecking(false);
      }
    };

    checkStorageAvailability();
    
    return () => {
      isMounted = false;
    };
  }, [provinceValue, cityValue]); // Only depend on the province and city values

  return {
    hasStorage,
    hasInitialCheck,
    isChecking
  };
};
