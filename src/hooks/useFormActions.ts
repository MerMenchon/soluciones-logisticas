
import { ServiceType } from "@/components/ServiceSelector";
import { FormData, FormState } from "@/types/form";
import { useToast } from "@/hooks/use-toast";
import { submitFormData, submitConfirmation } from "@/services/formService";
import { useFormValidation } from "@/hooks/useFormValidation";

interface UseFormActionsProps {
  formState: FormState;
  setters: {
    setFormSubmitted: (value: boolean) => void;
    setIsSubmitting: (value: boolean) => void;
    setSelectedService: (value: ServiceType | null) => void;
    setDistanceValue: (value: string | null) => void;
    setContactValue: (value: string | null) => void;
    setDateTimeValue: (value: string | null) => void;
    setShowConfirmation: (value: boolean) => void;
    setStorageProvince: (value: string) => void;
    setStorageCity: (value: string) => void;
    setOriginProvince: (value: string) => void;
    setOriginCity: (value: string) => void;
    setUseOriginAsStorage: (value: boolean) => void;
    setDestinationProvince: (value: string) => void;
    setDestinationCity: (value: string) => void;
    setUseDestinationAsStorage: (value: boolean) => void;
    setProductType: (value: string) => void;
    setWeight: (value: string) => void;
    setVolume: (value: string) => void;
    setCargoValue: (value: string) => void;
    setShippingTime: (value: string) => void;
    setProductDescription: (value: string) => void;
    setEmail: (value: string) => void;
    setAdditionalInfo: (value: string) => void;
  };
}

