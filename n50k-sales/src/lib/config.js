export const CONFIG = {
  PAYSTACK_PUBLIC_KEY: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_live_33dadf4fcc7b6423310fa4217b8d3897055a2b7a',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://zisbhfwxaiqtxtkecyow.supabase.co',
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppc2JoZnd4YWlxdHh0a2VjeW93Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjExODg3MCwiZXhwIjoyMDg3Njk0ODcwfQ.73ZbPmer59jf1SqXb9Ey7L1DhHwubQmGHlv5n-N2QSs',
  PRICE_KOBO: 250000,           // ₦2,500 in kobo
  PRICE_NAIRA: 2500,
  PRICE_DISPLAY: '₦2,500',
  ORIGINAL_PRICE: '₦9,000',
  BOOK_TITLE: 'The N50K Blueprint',
  PDF_URL: import.meta.env.VITE_PDF_DOWNLOAD_URL || '#',
  AUTHOR: 'Nnanta Precious',
}
