import axios from 'https://esm.sh/axios@1.3.5';
import debug from '../utils/debug.ts';

const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN');
const WHATSAPP_GRAPH_URL = 'https://graph.facebook.com/v16.0';
export const sendWhatsAppMessage = (phone_number_id: string, phoneNumber: string, message: string) => {
  try {
    console.log(`Sending WhatsApp Message sent to ${phoneNumber}: ${message}`);
    return axios({
      method: 'POST', // Required, HTTP method, a string, e.g. POST, GET
      url: `${WHATSAPP_GRAPH_URL}/${phone_number_id}/messages?access_token=${WHATSAPP_TOKEN}`,
      data: {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        text: { body: message },
      },
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error sending message');
  }
};

export const markWhatsAppMessageAsRead = (phoneNumber: string, messageId: string) => {
  try {
    debug(`Marking message as read to ${phoneNumber}`);
    return axios({
      method: 'POST', // Required, HTTP method, a string, e.g. POST, GET
      url: `${WHATSAPP_GRAPH_URL}/${phoneNumber}/messages?access_token=${WHATSAPP_TOKEN}`,
      data: {
        messaging_product: 'whatsapp',
        message_id: messageId,
        status: 'read',
      },
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error sending message');
  }
};
