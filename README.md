# ApexScout | Advanced Athletic Scouting & Performance Terminal

ApexScout is a professional-grade MERN stack application designed for the sports industry. It provides a dual-portal ecosystem where athletes can showcase their performance data and scouts can discover, track, and analyze emerging talent using a data-driven approach.

---

## 🎯 Project Vision
ApexScout bridges the gap between raw athletic talent and professional discovery. Traditional scouting is often subjective and fragmented; ApexScout digitizes the "eye test" by converting raw performance metrics into a standardized **Apex Ratio**, allowing scouts to make objective, data-backed decisions across different sports.

## 🛠️ Tech Stack
- **Frontend**: React 18 (Vite), Tailwind CSS, Framer Motion (for physics-based animations), Recharts (data visualization), React Context (Global state).
- **Backend**: Node.js, Express.js (REST architecture).
- **Database**: MongoDB Atlas (Mongoose ODM).
- **UX Components**: `@dnd-kit` (Kanban logic), `react-countup` (Animated metrics), `lucide-react` (Iconography).
- **Security**: JWT Authentication, Helmet (Security headers), Rate Limiting, Mongo Sanitize, XSS Protection.

## ✨ Core Features

### 🏆 Athlete Intelligence Portal
- **The Apex Profile**: Input raw performance metrics (Speed, Vertical Leaps, Stamina).
- **Normalization Engine**: Raw data is automatically converted into a 0-100 percentile scale (Apex Ratio) for cross-sport comparison.
- **Radar Visualization**: Dynamic 6-axis performance footprints powered by Chart.js.
- **Highlight Reel**: Integrated viewer for talent showcases.

### 🕵️ Scout Command Center
- **The Marketplace**: Professional-grade terminal to filter athletes by sport, verification status, and specific performance percentiles.
- **Comparison Terminal**: Side-by-side head-to-head analysis of athlete metrics.
- **Scouting Pipeline**: High-performance Kanban board to manage prospects from **Discovery** to **Signing**.
- **Real-Time Analytics**: An automated dashboard that refreshes metrics (Active Prospects, Contacted rate) instantly as the pipeline changes.

## 🦾 Technical Highlights
- **Global Data Syncing**: Implemented a specialized `AnalyticsContext` that synchronizes pipeline updates from the Kanban board directly to the Dashboard counters without page refreshes.
- **Self-Healing API**: Integrated Axios interceptors with **Retrying Logic** to automatically handle backend "cold starts" and transient network errors on cloud hosting.
- **Optimistic UI**: The Scouting Pipeline reflects drag-and-drop changes immediately, ensuring a zero-latency feel for professional users.

---

## 🚀 Installation & Setup

### 1. Clone & Install
```bash
git clone <repository-url>
cd ApexScout
npm install  # Root dependencies
```

### 2. Backend Config
```bash
cd backend
# Create .env file:
# PORT=5000, MONGO_URI=your_db_uri, JWT_SECRET=your_secret
npm run dev
```

### 3. Frontend Config
```bash
cd ../frontend
# Add VITE_API_URL to your environment variables
npm run dev
```

## 🔌 API Documentation
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/v1/auth/register` | Register new Account |
| GET | `/api/v1/scout/analytics` | Global Scout KPI Metrics |
| PATCH | `/api/v1/scout/pipeline/:id` | Update Athlete Stage |
| GET | `/api/v1/profile` | Manage Athlete Apex Data |

## 📸 Screenshots

### 1. The Command Center (Dashboard)
![Analytics](docs/screenshots/analytics.png)

### 2. Athlete Talent Marketplace
![Marketplace](docs/screenshots/marketplace.png)

### 3. The Scouting Pipeline (Kanban)
![Pipeline](docs/screenshots/pipeline.png)

### 4. Apex Radar Profile
![Radar](docs/screenshots/radar.png)

## 🌐 Deployment
- **Frontend (Vercel)**: Configured for SPA routing via `vercel.json`.
- **Backend (Render)**: Optimized for Node.js production environments.
- **Database (MongoDB Atlas)**: Globally distributed cloud cluster.

### 🔑 Showcase Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Scout** | `scout@apex.com` | `password123` |
| **Athlete** | `marcus@apex.com` | `password123` |

---
*Developed for the Full Stack Development Course Showcase.*

