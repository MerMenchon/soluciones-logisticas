
import React from "react";
import { Button } from "@/components/ui/button";
import ServiceSelector from "@/components/ServiceSelector";
import LocationSelector from "@/components/LocationSelector";
import ProductDetails from "@/components/ProductDetails";
import ContactDetails from "@/components/ContactDetails";
import { RotateCcw, Send, Warehouse, Truck, Calendar } from "lucide-react";
import { useFormContext } from "@/contexts/FormContext";
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
    email,
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
    setEmail,
    setAdditionalInfo,
  } = useFormContext();

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
    <form onSubmit={handleSubmit} className="space-y-8">
      <ServiceSelector 
        selectedService={selectedService as ServiceType} 
        onSelectService={useFormContext().setSelectedService} 
      />

      {/* Date Selector - Now showing calendar directly with optimized size */}
      <div className="form-section" style={{ maxWidth: "320px", margin: "0 auto 2rem" }}>
        <h2 className="form-title">
          <Calendar className="w-5 h-5" />
          <span>Fecha de inicio de la solicitud</span>
        </h2>
        <div>
          <div className="bg-white border rounded-md shadow-sm p-3">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={disabledDays}
              initialFocus
              className="mx-auto"
            />
            <div className="pt-2 text-center text-sm text-muted-foreground">
              {selectedDate ? 
                <p>Fecha seleccionada: {format(selectedDate, "PPP")}</p> : 
                <p>Seleccione una fecha para iniciar</p>
              }
            </div>
          </div>
        </div>
      </div>

      {selectedService && (
        <>
          {(selectedService === "storage" || selectedService === "both") && (
            <div className="form-section">
              <h2 className="form-title">
                <Warehouse className="w-5 h-5" />
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
                />
              )}
            </div>
          )}

          {(selectedService === "transport" || selectedService === "both") && (
            <div className="form-section">
              <h2 className="form-title">
                <Truck className="w-5 h-5" />
                <span>Ruta de Transporte</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                />
                
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
                />
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
          />
          
          <ContactDetails
            additionalInfo={additionalInfo}
            onAdditionalInfoChange={setAdditionalInfo}
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
            <Button
              type="button"
              variant="outline"
              className="border-agri-primary text-agri-primary hover:bg-agri-light"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restablecer
            </Button>
            
            <Button
              type="submit"
              className="bg-agri-primary hover:bg-agri-dark text-white"
              disabled={isSubmitting}
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
