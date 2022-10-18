import { supabase } from "../../libs/supabase";
import { Listeners } from "../models";

export async function getNearbyUsers({longitude, latitude}: any, currentUserId: string) {
  const { data, error } = await supabase.rpc<Listeners>('nearby_users', {
    location: `POINT(${longitude} ${latitude})`,
    except_user_id: currentUserId
  })
  if (error) {
    throw new Error(error.message);
  }
  return data
}