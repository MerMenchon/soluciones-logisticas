
import { ValidationResult } from "@/contexts/form/types";

export interface LogisticsFormHookReturn {
  // Service properties
  selectedService: string;
  setSelectedService: (service: string) => void;
  
  // Location properties
  storageProvince: string;
  storageCity: string;
  originProvince: string;
  originCity: string;
  destinationProvince: string;
  destinationCity: string;
  useOriginAsStorage: boolean;
  useDestinationAsStorage: boolean;
  estimatedStorageTime: string;
  
  // Location methods
  setStorageProvince: (province: string) => void;
  setStorageCity: (city: string, hasStorage: boolean) => void;
  setOriginProvince: (province: string) => void;
  setOriginCity: (city: string, hasStorage: boolean) => void;
  setDestinationProvince: (province: string) => void;
  setDestinationCity: (city: string, hasStorage: boolean) => void;
  handleUseOriginAsStorageChange: (checked: boolean) => void;
  handleUseDestinationAsStorageChange: (checked: boolean) => void;
  setEstimatedStorageTime: (time: string) => void;
  
  // Product properties
  productType: string;
  description: string;
  presentation: string;
  clarification: string;
  cargoValue: string;
  quantity: string;
  quantityUnit: string;
  
  // Product methods
  setProductType: (type: string) => void;
  setDescription: (description: string) => void;
  setPresentation: (presentation: string) => void;
  setClarification: (clarification: string) => void;
  setCargoValue: (value: string) => void;
  setQuantity: (quantity: string) => void;
  setQuantityUnit: (unit: string) => void;
  
  // Form state
  isFormValid: boolean;
  isSubmitting: boolean;
  formSubmitted: boolean;
  showConfirmation: boolean;
  isWaitingForResponse: boolean;
  showResponseDialog: boolean;
  
  // Validation
  validationResult?: ValidationResult;
  validateForm: () => string | null;
  validateFields: () => ValidationResult;
  validateField: (fieldName: string) => ValidationResult;
  
  // Field tracking methods
  setFieldTouched: (fieldName: string) => void;
  getFieldError: (fieldName: string) => string | null;
  isFieldTouched: (fieldName: string) => boolean;
  
  // Date related
  shippingTime: string;
  setShippingTime: (time: string) => void;
  selectedDate: Date | undefined;
  disabledDays: { before: Date };
  handleDateSelect: (date: Date | undefined) => void;
  handleDatePopoverOpen: () => void;
  handleDateBlur: () => void;
  
  // Form actions
  handleFormSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
  handleCloseResponseDialog: () => void;
  additionalInfo: string;
  setAdditionalInfo: (info: string) => void;
}
