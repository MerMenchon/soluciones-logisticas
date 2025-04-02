
import React, { useEffect, useState } from "react";
import ServiceSelector from "@/components/ServiceSelector";
import ProductDetails from "@/components/ProductDetails";
import ContactDetails from "@/components/ContactDetails";
import { useFormContext } from "@/contexts/FormContext";
import ShippingDateSelector from "@/components/logistics/ShippingDateSelector";
import StorageLocationSection from "@/components/logistics/StorageLocationSection";
import TransportRouteSection from "@/components/logistics/TransportRouteSection";
import FormActions from "@/components/logistics/FormActions";

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
    category,
    setCategory,
    validateForm,
    estimatedStorageTime,
    setEstimatedStorageTime,
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

  return (
    <form onSubmit={handleSubmit} className="reference-form space-y-8">
      <ServiceSelector 
        selectedService={selectedService as ServiceType} 
        onSelectService={useFormContext().setSelectedService} 
      />

      {/* Date Selector */}
      <ShippingDateSelector
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        disabledDays={disabledDays}
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
            category={category}
            onCategoryChange={setCategory}
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
  );
};

export default LogisticsForm;
