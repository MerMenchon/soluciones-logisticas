
import { FormData } from "@/types/form";

// Webhook URLs
const WEBHOOK_URL = "https://bipolos.app.n8n.cloud/webhook-test/recepcionFormulario";
const CONFIRMATION_WEBHOOK_URL = "https://bipolos.app.n8n.cloud/webhook-test/confirmacion";

export const submitFormData = async (formData: FormData) => {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Error al enviar los datos');
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error al enviar los datos:", error);
    throw error;
  }
};

export const submitConfirmation = async (confirmData: {
  confirmacion: "si" | "no";
  distance: string | null;
  contacto: string | null;
  "fecha y hora": string | null;
}) => {
  try {
    const response = await fetch(CONFIRMATION_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(confirmData),
    });
    
    if (!response.ok) {
      throw new Error('Error al procesar la solicitud');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
