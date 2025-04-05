
import React, { useEffect, useState } from "react";
import ServiceSelector from "@/components/ServiceSelector";
import ProductDetails from "@/components/ProductDetails";
import ContactDetails from "@/components/ContactDetails";
import { useFormContext } from "@/contexts/FormContext";
import ShippingDateSelector from "@/components/logistics/ShippingDateSelector";
import StorageLocationSection from "@/components/logistics/StorageLocationSection";
import TransportRouteSection from "@/components/logistics/TransportRouteSection";
import FormActions from "@/components/logistics/FormActions";
import SuccessMessage from "@/components/SuccessMessage";

// Define the ServiceType to match the one in ServiceSelector
type ServiceType = "storage" | "transport" | "both";

const LogisticsForm = () => {
  const {
    selectedService,
    storageProvince,
    storageCity,
    originProvince,
    originCity,
    useOriginAsStorage,
    destinationProvince,
    destinationCity,
    useDestinationAsStorage,
    productType,
    cargoValue,
    shippingTime,
    additionalInfo,
    isSubmitting,
    setStorageProvince,
    setStorageCity,
    setOriginProvince,
    setOriginCity,
    setDestinationProvince,
    setDestinationCity,
    handleUseOriginAsStorageChange,
    handleUseDestinationAsStorageChange,
    setProductType,
    setCargoValue,
    setShippingTime,
    resetForm,
    handleSubmit,
    description,
    setDescription,
    presentation,
    setPresentation,
    clarification,
    setClarification,
    quantity,
    setQuantity,
    quantityUnit,
    setQuantityUnit,
    setAdditionalInfo,
    validateForm,
    validateFields,
    estimatedStorageTime,
    setEstimatedStorageTime,
    showResponseDialog,
    handleCloseResponseDialog,
    isWaitingForResponse,
    validationResult,
  } = useFormContext();

  // State for form validation
  const [isFormValid, setIsFormValid] = useState(false);

  // Effect to validate the form when relevant values change
  useEffect(() => {
    const isValid = validateForm() === null;
    setIsFormValid(isValid);
  }, [
    selectedService,
    storageProvince,
    storageCity,
    originProvince,
    originCity,
    destinationProvince,
    destinationCity,
    productType,
    description,
    quantity,
    quantityUnit,
    cargoValue,
    shippingTime,
    estimatedStorageTime,
    presentation,
    validateForm
  ]);

  // For date picker
  const selectedDate = shippingTime ? new Date(shippingTime) : undefined;
  const today = new Date();
  
  // Disable past dates
  const disabledDays = { before: today };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setShippingTime(date.toISOString());
    }
  };

  // Function to handle form submission and validate all fields
  const handleFormSubmit = (e: React.FormEvent) => {
    // Validate all fields before submitting
    validateFields();
    handleSubmit(e);
  };

  return (
    <>
      {/* Response Dialog */}
      <SuccessMessage 
        open={showResponseDialog || isWaitingForResponse} 
        onClose={handleCloseResponseDialog} 
      />
      
      <form onSubmit={handleFormSubmit} className="reference-form space-y-8" noValidate>
        <ServiceSelector 
          selectedService={selectedService as ServiceType} 
          onSelectService={useFormContext().setSelectedService} 
          error={validationResult?.errors?.selectedService || null}
        />

        {/* Date Selector */}
        <ShippingDateSelector
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          disabledDays={disabledDays}
          error={validationResult?.errors?.shippingTime || null}
        />

        {selectedService && (
          <>
            {(selectedService === "storage" || selectedService === "both") && (
              <StorageLocationSection
                selectedService={selectedService}
                storageProvince={storageProvince}
                storageCity={storageCity}
                setStorageProvince={setStorageProvince}
                setStorageCity={setStorageCity}
                estimatedStorageTime={estimatedStorageTime}
                setEstimatedStorageTime={setEstimatedStorageTime}
                errors={{
                  province: validationResult?.errors?.storageProvince || null,
                  city: validationResult?.errors?.storageCity || null,
                  time: validationResult?.errors?.estimatedStorageTime || null
                }}
              />
            )}

            {(selectedService === "transport" || selectedService === "both") && (
              <TransportRouteSection
                originProvince={originProvince}
                originCity={originCity}
                setOriginProvince={setOriginProvince}
                setOriginCity={setOriginCity}
                destinationProvince={destinationProvince}
                destinationCity={destinationCity}
                setDestinationProvince={setDestinationProvince}
                setDestinationCity={setDestinationCity}
                selectedService={selectedService}
                useOriginAsStorage={useOriginAsStorage}
                handleUseOriginAsStorageChange={handleUseOriginAsStorageChange}
                useDestinationAsStorage={useDestinationAsStorage}
                handleUseDestinationAsStorageChange={handleUseDestinationAsStorageChange}
                estimatedStorageTime={estimatedStorageTime}
                setEstimatedStorageTime={setEstimatedStorageTime}
                errors={{
                  originProvince: validationResult?.errors?.originProvince || null,
                  originCity: validationResult?.errors?.originCity || null,
                  destinationProvince: validationResult?.errors?.destinationProvince || null,
                  destinationCity: validationResult?.errors?.destinationCity || null,
                  estimatedStorageTime: validationResult?.errors?.estimatedStorageTime || null
                }}
              />
            )}

            <ProductDetails 
              productType={productType}
              onProductTypeChange={setProductType}
              value={cargoValue}
              onValueChange={setCargoValue}
              shippingTime={shippingTime}
              onShippingTimeChange={setShippingTime}
              description={description}
              onDescriptionChange={setDescription}
              presentation={presentation}
              onPresentationChange={setPresentation}
              clarification={clarification}
              onClarificationChange={setClarification}
              quantity={quantity}
              onQuantityChange={setQuantity}
              quantityUnit={quantityUnit}
              onQuantityUnitChange={setQuantityUnit}
              errors={{
                productType: validationResult?.errors?.productType || null,
                description: validationResult?.errors?.description || null,
                presentation: validationResult?.errors?.presentation || null,
                quantity: validationResult?.errors?.quantity || null,
                quantityUnit: validationResult?.errors?.quantityUnit || null,
                value: validationResult?.errors?.cargoValue || null
              }}
            />
            
            <ContactDetails
              additionalInfo={additionalInfo}
              onAdditionalInfoChange={setAdditionalInfo}
            />

            <FormActions 
              onReset={resetForm} 
              isSubmitting={isSubmitting} 
              isFormValid={isFormValid}
            />
          </>
        )}
      </form>
    </>
  );
};

export default LogisticsForm;
