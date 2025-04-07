
import { WebhookResponse } from "../types";

const WEBHOOK_URL = "https://bipolos.app.n8n.cloud/webhook/recepcionFormulario";
const WEBHOOK_TIMEOUT = 30000; // 30 seconds timeout

export const sendToWebhook = async (formData: any): Promise<WebhookResponse> => {
  try {
    console.log("Sending data to webhook:", JSON.stringify(formData, null, 2));
    
    // Create an AbortController to handle timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(formData),
    });
    
    // Clear the timeout since we got a response
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Webhook response was not ok: ${response.status}`);
    }

    // Parse the response as JSON
    const rawResponse = await response.json();
    console.log("Webhook response received:", rawResponse);
    
    // Handle array responses (API returns array with one object sometimes)
    const responseData = Array.isArray(rawResponse) ? rawResponse[0] : rawResponse;
    
    // Ensure all cost fields are handled as strings
    const formattedResponse: WebhookResponse = {
      titulo: responseData.titulo || "¡Consulta recibida!",
      mensaje: responseData.mensaje || "Gracias por su consulta. Pronto nos pondremos en contacto.",
      precio: responseData.precio?.toString(),
      CostoTotalAlmacenamiento: responseData.CostoTotalAlmacenamiento?.toString(),
      CostoTotalTransporte: responseData.CostoTotalTransporte?.toString(),
      CostoTotal: responseData.CostoTotal?.toString(),
      costoTotalIndividual: responseData.CostoTotalIndividual?.toString() || responseData.costoTotalIndividual?.toString()
    };
    
    console.log("Processed webhook response:", formattedResponse);
    return formattedResponse;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out after', WEBHOOK_TIMEOUT/1000, 'seconds');
      throw new Error(`Request timed out after ${WEBHOOK_TIMEOUT/1000} seconds`);
    }
    
    console.error('Error sending data to webhook:', error);
    throw error;
  }
};
