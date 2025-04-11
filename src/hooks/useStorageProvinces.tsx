
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
        // Always get all provinces first
        const provincesData = await getProvincias();
        
        // For storage type, we'll show all provinces but filter cities later
        // We no longer filter provinces based on storage availability
        console.log(`Showing all ${provincesData.length} provinces for type ${type}`);
        
        if (isMounted) {
          setProvinces(provincesData);
        }
        
        const endTime = performance.now();
        console.log(`Provinces loaded in ${Math.round(endTime - startTime)}ms - Found ${provincesData.length} provinces`);
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
