
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ServiceSelector from "@/components/ServiceSelector";
import LocationSelector from "@/components/LocationSelector";
import ProductDetails from "@/components/ProductDetails";
import ContactDetails from "@/components/ContactDetails";
import { RotateCcw, Send, Warehouse, Truck, Calendar, MapPin, Navigation } from "lucide-react";
import { useFormContext } from "@/contexts/FormContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

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

  // Nuevo estado para controlar si el formulario es válido
  const [isFormValid, setIsFormValid] = useState(false);

  // Efecto para validar el formulario cada vez que cambian los valores relevantes
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
      <div className="reference-form-section">
        <h2 className="reference-form-subtitle">
          <Calendar className="w-5 h-5 inline-block mr-2" />
          <span>Fecha de inicio de la solicitud</span>
        </h2>
        <div className="space-y-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="shippingDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal reference-form-input",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Seleccione una fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={disabledDays}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {selectedService && (
        <>
          {(selectedService === "storage" || selectedService === "both") && (
            <div className="reference-form-section">
              <h2 className="reference-form-subtitle">
                <Warehouse className="w-5 h-5 inline-block mr-2" />
                <span>Ubicación de Almacenamiento</span>
              </h2>
              
              {selectedService === "both" ? (
                <div className="text-muted-foreground text-sm mb-4">
                  Seleccione la ubicación usando las opciones en Origen o Destino
                </div>
              ) : (
                <LocationSelector
                  type="storage"
                  provinceValue={storageProvince}
                  cityValue={storageCity}
                  onProvinceChange={setStorageProvince}
                  onCityChange={setStorageCity}
                  label="Almacenamiento"
                  estimatedTime={estimatedStorageTime}
                  onEstimatedTimeChange={setEstimatedStorageTime}
                />
              )}
            </div>
          )}

          {(selectedService === "transport" || selectedService === "both") && (
            <div className="reference-form-section">
              <h2 className="reference-form-subtitle">
                <Truck className="w-5 h-5 inline-block mr-2" />
                <span>Ruta de Transporte</span>
              </h2>
              
              <div className="reference-form-cols-2">
                <div className="space-y-6">
                  <h3 className="font-medium text-base flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Origen
                  </h3>
                  <LocationSelector
                    type="origin"
                    provinceValue={originProvince}
                    cityValue={originCity}
                    onProvinceChange={setOriginProvince}
                    onCityChange={setOriginCity}
                    label="Origen"
                    useAsStorage={useOriginAsStorage}
                    onUseAsStorageChange={
                      selectedService === "both" 
                        ? handleUseOriginAsStorageChange 
                        : undefined
                    }
                    estimatedTime={useOriginAsStorage ? estimatedStorageTime : undefined}
                    onEstimatedTimeChange={useOriginAsStorage ? setEstimatedStorageTime : undefined}
                  />
                </div>
                
                <div className="space-y-6">
                  <h3 className="font-medium text-base flex items-center">
                    <Navigation className="w-4 h-4 mr-2" />
                    Destino
                  </h3>
                  <LocationSelector
                    type="destination"
                    provinceValue={destinationProvince}
                    cityValue={destinationCity}
                    onProvinceChange={setDestinationProvince}
                    onCityChange={setDestinationCity}
                    label="Destino"
                    useAsStorage={useDestinationAsStorage}
                    onUseAsStorageChange={
                      selectedService === "both"
                        ? handleUseDestinationAsStorageChange
                        : undefined
                    }
                    estimatedTime={useDestinationAsStorage ? estimatedStorageTime : undefined}
                    onEstimatedTimeChange={useDestinationAsStorage ? setEstimatedStorageTime : undefined}
                  />
                </div>
              </div>
            </div>
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

          <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
            <Button
              type="button"
              variant="outline"
              className="reference-form-button-secondary"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restablecer
            </Button>
            
            <Button
              type="submit"
              className="reference-form-button"
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
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
