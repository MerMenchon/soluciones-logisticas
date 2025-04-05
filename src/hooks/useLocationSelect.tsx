
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
  const [hasShownToast, setHasShownToast] = useState(false);
  const { toast } = useToast();

  // Fetch provinces on component mount
  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const provincesData = await getProvincias();
        setProvinces(provincesData);
      } catch (error) {
        console.error("Error loading provinces:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las provincias. Intente nuevamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, [toast]);

  // Reset hasShownToast when province changes
  useEffect(() => {
    if (provinceValue) {
      setHasShownToast(false);
    }
  }, [provinceValue]);

  // Fetch cities when province changes
  useEffect(() => {
    const loadCities = async () => {
      if (provinceValue) {
        setIsLoadingCities(true);
        try {
          const citiesData = await getCiudades(provinceValue);
          
          // Note: We now filter cities in the CitySelector component
          // This allows us to show all cities but just mark which ones have storage
          setCities(citiesData);
          
          // If this is a storage selector and no cities with storage are available, show a toast
          if (type === "storage" && !hasShownToast) {
            const citiesWithStorage = citiesData.filter(city => city.hasStorage);
            if (citiesWithStorage.length === 0) {
              toast({
                title: "No hay almacenamiento",
                description: "No hay ciudades con almacenamiento disponible en esta provincia.",
                variant: "destructive",
                duration: 3000,
              });
              setHasShownToast(true);
            }
          }
        } catch (error) {
          console.error("Error loading cities:", error);
          toast({
            title: "Error",
            description: "No se pudieron cargar las ciudades. Intente nuevamente.",
            variant: "destructive",
            duration: 3000,
          });
          setCities([]);
        } finally {
          setIsLoadingCities(false);
        }
      } else {
        setCities([]);
      }
    };

    loadCities();
  }, [provinceValue, toast, type, hasShownToast]);

  // Check storage availability when city changes
  useEffect(() => {
    const checkStorageAvailability = async () => {
      if (provinceValue && cityValue) {
        try {
          const storageAvailable = await isStorageAvailable(provinceValue, cityValue);
          setHasStorage(storageAvailable);
          setHasInitialCheck(true);
        } catch (error) {
          console.error("Error checking storage availability:", error);
          setHasStorage(false);
          setHasInitialCheck(true);
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
  }, [provinceValue, cityValue]);

  // This function matches the signature in the LocationSelectParams interface
  const handleCityChange = (value: string, hasStorage: boolean) => {
    onCityChange(value, hasStorage);
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
