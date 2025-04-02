
import React from "react";
import { Warehouse, Truck, PackageCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type ServiceType = "storage" | "transport" | "both";

interface ServiceSelectorProps {
  selectedService: ServiceType | null;
  onSelectService: (service: ServiceType) => void;
}

const ServiceSelector = ({
  selectedService,
  onSelectService,
}: ServiceSelectorProps) => {
  return (
    <div className="form-section">
      <h2 className="form-title">Seleccione un servicio</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={cn("service-card", selectedService === "storage" && "active")}
          onClick={() => onSelectService("storage")}
        >
          <Warehouse className="service-icon" />
          <span className="font-medium">Almacenamiento</span>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Servicio de almacenamiento de mercadería
          </p>
        </div>

        <div
          className={cn("service-card", selectedService === "transport" && "active")}
          onClick={() => onSelectService("transport")}
        >
          <Truck className="service-icon" />
          <span className="font-medium">Transporte</span>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Servicio de transporte de mercadería
          </p>
        </div>

        <div
          className={cn("service-card", selectedService === "both" && "active")}
          onClick={() => onSelectService("both")}
        >
          <PackageCheck className="service-icon" />
          <span className="font-medium">Almacenamiento y Transporte</span>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Servicios combinados para su mercadería
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelector;
