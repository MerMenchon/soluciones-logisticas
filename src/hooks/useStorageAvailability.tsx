
import { useState, useEffect } from "react";
import { isStorageAvailable } from "@/data/locations";

export const useStorageAvailability = (provinceValue: string, cityValue: string) => {
  const [hasStorage, setHasStorage] = useState(false);
  const [hasInitialCheck, setHasInitialCheck] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const checkStorageAvailability = async () => {
      if (provinceValue && cityValue) {
        try {
          const storageAvailable = await isStorageAvailable(provinceValue, cityValue);
          if (isMounted) {
            setHasStorage(storageAvailable);
            setHasInitialCheck(true);
          }
        } catch (error) {
          console.error("Error checking storage availability:", error);
          if (isMounted) {
            setHasStorage(false);
            setHasInitialCheck(true);
          }
        }
      } else {
        setHasStorage(false);
        // Reset the initial check flag when there's no city selected
        if (cityValue === '') {
          setHasInitialCheck(false);
        }
      }
    };

    checkStorageAvailability();
    
    return () => {
      isMounted = false;
    };
  }, [provinceValue, cityValue]);

  return {
    hasStorage,
    hasInitialCheck
  };
};
