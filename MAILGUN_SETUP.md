# Mailgun Email Setup Guide

## 🚀 Quick Setup

### 1. Get Mailgun Credentials
- **Go to Mailgun Dashboard** → Sending → SMTP
- **Copy your SMTP credentials:**
  - SMTP Username
  - SMTP Password

### 2. Add to Render Environment Variables
In your Render dashboard, add these environment variables:

```
MAILGUN_SMTP_USER=your_smtp_username_from_mailgun
MAILGUN_SMTP_PASS=your_smtp_password_from_mailgun
MAILGUN_FROM_EMAIL=noreply@litestart.co.uk
```

### 3. Configure Webhooks for Bounce Detection
- **Go to Mailgun Dashboard** → Webhooks
- **Add new webhook** for bounce events:
  - **URL**: `https://litestart-backend.onrender.com/api/email-bounce`
  - **Events**: Select "Bounces" and "Complaints"
- **Add new webhook** for complaint events:
  - **URL**: `https://litestart-backend.onrender.com/api/email-complaint`
  - **Events**: Select "Complaints"

### 4. Test Email System
- **Sign up on your website**
- **Check if thank you email is sent**
- **Check Render logs** for any errors

## 📧 Email Features

### ✅ What Works Now:
- **Thank you emails** sent automatically
- **Professional from address** (`noreply@litestart.co.uk`)
- **HTML formatted emails** with branding
- **Bounce detection** - automatically marks invalid emails as unverified
- **Complaint detection** - handles spam reports

### ⏳ What Works After CNAME Verification:
- **Email tracking** (opens, clicks)
- **Analytics dashboard**
- **Unsubscribe handling**

## 🔧 Troubleshooting

### Common Issues:
1. **"Authentication failed"** - Check SMTP credentials
2. **"Invalid from address"** - Ensure domain is verified
3. **"Connection timeout"** - Check firewall/network
4. **"Webhooks not working"** - Check webhook URLs and events

### Check Render Logs:
- **Go to Render dashboard**
- **Click on your service**
- **View logs** for email errors and bounce processing

## 📋 Environment Variables Summary

```
MONGO_URI=mongodb+srv://Project-Scott-Reece:InternBES25@project.q0lhe0r.mongodb.net/project1?retryWrites=true&w=majority&appName=Project
PORT=3001
NODE_ENV=production
MAILGUN_SMTP_USER=your_mailgun_smtp_username
MAILGUN_SMTP_PASS=your_mailgun_smtp_password
MAILGUN_FROM_EMAIL=noreply@litestart.co.uk
```

## 🎯 Next Steps

1. **Add Mailgun credentials** to Render
2. **Configure webhooks** for bounce detection
3. **Test signup** on your website
4. **Check email delivery** and bounce processing
5. **Wait for CNAME verification** (24-48 hours)
6. **Enjoy automatic email validation!**

## 🔄 How Bounce Detection Works

### Email Flow:
1. **User signs up** → Email sent immediately
2. **Email delivered** → User marked as verified
3. **Email bounces** → Webhook triggers, user marked as unverified
4. **Admin panel updates** → Shows real-time verification status

### Benefits:
- ✅ **No false positives** - Real users get emails
- ✅ **Automatic cleanup** - Fake emails detected via bounces
- ✅ **Real-time updates** - Verification status updates automatically
- ✅ **Better user experience** - Users get immediate confirmation 