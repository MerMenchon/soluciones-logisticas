
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getProvincias } from "@/data/provinces";

export const useProvinceData = () => {
  const [provinces, setProvinces] = useState<string[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    
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
          }
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
