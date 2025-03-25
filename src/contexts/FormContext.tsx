
import React, { createContext, useContext, useState, ReactNode } from "react";
import { ServiceType } from "@/components/ServiceSelector";
import { useToast } from "@/hooks/use-toast";

// Webhook URLs
const WEBHOOK_URL = "https://bipolos.app.n8n.cloud/webhook-test/recepcionFormulario";
const CONFIRMATION_WEBHOOK_URL = "https://bipolos.app.n8n.cloud/webhook-test/d2d6a0f1-2c83-4d50-8ae4-d2ab29b86f97";

interface FormContextType {
  // Form state
  formSubmitted: boolean;
  isSubmitting: boolean;
  selectedService: ServiceType | null;
  
  // Response data
  distanceValue: string | null;
  showConfirmation: boolean;
  
  // Location states
  storageProvince: string;
  storageCity: string;
  originProvince: string;
  originCity: string;
  useOriginAsStorage: boolean;
  destinationProvince: string;
  destinationCity: string;
  useDestinationAsStorage: boolean;
  
  // Product details
  productType: string;
  weight: string;
  volume: string;
  cargoValue: string;
  shippingTime: string;
  
  // Contact information
  email: string;
  additionalInfo: string;
  
  // Form actions
  setSelectedService: (service: ServiceType) => void;
  setStorageProvince: (province: string) => void;
  setStorageCity: (city: string, hasStorage: boolean) => void;
  setOriginProvince: (province: string) => void;
  setOriginCity: (city: string, hasStorage: boolean) => void;
  setDestinationProvince: (province: string) => void;
  setDestinationCity: (city: string, hasStorage: boolean) => void;
  handleUseOriginAsStorageChange: (checked: boolean) => void;
  handleUseDestinationAsStorageChange: (checked: boolean) => void;
  setProductType: (type: string) => void;
  setWeight: (weight: string) => void;
  setVolume: (volume: string) => void;
  setCargoValue: (value: string) => void;
  setShippingTime: (time: string) => void;
  setEmail: (email: string) => void;
  setAdditionalInfo: (info: string) => void;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  validateForm: () => string | null;
  confirmRequest: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Response data
  const [distanceValue, setDistanceValue] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Service selection
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  
  // Location states
  const [storageProvince, setStorageProvince] = useState("");
  const [storageCity, setStorageCity] = useState("");
  
  const [originProvince, setOriginProvince] = useState("");
  const [originCity, setOriginCity] = useState("");
  const [useOriginAsStorage, setUseOriginAsStorage] = useState(false);
  
  const [destinationProvince, setDestinationProvince] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [useDestinationAsStorage, setUseDestinationAsStorage] = useState(false);
  
  // Product details
  const [productType, setProductType] = useState("");
  const [weight, setWeight] = useState("");
  const [volume, setVolume] = useState("");
  const [cargoValue, setCargoValue] = useState("");
  const [shippingTime, setShippingTime] = useState("");
  
  // Contact information
  const [email, setEmail] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

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
    
    setEmail("");
    setAdditionalInfo("");
    
    setFormSubmitted(false);
    
    // Reset response data
    setDistanceValue(null);
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
    if (useOriginAsStorage && !hasStorage) {
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
    if (useDestinationAsStorage && !hasStorage) {
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
      setStorageProvince(originProvince);
      setStorageCity(originCity);
    } else if (!useDestinationAsStorage) {
      setStorageProvince("");
      setStorageCity("");
    }
  };

  const handleUseDestinationAsStorageChange = (checked: boolean) => {
    setUseDestinationAsStorage(checked);
    if (checked) {
      setUseOriginAsStorage(false);
      setStorageProvince(destinationProvince);
      setStorageCity(destinationCity);
    } else if (!useOriginAsStorage) {
      setStorageProvince("");
      setStorageCity("");
    }
  };

  const validateForm = (): string | null => {
    if (!selectedService) {
      return "Debe seleccionar un servicio";
    }

    if (selectedService === "storage" || selectedService === "both") {
      if (!storageProvince || !storageCity) {
        return "Debe seleccionar ubicación de almacenamiento";
      }
    }

    if (selectedService === "transport" || selectedService === "both") {
      if (!originProvince || !originCity) {
        return "Debe seleccionar origen";
      }
      if (!destinationProvince || !destinationCity) {
        return "Debe seleccionar destino";
      }
    }

    if (!productType) {
      return "Debe seleccionar tipo de producto";
    }

    if (!weight && !volume) {
      return "Debe ingresar peso o volumen";
    }

    if (!cargoValue || parseFloat(cargoValue) <= 0) {
      return "Debe ingresar un valor de carga válido (mayor a cero USD)";
    }
    
    // Email validation using regex
    if (!email) {
      return "Debe ingresar un email de contacto";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Debe ingresar un email válido";
    }

    return null;
  };

  const submitFormData = async () => {
    const serviceTypeLabel = selectedService === "both" ? "almacenamiento y transporte" : selectedService;
    
    const formData = {
      "Tipo Servicio": serviceTypeLabel,
      "almacenamiento provincia": storageProvince || null,
      "almacenamiento ciudad": storageCity || null,
      "origen provincia": originProvince || null,
      "origen ciudad": originCity || null,
      "destino provincia": destinationProvince || null,
      "destino ciudad": destinationCity || null,
      "Tipo Producto": productType || null,
      "Tiempo de Envío": shippingTime || null,
      "Peso (kg)": weight ? parseFloat(weight) : null,
      "Volumen": volume ? parseFloat(volume) : null,
      "Valor": cargoValue ? parseFloat(cargoValue) : null,
      "Email": email,
      "Información Adicional": additionalInfo || null,
      "Fecha y Hora": new Date().toISOString()
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al enviar los datos');
      }
      
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      throw error;
    }
  };

  const confirmRequest = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);
    
    try {
      // Send confirmation to webhook using POST method instead of GET
      const response = await fetch(CONFIRMATION_WEBHOOK_URL, {
        method: "POST", // Changed from GET to POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ confirmed: true, distance: distanceValue }),
      });
      
      if (!response.ok) {
        throw new Error('Error al confirmar la solicitud');
      }
      
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
      const responseData = await submitFormData();
      
      if (responseData && responseData.distancia !== undefined) {
        setDistanceValue(responseData.distancia.toString());
        setShowConfirmation(true);
      } else {
        // If the response doesn't contain distance, proceed with normal flow
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

  return (
    <FormContext.Provider
      value={{
        formSubmitted,
        isSubmitting,
        selectedService,
        distanceValue,
        showConfirmation,
        storageProvince,
        storageCity,
        originProvince,
        originCity,
        useOriginAsStorage,
        destinationProvince,
        destinationCity,
        useDestinationAsStorage,
        productType,
        weight,
        volume,
        cargoValue,
        shippingTime,
        email,
        additionalInfo,
        setSelectedService: handleServiceChange,
        setStorageProvince,
        setStorageCity: handleStorageCityChange,
        setOriginProvince,
        setOriginCity: handleOriginCityChange,
        setDestinationProvince,
        setDestinationCity: handleDestinationCityChange,
        handleUseOriginAsStorageChange,
        handleUseDestinationAsStorageChange,
        setProductType,
        setWeight,
        setVolume,
        setCargoValue,
        setShippingTime,
        setEmail,
        setAdditionalInfo,
        resetForm,
        handleSubmit,
        validateForm,
        confirmRequest
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
