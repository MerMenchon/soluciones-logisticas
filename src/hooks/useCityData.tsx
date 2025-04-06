
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getCiudades, Location } from "@/data/locations";

export const useCityData = (
  provinceValue: string,
  type: "origin" | "destination" | "storage" | "transport"
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
          // Loading toast is still helpful for UX so users know something is happening
          toast({
            title: "Cargando ciudades",
            description: `Obteniendo ciudades para ${provinceValue}...`,
          });
          
          const startTime = performance.now();
          const citiesData = await getCiudades(provinceValue);
          const endTime = performance.now();
          
          console.log(`Cities loaded in ${Math.round(endTime - startTime)}ms - Found ${citiesData.length} cities`);
          
          if (isMounted) {
            setCities(citiesData);
            
            // If this is a storage selector and no cities with storage are available, show a toast
            if (type === "storage") {
              const citiesWithStorage = citiesData.filter(city => city.hasStorage);
              if (citiesWithStorage.length === 0) {
                toast({
                  title: "Información",
                  description: "No hay ciudades con almacenamiento disponible en esta provincia.",
                });
              }
            }
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
