# 🚀 Vercel Deployment Guide (ভ্যার্সেল ডিপ্লয়মেন্ট গাইড)

এই অ্যাপটি **Vercel**-এ খুব সহজে ১ ক্লিকে ডিপ্লয় (Live) করার জন্য প্রস্তুত করা হয়েছে।

---

## 🇧🇩 বাংলা নির্দেশিকা (বাংলায় সহজে ডিপ্লয় করুন):

### ধাপ ১: গিটহাবে কোড আপলোড করুন (GitHub)
1. এই প্রোজেক্টের কোড আপনার **GitHub** একাউন্টে একটি নতুন Repository তৈরি করে Push / Upload করুন।

### ধাপ ২: Vercel-এ লগইন করুন
1. [vercel.com](https://vercel.com) ওয়েবসাইটে যান।
2. আপনার GitHub অ্যাকাউন্ট দিয়ে **Sign Up** অথবা **Log In** করুন।

### ধাপ ৩: প্রোজেক্ট Import করুন
1. Vercel ড্যাশবোর্ডে **"Add New..."** -> **"Project"** বাটনে ক্লিক করুন।
2. আপনার GitHub Repository সিলেক্ট করে **"Import"** এ ক্লিক করুন।

### ধাপ ৪: সেটিংস যাচাই ও Deploy
- **Framework Preset**: `Vite` (Vercel স্বয়ংক্রিয়ভাবে এটি সনাক্ত করবে)
- **Root Directory**: `./` (ডিফল্ট)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- Firebase কনফিগারেশন অলরেডি `firebase-applet-config.json`-এ যুক্ত আছে, তাই আলাদা কোনো Environment Variable যোগ না করলেও সাইট সম্পূর্ণ সচল থাকবে!
- এবার নিচে থাকা **"Deploy"** বাটনে ক্লিক করুন।

১ মিনিটের মধ্যে আপনার ওয়েবসাইট লাইভ হয়ে একটি ফ্রি ডোমেইন (যেমন: `your-store.vercel.app`) তৈরি হয়ে যাবে! 🎉

---

## 🇬🇧 English Guide:

1. **Push to GitHub**: Push this project repository to your GitHub account.
2. **Login to Vercel**: Head over to [vercel.com](https://vercel.com) and log in with GitHub.
3. **Import Project**: Click **"Add New..."** -> **"Project"**, select this repository, and click **"Import"**.
4. **Deploy**:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - The included `vercel.json` ensures full Single Page Application routing (no 404 on reload) and caching.
   - Click **Deploy**!
