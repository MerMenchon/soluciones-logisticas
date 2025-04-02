
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Package, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchPresentations } from "@/data/locations";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductDetailsProps {
  productType: string;
  onProductTypeChange: (type: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  presentation: string;
  onPresentationChange: (presentation: string) => void;
  weight: string;
  onWeightChange: (weight: string) => void;
  volume: string;
  onVolumeChange: (volume: string) => void;
  value: string;
  onValueChange: (value: string) => void;
  shippingTime: string;
  onShippingTimeChange: (time: string) => void;
  clarification?: string;
  onClarificationChange?: (clarification: string) => void;
}

const ProductDetails = ({
  productType,
  onProductTypeChange,
  description,
  onDescriptionChange,
  presentation,
  onPresentationChange,
  weight,
  onWeightChange,
  volume,
  onVolumeChange,
  value,
  onValueChange,
  shippingTime,
  onShippingTimeChange,
  clarification = "",
  onClarificationChange = () => {},
}: ProductDetailsProps) => {
  const [productOptions, setProductOptions] = useState<string[]>([]);
  const [presentationOptions, setPresentationOptions] = useState<string[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingPresentations, setIsLoadingPresentations] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProductTypes = async () => {
      setIsLoadingProducts(true);
      try {
        // Google Sheets needs to be published to the web as CSV
        // Using the shared sheet with the correct sheet name
        const sheetId = "1VYDCQfaz3-7IrhPUGpAO4UBLMDR1mEyl6UCHU1hznwQ";
        const sheetName = "PRODUCTOS"; // Specific sheet name
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
        
        const response = await fetch(sheetUrl);
        
        if (!response.ok) {
          throw new Error("Error al cargar los tipos de productos");
        }
        
        const csvText = await response.text();
        
        // Parse CSV to extract product types
        const rows = csvText.split('\n');
        
        // Find the column index for "PRODUCTOS"
        const headers = rows[0].split(',');
        const productColumnIndex = headers.findIndex(
          header => header.trim().replace(/"/g, '').toUpperCase() === 'PRODUCTOS'
        );
        
        if (productColumnIndex === -1) {
          throw new Error("No se encontró la columna 'PRODUCTOS' en la hoja");
        }
        
        // Extract product types
        const products = rows
          .slice(1) // Skip header row
          .map(row => {
            const columns = row.split(',');
            return columns[productColumnIndex]?.replace(/"/g, '').trim();
          })
          .filter(product => product && product.length > 0) // Filter out empty values
          .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
        
        setProductOptions(products);
      } catch (error) {
        console.error("Error fetching product types:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los tipos de productos. Usando opciones predeterminadas.",
          variant: "destructive",
        });
        
        // Fallback to default options if fetch fails
        setProductOptions([
          "Alimentos",
          "Alimentos refrigerados",
          "Bebidas",
          "Textiles",
          "Electrónica",
          "Maquinaria",
          "Químicos",
          "Materiales de construcción",
          "Productos farmacéuticos",
          "Otros"
        ]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    const fetchAvailablePresentations = async () => {
      setIsLoadingPresentations(true);
      try {
        const presentations = await fetchPresentations();
        setPresentationOptions(presentations);
      } catch (error) {
        console.error("Error fetching presentations:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los tipos de presentación. Usando opciones predeterminadas.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingPresentations(false);
      }
    };

    fetchProductTypes();
    fetchAvailablePresentations();
  }, [toast]);

  // Handle numeric input validation
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Allow decimals and empty values (for UX)
    if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
      // Check if value is greater than 0
      if (newValue === '' || parseFloat(newValue) > 0) {
        onValueChange(newValue);
      }
    }
  };

  // Handle description input with 100 character limit
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = e.target.value;
    if (newDescription.length <= 100) {
      onDescriptionChange(newDescription);
    }
  };

  // Handle clarification input with 50 character limit
  const handleClarificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newClarification = e.target.value;
    if (newClarification.length <= 50) {
      onClarificationChange(newClarification);
    }
  };

  // Check if the selected presentation is "Otro"
  const showClarificationInput = presentation === "Otro";
  
  // For date picker
  const selectedDate = shippingTime ? new Date(shippingTime) : undefined;
  const today = new Date();
  
  // Disable past dates
  const disabledDays = { before: today };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onShippingTimeChange(date.toISOString());
    }
  };

  return (
    <div className="form-section">
      <h2 className="form-title">
        <Package className="w-5 h-5" />
        <span>Detalles del Producto</span>
      </h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="productType" className="block text-sm font-medium text-agri-secondary mb-1">
            Tipo de producto *
          </label>
          <select
            id="productType"
            value={productType}
            onChange={(e) => onProductTypeChange(e.target.value)}
            className="w-full h-10 px-3 py-2 text-sm border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            required
            disabled={isLoadingProducts}
          >
            <option value="" disabled>
              {isLoadingProducts ? "Cargando tipos de producto..." : "Seleccione un tipo de producto"}
            </option>
            {productOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-agri-secondary mb-1">
            Descripción del producto
          </label>
          <Input
            id="description"
            type="text"
            placeholder="Describa brevemente su producto"
            value={description}
            onChange={handleDescriptionChange}
            maxLength={100}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Máximo 100 caracteres
          </p>
        </div>

        <div>
          <label htmlFor="presentation" className="block text-sm font-medium text-agri-secondary mb-1">
            Presentación
          </label>
          <select
            id="presentation"
            value={presentation}
            onChange={(e) => onPresentationChange(e.target.value)}
            className="w-full h-10 px-3 py-2 text-sm border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={isLoadingPresentations}
          >
            <option value="" disabled>
              {isLoadingPresentations ? "Cargando tipos de presentación..." : "Seleccione un tipo de presentación"}
            </option>
            {presentationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {showClarificationInput && (
          <div>
            <label htmlFor="clarification" className="block text-sm font-medium text-agri-secondary mb-1">
              Aclaración
            </label>
            <Input
              id="clarification"
              type="text"
              placeholder="Especifique detalles de la presentación"
              value={clarification}
              onChange={handleClarificationChange}
              maxLength={50}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Máximo 50 caracteres
            </p>
          </div>
        )}

        <div>
          <label htmlFor="shippingDate" className="block text-sm font-medium text-agri-secondary mb-1">
            Fecha estimada de salida
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="shippingDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Seleccione una fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-agri-secondary mb-1">
              Peso (kg)
            </label>
            <Input
              id="weight"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={weight}
              onChange={(e) => onWeightChange(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Ingrese el peso en kilogramos
            </p>
          </div>
          
          <div>
            <label htmlFor="volume" className="block text-sm font-medium text-agri-secondary mb-1">
              Volumen (m³)
            </label>
            <Input
              id="volume"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={volume}
              onChange={(e) => onVolumeChange(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Ingrese el volumen en metros cúbicos
            </p>
          </div>
        </div>
        
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-agri-secondary mb-1">
            Valor de la carga (USD) *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              $
            </span>
            <Input
              id="value"
              placeholder="0.00"
              value={value}
              onChange={handleValueChange}
              className="w-full pl-7"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Ingrese el valor en dólares estadounidenses (USD), debe ser mayor a 0
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
