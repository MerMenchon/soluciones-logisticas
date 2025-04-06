
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getProvincias, 
  getCiudades, 
  isStorageAvailable, 
  Location 
} from "@/data/locations";
import { UseLocationSelectHookParams } from "@/types/location";

export const useLocationSelect = ({
  type,
  provinceValue,
  cityValue,
  onCityChange,
}: UseLocationSelectHookParams) => {
  const [cities, setCities] = useState<Location[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [hasStorage, setHasStorage] = useState(false);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [hasInitialCheck, setHasInitialCheck] = useState(false);
  const { toast } = useToast();

  // Fetch provinces on component mount
  useEffect(() => {
    let isMounted = true;
    
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        // Show loading toast for better UX with large dataset
        const toastId = toast({
          title: "Cargando provincias",
          description: "Obteniendo datos de provincias...",
        });
        
        const startTime = performance.now();
        const provincesData = await getProvincias();
        const endTime = performance.now();
        
        console.log(`Provinces loaded in ${Math.round(endTime - startTime)}ms`);
        
        if (isMounted) {
          setProvinces(provincesData);
          
          // Update toast to success
          toast({
            id: toastId,
            title: "Provincias cargadas",
            description: `${provincesData.length} provincias disponibles`,
            variant: "default",
          });
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

  // Fetch cities when province changes
  useEffect(() => {
    let isMounted = true;
    let toastId: string | number | undefined;
    
    const loadCities = async () => {
      if (provinceValue) {
        setIsLoadingCities(true);
        try {
          // Show loading toast for better UX with large dataset
          toastId = toast({
            title: "Cargando ciudades",
            description: `Obteniendo ciudades para ${provinceValue}...`,
          });
          
          const startTime = performance.now();
          const citiesData = await getCiudades(provinceValue);
          const endTime = performance.now();
          
          console.log(`Cities loaded in ${Math.round(endTime - startTime)}ms`);
          
          if (isMounted) {
            // Note: We now filter cities in the CitySelector component
            // This allows us to show all cities but just mark which ones have storage
            setCities(citiesData);
            
            // Update toast to success
            toast({
              id: toastId,
              title: "Ciudades cargadas",
              description: `${citiesData.length} ciudades disponibles en ${provinceValue}`,
              variant: "default",
            });
            
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
              id: toastId,
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
      
      // Clear the loading toast if component unmounts
      if (toastId) {
        toast({
          id: toastId,
          duration: 0, // Remove immediately
        });
      }
    };
  }, [provinceValue, toast, type]);

  // Check storage availability when city changes
  useEffect(() => {
    let isMounted = true;
    
    const checkStorageAvailability = async () => {
      if (provinceValue && cityValue) {
        try {
          const storageAvailable = await isStorageAvailable(provinceValue, cityValue);
          if (isMounted) {
            setHasStorage(storageAvailable);
            setHasInitialCheck(true);
          }
        } catch (error) {
          console.error("Error checking storage availability:", error);
          if (isMounted) {
            setHasStorage(false);
            setHasInitialCheck(true);
          }
        }
      } else {
        setHasStorage(false);
        // Reset the initial check flag when there's no city selected
        if (cityValue === '') {
          setHasInitialCheck(false);
        }
      }
    };

    checkStorageAvailability();
    
    return () => {
      isMounted = false;
    };
  }, [provinceValue, cityValue]);

  const handleCityChange = (value: string) => {
    const selectedLocation = cities.find(city => city.ciudad === value);
    onCityChange(value, selectedLocation?.hasStorage || false);
  };

  return {
    cities,
    provinces,
    hasStorage,
    hasInitialCheck,
    isLoadingProvinces,
    isLoadingCities,
    handleCityChange
  };
};
