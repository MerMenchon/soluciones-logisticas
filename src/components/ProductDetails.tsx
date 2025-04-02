import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchPresentations, fetchQuantityUnits, useQuantityUnits } from "@/data/locations";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ProductDetailsProps {
  productType: string;
  onProductTypeChange: (type: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  presentation: string;
  onPresentationChange: (presentation: string) => void;
  value: string;
  onValueChange: (value: string) => void;
  shippingTime: string;
  onShippingTimeChange: (time: string) => void;
  clarification?: string;
  onClarificationChange?: (clarification: string) => void;
  quantity: string;
  onQuantityChange: (quantity: string) => void;
  quantityUnit: string;
  onQuantityUnitChange: (unit: string) => void;
}

const ProductDetails = ({
  productType,
  onProductTypeChange,
  description,
  onDescriptionChange,
  presentation,
  onPresentationChange,
  value,
  onValueChange,
  shippingTime,
  onShippingTimeChange,
  clarification = "",
  onClarificationChange = () => {},
  quantity,
  onQuantityChange,
  quantityUnit,
  onQuantityUnitChange,
}: ProductDetailsProps) => {
  const [productOptions, setProductOptions] = useState<string[]>([]);
  const [presentationOptions, setPresentationOptions] = useState<string[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingPresentations, setIsLoadingPresentations] = useState(true);
  const { toast } = useToast();
  
  // Use the React Query hook for quantity units
  const { data: quantityUnitOptions = [], isLoading: isLoadingQuantityUnits } = useQuantityUnits();

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

  // Handle quantity input validation
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = e.target.value;
    
    // Allow decimals and empty values (for UX)
    if (newQuantity === '' || /^\d*\.?\d*$/.test(newQuantity)) {
      // Check if value is greater than 0
      if (newQuantity === '' || parseFloat(newQuantity) > 0) {
        onQuantityChange(newQuantity);
      }
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
          <Select 
            value={productType} 
            onValueChange={onProductTypeChange}
            disabled={isLoadingProducts}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                isLoadingProducts 
                  ? "Cargando tipos de producto..." 
                  : "Seleccione un tipo de producto"
              } />
            </SelectTrigger>
            <SelectContent>
              {productOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        </div>

        <div>
          <label htmlFor="presentation" className="block text-sm font-medium text-agri-secondary mb-1">
            Presentación
          </label>
          <Select 
            value={presentation} 
            onValueChange={onPresentationChange}
            disabled={isLoadingPresentations}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                isLoadingPresentations 
                  ? "Cargando tipos de presentación..." 
                  : "Seleccione un tipo de presentación"
              } />
            </SelectTrigger>
            <SelectContent>
              {presentationOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          </div>
        )}

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-agri-secondary mb-1">
            Cantidad *
          </label>
          <div className="flex items-stretch gap-2">
            <div className="w-1/3">
              <Input
                id="quantity"
                placeholder="0.00"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-full h-full"
                required
              />
            </div>
            
            <div className="w-2/3 flex items-center">
              {isLoadingQuantityUnits ? (
                <div className="text-sm text-muted-foreground py-2">Cargando...</div>
              ) : (
                <ToggleGroup 
                  type="single" 
                  value={quantityUnit}
                  onValueChange={(value) => {
                    if (value) onQuantityUnitChange(value);
                  }}
                  className="flex justify-start h-10"
                >
                  {quantityUnitOptions.slice(0, 3).map((unit) => (
                    <ToggleGroupItem 
                      key={unit} 
                      value={unit} 
                      aria-label={unit}
                      variant="bordered"
                      className="rounded-md text-sm border border-agri-light h-full"
                    >
                      {unit}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-agri-secondary mb-1">
            Valor de la carga (USD) *
          </label>
          <div className="flex items-stretch gap-2">
            <div className="w-1/3">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
