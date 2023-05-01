# YYX Chat
This chat assistant sends messages through WhatsApp and uses OpenAI to respond to the user messages.

## Features
  - Responds to incoming text messages
  - Saves the user's name, phone number, and WhatsApp ID to a database
  - Fetches the previous five messages sent by the user within the last 24 hours
  - Generates a response using OpenAI's GPT-3 API

## Dependencies
  - Deno v1.15.3
  - Supabase
  - OpenAI API
  - WhatsApp API

## Running the Project
  - Copy the .env.example file to .env and fill in the required environment variables.
  - Install Supabase CLI.

### Running locally
- `supabase login`
- `supabase start`
-  Link to the (test) project: `supabase link --project-ref <project-id>`
- `supabase functions serve whatsapp-webhook --env-file ./supabase/.env.local --debug --no-verify-jwt`
- `supabase status`

### Deploy function to Prod
-  Link to the (prod) project: `supabase link --project-ref <project-id>`
- `supabase functions deploy whatsapp-webhook --no-verify-jwt`
### Set Env Variables 
- `supabase secrets set --env-file ./supabase/.env`

### Database Migrations
- Create new migration: `supabase migrations new new_table_name`
- Run migrations locally: `supbase db reset`

### Creating migrations using the table editor
- Use `supabase status` to get the link to the admin panel.
- Navigate to the table editor and make your changes.
- Run this command to get the sql output needed to add to the migration file: `supabase db diff --schema public`
- Create new migration file: `supabase migrations new new_table_name`
- Copy/Paste diff.

### Deploying migrations
- Deploy migrations to prod: `supabase 
[Supabase Docs Reference](https://supabase.com/docs/guides/getting-started/local-development#deploy-your-project)
```
supabase link --project-ref <project-id>
# You can get <project-id> from your project's dashboard URL: https://app.supabase.com/project/<project-id>

supabase db remote commit
# Capture any changes that you have made to your remote database before you went through the steps above
# If you have not made any changes to the remote database, skip this step

# Deploy changes
supabase db push
```

## License

This project is licensed under the MIT License.


## AI Documentation

This is a TypeScript code snippet that listens to incoming messages from WhatsApp and logs the events in the console. It uses Deno as a runtime environment, which is a secure JavaScript and TypeScript runtime built on V8. The code is designed to be run on a server and leverages the following modules:

  - serve from https://deno.land/std@0.177.0/http/server.ts is used to create a simple- HTTP server that listens for incoming requests.
  - supabase from ./data/db/index.ts is a module that connects to a Supabase database- and performs database operations.
  - getOpenAIResponse from ./services/openai.ts is a service that interacts with- OpenAI's API to generate natural language responses.
  - markWhatsAppMessageAsRead and sendWhatsAppMessage from ./services/whatsapp.ts are- services that send and receive messages from WhatsApp's API.

The code first logs a message to the console, then creates a server using the serve function. It then defines two async functions to handle incoming GET and POST requests. The verifyWhatsAppWebhook function is used to verify the webhook URL sent by WhatsApp when setting up the webhook. The function parses the URL parameters and checks that the verify token matches. If it does, it returns the challenge token sent by WhatsApp in the response. If it doesn't, it returns a "Forbidden" response.

The handleWhatsAppEvent function is used to handle incoming POST requests sent by WhatsApp. It first checks the request body to ensure it is valid. It then extracts the relevant information from the webhook payload, such as the message sender's phone number, message body, and message type. If the message is not a text message, it sends a response to WhatsApp informing the user that only text messages are accepted. If the message is a text message, it checks if the user exists in the Supabase database. If the user does not exist, it adds the user to the database. The function then retrieves the previous messages from the user within the last 24 hours, stores them in the messages array, and calls the getOpenAIResponse function to generate a natural language response. Finally, it sends the response to the user via WhatsApp's API.

The code ends with a call to the serve function, passing in the verifyWhatsAppWebhook and handleWhatsAppEvent functions to handle incoming requests.