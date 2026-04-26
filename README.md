# 🩸 HemoLink: The Intelligent Blood Network

**HemoLink** is a mission-critical, full-stack logistics platform designed to coordinate emergency blood transfers between hospitals in real-time. By leveraging satellite mapping and an intelligent prioritization engine, HemoLink ensures that the right blood type reaches the right patient at the right time.

## 🚀 Live Deployment
The platform is actively deployed and serving traffic:
**[https://hemolink-backend-759165048111.asia-south1.run.app/](https://hemolink-backend-759165048111.asia-south1.run.app/)**

---

## ✨ Key Features
- **Live Satellite Map**: Real-time visualization of the hospital network using the Google Maps API.
- **Emergency Priority Engine**: Smart sorting of blood requests based on urgency and type rarity.
- **Digital Inventory Management**: Hospitals can track and update their blood stock in real-time.
- **Instant Broadcast**: Push-notification style alerts for critical blood shortages.
- **Premium UI**: High-contrast, accessibility-focused design for high-pressure medical environments.

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite), TailwindCSS, Lucide-Icons, Google Maps JS API.
- **Backend**: Node.js, Express.
- **Database**: MongoDB Atlas (Global Cluster).
- **Infrastructure**: Google Cloud Platform (GCP).
- **Deployment**: Google Cloud Run (Serverless Containerization).

---

## 📦 Deployment Instructions

This project is configured for seamless deployment to **Google Cloud Run**.

### 1. Build & Push Image
```powershell
gcloud builds submit --tag gcr.io/hemolink-494510/hemolink-backend .
```

### 2. Deploy to Cloud Run
```powershell
gcloud run deploy hemolink-backend `
  --image gcr.io/hemolink-494510/hemolink-backend `
  --platform managed `
  --region asia-south1 `
  --allow-unauthenticated `
  --set-env-vars="GOOGLE_MAPS_API_KEY=YOUR_KEY,MONGODB_URI=YOUR_URI"
```

### 3. Database Security
Ensure your **MongoDB Atlas Network Access** includes the whitelist for `0.0.0.0/0` to allow Cloud Run's dynamic IP range to communicate with the database.

---

## 👨‍💻 Project Structure
- `/frontend`: React application (Client-side)
- `/backend`: Node.js API & Static File Server
- `backend/dist`: Production-built frontend assets
- `backend/models`: MongoDB Schemas
- `backend/seed.js`: Initial data population script

---

## 📜 License
This project is part of a life-saving initiative. All rights reserved.
