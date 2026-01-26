<p align="center">
  <img src="public/litestart_chameleon_logo.png" alt="LiteStart Logo" width="120" />
</p>

<h1 align="center">LiteStart</h1>

<p align="center">
  <strong>Micro-internships that move fast.</strong><br/>
  Connecting ambitious university students with early-stage startups for short-term, high-impact projects.
</p>

<p align="center">
  <a href="https://www.litestart.co.uk">🌐 Live Demo</a> •
  <a href="#features">✨ Features</a> •
  <a href="#tech-stack">🛠 Tech Stack</a> •
  <a href="#getting-started">🚀 Getting Started</a>
</p>

---

## 🎯 What is LiteStart?

LiteStart is a **micro-internship marketplace** that bridges the gap between university students seeking real-world experience and startups needing agile, cost-effective talent. Unlike traditional internships that demand months of commitment, LiteStart offers **1–3 week project-based placements** — structured, outcome-focused, and designed to fit around student schedules.

Born out of the Bristol entrepreneurial ecosystem, LiteStart is redefining how early-stage companies access talent and how students build career-defining portfolios.

---

## ✨ Features

### For Startups
- **🎯 AI-Powered Matching** — Get matched with pre-vetted university talent based on skills, availability, and project fit
- **⚡ Fast Turnaround** — From posting to project kickoff in days, not months
- **📋 Project-Based Hiring** — Define scope, timeline, and deliverables upfront
- **💰 Cost-Effective** — Access premium talent at startup-friendly rates

### For Students
- **🎓 University-Verified Profiles** — Showcase your skills with verified academic credentials
- **📁 CV Upload & Portfolio** — Upload your CV and build a portfolio of real work
- **🔔 Smart Job Alerts** — Get notified about opportunities matching your skills
- **🏆 Build Real Experience** — Work on actual startup projects, not hypotheticals

### Platform Features
- **🔐 Secure Authentication** — JWT-based auth with email verification
- **☁️ Cloud CV Storage** — Cloudinary-powered document management
- **📊 Analytics Dashboard** — Track applications, matches, and engagement
- **📧 Email Notifications** — Automated updates via Nodemailer

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS |
| **Routing** | React Router v6 |
| **Backend** | Node.js + Express 5 |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT + bcrypt |
| **File Storage** | Cloudinary |
| **Email** | Nodemailer |
| **Deployment** | GitHub Pages (Frontend) + Render (Backend) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for CV uploads)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/litestart.git
cd litestart

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the `/backend` directory:

```env
# MongoDB
MONGO_URI=mongodb+srv://your-connection-string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# JWT
JWT_SECRET=your-jwt-secret

# Email (optional)
EMAIL_USER=your-email
EMAIL_PASS=your-app-password
```

### Running Locally

```bash
# Terminal 1: Start the backend
cd backend
npm start

# Terminal 2: Start the frontend
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |

---

## 🌐 Deployment

| Environment | URL | Platform |
|-------------|-----|----------|
| **Production (Frontend)** | [litestart.co.uk](https://www.litestart.co.uk) | GitHub Pages |
| **Production (Backend)** | litestart-backend.onrender.com | Render |

### Deploy Frontend
```bash
npm run build
npm run deploy
```

### Deploy Backend
Push to `main` branch — Render auto-deploys via `render.yaml`.

---

## 📁 Project Structure

```
litestart/
├── src/
│   ├── components/       # React components
│   ├── contexts/         # Auth context
│   ├── config/           # API & analytics config
│   └── services/         # Google Analytics
├── backend/
│   ├── models/           # Mongoose schemas
│   ├── services/         # Cloudinary, Email services
│   └── index.js          # Express server
├── public/               # Static assets
└── dist/                 # Production build
```

---

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, new features, or documentation improvements — open a PR and let's build together.

---

## 📄 License

MIT License — feel free to use this project as inspiration for your own ventures.

---

<p align="center">
  <strong>Built with ❤️ in Bristol, UK</strong><br/>
  <em>Empowering the next generation of talent and founders.</em>
</p>

