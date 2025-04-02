
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";

interface ContactDetailsProps {
  additionalInfo: string;
  onAdditionalInfoChange: (info: string) => void;
}

const ContactDetails = ({
  additionalInfo,
  onAdditionalInfoChange,
}: ContactDetailsProps) => {
  return (
    <div className="form-section">
      <h2 className="form-title">
        <Info className="w-5 h-5" />
        <span>Información Adicional</span>
      </h2>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-agri-secondary mb-1">
            Información adicional
          </label>
          <Textarea
            id="additionalInfo"
            placeholder="Cualquier detalle adicional que debamos conocer..."
            value={additionalInfo}
            onChange={(e) => onAdditionalInfoChange(e.target.value)}
            className="w-full min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
