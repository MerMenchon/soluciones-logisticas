
import React from "react";
import { useFormContext } from "@/contexts/FormContext";
import { Truck, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceSelector from "@/components/ServiceSelector";
import LocationSelector from "@/components/LocationSelector";
import ProductDetails from "@/components/ProductDetails";
import ContactDetails from "@/components/ContactDetails";

const LogisticsForm = () => {
  const {
    handleSubmit,
    isSubmitting,
    selectedService,
    setSelectedService,
    productType,
    setProductType,
    weight,
    setWeight,
    volume,
    setVolume,
    cargoValue,
    setCargoValue,
    shippingTime,
    setShippingTime,
    email,
    setEmail,
    additionalInfo,
    setAdditionalInfo,
    productDescription,
    setProductDescription,
    // Location states and handlers
    storageProvince,
    storageCity,
    setStorageProvince,
    setStorageCity,
    originProvince,
    originCity,
    setOriginProvince,
    setOriginCity,
    useOriginAsStorage,
    handleUseOriginAsStorageChange,
    destinationProvince,
    destinationCity,
    setDestinationProvince,
    setDestinationCity,
    useDestinationAsStorage,
    handleUseDestinationAsStorageChange
  } = useFormContext();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ServiceSelector
        selectedService={selectedService}
        onSelectService={setSelectedService}
      />

      {selectedService === "storage" && (
        <LocationSelector 
          type="storage"
          provinceValue={storageProvince}
          cityValue={storageCity}
          onProvinceChange={setStorageProvince}
          onCityChange={setStorageCity}
          label="Almacenamiento"
          serviceType={selectedService}
        />
      )}

      {(selectedService === "transport" || selectedService === "both") && (
        <>
          <LocationSelector 
            type="origin"
            provinceValue={originProvince}
            cityValue={originCity}
            onProvinceChange={setOriginProvince}
            onCityChange={setOriginCity}
            label="Origen"
            useAsStorage={useOriginAsStorage}
            onUseAsStorageChange={handleUseOriginAsStorageChange}
            serviceType={selectedService}
          />

          <LocationSelector 
            type="destination"
            provinceValue={destinationProvince}
            cityValue={destinationCity}
            onProvinceChange={setDestinationProvince}
            onCityChange={setDestinationCity}
            label="Destino"
            useAsStorage={useDestinationAsStorage}
            onUseAsStorageChange={handleUseDestinationAsStorageChange}
            serviceType={selectedService}
          />
        </>
      )}

      {selectedService && (
        <ProductDetails
          productType={productType}
          onProductTypeChange={setProductType}
          weight={weight}
          onWeightChange={setWeight}
          volume={volume}
          onVolumeChange={setVolume}
          value={cargoValue}
          onValueChange={setCargoValue}
          shippingTime={shippingTime}
          onShippingTimeChange={setShippingTime}
          description={productDescription}
          onDescriptionChange={setProductDescription}
        />
      )}

      {selectedService && (
        <ContactDetails
          email={email}
          onEmailChange={setEmail}
          additionalInfo={additionalInfo}
          onAdditionalInfoChange={setAdditionalInfo}
        />
      )}

      {selectedService && (
        <div className="flex justify-center pt-6">
          <Button
            type="submit"
            className="bg-agri-green hover:bg-agri-green/90 text-white flex items-center gap-2 px-6 py-5 text-lg rounded-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Enviando..."
            ) : (
              <>
                <span>Enviar solicitud</span>
                {selectedService === "transport" && <Truck className="w-5 h-5" />}
                {selectedService === "storage" && <PackageCheck className="w-5 h-5" />}
                {selectedService === "both" && (
                  <>
                    <Truck className="w-5 h-5" />
                    <PackageCheck className="w-5 h-5" />
                  </>
                )}
              </>
            )}
          </Button>
        </div>
      )}
    </form>
  );
};

export default LogisticsForm;
