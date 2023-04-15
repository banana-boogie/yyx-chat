import axios from 'https://esm.sh/axios@1.3.5';

const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN');
const WHATSAPP_GRAPH_URL = 'https://graph.facebook.com/v16.0'
export const sendWhatsAppMessage = async (
  phone_number_id: string,
  from: string,
  message: string
) => {
  try {
    // DEBUG:  console.log(`Sending message to ${from}`)
    return axios({
      method: 'POST', // Required, HTTP method, a string, e.g. POST, GET
      url: `${WHATSAPP_GRAPH_URL}/${phone_number_id}/messages?access_token=${WHATSAPP_TOKEN}`,
      data: {
        messaging_product: 'whatsapp',
        to: from,
        text: { body: message },
      },
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error sending message');
  }
};



export const markWhatsAppMessageAsRead = async (
  phoneNumber: string,
  messageId: string
) => {
  try {
    //  DEBUG:  console.log(`Marking message as read to ${phoneNumber}`);
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


