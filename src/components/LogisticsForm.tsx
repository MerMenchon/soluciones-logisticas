
import React from "react";
import ServiceSelector from "./ServiceSelector";
import LocationSelector from "./LocationSelector";
import ProductDetails from "./ProductDetails";
import ContactDetails from "./ContactDetails";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useFormContext } from "@/contexts/FormContext";

const LogisticsForm = () => {
  const {
    // Service data
    selectedService,
    setSelectedService,
    
    // Location data
    storageProvince,
    storageCity,
    originProvince,
    originCity,
    destinationProvince,
    destinationCity,
    useOriginAsStorage,
    useDestinationAsStorage,
    setStorageProvince,
    setStorageCity,
    setOriginProvince,
    setOriginCity,
    setDestinationProvince,
    setDestinationCity,
    handleUseOriginAsStorageChange,
    handleUseDestinationAsStorageChange,
    
    // Product details
    productType,
    setProductType,
    description,
    setDescription,
    presentation,
    setPresentation,
    clarification,
    setClarification,
    cargoValue,
    setCargoValue,
    shippingTime,
    setShippingTime,
    quantity,
    setQuantity,
    quantityUnit,
    setQuantityUnit,
    category,
    setCategory,
    
    // Contact details
    email,
    setEmail,
    additionalInfo,
    setAdditionalInfo,
    
    // Form submission
    handleSubmit,
    isSubmitting,
  } = useFormContext();

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <ServiceSelector 
        selectedService={selectedService} 
        onServiceChange={setSelectedService} 
      />
      
      {selectedService && (
        <>
          <LocationSelector 
            selectedService={selectedService}
            storageProvince={storageProvince}
            storageCity={storageCity}
            originProvince={originProvince}
            originCity={originCity}
            destinationProvince={destinationProvince}
            destinationCity={destinationCity}
            useOriginAsStorage={useOriginAsStorage}
            useDestinationAsStorage={useDestinationAsStorage}
            onStorageProvinceChange={setStorageProvince}
            onStorageCityChange={setStorageCity}
            onOriginProvinceChange={setOriginProvince}
            onOriginCityChange={setOriginCity}
            onDestinationProvinceChange={setDestinationProvince}
            onDestinationCityChange={setDestinationCity}
            onUseOriginAsStorageChange={handleUseOriginAsStorageChange}
            onUseDestinationAsStorageChange={handleUseDestinationAsStorageChange}
          />

          <ProductDetails 
            productType={productType}
            onProductTypeChange={setProductType}
            description={description}
            onDescriptionChange={setDescription}
            presentation={presentation}
            onPresentationChange={setPresentation}
            clarification={clarification}
            onClarificationChange={setClarification}
            value={cargoValue}
            onValueChange={setCargoValue}
            shippingTime={shippingTime}
            onShippingTimeChange={setShippingTime}
            quantity={quantity}
            onQuantityChange={setQuantity}
            quantityUnit={quantityUnit}
            onQuantityUnitChange={setQuantityUnit}
            category={category}
            onCategoryChange={setCategory}
          />

          <ContactDetails 
            email={email}
            onEmailChange={setEmail}
            additionalInfo={additionalInfo}
            onAdditionalInfoChange={setAdditionalInfo}
          />

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-white rounded-full" />
                  Procesando...
                </span>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar consulta
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default LogisticsForm;
