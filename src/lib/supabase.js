import { createClient } from '@supabase/supabase-js'
import { CONFIG } from './config'

export const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY)

export async function saveOrder({ reference, name, email, phone }) {
  try {
    const record = {
      reference,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      product: CONFIG.BOOK_TITLE,
      amount: CONFIG.PRICE_NAIRA,
      status: 'paid',
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('orders').insert([record])
    if (error) console.error('Supabase insert error:', error)

    // Trigger the email edge function directly securely skipping webhook dependency
    const { error: funcError } = await supabase.functions.invoke('send-confirmation', {
      body: { record: record }
    })
    if (funcError) console.error('Supabase function invoke error:', funcError)

    return !error
  } catch (err) {
    console.error('Supabase error:', err)
    return false
  }
}

