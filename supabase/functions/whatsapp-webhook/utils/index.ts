import { messageResponse } from '../data/message.ts';
import { ChatCompletionRequestMessage } from 'https://esm.sh/openai@3.2.1';

export function formatPromptsFromMessages(messagesRecord: messageResponse): ChatCompletionRequestMessage[] {
  const prompts: ChatCompletionRequestMessage[] = [];

  messagesRecord.forEach((record) => {
    prompts.push(
      {
        role: 'assistant',
        content: record.openAiResponse,
      },
      {
        role: 'user',
        content: record.message,
      }
    );
  });

  return prompts;
}
