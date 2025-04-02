
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
    <div className="reference-form-section">
      <h2 className="reference-form-subtitle">Seleccione un servicio</h2>
      <div className="reference-form-cols-3">
        <div
          className={cn(
            "border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center hover:border-blue-500 hover:shadow-md cursor-pointer transition-all duration-300",
            selectedService === "storage" && "border-blue-500 bg-blue-50"
          )}
          onClick={() => onSelectService("storage")}
        >
          <Warehouse className="text-blue-600 w-10 h-10 mb-2" />
          <span className="font-medium">Almacenamiento</span>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Servicio de almacenamiento de mercadería
          </p>
        </div>

        <div
          className={cn(
            "border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center hover:border-blue-500 hover:shadow-md cursor-pointer transition-all duration-300",
            selectedService === "transport" && "border-blue-500 bg-blue-50"
          )}
          onClick={() => onSelectService("transport")}
        >
          <Truck className="text-blue-600 w-10 h-10 mb-2" />
          <span className="font-medium">Transporte</span>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Servicio de transporte de mercadería
          </p>
        </div>

        <div
          className={cn(
            "border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center hover:border-blue-500 hover:shadow-md cursor-pointer transition-all duration-300",
            selectedService === "both" && "border-blue-500 bg-blue-50"
          )}
          onClick={() => onSelectService("both")}
        >
          <PackageCheck className="text-blue-600 w-10 h-10 mb-2" />
          <span className="font-medium">Almacenamiento y Transporte</span>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Servicios combinados para su mercadería
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelector;
