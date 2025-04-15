
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getCiudades } from "@/data/cities";
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
    const maxRetries = 2;
    
    const loadCities = async () => {
      if (!provinceValue) {
        setCities([]);
        return;
      }
      
      setIsLoadingCities(true);
      
      try {
        console.log(`Loading cities for province: ${provinceValue}, type: ${type}`);
        const startTime = performance.now();
        
        // For storage type, we want cities with storage only
        // For other types, we want all cities
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
