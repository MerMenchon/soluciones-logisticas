
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CostInfoCardProps {
  webhookResponse: any;
}

// This function checks if the value is a valid number to format, otherwise returns the string as-is
const formatValue = (value: string | undefined): string => {
  if (!value) return '0';
  
  // Check if it's a numeric string we can format
  const numValue = parseFloat(value);
  if (!isNaN(numValue)) {
    return numValue.toLocaleString('es-AR');
  }
  
  // If it's not a number, return the original string (like "Servicio no solicitado")
  return value;
};

// Function to determine if a cost value should be displayed
const shouldDisplayCost = (value: string | undefined): boolean => {
  if (!value) return false;
  
  // If it's not a parseable number, always display it (like "Servicio no solicitado")
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return true;
  
  // If it's a number, only display if it's not zero
  return numValue !== 0;
};

// Function to determine if a value should be displayed with $ symbol 
// (only for numeric values, not for messages like "Servicio no solicitado")
const shouldShowCurrencySymbol = (value: string | undefined): boolean => {
  if (!value) return false;
  return !isNaN(parseFloat(value));
};

const CostInfoCard = ({ webhookResponse }: CostInfoCardProps) => {
  // Get the individual cost value from either capitalization version
  const individualCost = webhookResponse?.CostoTotalIndividual || webhookResponse?.costoTotalIndividual;
  
  // Check if we have cost information to display (not zero)
  const hasCostInfo = shouldDisplayCost(webhookResponse?.CostoTotal) || 
                     shouldDisplayCost(webhookResponse?.CostoTotalAlmacenamiento) || 
                     shouldDisplayCost(webhookResponse?.CostoTotalTransporte) ||
                     shouldDisplayCost(webhookResponse?.costoTotalIndividual) ||
                     shouldDisplayCost(webhookResponse?.CostoTotalIndividual) ||
                     shouldDisplayCost(webhookResponse?.precio);
  
  if (!hasCostInfo) return null;
  
  return (
    <Card className="border-2 border-agri-primary/20 bg-agri-primary/5">
      <CardContent className="pt-6">
        {shouldDisplayCost(webhookResponse?.CostoTotal) && (
          <div className="text-center mb-4">
            <div className="text-sm text-muted-foreground mb-1">Costo Total:</div>
            <div className="text-4xl font-bold text-agri-primary">
              {shouldShowCurrencySymbol(webhookResponse?.CostoTotal) ? 'USD ' : ''}
              {formatValue(webhookResponse?.CostoTotal)}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4">
          {shouldDisplayCost(webhookResponse?.CostoTotalAlmacenamiento) && (
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Almacenamiento:</div>
              <div className="text-lg font-semibold text-agri-primary">
                {shouldShowCurrencySymbol(webhookResponse?.CostoTotalAlmacenamiento) ? 'USD ' : ''}
                {formatValue(webhookResponse?.CostoTotalAlmacenamiento)}
              </div>
            </div>
          )}
          
          {shouldDisplayCost(webhookResponse?.CostoTotalTransporte) && (
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Transporte:</div>
              <div className="text-lg font-semibold text-agri-primary">
                {shouldShowCurrencySymbol(webhookResponse?.CostoTotalTransporte) ? 'USD ' : ''}
                {formatValue(webhookResponse?.CostoTotalTransporte)}
              </div>
            </div>
          )}
        </div>
        
        {shouldDisplayCost(individualCost) && (
          <div className="text-center mt-4 pt-4 border-t border-agri-primary/20">
            <div className="text-xs text-muted-foreground mb-1">Costo por unidad:</div>
            <div className="text-lg font-semibold text-agri-primary">
              {shouldShowCurrencySymbol(individualCost) ? 'USD ' : ''}
              {formatValue(individualCost)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CostInfoCard;
