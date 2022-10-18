import { supabase } from "../../libs/supabase";
import { User } from "../models";

export async function createUser(user: Partial<User>) {
  const { data, error } = await supabase
    .from<User>('users')
    .upsert(user, { onConflict: 'spotify_user_id' })
    .single()
  if (error) {
    throw new Error(`Supabase Error: ${error.message}`);
  }

  return data
}