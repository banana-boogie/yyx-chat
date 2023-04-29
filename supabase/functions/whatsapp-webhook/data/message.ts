import supabase from './db/index';

export async function getMessages(userId: string, { limit } = { limit: 5}): Promise<string[]> {
  // Get previous messages from Supabase
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // One day ago

  const { data: messages, error: previousMessagesError } = await supabase
    .from('messages')
    .select('message')
    .eq('user_id', userId)
    .lte('inserted_at', oneDayAgo.toISOString())
    .order('inserted_at', { ascending: false })
    .limit(limit);

  if (previousMessagesError) {
    console.error(`Error fetching previous message: ${previousMessagesError}`);
    throw previousMessagesError;
  }

  if (messages && messages.length === 0) {
    // DEBUG
    // console.log(`No previous messages found for user ${userId}`);
    return [];
  }

  // DEBUG
  console.log(`Previous messages found: ${messages}`);
  return messages.map((message) => message.message);
}

export async function saveMessage(userId: string, message: string): Promise<string> {
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

  // DEBUG
  // console.log(`Message saved to Supabase: ${JSON.stringify(data[0])}`);

  return data[0].id;
}


// function to update the Message in supabase
export async function saveOpenAiResponse(messageId: string, openAiResponse: string): Promise<string> {
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
  
  return data[0].id;
}