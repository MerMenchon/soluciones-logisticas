import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { fetchDistance } from "@/utils/maps";
import { useToast } from "@/hooks/use-toast";

// Define service type
type ServiceType = "storage" | "transport" | "both" | "";

// Define types for province and city options
interface ProvinceCityOption {
  value: string;
  label: string;
}

// Form Context type
interface FormContextType {
  // Service selection
  selectedService: ServiceType;
  setSelectedService: (service: ServiceType) => void;

  // Location details
  storageProvince: string;
  storageCity: string;
  originProvince: string;
  originCity: string;
  useOriginAsStorage: boolean;
  destinationProvince: string;
  destinationCity: string;
  useDestinationAsStorage: boolean;

  // Location setters
  setStorageProvince: (province: string) => void;
  setStorageCity: (city: string) => void;
  setOriginProvince: (province: string) => void;
  setOriginCity: (city: string) => void;
  setDestinationProvince: (province: string) => void;
  setDestinationCity: (city: string) => void;
  handleUseOriginAsStorageChange: (checked: boolean) => void;
  handleUseDestinationAsStorageChange: (checked: boolean) => void;

  // UI state
  isSubmitting: boolean;
  formSubmitted: boolean;
  showConfirmation: boolean;
  distanceValue: string | null;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  setShowConfirmation: Dispatch<SetStateAction<boolean>>;
  setDistanceValue: Dispatch<SetStateAction<string | null>>;

  // Confirmation actions
  confirmRequest: () => void;
  cancelRequest: () => void;

  // Contact details
  email: string;
  additionalInfo: string;

  // Product details
  productType: string;
  description: string;
  presentation: string;
  clarification: string;
  cargoValue: string;
  shippingTime: string;
  quantity: string;
  quantityUnit: string;
  category: string;

  // Contact setters
  setEmail: (email: string) => void;
  setAdditionalInfo: (info: string) => void;

  // Product details setters
  setProductType: (type: string) => void;
  setDescription: (description: string) => void;
  setPresentation: (presentation: string) => void;
  setClarification: (clarification: string) => void;
  setCargoValue: (value: string) => void;
  setShippingTime: (time: string) => void;
  setQuantity: (quantity: string) => void;
  setQuantityUnit: (unit: string) => void;
  setCategory: (category: string) => void;

  // Form submission
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

// Create the context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Hook for using the form context
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

// Form Context Provider
export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();

  // Form state
  const [selectedService, setSelectedService] = useState<ServiceType>("");
  const [storageProvince, setStorageProvince] = useState("");
  const [storageCity, setStorageCity] = useState("");
  const [originProvince, setOriginProvince] = useState("");
  const [originCity, setOriginCity] = useState("");
  const [useOriginAsStorage, setUseOriginAsStorage] = useState(false);
  const [destinationProvince, setDestinationProvince] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [useDestinationAsStorage, setUseDestinationAsStorage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [distanceValue, setDistanceValue] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Product details
  const [productType, setProductType] = useState("");
  const [description, setDescription] = useState("");
  const [presentation, setPresentation] = useState("");
  const [clarification, setClarification] = useState("");
  const [cargoValue, setCargoValue] = useState("");
  const [shippingTime, setShippingTime] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityUnit, setQuantityUnit] = useState("");
  const [category, setCategory] = useState("");

  // Handlers for boolean changes
  const handleUseOriginAsStorageChange = (checked: boolean) => {
    setUseOriginAsStorage(checked);
    if (checked) {
      setStorageProvince(originProvince);
      setStorageCity(originCity);
    }
  };

  const handleUseDestinationAsStorageChange = (checked: boolean) => {
    setUseDestinationAsStorage(checked);
    if (checked) {
      setStorageProvince(destinationProvince);
      setStorageCity(destinationCity);
    }
  };

  // Handle service change
  const handleServiceChange = (service: string) => {
    setSelectedService(service as ServiceType);
    resetLocations();
  };

  // Reset locations
  const resetLocations = () => {
    setStorageProvince("");
    setStorageCity("");
    setOriginProvince("");
    setOriginCity("");
    setDestinationProvince("");
    setDestinationCity("");
    setUseOriginAsStorage(false);
    setUseDestinationAsStorage(false);
  };

  // Reset form
  const resetForm = () => {
    setSelectedService("");
    resetLocations();
    setIsSubmitting(false);
    setFormSubmitted(false);
    setShowConfirmation(false);
    setDistanceValue(null);
    setEmail("");
    setAdditionalInfo("");
    setProductType("");
    setDescription("");
    setPresentation("");
    setClarification("");
    setCargoValue("");
    setShippingTime("");
    setQuantity("");
    setQuantityUnit("");
    setCategory("");
  };

