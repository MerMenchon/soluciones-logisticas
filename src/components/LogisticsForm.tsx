import React, { useEffect, useState } from "react";
import ServiceSelector from "@/components/ServiceSelector";
import ProductDetails from "@/components/ProductDetails";
import ContactDetails from "@/components/ContactDetails";
import { useFormContext } from "@/contexts/form"; // This import is correct but there might be a naming conflict
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
    estimatedStorageTime,
    setEstimatedStorageTime,
    showResponseDialog,
    handleCloseResponseDialog,
    isWaitingForResponse,
    isFieldTouched,
    markFieldTouched,
    getFieldError,
    resetFieldError,
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
      markFieldTouched('shippingTime');
    }
  };

  return (
    <>
      {/* Response Dialog */}
      <SuccessMessage 
        open={showResponseDialog || isWaitingForResponse} 
        onClose={handleCloseResponseDialog} 
      />
      
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
          isInvalid={isFieldTouched('shippingTime') && getFieldError('shippingTime') !== null}
          errorMessage={getFieldError('shippingTime')}
          onBlur={() => markFieldTouched('shippingTime')}
        />

        {selectedService && (
          <>
            {/* Reordered sections - show TransportRouteSection first when "both" is selected */}
            {(selectedService === "transport" || selectedService === "both") && (
              <TransportRouteSection
                originProvince={originProvince}
                originCity={originCity}
                setOriginProvince={(value) => {
                  setOriginProvince(value);
                  markFieldTouched('originProvince');
                }}
                setOriginCity={(value) => {
                  setOriginCity(value);
                  markFieldTouched('originCity');
                }}
                destinationProvince={destinationProvince}
                destinationCity={destinationCity}
                setDestinationProvince={(value) => {
                  setDestinationProvince(value);
                  markFieldTouched('destinationProvince');
                }}
                setDestinationCity={(value) => {
                  setDestinationCity(value);
                  markFieldTouched('destinationCity');
                }}
                selectedService={selectedService}
                useOriginAsStorage={useOriginAsStorage}
                handleUseOriginAsStorageChange={handleUseOriginAsStorageChange}
                useDestinationAsStorage={useDestinationAsStorage}
                handleUseDestinationAsStorageChange={handleUseDestinationAsStorageChange}
                estimatedStorageTime={estimatedStorageTime}
                setEstimatedStorageTime={(value) => {
                  setEstimatedStorageTime(value);
                  markFieldTouched('estimatedStorageTime');
                }}
                isFieldTouched={isFieldTouched}
                getFieldError={getFieldError}
                markFieldTouched={markFieldTouched}
                resetFieldError={resetFieldError}
              />
            )}

            {(selectedService === "storage" || selectedService === "both") && (
              <StorageLocationSection
                selectedService={selectedService}
                storageProvince={storageProvince}
                storageCity={storageCity}
                setStorageProvince={(value) => {
                  setStorageProvince(value);
                  markFieldTouched('storageProvince');
                }}
                setStorageCity={(value) => {
                  setStorageCity(value); 
                  markFieldTouched('storageCity');
                }}
                estimatedStorageTime={estimatedStorageTime}
                setEstimatedStorageTime={(value) => {
                  setEstimatedStorageTime(value);
                  markFieldTouched('estimatedStorageTime');
                }}
                isFieldTouched={isFieldTouched}
                getFieldError={getFieldError}
                markFieldTouched={markFieldTouched}
                resetFieldError={resetFieldError}
                // Pass these props for the "both" service option
                useOriginAsStorage={useOriginAsStorage}
                useDestinationAsStorage={useDestinationAsStorage}
                originProvince={originProvince}
                originCity={originCity}
                destinationProvince={destinationProvince}
                destinationCity={destinationCity}
                handleUseOriginAsStorageChange={handleUseOriginAsStorageChange}
                handleUseDestinationAsStorageChange={handleUseDestinationAsStorageChange}
              />
            )}

            <ProductDetails 
              productType={productType}
              onProductTypeChange={(value) => {
                setProductType(value);
                markFieldTouched('productType');
              }}
              value={cargoValue}
              onValueChange={(value) => {
                setCargoValue(value);
                markFieldTouched('cargoValue');
              }}
              shippingTime={shippingTime}
              onShippingTimeChange={(value) => {
                setShippingTime(value);
                markFieldTouched('shippingTime');
              }}
              description={description}
              onDescriptionChange={(value) => {
                setDescription(value);
                markFieldTouched('description');
              }}
              presentation={presentation}
              onPresentationChange={(value) => {
                setPresentation(value);
                markFieldTouched('presentation');
              }}
              clarification={clarification}
              onClarificationChange={setClarification}
              quantity={quantity}
              onQuantityChange={(value) => {
                setQuantity(value);
                markFieldTouched('quantity');
              }}
              quantityUnit={quantityUnit}
              onQuantityUnitChange={setQuantityUnit}
              isFieldTouched={isFieldTouched}
              getFieldError={getFieldError}
              markFieldTouched={markFieldTouched}
              resetFieldError={resetFieldError}
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
