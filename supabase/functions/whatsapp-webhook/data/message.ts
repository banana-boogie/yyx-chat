import supabase from './db/index.ts';
import debug from '../utils/debug.ts';

export async function getMessages(userId: number, { limit } = { limit: 5 }): Promise<string[]> {
  // Get previous messages from Supabase
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // One day ago

  const { data: messagesResponse, error: previousMessagesError } = await supabase
    .from('messages')
    .select('message')
    .eq('user_id', userId)
    .gte('inserted_at', oneDayAgo.toISOString())
    .order('inserted_at', { ascending: false })
    .limit(limit);

  if (previousMessagesError) {
    console.error(`Error fetching previous message: ${previousMessagesError}`);
    throw previousMessagesError;
  }

  if (messagesResponse && messagesResponse.length === 0) {
    debug(`No previous messages found for user id#:${userId}`);
    return [];
  }

  const messages: string[] = [];

  messagesResponse.forEach((entry) => {
    if (entry.message !== null) {
      messages.unshift(entry.message);
    }
  });

  debug(`Previous messages found: ${messages}`);

  return messages;
}

export async function saveMessage(userId: number, message: string): Promise<number> {
  const { error, data } = await supabase
    .from('messages')
    .insert({
      user_id: userId,
      message: message,
    })
    .select();

  if (error) {
    console.error(`Error saving message to Supabase: ${error}`);
    throw error;
  }

  if (data && !data.length) {
    console.error(`Error saving message to Supabase: ${error}`);
    throw new Error('Error saving message to Supabase');
  }

  debug(`Message saved to Supabase: ${JSON.stringify(data[0])}`);

  return data[0].id;
}

// function to update the Message in supabase
export async function saveOpenAiResponse(messageId: number, openAiResponse: string): Promise<number> {
  const { error, data } = await supabase
    .from('messages')
    .update({
      openai_response: openAiResponse,
    })
    .eq('id', messageId)
    .select();

  if (error) {
    console.error(`Error updating message to Supabase: ${error}`);
    throw error;
  }

  if (data && !data.length) {
    console.error(`Error updating message to Supabase: ${error}`);
    throw new Error('Error updating message to Supabase');
  }

  debug(`Saved OpenAI response to Supabase: ${JSON.stringify(data[0])}`);

  return data[0].id;
}
