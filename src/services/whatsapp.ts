import axios from "axios";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_GRAPH_URL = 'https://graph.facebook.com/v16.0'
export const sendWhatsAppMessage = async (
  phone_number_id: string,
  from: string,
  message: string
) => {
  try {
    return axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url: `${WHATSAPP_GRAPH_URL}/${phone_number_id}/messages?access_token=${WHATSAPP_TOKEN}`,
      data: {
        messaging_product: "whatsapp",
        to: from,
        text: { body: message },
      },
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
  }
};



export const markWhatsAppMessageAsRead = async (
  phoneNumber: string,
  messageId: string
) => {
  try {
    return axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url: `${WHATSAPP_GRAPH_URL}/${phoneNumber}/messages?access_token=${WHATSAPP_TOKEN}`,
      data: {
        messaging_product: "whatsapp",
        message_id: messageId,
        status: 'read'
      },
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
  }
};


