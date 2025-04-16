
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
        const startTime = performance.now();
        const provincesData = await getProvincias();
        const endTime = performance.now();
        
        // console.log(`Provinces loaded in ${Math.round(endTime - startTime)}ms`);
        
        if (isMounted) {
          setProvinces(provincesData);
        }
      } catch (error) {
        console.error("Error loading provinces:", error);
        if (isMounted) {
          // Call toast with no arguments since it now doesn't accept any
          toast();
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
