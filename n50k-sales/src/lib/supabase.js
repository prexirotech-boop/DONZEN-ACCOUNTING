import { createClient } from '@supabase/supabase-js'
import { CONFIG } from './config'

export const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY)

export async function saveOrder({ reference, name, email, phone }) {
  try {
    const { error } = await supabase.from('orders').insert([{
      reference,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      product: CONFIG.BOOK_TITLE,
      amount: CONFIG.PRICE_NAIRA,
      status: 'paid',
      created_at: new Date().toISOString(),
    }])
    if (error) console.error('Supabase insert error:', error)
    return !error
  } catch (err) {
    console.error('Supabase error:', err)
    return false
  }
}
