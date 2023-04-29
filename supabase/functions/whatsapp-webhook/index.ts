import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { verifyWhatsAppWebhook, handleWhatsAppEvent } from './controllers';
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

