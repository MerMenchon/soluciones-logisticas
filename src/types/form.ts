
import { ServiceType } from "@/components/ServiceSelector";

// Form Context Types
export interface FormState {
  // Form submission state
  formSubmitted: boolean;
  isSubmitting: boolean;
  selectedService: ServiceType | null;
  
  // Response data
  distanceValue: string | null;
  contactValue: string | null;
  dateTimeValue: string | null;
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
  productDescription: string;
  
  // Contact information
  email: string;
  additionalInfo: string;
}

export interface FormActions {
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
  setProductDescription: (description: string) => void;
  setEmail: (email: string) => void;
  setAdditionalInfo: (info: string) => void;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  validateForm: () => string | null;
  confirmRequest: () => void;
  cancelRequest: () => void;
}

export type FormContextType = FormState & FormActions;

export interface FormData {
  "Tipo Servicio": string;
  "almacenamiento provincia": string | null;
  "almacenamiento ciudad": string | null;
  "origen provincia": string | null;
  "origen ciudad": string | null;
  "destino provincia": string | null;
  "destino ciudad": string | null;
  "Tipo Producto": string | null;
  "Descripción Producto": string | null;
  "Tiempo de Envío": string | null;
  "Peso (kg)": number | null;
  "Volumen": number | null;
  "Valor": number | null;
  "Email": string;
  "Información Adicional": string | null;
  "Fecha y Hora": string;
}
