import { supabase } from "../../libs/supabase";
import { Listeners } from "../models";

export async function saveListenerState(listenState: Partial<Listeners>) {
  const { data, error } = await supabase
    .from<Listeners>('listeners')
    .upsert(listenState, { onConflict: 'user_id' })
    .single()
  if (error) {
    throw new Error(error.message);
  }
  return data
}