export const CONFIG = {
  PAYSTACK_PUBLIC_KEY: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_d786df7f8dcd32ac7132be78cdab581b93e9ade8',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://zisbhfwxaiqtxtkecyow.supabase.co',
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppc2JoZnd4YWlxdHh0a2VjeW93Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjExODg3MCwiZXhwIjoyMDg3Njk0ODcwfQ.73ZbPmer59jf1SqXb9Ey7L1DhHwubQmGHlv5n-N2QSs',
  PRICE_KOBO: 250000,           // ₦2,500 in kobo
  PRICE_NAIRA: 2500,
  PRICE_DISPLAY: '₦2,500',
  ORIGINAL_PRICE: '₦9,000',
  BOOK_TITLE: 'The N50K Blueprint',
  PDF_URL: import.meta.env.VITE_PDF_DOWNLOAD_URL || 'https://zisbhfwxaiqtxtkecyow.supabase.co/storage/v1/object/public/downloads/N50K_Blueprint_Enhanced_2.pdf',
  AUTHOR: 'Nnanta Precious',
}
