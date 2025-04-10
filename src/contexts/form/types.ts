
// Define ServiceType for form state
export type ServiceType = "storage" | "transport" | "both" | "";

// WebhookResponse interface
export interface WebhookResponse {
  titulo: string;
  mensaje: string;
  precio?: string; // Made optional as it seems to be replaced by the new fields
  CostoTotalAlmacenamiento?: string;
  CostoTotalTransporte?: string;
  CostoTotal?: string;
  costoTotalIndividual?: string;
  CostoTotalIndividual?: string; // Added to handle the upper case version
  id?: string; // Added for confirmation flow
  submissionDate?: string; // Added for confirmation flow
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
  showResponseDialog: boolean;
  showSuccessConfirmation: boolean; // New state for showing success confirmation

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
  
  // Field tracking methods
  isFieldTouched: (fieldName: keyof FormState) => boolean;
  markFieldTouched: (fieldName: keyof FormState) => void;
  getFieldError: (fieldName: string) => string | null;
  resetFieldError: (fieldName: string) => void;
  
  // Dialog methods
  setShowResponseDialog: (show: boolean) => void;
  setShowSuccessConfirmation: (show: boolean) => void; // New method
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
  
  // Add the missing method that's needed in SuccessMessage.tsx
  updateSubmissionState: (updates: Partial<FormState>) => void;
}

// FormProviderProps interface
export interface FormProviderProps {
  children: React.ReactNode;
}
