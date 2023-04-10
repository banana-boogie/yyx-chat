import axios from "axios";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

export const sendWhatsAppMessage = async (
  phone_number_id: string,
  from: string,
  message: string
) => {
  try {
    return axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url: `https://graph.facebook.com/v12.0/${phone_number_id}/messages?access_token=${WHATSAPP_TOKEN}`,
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
