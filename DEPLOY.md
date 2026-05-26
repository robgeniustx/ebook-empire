# P2P ebook empire — Go Live Guide

## What You Have
| File | Purpose |
|------|---------|
| `index.html` | Your storefront — product grid, cart, hero |
| `admin.html` | Your private dashboard — manage products, orders, emails |
| `checkout.html` | Multi-item cart checkout page |
| `success.html` | Post-purchase download delivery page |

---

## STEP 1 — Set Up Your Stripe Account (Free)

1. Go to **stripe.com** → Sign up (free account, no monthly fees)
2. Complete identity verification
3. Go to **Dashboard → Payment Links → + New**
4. Create one Payment Link per product:
   - Set the price
   - Set the **Confirmation page** to "Custom URL":
     ```
     https://yourdomain.com/success.html?product=PRODUCT_ID
     ```
   - Replace `PRODUCT_ID` with the product's ID number (1–6, visible in admin panel)
5. Copy each Payment Link URL (looks like `https://buy.stripe.com/xxxxx`)

---

## STEP 2 — Add Stripe Links to Your Products

1. Open **admin.html** in your browser
2. Login: `admin@p2pebookempire.com` / `P2Pebook2025!`
3. Go to **Products** → Click **Edit** on each product
4. Paste the Stripe Payment Link into the "Stripe Payment Link" field
5. Paste your Google Drive / Dropbox download URL into "Download File URL"
6. Click **Save Product**
7. Change admin password in **Settings → Security** before going live

---

## STEP 3 — Host Your Site Free (Netlify — Recommended)

### Option A: Drag and Drop (2 minutes, no coding)
1. Go to **netlify.com** → Sign up free
2. Click **"Add new site" → "Deploy manually"**
3. Drag the entire `p2p-ebook-empire` folder into the upload zone
4. Your site is live instantly at a random `.netlify.app` URL

### Option B: Connect to GitHub (auto-deploys on changes)
1. Create a free account at **github.com**
2. Create a new repository named `p2p-ebook-empire`
3. Upload all files to the repo
4. Go to **netlify.com** → New Site → Import from Git → Select your repo
5. Click Deploy

---

## STEP 4 — Add Your Custom Domain

### Domain: p2pebookempire.com ✅ Configured

#### **Namecheap DNS Setup Instructions**

**STEP 1: Access Namecheap Dashboard**
1. Go to **namecheap.com** and sign in to your account
2. Click **"Domain List"** in the left sidebar
3. Find **p2pebookempire.com** and click the **arrow (>)** to expand it
4. Click **"Manage"** next to the domain

**STEP 2: Update DNS Records**
1. Go to the **"Advanced DNS"** tab
2. Look for existing records and delete any that conflict
3. Add these two records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.19.38 (Netlify IP) | 3600 |
| CNAME | www | p2pebookempire.netlify.app | 3600 |

**STEP 3: Configure in Netlify**
1. Go to **netlify.com** → Your Site Dashboard
2. Click **"Domain settings"** → **"Add custom domain"**
3. Enter `p2pebookempire.com`
4. Wait for DNS propagation (usually 5-30 minutes)

**STEP 4: Enable HTTPS**
1. In Netlify, under **"Domain management"**, click **"Set up Netlify DNS"** OR
2. Let Netlify auto-detect and provision an SSL certificate (automatic, free)
3. Once propagated, your site is live at **https://p2pebookempire.com**

**Verification**
- DNS propagation typically takes 5-30 minutes
- Check status: Use `nslookup p2pebookempire.com` or visit https://whatsmydns.net
- Your site should be accessible at: **https://p2pebookempire.com**

---

## STEP 5 — Upload Your Product Files

1. Go to **Google Drive** (free 15GB) or **Dropbox** (free 2GB)
2. Upload each PDF/zip file
3. Right-click → **Share → "Anyone with the link"**
4. Copy the shareable link
5. In admin panel → Edit each product → paste link in "Download File URL"

---

## STEP 6 — Go Live Checklist

- [ ] All Stripe Payment Links added to products
- [ ] All download URLs added to products
- [ ] Admin password changed from default
- [ ] Support email confirmed correct (robertg@xlr8pressurewashing.com)
- [ ] Site tested on mobile
- [ ] One test purchase completed to verify download delivery
- [ ] success.html URL added to Stripe Payment Links as confirmation URL

---

## Monthly Costs Breakdown

| Service | Cost |
|---------|------|
| Netlify hosting | **FREE** |
| SSL/HTTPS | **FREE** (via Netlify) |
| Stripe | **FREE** (2.9% + 30¢ per sale — no monthly fee) |
| Domain name | ~$10/year (optional) |
| Google Drive (file hosting) | **FREE** up to 15GB |
| **Total ongoing cost** | **$0–$10/year** |

Compare to: Shopify ($39/mo) + Stan.store ($29/mo) + transaction fees = $800+/year

---

## Domain Configuration Status

✅ **Domain**: p2pebookempire.com  
✅ **Registrar**: Namecheap  
✅ **Hosting**: Netlify (free tier)  
✅ **SSL**: Automatic via Netlify  
⏳ **Status**: Ready for DNS configuration (see STEP 4 above)

---

## Adding Products Later

1. Open `admin.html`
2. Click **+ Add Product**

---

## Quick Troubleshooting

**Q: My domain isn't loading after 30 minutes**
- DNS cache may need clearing: Restart your browser or use `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

**Q: I see Netlify's default page instead of my store**
- Verify the CNAME record is correctly set in Namecheap DNS
- Check Netlify → "Domain settings" to confirm custom domain is added

**Q: SSL certificate won't provision**
- Wait up to 1 hour for Netlify to detect the domain
- If still not working, go to Netlify → Domains → Force HTTPS setup
3. Fill out the form, paste Stripe link and download URL
4. Save — product appears on storefront immediately (same browser/domain)

> Note: Products are stored in browser localStorage. To sync across devices or make them permanent, the next upgrade is a simple backend (Firebase free tier or Supabase free tier — happy to build that whenever you're ready).

---

## Support

Questions? Robert Green · robertg@xlr8pressurewashing.com
