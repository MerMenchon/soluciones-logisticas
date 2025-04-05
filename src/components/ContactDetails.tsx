
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
    <div className="reference-form-section">
      <h2 className="reference-form-subtitle">
        <Info className="w-5 h-5 inline-block mr-2" />
        <span>Información Adicional</span>
      </h2>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="reference-form-group">
          <label htmlFor="additionalInfo" className="reference-form-label">
            Información adicional
          </label>
          <Textarea
            id="additionalInfo"
            placeholder="Cualquier detalle adicional que debamos conocer..."
            value={additionalInfo}
            onChange={(e) => onAdditionalInfoChange(e.target.value)}
            className="reference-form-input min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
