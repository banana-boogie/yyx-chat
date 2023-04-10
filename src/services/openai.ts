import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Call OpenAI API to get a response, taking in the message from WhatsApp
export const getOpenAIResponse = async (prompt: string): Promise<string> => {
  if (!configuration.apiKey) {
   throw new Error("OpenAI API key not configured, please follow instructions in README.md")
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.6,
    });
    return completion.data.choices[0].text || "";
  } catch(error: any) {
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
