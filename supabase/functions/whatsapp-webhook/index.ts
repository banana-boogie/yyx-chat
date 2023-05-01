import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { verifyWhatsAppWebhook, handleWhatsAppEvent } from './controllers/index.ts';
import debug from './utils/debug.ts';

debug('Hello from WhatsApp Webhooks Functions!');

serve(async (req: Request) => {
  if (req.method === 'GET') {
    return await verifyWhatsAppWebhook(req);
  } else if (req.method === 'POST') {
    return await handleWhatsAppEvent(req);
  } else {
    return new Response('Not Found', { status: 404 });
  }
});
