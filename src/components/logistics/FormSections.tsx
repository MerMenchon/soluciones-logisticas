
import React from "react";
import ServiceSelector from "@/components/ServiceSelector";
import ProductDetails from "@/components/ProductDetails";
import ContactDetails from "@/components/ContactDetails";
import ShippingDateSelector from "@/components/logistics/ShippingDateSelector";
import StorageLocationSection from "@/components/logistics/StorageLocationSection";
import TransportRouteSection from "@/components/logistics/TransportRouteSection";
import FormActions from "@/components/logistics/FormActions";
import { useLogisticsForm } from "@/hooks/useLogisticsForm";

// Define the ServiceType to match the one in ServiceSelector
type ServiceType = "storage" | "transport" | "both";

const FormSections = () => {
  const {
    selectedService,
    setSelectedService,
    selectedDate,
    disabledDays,
    handleDateSelect,
    handleDatePopoverOpen,
    isFormValid,
    getFieldError,
    isSubmitting,
    resetForm,
  } = useLogisticsForm();

  return (
    <>
      <ServiceSelector 
        selectedService={selectedService as ServiceType} 
        onSelectService={setSelectedService} 
        error={getFieldError("selectedService")}
      />

      {/* Date Selector */}
      <ShippingDateSelector
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        onOpen={handleDatePopoverOpen}
        disabledDays={disabledDays}
        error={getFieldError("shippingTime")}
      />

      {selectedService && (
        <>
          {/* Conditional rendering of storage section */}
          <RenderStorageSection 
            selectedService={selectedService as ServiceType} 
          />
          
          {/* Conditional rendering of transport section */}
          <RenderTransportSection 
            selectedService={selectedService as ServiceType}
          />

          <ProductDetailsSection />
          <ContactDetailsSection />

          <FormActions 
            onReset={resetForm} 
            isSubmitting={isSubmitting} 
            isFormValid={isFormValid}
          />
        </>
      )}
    </>
  );
};

// Component to conditionally render the storage section
const RenderStorageSection = ({ selectedService }: { selectedService: ServiceType }) => {
  if (selectedService !== "storage" && selectedService !== "both") return null;
  
  const {
    storageProvince,
    storageCity,
    setStorageProvince,
    setStorageCity,
    estimatedStorageTime,
    setEstimatedStorageTime,
    getFieldError,
  } = useLogisticsForm();

  return (
    <StorageLocationSection
      selectedService={selectedService}
      storageProvince={storageProvince}
      storageCity={storageCity}
      setStorageProvince={setStorageProvince}
      setStorageCity={setStorageCity}
      estimatedStorageTime={estimatedStorageTime}
      setEstimatedStorageTime={setEstimatedStorageTime}
      errors={{
        province: getFieldError("storageProvince"),
        city: getFieldError("storageCity"),
        time: getFieldError("estimatedStorageTime")
      }}
    />
  );
};

// Component to conditionally render the transport section
const RenderTransportSection = ({ selectedService }: { selectedService: ServiceType }) => {
  if (selectedService !== "transport" && selectedService !== "both") return null;
  
  const {
    originProvince,
    originCity,
    setOriginProvince,
    setOriginCity,
    destinationProvince,
    destinationCity,
    setDestinationProvince,
    setDestinationCity,
    useOriginAsStorage,
    handleUseOriginAsStorageChange,
    useDestinationAsStorage,
    handleUseDestinationAsStorageChange,
    estimatedStorageTime,
    setEstimatedStorageTime,
    getFieldError,
  } = useLogisticsForm();

  return (
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
        originProvince: getFieldError("originProvince"),
        originCity: getFieldError("originCity"),
        destinationProvince: getFieldError("destinationProvince"),
        destinationCity: getFieldError("destinationCity"),
        estimatedStorageTime: getFieldError("estimatedStorageTime")
      }}
    />
  );
};

// Component for product details section
const ProductDetailsSection = () => {
  const {
    productType,
    setProductType,
    cargoValue,
    setCargoValue,
    shippingTime,
    setShippingTime,
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
    getFieldError,
  } = useLogisticsForm();

  return (
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
        productType: getFieldError("productType"),
        description: getFieldError("description"),
        presentation: getFieldError("presentation"),
        quantity: getFieldError("quantity"),
        quantityUnit: getFieldError("quantityUnit"),
        value: getFieldError("cargoValue")
      }}
    />
  );
};

// Component for contact details section
const ContactDetailsSection = () => {
  const { additionalInfo, setAdditionalInfo } = useLogisticsForm();

  return (
    <ContactDetails
      additionalInfo={additionalInfo}
      onAdditionalInfoChange={setAdditionalInfo}
    />
  );
};

export default FormSections;
