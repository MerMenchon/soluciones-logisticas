import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ShippingDateSelectorProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  disabledDays: { before: Date };
  isInvalid?: boolean;
  errorMessage?: string | null;
  onBlur?: () => void;
}

const ShippingDateSelector = ({
  selectedDate,
  onDateSelect,
  disabledDays,
  isInvalid = false,
  errorMessage = null,
  onBlur
}: ShippingDateSelectorProps) => {
  const [open, setOpen] = useState(false); // Estado para controlar el popover

  return (
    <div className="reference-form-section">
      <h2 className="reference-form-subtitle">
        <Calendar className="w-5 h-5 inline-block mr-2" />
        <span>Fecha del servicio</span>
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        ¿A partir de qué fecha lo solicitás?
      </p>
      <div className="space-y-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="shippingDate"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal reference-form-input",
                !selectedDate && "text-muted-foreground",
                isInvalid && "border-red-500"
              )}
              onBlur={onBlur}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {selectedDate
                ? format(selectedDate, "PPP", { locale: es })
                : <span>Seleccione una fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                onDateSelect(date);
                setOpen(false); // Cierra el popover al seleccionar
              }}
              disabled={disabledDays}
              initialFocus
              locale={es} // Muestra el calendario en español
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        {isInvalid && errorMessage && (
          <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default ShippingDateSelector;
