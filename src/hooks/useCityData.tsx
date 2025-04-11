
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getCiudades, Location } from "@/data/locations";

export const useCityData = (
  provinceValue: string,
  type: "origin" | "destination" | "storage" | "transport" | "both"
) => {
  const [cities, setCities] = useState<Location[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    
    const loadCities = async () => {
      if (provinceValue) {
        setIsLoadingCities(true);
        
        try {
          const startTime = performance.now();
          const citiesData = await getCiudades(provinceValue);
          const endTime = performance.now();
          
          console.log(`Cities loaded in ${Math.round(endTime - startTime)}ms - Found ${citiesData.length} cities`);
          
          const storageCount = citiesData.filter(city => city.hasStorage).length;
          console.log(`Cities with storage: ${storageCount} / ${citiesData.length}`);
          
          if (isMounted) {
            setCities(citiesData);
            
            // Removed the toast for storage cities
          }
        } catch (error) {
          console.error("Error loading cities:", error);
          if (isMounted) {
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

