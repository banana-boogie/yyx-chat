import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1';

import debug from '../utils/debug.ts';

const configuration = new Configuration({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

const openai = new OpenAIApi(configuration);

type prompts = ChatCompletionRequestMessage[];

// Call OpenAI API to get a response, taking in the message from WhatsApp
export const getOpenAIResponse = async (prompts: prompts): Promise<string> => {
  if (!configuration.apiKey) {
    throw new Error('OpenAI API key not configured, please follow instructions in README.md');
  }

  try {
    debug(`OpenAI message prompts: ${JSON.stringify(prompts)}`);
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content: `You are an assistant that helps thermomix customers for YummyYummix in Mexico.\
          Most customers will speak in Spanish but some may speak other languages such as English.
          Respond in the language the user speaks to you in.`,
        },
        ...prompts,
      ],
      temperature: 0.8,
    });

    const chatResponse = completion.data.choices[0].message?.content;

    debug(`OpenAI response: ${chatResponse}`);
    return chatResponse || '';
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);

      throw new Error(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      throw Error('An error occurred during your request.');
    }
  }
};
