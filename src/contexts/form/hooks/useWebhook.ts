
import { WebhookResponse } from "../types";

const WEBHOOK_URL = "https://bipolos.app.n8n.cloud/webhook-test/recepcionFormulario";

export const sendToWebhook = async (formData: any): Promise<WebhookResponse> => {
  try {
    console.log("Sending data to webhook:", JSON.stringify(formData, null, 2));
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Webhook response was not ok: ${response.status}`);
    }

    // Parse the response as JSON and return it as is with precio as string
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error sending data to webhook:', error);
    throw error;
  }
};
