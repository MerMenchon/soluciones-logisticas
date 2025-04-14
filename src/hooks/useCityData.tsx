
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getCiudades } from "@/data/locations";
import { Location } from "@/types/locations"; // Import the correct Location type

export const useCityData = (
  provinceValue: string,
  type: "origin" | "destination" | "storage" | "transport" | "both"
) => {
  const [cities, setCities] = useState<Location[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 1;
    
    const loadCities = async () => {
      if (provinceValue) {
        setIsLoadingCities(true);
        
        try {
          console.log(`Loading cities for province: ${provinceValue}`);
          const startTime = performance.now();
          const citiesData = await getCiudades(provinceValue);
          const endTime = performance.now();
          
          console.log(`Cities loaded in ${Math.round(endTime - startTime)}ms - Found ${citiesData.length} cities`);
          
          if (citiesData.length === 0) {
            console.log(`No cities found for province: ${provinceValue}`);
          } else {
            const storageCount = citiesData.filter(city => city.hasStorage).length;
            console.log(`Cities with storage: ${storageCount} / ${citiesData.length}`);
          }
          
          if (isMounted) {
            setCities(citiesData);
          }
        } catch (error) {
          console.error("Error loading cities:", error);
          if (isMounted) {
            if (retryCount < maxRetries) {
              console.log(`Retrying city load (${retryCount + 1}/${maxRetries})...`);
              retryCount++;
              setTimeout(loadCities, 1000); // Wait 1 second before retry
              return;
            }
            
            toast({
              title: "Error",
              description: "No se pudieron cargar las ciudades. Intente nuevamente.",
              variant: "destructive",
            });
            setCities([]);
          }
        } finally {
          if (isMounted) {
            setIsLoadingCities(false);
          }
        }
      } else {
        setCities([]);
      }
    };

    loadCities();
    
    return () => {
      isMounted = false;
    };
  }, [provinceValue, toast, type]);

  return {
    cities,
    isLoadingCities
  };
};
