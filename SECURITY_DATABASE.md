# 🔒 Security & Database Configuration Guide

## Overview
Your BridgeP2P platform now has complete user authentication and individual store management. Here's what's configured:

---

## ✅ What's Implemented

### **1. Authentication System (Firebase)**
- ✓ Email/Password signup and login
- ✓ Google OAuth integration
- ✓ Password reset functionality
- ✓ Email verification
- ✓ Session management
- ✓ Auto-redirect to dashboard after login

### **2. User Account System**
- ✓ Personal profile management (name, bio, email)
- ✓ Individual store creation and management
- ✓ Account status tracking
- ✓ Subscription/trial management

### **3. Store Management**
- ✓ Each user gets their own store with unique URL slug
- ✓ Store analytics (sales, orders, products)
- ✓ Payout tracking (Stripe integration ready)
- ✓ Individual commission tracking (5% default)

### **4. Security Features**
- ✓ Password hashing (Firebase handles)
- ✓ 2FA-ready framework
- ✓ Session management
- ✓ Secure password reset flow
- ✓ Account deletion option
- ✓ CORS protection ready

### **5. Notification System**
- ✓ Order alerts toggle
- ✓ Payout notifications
- ✓ Review notifications
- ✓ Marketing email preferences

---

## 🗄️ Firestore Database Structure

### **Users Collection**
```
users/
  {uid}/
    - uid: "user123"
    - email: "user@example.com"
    - name: "John Doe"
    - bio: "Product creator"
    - plan: "trial" or "pro"
    - trialStart: Timestamp
    - trialEnd: Timestamp
    - storeSetup: boolean
    - storeName: "John's Store"
    - storeSlug: "johns-store"
    - storeDesc: "Ebooks and courses"
    - totalSales: number
    - totalOrders: number
    - commission: 0.05
    - stripeConnected: boolean
    - stripeAccountId: "acct_xxx" (when connected)
    - twoFAEnabled: boolean
    - notifications: {
        orders: true,
        payouts: true,
        reviews: true,
        marketing: true
      }
    - createdAt: Timestamp
    - updatedAt: Timestamp
```

### **Products Collection** (per store)
```
users/{uid}/products/
  {productId}/
    - id: "prod_123"
    - title: "E-Book Title"
    - category: "ebook" or "course" or "template"
    - description: "Full description"
    - price: 19.97
    - originalPrice: 34.99
    - stripeLink: "https://buy.stripe.com/..."
    - downloadUrl: "https://drive.google.com/..."
    - emoji: "📗"
    - badge: "bestseller"
    - status: "published" or "draft"
    - sales: number
    - revenue: number
    - createdAt: Timestamp
    - updatedAt: Timestamp
```

### **Orders Collection** (per store)
```
users/{uid}/orders/
  {orderId}/
    - id: "order_123"
    - buyerEmail: "buyer@example.com"
    - buyerName: "Jane Smith"
    - productId: "prod_123"
    - amount: 19.97
    - stripeSessionId: "cs_test_..."
    - status: "completed" or "refunded"
    - payoutStatus: "pending" or "paid"
    - downloadUrl: "https://drive.google.com/..."
    - createdAt: Timestamp
    - downloadedAt: Timestamp
```

### **Subscribers Collection** (global)
```
subscribers/
  {subId}/
    - email: "subscriber@example.com"
    - subscribedAt: Timestamp
    - status: "active" or "unsubscribed"
```

---

## 🔐 Security Best Practices

### **1. Firestore Security Rules**
Replace the rules in your Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      
      // Products under a user
      match /products/{productId} {
        allow read: if true; // Public read for storefront
        allow write: if request.auth.uid == uid;
      }
      
      // Orders under a user
      match /orders/{orderId} {
        allow read, write: if request.auth.uid == uid;
      }
    }
    
    // Global subscribers (write only for signups)
    match /subscribers/{subId} {
      allow write: if true;
      allow read: if false;
    }
  }
}
```

### **2. Authentication Rules**
- ✓ Passwords: Minimum 8 characters, Firebase enforces strong passwords
- ✓ Email verification: Enable in Firebase Console → Authentication → Email/Password → Email verification
- ✓ Password reset: Automatic email sent by Firebase
- ✓ Brute force protection: Firebase blocks after too many failed attempts

### **3. Store Access Control**
Each user can only:
- View their own store data
- Create/edit/delete their own products
- See their own orders and analytics
- Cannot access other users' stores

### **4. Payment Security**
- ✓ Stripe Payment Links handle all payment processing
- ✓ No credit card data stored in your database
- ✓ Stripe webhooks (setup needed) auto-sync orders

---

## 🛠️ Setup Checklist

### **Step 1: Firebase Project** ✓ Already Configured
- Project ID: `p2p-ebook-empire`
- Auth SDK: Enabled
- Firestore: Enabled
- Storage: Enabled

### **Step 2: Configure Firestore Security**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select `p2p-ebook-empire` project
3. Click **Firestore Database** → **Rules**
4. Copy rules from "Security Rules" section above
5. Click **Publish**

### **Step 3: Enable Authentication Methods**
1. Go to **Authentication** → **Sign-in Method**
2. Enable:
   - ✓ Email/Password
   - ✓ Google
3. Set **Email verification**: OFF (for testing), ON (for production)
4. Set **Password Reset Email**: Customize template

### **Step 4: Configure Storage (for file uploads)**
1. Go to **Storage**
2. Create bucket
3. Configure security rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{uid}/{allPaths=**} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

### **Step 5: Set Up Stripe Webhooks** (Optional, for auto order sync)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **Developers** → **Webhooks** → **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/webhooks/stripe`
4. Events to send:
   - `charge.succeeded`
   - `charge.refunded`
