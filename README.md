# The N50K Blueprint — Sales Page

Complete conversion-optimised sales page. Vite + React → deploys to Vercel in minutes.

---

## 🗄️ Step 1: Set Up Supabase (5 minutes)

1. Go to **supabase.com** → Your project → **SQL Editor**
2. Click **New Query**
3. Paste the entire contents of **`SUPABASE_SETUP.sql`** into the editor
4. Click **Run**
5. You'll see a confirmation table — setup complete!

---

## 🔑 Step 2: Get Your Supabase Anon Key

1. In Supabase → **Settings → API**
2. Copy the **anon public** key (the shorter one — NOT the service_role key)

---

## ⚙️ Step 3: Configure Environment Variables

```
cp .env.example .env
```

Edit `.env` with your values:
```
VITE_PAYSTACK_PUBLIC_KEY=pk_live_33dadf4fcc7b6423310fa4217b8d3897055a2b7a
VITE_SUPABASE_URL=https://zisbhfwxaiqtxtkecyow.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_PDF_DOWNLOAD_URL=https://your-pdf-hosting-url.com/blueprint.pdf
```

---

## 📄 Step 4: Host Your PDF

Upload the N50K Blueprint PDF somewhere public:
- **Supabase Storage** (easiest): Dashboard → Storage → New bucket → Upload → Copy URL
- **Google Drive**: Upload → Share with anyone → Get direct download link
- **Cloudflare R2**: Fast CDN with free tier

Paste the URL into VITE_PDF_DOWNLOAD_URL.

---

## 🚀 Step 5: Deploy to Vercel

1. Push project to GitHub
2. vercel.com → Add New Project → Import repo
3. Add your 4 environment variables in Vercel Settings
4. Deploy — live in 60 seconds

Or use CLI:
```
npm i -g vercel && vercel --prod
```

---

## 💻 Run Locally

```
npm install
npm run dev
```

Visit http://localhost:5173

---

© 2025 The N50K Blueprint · All Rights Reserved
