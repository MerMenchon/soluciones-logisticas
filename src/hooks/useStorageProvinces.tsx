
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getProvincias } from "@/data/locations";

export const useStorageProvinces = (type: "origin" | "destination" | "storage" | "transport" | "both") => {
  const [provinces, setProvinces] = useState<string[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 2;
    
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const startTime = performance.now();
        
        // Always get all provinces first
        const provincesData = await getProvincias();
        
        // For all types, we'll show all provinces and filter cities later as needed
        if (isMounted) {
          setProvinces(provincesData);
          console.log(`Loaded ${provincesData.length} provinces successfully for ${type} type`);
        }
        
        const endTime = performance.now();
        console.log(`Provinces loaded in ${Math.round(endTime - startTime)}ms - Found ${provincesData.length} provinces`);
      } catch (error) {
        console.error("Error loading provinces:", error);
        if (isMounted) {
          if (retryCount < maxRetries) {
            console.log(`Retrying province load (${retryCount + 1}/${maxRetries})...`);
            retryCount++;
            setTimeout(loadProvinces, 1000); // Wait 1 second before retry
            return;
          }
          
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
