
import { WebhookResponse } from "../types";

const WEBHOOK_URL = "https://bipolos.app.n8n.cloud/webhook-test/recepcionFormulario";
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

    // Parse the response as JSON and return it as is with precio as string
    const responseData = await response.json();
    console.log("Webhook response received:", responseData);
    
    return responseData;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out after', WEBHOOK_TIMEOUT/1000, 'seconds');
      throw new Error(`Request timed out after ${WEBHOOK_TIMEOUT/1000} seconds`);
    }
    
    console.error('Error sending data to webhook:', error);
    throw error;
  }
};
