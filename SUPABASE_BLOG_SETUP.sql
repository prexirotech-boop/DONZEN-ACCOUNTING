-- Create the blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT DEFAULT 'General',
  is_published BOOLEAN DEFAULT true,
  author TEXT DEFAULT 'Instructor Precious',
  read_time INT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid duplication errors
DROP POLICY IF EXISTS "Allow public read access to published posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow admin full access to blog posts" ON blog_posts;

-- Create policy to allow anyone to read published posts
CREATE POLICY "Allow public read access to published posts" ON blog_posts
  FOR SELECT USING (is_published = true);

-- Create policy to allow authenticated users (admin dashboard) full access
CREATE POLICY "Allow admin full access to blog posts" ON blog_posts
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert some sample high-quality articles to get the blog started immediately
INSERT INTO blog_posts (title, slug, summary, content, category, cover_image, author, read_time)
VALUES 
(
  'How Nigerian SMEs Should Manage Cash Flow',
  'how-nigerian-smes-should-manage-cash-flow',
  'A practical guide for small and medium enterprises in Nigeria to balance inflows, manage overheads, and maintain liquidity in a volatile economy.',
  'Managing cash flow is the single most critical factor for the survival of any small business in Nigeria today. With inflation, currency volatility, and unpredictable market demands, keeping a close eye on your cash inflows and outflows is not just accounting—it is survival.

Here are 5 practical strategies Nigerian SMEs should implement immediately:

1. Maintain a Daily Cash Book
Do not wait until the end of the month to record transactions. Write down every single inflow and outflow daily. Whether it is a minor expense for transport or a major customer deposit, document it.

2. Separate Personal and Business Finances
This remains the biggest pitfall for Nigerian entrepreneurs. Open a dedicated corporate bank account for your SME. Pay yourself a fixed salary and resist the temptation to draw cash from the business for personal emergencies.

3. Forecast Cash Flow Weekly
Look ahead 4 to 12 weeks. When are your major expenses due (e.g., shop rent, inventory procurement, staff salaries)? When do you expect customer payments? Preparing a simple cash projection spreadsheet helps you anticipate dry periods before they hit.

4. Accelerate Receivables (Inflow)
Do not extend credit loosely. Offer small discounts for early payments (e.g., 2% off if paid in 5 days) and follow up on outstanding invoices actively. Use WhatsApp and polite reminder emails to prompt clients.

5. Manage Overhead Costs
Keep your fixed costs as low as possible. Consider shared workspaces instead of renting massive offices, or outsource delivery services instead of buying delivery vans and hiring full-time drivers until your volume warrants it.',
  'Cash Flow',
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
  'Instructor Precious',
  6
),
(
  'Excel Bookkeeping Tutorials: Essential Formulas for Small Business Owners',
  'excel-bookkeeping-tutorials-essential-formulas',
  'Learn the core Microsoft Excel formulas and table layouts needed to create a simple, reliable, and automated bookkeeping sheet for your shop or service.',
  'Excel is the most powerful tool in an accountant’s arsenal, and as a business owner, mastering a few formulas will save you hours of manual work. Here is how to build a basic automated bookkeeping sheet.

Key Columns for Your Sheets:
- Date
- Description
- Reference/Invoice No
- Category (Sales, Rent, Electricity, Salaries, etc.)
- Inflow (Income)
- Outflow (Expense)
- Balance

Crucial Formulas to Use:

1. Running Balance Formula:
In your balance column, use the formula:
` || '`=F2 + D3 - E3`' || ` (where F2 is the previous balance, D3 is the inflow, and E3 is the outflow). Drag this formula down.

2. SUMIF for Category Analysis:
To find out how much you spent on "Rent" or made in "Sales", use SUMIF:
` || '`=SUMIF(Category_Range, "Sales", Amount_Range)`' || `
This dynamically sums up values matching the exact criteria.

3. VLOOKUP or XLOOKUP for Invoicing:
Quickly pull item prices from a price list sheet into your invoice generator sheet using VLOOKUP.

Always keep backups of your Excel sheets in the cloud (Google Drive, OneDrive) to avoid losing your financial records if your computer crashes.',
  'Excel',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
  'Instructor Precious',
  5
)
ON CONFLICT (slug) DO NOTHING;