  // Function to validate the form
  const validateForm = () => {
    if (!selectedService) {
      return "Debe seleccionar un servicio";
    }

    if (selectedService === "storage") {
      if (!storageProvince || !storageCity) {
        return "Debe seleccionar provincia y ciudad de almacenamiento";
      }
    }

    if (selectedService === "transport") {
      if (!originProvince || !originCity || !destinationProvince || !destinationCity) {
        return "Debe seleccionar origen y destino";
      }
    }

    if (selectedService === "both") {
      if (!originProvince || !originCity || !destinationProvince || !destinationCity) {
        return "Debe seleccionar origen y destino";
      }
    }
    
    if (!productType) {
      return "Debe seleccionar tipo de producto";
    }

    // Add validation for description when product type is "Otro"
    if (productType === "Otro" && !description.trim()) {
      return "Debe ingresar una descripción del producto cuando el tipo es 'Otro'";
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      return "Debe ingresar una cantidad válida (mayor a cero)";
    }
    
    if (!quantityUnit) {
      return "Debe seleccionar una unidad de medida para la cantidad";
    }

    if (!cargoValue || parseFloat(cargoValue) <= 0) {
      return "Debe ingresar un valor de carga válido (mayor a cero)";
    }

    if (!email) {
      return "Debe ingresar un email";
    }

    return null;
  };

  // Function to handle form submission
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

    if (selectedService === "transport" || selectedService === "both") {
      setIsSubmitting(true);
      try {
        const distance = await fetchDistance(
          `${originCity}, ${originProvince}, Argentina`,
          `${destinationCity}, ${destinationProvince}, Argentina`
        );
        setDistanceValue(distance);
        setShowConfirmation(true);
      } catch (error) {
        console.error("Error fetching distance:", error);
        toast({
          title: "Error",
          description: "No se pudo calcular la distancia entre los puntos.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    } else {
      confirmRequest();
    }
  };

  const confirmRequest = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Here you would typically send the form data to your server
    const formData = getFormData();
    console.log("Form data submitted:", formData);

    // Show success message
    toast({
      title: "Éxito",
      description: "Su consulta ha sido enviada correctamente!",
    });

    setFormSubmitted(true);
    setIsSubmitting(false);
  };

  const cancelRequest = () => {
    setShowConfirmation(false);
    setDistanceValue(null);
    setIsSubmitting(false);
  };

  // Add category to getFormData function
  const getFormData = () => {
    return {
      "Servicio": selectedService,
      "Provincia de Almacenamiento": storageProvince || null,
      "Ciudad de Almacenamiento": storageCity || null,
      "Provincia de Origen": originProvince || null,
      "Ciudad de Origen": originCity || null,
      "Provincia de Destino": destinationProvince || null,
      "Ciudad de Destino": destinationCity || null,
      "Email": email,
      "Información Adicional": additionalInfo || null,
      
      // Product details
      "Tipo de Producto": productType,
      "Categoría": category || null,
      "Descripción": description || null,
      "Presentación": presentation || null,
      "Aclaración": clarification || null,
      "Tiempo de Envío": shippingTime || null,
      "Cantidad": quantity ? parseFloat(quantity) : null,
      "Unidad de Cantidad": quantityUnit || null,
      "Valor": cargoValue ? parseFloat(cargoValue) : null,
    };
  };

  return (
    <FormContext.Provider
      value={{
        // Form state
        selectedService,
        storageProvince,
        storageCity,
        originProvince,
        originCity,
        useOriginAsStorage,
        destinationProvince,
        destinationCity,
        useDestinationAsStorage,
        isSubmitting,
        formSubmitted,
        showConfirmation,
        distanceValue,
        email,
        additionalInfo,
        productType,
        description,
        presentation,
        clarification,
        cargoValue,
        shippingTime,
        quantity,
        quantityUnit,
        category,

        // Setters
        setSelectedService: handleServiceChange,
        setStorageProvince,
        setStorageCity,
        setOriginProvince,
        setOriginCity,
        setDestinationProvince,
        setDestinationCity,
        handleUseOriginAsStorageChange,
        handleUseDestinationAsStorageChange,
        setIsSubmitting,
        setShowConfirmation,
        setDistanceValue,
        setEmail,
        setAdditionalInfo,
        setProductType,
        setDescription,
        setPresentation,
        setClarification,
        setCargoValue,
        setShippingTime,
        setQuantity,
        setQuantityUnit,
        setCategory,

        // Form submission
        handleSubmit,
        resetForm,
        confirmRequest,
        cancelRequest,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
