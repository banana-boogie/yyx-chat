// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
export default async function verifyWhatsAppWebhook(req: Request) {
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
