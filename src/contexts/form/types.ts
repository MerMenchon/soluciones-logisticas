
import { ReactNode } from "react";

// Define service type
export type ServiceType = "storage" | "transport" | "both" | "";

// Define types for province and city options
export interface ProvinceCityOption {
  value: string;
  label: string;
}

// Form Context type
export interface FormContextType {
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
  estimatedStorageTime: string;

  // Location setters
  setStorageProvince: (province: string) => void;
  setStorageCity: (city: string) => void;
  setOriginProvince: (province: string) => void;
  setOriginCity: (city: string) => void;
  setDestinationProvince: (province: string) => void;
  setDestinationCity: (city: string) => void;
  handleUseOriginAsStorageChange: (checked: boolean) => void;
  handleUseDestinationAsStorageChange: (checked: boolean) => void;
  setEstimatedStorageTime: (time: string) => void;

  // UI state
  isSubmitting: boolean;
  formSubmitted: boolean;
  showConfirmation: boolean;
  distanceValue: string | null;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setDistanceValue: React.Dispatch<React.SetStateAction<string | null>>;

  // Confirmation actions
  confirmRequest: () => void;
  cancelRequest: () => void;

  // Contact details
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
  
  // Form validation
  validateForm: () => string | null;
}

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
  category: string;
}

export interface FormProviderProps {
  children: ReactNode;
}
