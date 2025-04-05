
// Define ServiceType for form state
export type ServiceType = "storage" | "transport" | "both" | "";

// WebhookResponse interface
export interface WebhookResponse {
  titulo: string;
  mensaje: string;
  precio: string; // Changed from number to string to match API response
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: {
    [key: string]: string | null;
  };
}

// Form State interface
export interface FormState {
  // Service state
  selectedService: ServiceType;
  
  // Location state
  storageProvince: string;
  storageCity: string;
  originProvince: string;
  originCity: string;
  useOriginAsStorage: boolean;
  destinationProvince: string;
  destinationCity: string;
  useDestinationAsStorage: boolean;
  estimatedStorageTime: string;

  // UI state
  isSubmitting: boolean;
  formSubmitted: boolean;
  showConfirmation: boolean;
  distanceValue: string | null;
  isWaitingForResponse: boolean;
  showResponseDialog: boolean; // New state for controlling dialog visibility

  // Contact state
  additionalInfo: string;

  // Product state
  productType: string;
  description: string;
  presentation: string;
  clarification: string;
  cargoValue: string;
  shippingTime: string;
  quantity: string;
  quantityUnit: string;
  
  // Optional webhook response
  webhookResponse?: WebhookResponse;
  
  // Validation state
  validationResult?: ValidationResult;
}

// FormContext type for providing form context
export interface FormContextType extends FormState {
  // Service methods
  setSelectedService: (service: ServiceType) => void;
  
  // Location methods
  setStorageProvince: (province: string) => void;
  setStorageCity: (city: string) => void;
  setOriginProvince: (province: string) => void;
  setOriginCity: (city: string) => void;
  setDestinationProvince: (province: string) => void;
  setDestinationCity: (city: string) => void;
  handleUseOriginAsStorageChange: (checked: boolean) => void;
  handleUseDestinationAsStorageChange: (checked: boolean) => void;
  setEstimatedStorageTime: (time: string) => void;
  
  // Product methods
  setProductType: (type: string) => void;
  setDescription: (description: string) => void;
  setPresentation: (presentation: string) => void;
  setClarification: (clarification: string) => void;
  setCargoValue: (value: string) => void;
  setShippingTime: (time: string) => void;
  setQuantity: (quantity: string) => void;
  setQuantityUnit: (unit: string) => void;
  
  // Contact methods
  setAdditionalInfo: (info: string) => void;
  
  // Dialog methods
  setShowResponseDialog: (show: boolean) => void;
  handleCloseResponseDialog: () => void;
  
  // Form action methods
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  confirmRequest: () => Promise<void>;
  cancelRequest: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setShowConfirmation: (showConfirmation: boolean) => void;
  setDistanceValue: (distanceValue: string | null) => void;
  validateForm: () => string | null;
  validateFields: () => ValidationResult;
}

// FormProviderProps interface
export interface FormProviderProps {
  children: React.ReactNode;
}
