import { getOpenAIResponse } from '../services/openai';
import { getUserIdByPhoneNumber, createUser } from '../data/user';
import { getMessages, saveMessage, saveOpenAiResponse } from '../data/message';
import { markWhatsAppMessageAsRead, sendWhatsAppMessage } from '../services/whatsapp';

export default async function handleWhatsAppEvent(req: Request) {
  // Parse the request body from the POST
  const body = await req.json();

  // Check the Incoming webhook message
  // DEBUG
  //  console.log(JSON.stringify(body, null, 2));

  if (!body || !body?.object || !body?.entry) {
    console.warn('WhatsApp event not valid');
    return new Response('WhatsApp webhook event is not valid ', { status: 404 });
  }

  // https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  // Extract values from webhook payload
  const { metadata = {}, messages = [], contacts = [] } = body.entry[0].changes[0]?.value || {};
  const phoneNumberId = metadata.phone_number_id;
  const phoneNumber = messages[0]?.from;
  const messageBody = messages[0]?.text?.body;
  const whatsAppMessageId = messages[0]?.id;
  const profileName = contacts[0]?.profile?.name;
  const messageType = messages[0]?.type;

  try {
    if (!profileName) {
      console.log(`WhatsApp Event is not a text message from a user. Ignoring it.`);
      return new Response('WhatsApp Event is not a text message from a user. Ignoring it.', { status: 200 });
    }

    if (messageType !== 'text') {
      console.warn(`WhatsApp Message from: ${profileName} #${phoneNumber} is of type ${messageType}. Ignoring it.`);
      await markWhatsAppMessageAsRead(phoneNumberId, whatsAppMessageId);
      await sendWhatsAppMessage(
        phoneNumberId,
        phoneNumber,
        'Lo siento, solo puedo responder a mensajes de texto. \n(Sorry, I can only respond to text messages.)'
      );

      return new Response('Bad Request: message was NOT a text', {
        status: 400,
      });
    }

    await handleWhatsAppTextMessage({ profileName, phoneNumber, messageBody, phoneNumberId, whatsAppMessageId });
    return new Response('Success message sent', { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Error', { status: 500 });
  }
}

async function handleWhatsAppTextMessage({ profileName, phoneNumber, messageBody, phoneNumberId, whatsAppMessageId }) {
  console.log(`WhatsApp Message from: ${profileName} #${phoneNumber}. Message: ${messageBody}`);
  try {
    let userId = await getUserIdByPhoneNumber(phoneNumber);

    if (!userId) {
      userId = await createUser(phoneNumber, profileName);
    }

    const previousMessages = await getMessages(userId);

    const messageId = await saveMessage(userId, messageBody);

    // Send the messages to OpenAI
    const messages = [...previousMessages, messageBody];
    const openAiResponse: string = await getOpenAIResponse(messages);
    await saveOpenAiResponse(messageId, openAiResponse);

    await markWhatsAppMessageAsRead(phoneNumberId, whatsAppMessageId);
    await sendWhatsAppMessage(phoneNumberId, phoneNumber, openAiResponse);
  } catch (error) {
    console.error('Error handling WhatsApp message', error);
    throw new Error(`Error handling WhatsApp message ${error}`);
  }

  return true;
}
