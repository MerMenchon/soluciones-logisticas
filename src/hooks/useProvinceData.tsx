
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getProvincias } from "@/data/locations";

export const useProvinceData = () => {
  const [provinces, setProvinces] = useState<string[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        // Loading toast is still helpful for UX
        toast({
          title: "Cargando provincias",
          description: "Obteniendo datos de provincias...",
        });
        
        const startTime = performance.now();
        const provincesData = await getProvincias();
        const endTime = performance.now();
        
        console.log(`Provinces loaded in ${Math.round(endTime - startTime)}ms`);
        
        if (isMounted) {
          setProvinces(provincesData);
          // Success toast removed as requested
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
  }, [toast]);

  return {
    provinces,
    isLoadingProvinces
  };
};
