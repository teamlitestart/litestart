# API Setup Guide

## Current Status

The website now works in both development and production environments:

### ✅ Development Mode
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- Full API functionality with MongoDB

### ✅ Production Mode (Live Website)
- Frontend: GitHub Pages
- Backend: Fallback to localStorage
- Signup functionality works without backend
- Admin panel works with local data

## How It Works

### Development
When running locally (`npm run dev`), the app automatically connects to `http://localhost:3001` for API calls.

### Production
When deployed to GitHub Pages, the app uses localStorage as a fallback:
- Signups are stored in browser localStorage
- Admin panel can view/manage local signups
- No backend required for basic functionality

## To Add Backend to Production

1. **Deploy your backend** to a service like:
   - Heroku
   - Railway
   - Render
   - Vercel
   - Netlify Functions

2. **Set environment variable** in your GitHub repository:
   - Go to Settings → Secrets and variables → Actions
   - Add `VITE_API_URL` with your backend URL
   - Example: `https://your-backend.herokuapp.com`

3. **The app will automatically**:
   - Use the backend when `VITE_API_URL` is set
   - Fall back to localStorage when no backend is available

## Current Features

### ✅ Working in Production
- Signup form (stores in localStorage)
- Admin panel (views local data)
- All static pages
- Email verification (simulated)

### 🔄 Will Work with Backend
- Real database storage
- Email verification
- User management
- Analytics

## Testing

You can test the current setup by:
1. Opening the live website
2. Filling out the signup form
3. Checking the admin panel at `/admin`
4. Viewing stored signups in browser localStorage 