5. Setup Firebase Cloud Function to handle webhook (see advanced section)

---

## 📱 User Flows

### **Registration Flow**
```
User → auth.html (signup)
  ↓
Firebase creates user
  ↓
Creates profile in users/{uid}
  ↓
Redirects to onboarding.html
  ↓
User sets up store
  ↓
Redirects to profile.html (dashboard)
```

### **Login Flow**
```
User → auth.html (signin)
  ↓
Firebase authenticates
  ↓
Check if user.storeSetup == true
  ↓
IF YES → profile.html (dashboard)
IF NO → onboarding.html (setup store)
```

### **Store Creation Flow**
```
User → onboarding.html
  ↓
Fills in store name, slug, description
  ↓
Firebase updates users/{uid} → storeSetup = true
  ↓
Redirects to profile.html
```

### **Product Upload Flow**
```
User → admin.html (admin panel)
  ↓
Login with store credentials
  ↓
Create product in users/{uid}/products/{productId}
  ↓
Paste Stripe Payment Link
  ↓
Add download link (Google Drive, Dropbox, etc.)
  ↓
Product shows on storefront
```

### **Purchase Flow**
```
Customer → index.html (storefront)
  ↓
Browses products
  ↓
Clicks "Buy" → Redirects to Stripe Payment Link
  ↓
Pays on Stripe
  ↓
Stripe redirects to success.html
  ↓
System logs order in users/{uid}/orders/{orderId}
  ↓
Customer gets download link
```

---

## 🚀 Deployment Checklist

### **Before Going Live**

- [ ] Change default admin password in `admin.html` (line 909)
- [ ] Test all authentication flows
- [ ] Test store creation and product upload
- [ ] Configure Firebase security rules (see above)
- [ ] Enable email verification in Firebase
- [ ] Set up Stripe webhook endpoint
- [ ] Configure CORS on your domain
- [ ] Set up SSL certificate (HTTPS required)
- [ ] Test payment flow with Stripe test mode
- [ ] Set up automated daily backups

### **Production Settings**

```javascript
// In Firebase Console → Project Settings → General
- Enable Google Analytics (optional)
- Set up billing alerts
- Enable multi-region backups

// In Authentication
- Enable Email Verification
- Set password requirements: min 8 characters
- Enable account lockout after 5 failed attempts

// In Firestore
- Enable automatic backups
- Set retention: 35 days
```

---

## 📊 Database Queries Reference

### **Get all products for a store:**
```javascript
db.collection('users').doc(userId).collection('products').get()
```

### **Get total sales for a store:**
```javascript
db.collection('users').doc(userId).collection('orders')
  .where('status', '==', 'completed').get()
```

### **Get user's store info:**
```javascript
db.collection('users').doc(userId).get()
```

### **Get all subscribers:**
```javascript
db.collection('subscribers').orderBy('subscribedAt', 'desc').get()
```

---

## 🔧 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Firebase not configured" | Ensure `firebaseConfig` in auth.html matches your Firebase project |
| Login loop | Check Firestore security rules allow user read/write to their own doc |
| Store URL conflicts | Make store slug unique by adding timestamp to duplicate slugs |
| Stripe link not working | Ensure HTTPS domain, add domain to Stripe allowed URLs |
| Payment webhook not firing | Test webhook in Stripe Dashboard → Webhooks → Send test event |

---

## 📚 Next Steps

1. **Set up Firestore security rules** (critical)
2. **Configure Stripe Payment Links** for each product
3. **Test complete purchase flow** with Stripe test cards
4. **Set up email templates** in Firebase Authentication
5. **Configure domain & SSL certificate**
6. **Enable production mode** in Stripe
7. **Set up monitoring & alerts** (optional)

---

## 📞 Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Stripe Payments Guide](https://stripe.com/docs/payments)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Common Auth Issues](https://firebase.google.com/docs/auth/troubleshooting)

**Your platform is ready! 🎉**
