
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Warehouse, Truck, PackagePlus } from "lucide-react";

type ServiceType = "storage" | "transport" | "both";

interface ServiceSelectorProps {
  selectedService: ServiceType;
  onSelectService: (service: string) => void;
  error: string | null;
}

const ServiceSelector = ({ selectedService, onSelectService, error }: ServiceSelectorProps) => {
  // Handle service selection
  const handleServiceSelect = (service: string) => {
    onSelectService(service);
  };
  
  const services = [
    {
      id: "storage",
      name: "Almacenaje",
      description: "Almacenamiento de mercadería",
      icon: <Warehouse className="w-6 h-6 mb-2" />,
    },
    {
      id: "transport",
      name: "Transporte",
      description: "Logística de transporte",
      icon: <Truck className="w-6 h-6 mb-2" />,
    },
    {
      id: "both",
      name: "Almacenaje & Transporte",
      description: "Servicio completo de logística",
      icon: <PackagePlus className="w-6 h-6 mb-2" />,
    },
  ];

  return (
    <div className="reference-form-section">
      <h2 className="reference-form-subtitle mb-4">Seleccione un servicio:</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`
              cursor-pointer transition-all duration-200
              hover:border-agri-primary hover:shadow-md 
              ${selectedService === service.id ? "border-agri-primary bg-agri-primary/5" : ""}
            `}
            onClick={() => handleServiceSelect(service.id)}
          >
            <CardContent className="flex flex-col items-center justify-center text-center p-6">
              {service.icon}
              <h3 className="font-medium text-lg mb-1">{service.name}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Only show error message after form submission */}
    </div>
  );
};

export default ServiceSelector;
