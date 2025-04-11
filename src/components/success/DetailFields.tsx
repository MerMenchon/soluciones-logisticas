
import React from "react";
import { Warehouse, Truck, Package, Calendar } from "lucide-react";

interface DetailFieldsProps {
  webhookResponse: any;
}

const DetailFields = ({ webhookResponse }: DetailFieldsProps) => {
  if (!webhookResponse?.data) return null;
  
  const { data } = webhookResponse;
  
  // Check if data fields exist
  const hasDataFields = data && (
    data.lugarAlmacenamientoTiempo || 
    data.rutaTransporte || 
    data.InformacionProducto ||
    data.fechaInicioEstimada
  );
  
  if (!hasDataFields) return null;
  
  return (
    <div className="mt-6 space-y-4">
      {data.lugarAlmacenamientoTiempo && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-start gap-3">
            <Warehouse className="h-5 w-5 text-agri-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-agri-secondary">Información sobre el almacenamiento</h4>
              <p className="text-sm text-gray-600 mt-1">{data.lugarAlmacenamientoTiempo}</p>
            </div>
          </div>
        </div>
      )}
      
      {data.rutaTransporte && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-start gap-3">
            <Truck className="h-5 w-5 text-agri-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-agri-secondary">Información sobre el transporte</h4>
              <p className="text-sm text-gray-600 mt-1">{data.rutaTransporte}</p>
            </div>
          </div>
        </div>
      )}
      
      {data.InformacionProducto && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-agri-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-agri-secondary">Información del producto</h4>
              <p className="text-sm text-gray-600 mt-1">{data.InformacionProducto}</p>
            </div>
          </div>
        </div>
      )}
      
      {data.fechaInicioEstimada && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-agri-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-agri-secondary">Fecha estimada de inicio</h4>
              <p className="text-sm text-gray-600 mt-1">{data.fechaInicioEstimada}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailFields;

