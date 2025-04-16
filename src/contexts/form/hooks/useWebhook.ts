import { WebhookResponse, WebhookResponseData } from "../types";

const WEBHOOK_URL = "https://bipolos.app.n8n.cloud/webhook/recepcionFormulario";
const CONFIRMATION_WEBHOOK_URL = "https://bipolos.app.n8n.cloud/webhook/confirmacion";
const WEBHOOK_TIMEOUT = 30000; // 30 seconds timeout

export const sendToWebhook = async (formData: any): Promise<WebhookResponse> => {
  try {
    // console.log("Sending data to webhook:", JSON.stringify(formData, null, 2));
    
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
    // console.log("Webhook response received:", rawResponse);
    
    // Handle array responses (API returns array with one object sometimes)
    const responseData = Array.isArray(rawResponse) ? rawResponse[0] : rawResponse;
    
    // Extract data object if it exists
    const dataObject: WebhookResponseData | undefined = responseData.data ? {
      lugarAlmacenamientoTiempo: responseData.data.lugarAlmacenamientoTiempo?.toString(),
      rutaTransporte: responseData.data.rutaTransporte?.toString(),
      InformacionProducto: responseData.data.InformacionProducto?.toString(),
      fechaInicioEstimada: responseData.data.fechaInicioEstimada?.toString(),
    } : undefined;
    
    // Process all fields as strings (including messages like "Servicio no solicitado")
    const formattedResponse: WebhookResponse = {
      titulo: responseData.titulo || "¡Consulta recibida!",
      mensaje: responseData.mensaje || "Gracias por su consulta. Pronto nos pondremos en contacto.",
      precio: responseData.precio?.toString(),
      CostoTotalAlmacenamiento: responseData.CostoTotalAlmacenamiento?.toString(),
      CostoTotalTransporte: responseData.CostoTotalTransporte?.toString(),
      CostoTotal: responseData.CostoTotal?.toString(),
      // Handle both capitalization formats for CostoTotalIndividual
      costoTotalIndividual: responseData.costoTotalIndividual?.toString(),
      CostoTotalIndividual: responseData.CostoTotalIndividual?.toString(),
      // New fields
      id: responseData.id?.toString(),
      submissionDate: responseData.submissionDate,
      // Data object
      data: dataObject
    };
    
    // console.log("Processed webhook response:", formattedResponse);
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

// Function to send confirmation with the corrected webhook URL
export const sendConfirmation = async (
  id: string | undefined, 
  submissionDate: string | undefined, 
  confirmacion: boolean
): Promise<void> => {
  try {
    if (!id || !submissionDate) {
      throw new Error('Missing required id or submissionDate for confirmation');
    }

      
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT);
    
    const response = await fetch(CONFIRMATION_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        id,
        submissionDate,
        confirmacion
      }),
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Confirmation webhook response was not ok: ${response.status}`);
    }

    // console.log("Confirmation sent successfully");
    
    // Optional: process response if needed
    const responseData = await response.json();
    // console.log("Confirmation response:", responseData);
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Confirmation request timed out after', WEBHOOK_TIMEOUT/1000, 'seconds');
      throw new Error(`Confirmation request timed out after ${WEBHOOK_TIMEOUT/1000} seconds`);
    }
    
    console.error('Error sending confirmation to webhook:', error);
    throw error;
  }
};
