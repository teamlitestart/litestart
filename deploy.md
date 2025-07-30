# Deployment Guide for LiteStart Backend

## Deploying to Render

1. **Connect your GitHub repository to Render:**
   - Go to [render.com](https://render.com)
   - Sign up/Login with your GitHub account
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository

2. **Configure the service:**
   - **Name:** `litestart-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Plan:** Free

3. **Environment Variables:**
   - `MONGO_URI`: `mongodb+srv://Project-Scott-Reece:InternBES25@project.q0lhe0r.mongodb.net/project1?retryWrites=true&w=majority&appName=Project`
   - `NODE_ENV`: `production`
   - `PORT`: `10000`

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically deploy your backend

5. **Update Frontend:**
   - The frontend is already configured to use the Render URL in production
   - Deploy your frontend to your preferred hosting service (Vercel, Netlify, etc.)

## Testing the Connection

Once deployed, you can test the API endpoints:

- **Health Check:** `https://litestart-backend.onrender.com/`
- **Signup:** `POST https://litestart-backend.onrender.com/api/signup`
- **Get Users:** `GET https://litestart-backend.onrender.com/api/users`

## Local Development

To run locally:
```bash
cd backend
npm install
npm start
```

The frontend will automatically use `http://localhost:3001` in development mode. 