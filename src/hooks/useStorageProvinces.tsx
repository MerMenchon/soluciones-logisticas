
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getProvincias } from "@/data/locations";
import { getCiudades } from "@/data/cities";

export const useStorageProvinces = (type: "origin" | "destination" | "storage" | "transport" | "both") => {
  const [provinces, setProvinces] = useState<string[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const startTime = performance.now();
        let provincesData = await getProvincias();
        
        // If this is a storage selector, we only want provinces that have cities with storage
        if (type === "storage") {
          console.log("Filtering provinces for storage availability");
          
          // Create a filtered list of provinces with storage
          const provincesWithStorage: string[] = [];
          
          // Process each province to check if it has cities with storage
          for (const province of provincesData) {
            const cities = await getCiudades(province);
            if (cities.some(city => city.hasStorage)) {
              provincesWithStorage.push(province);
            }
          }
          
          console.log(`Found ${provincesWithStorage.length} provinces with storage out of ${provincesData.length}`);
          provincesData = provincesWithStorage;
        }
        
        const endTime = performance.now();
        console.log(`Provinces loaded in ${Math.round(endTime - startTime)}ms - Found ${provincesData.length} provinces`);
        
        if (isMounted) {
          setProvinces(provincesData);
        }
      } catch (error) {
        console.error("Error loading provinces:", error);
        if (isMounted) {
          toast({
            title: "Error",
            description: "No se pudieron cargar las provincias. Intente nuevamente.",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoadingProvinces(false);
        }
      }
    };

    loadProvinces();
    
    return () => {
      isMounted = false;
    };
  }, [toast, type]);

  return {
    provinces,
    isLoadingProvinces
  };
};
