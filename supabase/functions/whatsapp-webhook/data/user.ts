import supabase from './db/index';

export async function getUserIdByPhoneNumber(phoneNumber: string): Promise<string|null> {
  // Check if user exists
  const { data: userRecords, error: userExistsError } = await supabase
    .from('users')
    .select('id')
    .eq('phone_number', phoneNumber)
    .limit(1);

  if (userRecords && userRecords.length > 0) {
    // DEBUG
    // console.log(`WhatsApp user ${profileName}: ${phoneNumber} exists in Supabase`);
    return userRecords[0].id;
  }

  return null;
}

export async function createUser(profileName: string, phoneNumber: string): Promise<string> {
  // Save WhatsApp user to Supabase
  const { data: userRecords, error } = await supabase
    .from('users')
    .insert({ name: profileName, phone_number: phoneNumber })
    .select('id');

  if (error) {
    console.error(`error savings whatsapp user to Supabase: ${error}`);
    throw error;
  }

  const user = userRecords[0];
  console.log(`New User! Creating ${user.name}: ${user.phone_number} in Supabase`);

  return user.id;
}
