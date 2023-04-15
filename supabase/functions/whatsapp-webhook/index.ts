import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

import supabase from './data/db/index.ts';
import { getOpenAIResponse } from './services/openai.ts';
import { markWhatsAppMessageAsRead, sendWhatsAppMessage } from './services/whatsapp.ts';

console.log('Hello from WhatsApp Webhooks Functions!');

serve(async (req: Request) => {
  if (req.method === 'GET') {
    return verifyWhatsAppWebhook(req);
  } else if (req.method === 'POST') {
    return handleWhatsAppEvent(req);
  } else {
    return new Response('Not Found', { status: 404 });
  }
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
const verifyWhatsAppWebhook = async (req: Request) => {
  const urlParams = new URLSearchParams(await req.url.split('?')[1]);
  const mode = urlParams.get('hub.mode');
  const token = urlParams.get('hub.verify_token');
  const challenge = urlParams.get('hub.challenge');

  const VERIFY_TOKEN = Deno.env.get('VERIFY_TOKEN');
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    // Respond with 200 OK and challenge token from the request
    console.log('WEBHOOK_VERIFIED');
    return new Response(challenge, { status: 200 });
  } else {
    // Responds with '403 Forbidden' if verify tokens do not match
    return new Response('Forbidden', { status: 403 });
  }
};

const handleWhatsAppEvent = async (req: Request) => {
  // Parse the request body from the POST
  const body = await req.json();

  // Check the Incoming webhook message
  // DEBUG: console.log(JSON.stringify(body, null, 2));

  if (!body || !body?.object || !body?.entry) {
    console.warn('WhatsApp event not valid');
    return new Response('WhatsApp webhook event is not valid ', { status: 404 });
  }

  // https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  // Extract values from webhook payload
  const { metadata = {}, messages = [], contacts = [] } = body.entry[0].changes[0]?.value || {};
  const phoneNumberId = metadata.phone_number_id;
  const from = messages[0]?.from;
  const msg_body = messages[0]?.text?.body;
  const messageId = messages[0]?.id;
  const profileName = contacts[0]?.profile?.name;
  const messageType = messages[0]?.type;

  try {
    if (!profileName) {
      // DEBUG:  console.log(`WhatsApp Event is not a text message from a user. Ignoring it.`);
      return new Response('WhatsApp Event is not a text message from a user. Ignoring it.', { status: 200 });
    }

    if (messageType !== 'text') {
      console.warn(`WhatsApp Message from: ${profileName} #${from} is of type ${messageType}. Ignoring it.`);
      await markWhatsAppMessageAsRead(phoneNumberId, messageId);
      await sendWhatsAppMessage(
        phoneNumberId,
        from,
        'Lo siento, solo puedo responder a mensajes de texto. \n(Sorry, I can only respond to text messages.)'
      );

      return new Response('Bad Request: message was NOT a text', {
        status: 400,
      });
    }

    console.log(`WhatsApp Message from: ${profileName} #${from}. Message ID: ${messageId}}`);

    // Check if user exists
    const { data: userExists, error: userExistsError } = await supabase
      .from('users')
      .select('id')
      .eq('phone_number', from)
      .limit(1);

    let userId;

    if (userExists && userExists.length > 0) {
      userId = userExists[0].id;
      //  DEBUG:  console.log(`WhatsApp user ${profileName}: ${from} already exists in Supabase`);
    } else {
      // Save WhatsApp user to Supabase
      const { data: user, error } = await supabase
        .from('users')
        .insert({ name: profileName, phone_number: from })
        .select('id');

      if (error) {
        console.error(`error savings whatsapp user to Supabase: ${error}`);
        throw error;
      }

      console.log(`New User! Saved WhatsApp user ${profileName}: ${from} to Supabase`);
      userId = user[0].id;
    }

    let messages = [];
    if (userExists && userExists.length > 0) {
      // Get previous messages from Supabase
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // One day ago

      const { data: previousMessages, error: previousMessagesError } = await supabase
        .from('messages')
        .select('message')
        .eq('user_id', userId)
        .gte('inserted_at', oneDayAgo.toISOString())
        .order('inserted_at', { ascending: false })
        .limit(5);

      if (previousMessagesError) {
        console.error(`Error fetching previous message: ${previousMessagesError}`);
        throw previousMessagesError;
      }

      if (previousMessages && previousMessages.length > 0) {
        messages = previousMessages.map((message) => message.message);
        //  DEBUG:  console.log(`Previous messages found: ${messages}`);
      }
    }

    // save message to Supabase
    const { error: messageError } = await supabase.from('messages').insert({
      user_id: userId,
      message: msg_body,
      phone_number: from
    });

    //  DEBUG: console.log(`Saved WhatsApp message from ${profileName}: ${from} to Supabase`);
    if (messageError) {
      console.error(`Error saving message to Supabase: ${messageError}`);
      throw messageError;
    }

    // Send the messages to OpenAI
    messages = [...messages, msg_body];

    const openAiResponse: string = await getOpenAIResponse(messages);

    await markWhatsAppMessageAsRead(phoneNumberId, messageId);
    await sendWhatsAppMessage(phoneNumberId, from, openAiResponse);
    console.log(`WhatsApp Message sent to ${from}: ${openAiResponse}`);
    return new Response('Success message sent', { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Error', { status: 500 });
  }
};
