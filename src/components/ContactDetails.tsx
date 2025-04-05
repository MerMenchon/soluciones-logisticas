
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";
import { useFormContext } from "@/contexts/form";

interface ContactDetailsProps {
  additionalInfo: string;
  onAdditionalInfoChange: (info: string) => void;
}

const ContactDetails = ({
  additionalInfo,
  onAdditionalInfoChange,
}: ContactDetailsProps) => {
  const { validateField } = useFormContext();
  
  const handleInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onAdditionalInfoChange(e.target.value);
    validateField("additionalInfo");  // Validate the field as it changes
  };

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
            onChange={handleInfoChange}
            className="reference-form-input min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
