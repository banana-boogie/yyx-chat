import supabase from './db/index.ts';
import debug from '../utils/debug.ts';
export async function getUserIdByPhoneNumber(phoneNumber: string): Promise<number | null> {
  // Check if user exists
  const { data: userRecords, error } = await supabase.from('users').select().eq('phone_number', phoneNumber).limit(1);

  if (error) {
    console.error(`Error fetching user from Supabase: ${error}`);
    throw error;
  }

  if (userRecords && userRecords.length > 0) {
    const user = userRecords[0];
    debug(`WhatsApp user ${user.name}: ${user.phone_number} exists in Supabase`);
    return user.id;
  }

  debug(`WhatsApp user ${phoneNumber} does not exist in Supabase`);
  return null;
}

export async function createUser(profileName: string, phoneNumber: string): Promise<number> {
  // Save WhatsApp user to Supabase
  const { data: userRecords, error } = await supabase
    .from('users')
    .insert({ name: profileName, phone_number: phoneNumber })
    .select();

  if (error) {
    console.error(`error savings whatsapp user to Supabase: ${error}`);
    throw error;
  }

  const user = userRecords[0];
  debug(`New User! Creating ${user.name}: ${user.phone_number} in Supabase`);

  return user.id;
}
