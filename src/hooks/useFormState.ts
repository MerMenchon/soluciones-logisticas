
import { useState } from "react";
import { ServiceType } from "@/components/ServiceSelector";
import { FormState } from "@/types/form";

export const useFormState = (): FormState => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Response data
  const [distanceValue, setDistanceValue] = useState<string | null>(null);
  const [contactValue, setContactValue] = useState<string | null>(null);
  const [dateTimeValue, setDateTimeValue] = useState<string | null>(null);
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
  const [productDescription, setProductDescription] = useState("");
  
  // Contact information
  const [email, setEmail] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  return {
    formSubmitted,
    isSubmitting,
    selectedService,
    distanceValue,
    contactValue,
    dateTimeValue,
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
    productDescription,
    email,
    additionalInfo
  };
};

