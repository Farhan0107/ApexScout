# ApexScout | Advanced Athletic Scouting & Performance Terminal

ApexScout is a professional-grade MERN stack application designed for the sports industry. It provides a dual-portal ecosystem where athletes can showcase their performance data and scouts can discover, track, and analyze emerging talent using a data-driven approach.

## 🎯 Problem Statement
Traditional scouting often relies on fragmented data, subjective observations, and inefficient communication channels. Emerging athletes struggle to get noticed, while scouts spend excessive time managing spreadsheets instead of analyzing talent. ApexScout solves this by providing a centralized, verified platform for performance analytics and talent pipeline management.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Recharts, Lucide-react
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: JWT Authentication, Bcrypt, Helmet, Rate Limiting, Mongo Sanitize

## ✨ Key Features

### 🏆 Athlete Portal
- **Performance Input**: A structured form to log raw metrics (Speed, Vertical Leap, etc.).
- **Dynamic Visualization**: Automated radar charts that visualize normalized performance metrics.
- **Media Highlights**: Integrated media viewer for highlight reels.

### 🕵️ Scout Terminal
- **Marketplace**: Advanced search and filtering terminal to discover talent across multiple sports.
- **Comparison Engine**: Head-to-head analysis of athlete metrics via specialized modals.
- **Watchlist Pipeline**: A Kanban-style management system to track prospects from discovery to signing.
- **Scout Analytics**: High-level dashboard showing pipeline distribution and top-rated prospects.

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Clone the repository
```bash
git clone <repository-url>
cd ApexScout
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env file based on .env.example
npm run seed  # Populate sample data
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

## 🔌 API Overview
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/v1/auth/register` | Register new user (Scout/Athlete) |
| POST | `/api/v1/auth/login` | Authenticate user and get JWT |
| GET | `/api/v1/scout/analytics` | Fetch analytics for scout dashboard |
| GET | `/api/v1/profile/me` | Fetch athlete profile and metrics |

## �️ Screenshots

### Landing Page
![Landing](docs/screenshots/landing.png)

### Scout Marketplace
![Marketplace](docs/screenshots/marketplace.png)

### Athlete Radar Profile
![Radar](docs/screenshots/radar.png)

### Scout Pipeline Board
![Pipeline](docs/screenshots/pipeline.png)

### Scout Analytics Dashboard
![Analytics](docs/screenshots/analytics.png)

## 🌐 Live Demo

- **Frontend (Vercel)**: [https://your-vercel-url](https://your-vercel-url)
- **Backend (Render)**: [https://your-render-api-url](https://your-render-api-url)

### 🔑 Demo Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Scout** | `scout@apex.com` | `password123` |
| **Athlete** | `marcus@apex.com` | `password123` |

## �🔮 Future Enhancements
- **Real-time Chat**: Direct messaging between scouts and athletes.
- **AI Talent Prediction**: Predict future performance based on developmental trends.
- **Video Processing**: Automated tagging of highlight reels using computer vision.

---
*Created for the Full Stack Development Course Showcase.*
