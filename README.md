# Momentum - Cross-Platform Goal Tracker

A modern, professional goal-tracking PWA with rewards, ads, and premium subscriptions.

## 🚀 Features

- **Goal Management**: Create, edit, delete, and track goals with progress visualization
- **Reward System**: Earn points and badges for achieving milestones
- **Monetization**: Ad-supported free tier, premium subscription via Paddle
- **PWA Support**: Installable on mobile and desktop
- **Dark Mode**: Persistent theme switching
- **Responsive Design**: Works seamlessly on all devices

## 🛠 Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18 + TypeScript
- TailwindCSS + ShadCN/UI
- Framer Motion
- React Query
- PWA support

### Backend
- FastAPI (Python 3.11+)
- PostgreSQL
- JWT Authentication
- Paddle Payments
- SQLAlchemy

## 📁 Project Structure

```
momentum/
├── frontend/          # Next.js app
├── backend/           # FastAPI server
├── docker-compose.yml # Local development
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL
- Docker (optional)

### Option 1: Docker Setup (Recommended)
```bash
# Make setup script executable (Linux/Mac)
chmod +x setup.sh
./setup.sh

# Or run manually
docker-compose up -d
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### Database Setup
- **Local**: Use PostgreSQL with connection string in `.env`
- **Cloud**: Use Supabase or Neon (see DEPLOYMENT.md)

## 🌐 Deployment

- **Frontend**: Vercel
- **Backend**: Render/Railway
- **Database**: Supabase/Neon
- **Payments**: Paddle

## 📝 Environment Variables

See `.env.example` files in frontend and backend directories.