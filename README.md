# 🔥 FitTrack — Fitness Tracking Mobile App

![React Native](https://img.shields.io/badge/React%20Native-Expo-000000?style=for-the-badge\&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge\&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge\&logo=mongodb)
![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)

> *"Discipline is the only currency that never devalues."*

FitTrack is a **full-stack fitness SaaS-style mobile application** built with **React Native (Expo)**, **Node.js**, and **MongoDB**. It simulates a premium fitness coaching system with tracking, analytics, and structured workout programs.

Designed for **MAD (Mobile Application Development) university coursework**, but structured like a production-grade SaaS product.

---

## 🚀 Live Concept

A dark, cinematic fitness platform that behaves like a **personal AI training system**:

* Track workouts like a professional athlete
* Monitor hydration like performance optimization systems
* Calculate BMI and fitness status instantly
* Maintain progressive overload tracking

---

## 📱 Key Features

### Core System

* 🔐 Secure Authentication (JWT-based)
* 🏋️ Structured Workout Engine (8 muscle groups)
* 📊 Real-time Progress Tracking
* 💧 Smart Water Intake System
* ⚖️ BMI Calculator with fitness classification

### UX / Product Layer

* 🎯 SaaS-style dashboard UI
* ⚡ Dark performance-focused interface
* 📈 Analytics-driven workout history
* 💬 Motivational training system messages

---

## 🧠 System Architecture

```
Frontend (React Native Expo)
        ↓ Axios API
Backend (Node.js + Express)
        ↓ Mongoose ORM
MongoDB Database (Local / Atlas)
```

---

## 🛠 Tech Stack

### Frontend

* React Native (Expo SDK)
* React Navigation (Stack + Tabs)
* Axios
* AsyncStorage
* Expo Linear Gradient
* Ionicons

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* bcrypt.js

---

## 📸 UI Preview

> Add screenshots here before submission

```
/assets/screenshots/home.png
/assets/screenshots/workouts.png
/assets/screenshots/progress.png
```

---

## 📁 Project Structure

```
fittrack/
├── frontend/
│   ├── screens/
│   ├── navigation/
│   ├── components/
│   ├── services/
│   └── assets/
│
└── backend/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    └── server.js
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-username/FitTrack-Fitness-Tracking-Mobile-App.git
cd FitTrack-Fitness-Tracking-Mobile-App
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/fittrack
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

Run backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npx expo start
```

---

## 🗄 Database Setup

### Local MongoDB

```
mongodb://localhost:27017/fittrack
```

### Seed Database

```bash
cd backend
node seed.js
```

---

## 📡 API Architecture

### Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`

### Workouts

* GET `/api/workouts/categories`
* GET `/api/workouts/:category`
* POST `/api/workouts/seed`

### Progress

* POST `/api/progress`
* GET `/api/progress`

### Water Tracking

* POST `/api/water/add`
* GET `/api/water/today`

---

## 🧭 App Flow

```
Splash → Login/Register → Dashboard
        ↓
   Home (Stats)
        ↓
 Workouts → Exercise Detail → Log
        ↓
 Progress Analytics
        ↓
 Profile Management
```

---

## 🎨 Design System

* Background: `#0A0A0A`
* Primary Accent: Bronze / Gold tones
* UI Style: Dark, cinematic, performance-focused
* Tone: Motivational / discipline-driven

---

## 🧪 Testing Notes

* Ensure backend is running before Expo start
* Use same WiFi for mobile testing
* Seed database before first run

---

## 🐛 Common Issues

* API error → verify `BASE_URL`
* Expo crash → `npx expo start --clear`
* MongoDB error → ensure service running

---

## 👨‍💻 Author

Developed by **Muhammad Suleman Shahid (msulemandanish@gmail.com)**

> Built with discipline. Designed for performance.

---

## 📜 License

Educational use only.
