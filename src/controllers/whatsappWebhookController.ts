import { Request, Response } from "express";

import Cache from '../data/cache';
const cache = Cache.getInstance();

import { getOpenAIResponse } from "../services/openai";
import { markWhatsAppMessageAsRead, sendWhatsAppMessage } from "../services/whatsapp";

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
  const msg_body = body.entry[0].changes[0]?.value.messages[0]?.text?.body; // extract the message text from the webhook payload
  const messageId = body.entry[0].changes[0]?.value.messages[0]?.id;
  const profileName = body.entry[0].changes[0]?.value.contacts[0]?.profile?.name;
  const messageType = body.entry[0].changes[0]?.value.messages[0]?.type;

  console.log(`WhatsApp Message from: ${profileName} #${from}`);
  try {
    if (messageType !== 'text') {
      console.warn(`WhatsApp Message from: ${profileName} #${from} is of type ${messageType}. Ignoring it.`);
      await markWhatsAppMessageAsRead(phone_number_id, messageId);
      await sendWhatsAppMessage(phone_number_id, from, 'Lo siento, solo puedo responder a mensajes de texto. \n(Sorry, I can only respond to text messages.)');

      return res.sendStatus(400);
    }

    let previousMessages = cache.get(phone_number_id) as any[];
    // default ttl is 24 hours
    if (previousMessages && previousMessages.length > 0) {
      cache.set(phone_number_id, [...previousMessages, msg_body]);
    } else {
      cache.set(phone_number_id, [msg_body]);
    }

    // send the messages to OpenAI
    const messages = cache.get(phone_number_id) as any[];
    const openAiResponse: string = await getOpenAIResponse(messages);

    await markWhatsAppMessageAsRead(phone_number_id, messageId);
    await sendWhatsAppMessage(phone_number_id, from, openAiResponse);
    console.log(`WhatsApp Message sent to ${from}: ${openAiResponse}`)
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
