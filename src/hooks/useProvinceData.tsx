
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getProvincias } from "@/data/provinces";

export const useProvinceData = () => {
  const [provinces, setProvinces] = useState<string[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 1;
    
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const startTime = performance.now();
        const provincesData = await getProvincias();
        const endTime = performance.now();
        
        console.log(`Provinces loaded in ${Math.round(endTime - startTime)}ms`);
        
        if (isMounted) {
          if (provincesData.length === 0) {
            console.log("No provinces returned from API");
            toast({
              title: "Advertencia",
              description: "No se pudieron cargar las provincias correctamente.",
              variant: "destructive",
            });
          } else {
            console.log(`Loaded ${provincesData.length} provinces successfully`);
          }
          setProvinces(provincesData);
        }
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
          // Ensure we set an empty array when there's an error
          setProvinces([]);
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
  }, [toast]);

  return {
    provinces,
    isLoadingProvinces
  };
};
