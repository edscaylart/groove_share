import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../constants'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  localStorage: AsyncStorage as any
})