export const useFormActions = ({ formState, setters }: UseFormActionsProps) => {
  const { toast } = useToast();
  const { validateForm } = useFormValidation(formState);
  
  const {
    setFormSubmitted,
    setIsSubmitting,
    setSelectedService,
    setDistanceValue,
    setContactValue,
    setDateTimeValue,
    setShowConfirmation,
    setStorageProvince,
    setStorageCity,
    setOriginProvince,
    setOriginCity,
    setUseOriginAsStorage,
    setDestinationProvince,
    setDestinationCity,
    setUseDestinationAsStorage,
    setProductType,
    setWeight,
    setVolume,
    setCargoValue,
    setShippingTime,
    setProductDescription,
    setEmail,
    setAdditionalInfo
  } = setters;

  const resetForm = () => {
    setSelectedService(null);
    
    setStorageProvince("");
    setStorageCity("");
    
    setOriginProvince("");
    setOriginCity("");
    setUseOriginAsStorage(false);
    
    setDestinationProvince("");
    setDestinationCity("");
    setUseDestinationAsStorage(false);
    
    setProductType("");
    setWeight("");
    setVolume("");
    setCargoValue("");
    setShippingTime("");
    setProductDescription("");
    
    setEmail("");
    setAdditionalInfo("");
    
    setFormSubmitted(false);
    
    // Reset response data
    setDistanceValue(null);
    setContactValue(null);
    setDateTimeValue(null);
    setShowConfirmation(false);
  };

  const handleServiceChange = (service: ServiceType) => {
    setSelectedService(service);
    
    // Reset relevant fields when changing service
    if (service === "storage") {
      setOriginProvince("");
      setOriginCity("");
      setDestinationProvince("");
      setDestinationCity("");
      setUseOriginAsStorage(false);
      setUseDestinationAsStorage(false);
    } else if (service === "transport") {
      setStorageProvince("");
      setStorageCity("");
    }
  };

  const handleStorageCityChange = (city: string, hasStorage: boolean) => {
    setStorageCity(city);
    if (!hasStorage) {
      toast({
        title: "Alerta",
        description: "No hay servicio de almacenamiento disponible en esta ciudad",
        variant: "destructive",
      });
    }
  };

  const handleOriginCityChange = (city: string, hasStorage: boolean) => {
    setOriginCity(city);
    if (formState.useOriginAsStorage && !hasStorage) {
      setUseOriginAsStorage(false);
      toast({
        title: "Alerta",
        description: "No hay servicio de almacenamiento disponible en esta ciudad",
        variant: "destructive",
      });
    }
  };

  const handleDestinationCityChange = (city: string, hasStorage: boolean) => {
    setDestinationCity(city);
    if (formState.useDestinationAsStorage && !hasStorage) {
      setUseDestinationAsStorage(false);
      toast({
        title: "Alerta",
        description: "No hay servicio de almacenamiento disponible en esta ciudad",
        variant: "destructive",
      });
    }
  };

  const handleUseOriginAsStorageChange = (checked: boolean) => {
    setUseOriginAsStorage(checked);
    if (checked) {
      setUseDestinationAsStorage(false);
      setStorageProvince(formState.originProvince);
      setStorageCity(formState.originCity);
    } else if (!formState.useDestinationAsStorage) {
      setStorageProvince("");
      setStorageCity("");
    }
  };

  const handleUseDestinationAsStorageChange = (checked: boolean) => {
    setUseDestinationAsStorage(checked);
    if (checked) {
      setUseOriginAsStorage(false);
      setStorageProvince(formState.destinationProvince);
      setStorageCity(formState.destinationCity);
    } else if (!formState.useOriginAsStorage) {
      setStorageProvince("");
      setStorageCity("");
    }
  };

  const prepareFormData = (): FormData => {
    const serviceTypeLabel = formState.selectedService === "both" 
      ? "almacenamiento y transporte" 
      : formState.selectedService || "";
    
    return {
      "Tipo Servicio": serviceTypeLabel,
      "almacenamiento provincia": formState.storageProvince || null,
      "almacenamiento ciudad": formState.storageCity || null,
      "origen provincia": formState.originProvince || null,
      "origen ciudad": formState.originCity || null,
      "destino provincia": formState.destinationProvince || null,
      "destino ciudad": formState.destinationCity || null,
      "Tipo Producto": formState.productType || null,
      "Descripción Producto": formState.productType === "Otros" ? formState.productDescription || null : null,
      "Tiempo de Envío": formState.shippingTime || null,
      "Peso (kg)": formState.weight ? parseFloat(formState.weight) : null,
      "Volumen": formState.volume ? parseFloat(formState.volume) : null,
      "Valor": formState.cargoValue ? parseFloat(formState.cargoValue) : null,
      "Email": formState.email,
      "Información Adicional": formState.additionalInfo || null,
      "Fecha y Hora": new Date().toISOString()
    };
  };

  const confirmRequest = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);
    
    try {
      await submitConfirmation({ 
        confirmacion: "si", 
        distance: formState.distanceValue,
        contacto: formState.contactValue,
        "fecha y hora": formState.dateTimeValue
      });
      
      // Only set form as submitted if the confirmation webhook was successful
      setFormSubmitted(true);
      
      toast({
        title: "Éxito",
        description: "Solicitud confirmada correctamente",
      });
    } catch (error) {
      console.error("Error al confirmar la solicitud:", error);
      toast({
        title: "Error",
        description: "No se pudo confirmar la solicitud. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelRequest = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);
    
    try {
      await submitConfirmation({ 
        confirmacion: "no", 
        distance: formState.distanceValue,
        contacto: formState.contactValue,
        "fecha y hora": formState.dateTimeValue
      });
      
      toast({
        title: "Información",
        description: "Solicitud cancelada",
      });
      
      // Reset form after cancellation
      resetForm();
    } catch (error) {
      console.error("Error al cancelar la solicitud:", error);
      toast({
        title: "Error",
        description: "No se pudo cancelar la solicitud. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = prepareFormData();
      const responseData = await submitFormData(formData);
      
      if (responseData) {
        // Handle array response format
        if (Array.isArray(responseData) && responseData.length > 0) {
          const firstItem = responseData[0];
          
          if (firstItem.DISTANCIA !== undefined) {
            setDistanceValue(firstItem.DISTANCIA.toString());
          }
          
          if (firstItem.CONTACTO !== undefined) {
            setContactValue(firstItem.CONTACTO);
          }
          
          if (firstItem["FECHA Y HORA"] !== undefined) {
            setDateTimeValue(firstItem["FECHA Y HORA"]);
          }
          
          setShowConfirmation(true);
        } 
        // Handle the previous response format for backward compatibility
        else if (responseData.distancia !== undefined) {
          setDistanceValue(responseData.distancia.toString());
          
          if (responseData.contacto !== undefined) {
            setContactValue(responseData.contacto);
          }
          
          if (responseData["fecha y hora"] !== undefined) {
            setDateTimeValue(responseData["fecha y hora"]);
          }
          
          setShowConfirmation(true);
        } else {
          // If the response doesn't contain any data, proceed with normal flow
          setFormSubmitted(true);
        }
      } else {
        // If the response doesn't contain any data, proceed with normal flow
        setFormSubmitted(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el formulario. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    resetForm,
    handleServiceChange,
    handleStorageCityChange,
    handleOriginCityChange,
    handleDestinationCityChange,
    handleUseOriginAsStorageChange,
    handleUseDestinationAsStorageChange,
    confirmRequest,
    cancelRequest,
    handleSubmit,
    validateForm
  };
};
