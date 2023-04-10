import { Request, Response } from "express";

import { getOpenAIResponse } from "../services/openai";
import { sendWhatsAppMessage } from "../services/whatsapp";

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
export const verifyWhatsAppWebhook = async (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log(req.query);
  console.log(VERIFY_TOKEN);
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    // Respond with 200 OK and challenge token from the request
    console.log("WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    // Responds with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
};

export const handleWhatsAppEvent = async (req: Request, res: Response) => {
  // Parse the request body from the POST
  const body = req.body;

  // Check the Incoming webhook message
  console.log(JSON.stringify(req.body, null, 2));

  // Return a '404 Not Found' if event is not from a WhatsApp API
  if (!body.object) {
    return res.sendStatus(404);
  }
  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (
    !(
      req.body.object && req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]
    )
  ) {
    return res.sendStatus(404);
  }
  const phone_number_id =
    body.entry[0].changes[0].value.metadata.phone_number_id;
  const from = body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
  const msg_body = body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload

  try {
    // send the msg_body to OpenAI
    const openAiResponse: string = await getOpenAIResponse(msg_body);

    await sendWhatsAppMessage(phone_number_id, from, openAiResponse);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
