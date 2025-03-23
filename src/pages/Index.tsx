import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ServiceSelector, { ServiceType } from "@/components/ServiceSelector";
import LocationSelector from "@/components/LocationSelector";
import ProductDetails from "@/components/ProductDetails";
import SuccessMessage from "@/components/SuccessMessage";
import { MapPin, PackageCheck, RotateCcw, Send, Warehouse, Truck } from "lucide-react";

// Updated webhook URL for form submission
const WEBHOOK_URL = "https://bipolos.app.n8n.cloud/webhook-test/f3df93f6-9eee-498e-8a85-e33b1b577ada";

const Index = () => {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const resetForm = () => {
    setSelectedService(null);
    
    setStorageProvince("");
    setStorageCity("");
    
    setOriginProvince("");
    setOriginCity("");
    setUseOriginAsStorage(false);
    
    setDestinationProvince("");
    setDestinationCity("");
    setUseDestinationAsStorage(false);
    
    setProductType("");
    setWeight("");
    setVolume("");
    setCargoValue("");
    
    setFormSubmitted(false);
  };

  const handleServiceChange = (service: ServiceType) => {
    setSelectedService(service);
    
    // Reset relevant fields when changing service
    if (service === "storage") {
      setOriginProvince("");
      setOriginCity("");
      setDestinationProvince("");
      setDestinationCity("");
      setUseOriginAsStorage(false);
      setUseDestinationAsStorage(false);
    } else if (service === "transport") {
      setStorageProvince("");
      setStorageCity("");
    }
  };

  const handleStorageCityChange = (city: string, hasStorage: boolean) => {
    setStorageCity(city);
    if (!hasStorage) {
      toast({
        title: "Alerta",
        description: "No hay servicio de almacenamiento disponible en esta ciudad",
        variant: "destructive",
      });
    }
  };

  const handleOriginCityChange = (city: string, hasStorage: boolean) => {
    setOriginCity(city);
    if (useOriginAsStorage && !hasStorage) {
      setUseOriginAsStorage(false);
      toast({
        title: "Alerta",
        description: "No hay servicio de almacenamiento disponible en esta ciudad",
        variant: "destructive",
      });
    }
  };

  const handleDestinationCityChange = (city: string, hasStorage: boolean) => {
    setDestinationCity(city);
    if (useDestinationAsStorage && !hasStorage) {
      setUseDestinationAsStorage(false);
      toast({
        title: "Alerta",
        description: "No hay servicio de almacenamiento disponible en esta ciudad",
        variant: "destructive",
      });
    }
  };

  const handleUseOriginAsStorageChange = (checked: boolean) => {
    setUseOriginAsStorage(checked);
    if (checked) {
      setUseDestinationAsStorage(false);
      setStorageProvince(originProvince);
      setStorageCity(originCity);
    } else if (!useDestinationAsStorage) {
      setStorageProvince("");
      setStorageCity("");
    }
  };

  const handleUseDestinationAsStorageChange = (checked: boolean) => {
    setUseDestinationAsStorage(checked);
    if (checked) {
      setUseOriginAsStorage(false);
      setStorageProvince(destinationProvince);
      setStorageCity(destinationCity);
    } else if (!useOriginAsStorage) {
      setStorageProvince("");
      setStorageCity("");
    }
  };

  const validateForm = (): string | null => {
    if (!selectedService) {
      return "Debe seleccionar un servicio";
    }

    if (selectedService === "storage" || selectedService === "both") {
      if (!storageProvince || !storageCity) {
        return "Debe seleccionar ubicación de almacenamiento";
      }
    }

    if (selectedService === "transport" || selectedService === "both") {
      if (!originProvince || !originCity) {
        return "Debe seleccionar origen";
      }
      if (!destinationProvince || !destinationCity) {
        return "Debe seleccionar destino";
      }
    }

    if (!productType) {
      return "Debe seleccionar tipo de producto";
    }

    if (!weight && !volume) {
      return "Debe ingresar peso o volumen";
    }

    if (!cargoValue || parseFloat(cargoValue) <= 0) {
      return "Debe ingresar un valor de carga válido (mayor a cero)";
    }

    return null;
  };

  const submitFormData = async () => {
    const formData = {
      service: selectedService,
      storage: selectedService === "storage" || selectedService === "both" 
        ? { province: storageProvince, city: storageCity }
        : null,
      transport: selectedService === "transport" || selectedService === "both" 
        ? {
            origin: { province: originProvince, city: originCity },
            destination: { province: destinationProvince, city: destinationCity }
          }
        : null,
      product: {
        type: productType,
        weight: weight || null,
        volume: volume || null,
        value: cargoValue
      },
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al enviar los datos');
      }
      
      return true;
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await submitFormData();
      setFormSubmitted(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el formulario. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (formSubmitted) {
    return <SuccessMessage onReset={resetForm} />;
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-agri-primary mb-3">
            Servicio de logística
          </h1>
          <p className="text-lg text-agri-secondary max-w-2xl mx-auto">
            Seleccione el servicio que necesita para su mercadería
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <ServiceSelector 
            selectedService={selectedService} 
            onSelectService={handleServiceChange} 
          />

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
                      onCityChange={handleStorageCityChange}
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
                      onCityChange={handleOriginCityChange}
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
                      onCityChange={handleDestinationCityChange}
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
                weight={weight}
                onWeightChange={setWeight}
                volume={volume}
                onVolumeChange={setVolume}
                value={cargoValue}
                onValueChange={setCargoValue}
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
      </div>
    </div>
  );
};

export default Index;
