# Cloudinary Setup Guide

## Why Cloudinary?
- **Free Tier**: 25GB storage + 25GB bandwidth/month
- **Original Format Preserved**: PDFs, Word docs, images stay exactly as uploaded
- **Easy Viewing**: Direct URLs to view/download CVs
- **Secure**: Built-in security features
- **Future-ready**: Perfect for AI analysis later

## Setup Steps

### 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email

### 2. Get Your Credentials
1. In your Cloudinary dashboard, go to "Settings" → "API Keys"
2. Copy your:
   - Cloud Name
   - API Key
   - API Secret

### 3. Add to Environment Variables
Add these to your `.env` file in the backend folder:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Test the Setup
1. Start your backend server
2. Try signing up as a student with a CV
3. Check the admin panel to view the uploaded CV

## Features Implemented

### For Students:
- ✅ CV upload (PDF, DOC, DOCX, JPG, PNG)
- ✅ File size validation (10MB max)
- ✅ File type validation
- ✅ Original format preserved
- ✅ Easy viewing in admin panel

### For Startups:
- ✅ Company description field
- ✅ Website URL field (optional)
- ✅ Easy viewing in admin panel

### Admin Panel:
- ✅ CV/Company info column in user table
- ✅ Detailed user view modal
- ✅ Direct CV viewing/downloading
- ✅ Company information display

## Storage Efficiency
- **MongoDB**: Only stores metadata (~1KB per CV)
- **Cloudinary**: Stores actual files (unlimited on free tier)
- **Total Cost**: $0/month

## Security
- Files are stored securely on Cloudinary
- Direct access only through admin panel
- No public access to CVs
