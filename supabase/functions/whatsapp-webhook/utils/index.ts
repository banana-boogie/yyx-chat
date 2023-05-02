import { messageResponse } from '../data/message.ts';
import { ChatCompletionRequestMessage } from 'https://esm.sh/openai@3.2.1';
import * as tokenizer from 'https://deno.land/x/gpt_2_3_tokenizer@v0.0.2/mod.js';

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

// Calculate the cost of the prompt based on the number of tokens
const OPENAI_MODEL_PRICING = 0.002 / 1000; // $0.002 per 1000 tokens for gpt-3.5-turbo
export function calculatePromptCost(
  prompts: ChatCompletionRequestMessage[],
  modelCost: number = OPENAI_MODEL_PRICING
): number {
  const text = prompts.map((p) => p.content).join('\n');
  const tokens = tokenizer.encode(text);
  const cost = tokens.length * modelCost;

  return Number(cost.toFixed(5));
}
