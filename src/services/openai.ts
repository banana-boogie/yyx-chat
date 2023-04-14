import { ChatCompletionResponseMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Call OpenAI API to get a response, taking in the message from WhatsApp
export const getOpenAIResponse = async (prompt: string | string[]): Promise<string> => {
  if (!configuration.apiKey) {
    throw new Error("OpenAI API key not configured, please follow instructions in README.md")
  }

  try {
    const prompts: ChatCompletionResponseMessage[] = Array.isArray(prompt)
      ? prompt.map((message) => ({ role: 'user', content: message }))
      : [{ role: 'user', content: prompt }];

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content: `You are an assistant that helps thermomix customers for Yummy Yummix in Mexico.\
          Most customers will speak in Spanish but some may speak other languages such as English.
          Respond in the language the user speaks to you in.`,
        },
        ...prompts
      ],
      temperature: 0.6,
    });

    const chatResponse = completion.data.choices[0].message?.content;

    return chatResponse || "";

  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);

      throw new Error(error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      throw Error('An error occurred during your request.')
    }
  }
}
