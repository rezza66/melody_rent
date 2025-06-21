# 🎵 Melody Rent

**Melody Rent** is a full-stack web application for managing product rentals. It provides user-friendly features for browsing, booking, and managing items, with an integrated dashboard.

## ✨ Features

- ✅ User authentication (JWT + Passport)
- 🎸 Browse and rent items
- 💳 Payment gateway (Midtrans integration)
- 📊 Admin dashboard (charts, analytics)
- 🌤️ Upload product images via Cloudinary
- 🧾 Role-based access with CASL
- 🔐 Protected routes with Redux & Persist)

## 🛠️ Technology

**Backend:**

- Express.js, MongoDB + Mongoose
- Passport + JWT (Auth)
- Midtrans (payment)
- Cloudinary + Multer (upload)
- Joi (validation)
- CASL (authorization)
- Dotenv, CORS

**Frontend:**

- React 18, Vite, Tailwind CSS
- React Router DOM v7
- Redux Toolkit + Persist
- Axios
- Recharts & Chart.js
- SweetAlert2

## 🚀 Quick Start

### 1. Clone the repository

- git clone https://github.com/rezza66/melody_rent.git
- cd melody_rent

2. Run the backend
   
- cd backend
- npm install
- npm run dev

3. Run the frontend

- cd frontend
- npm install
- npm run dev

📦 *Note*: Backend uses `nodemon` for development. Make sure it is installed globally or locally.

## ⚙️ Environment Variables

Create a .env file in the backend folder as follows:

- PORT=5001
- MONGO_URI=your_mongo_uri
- ADMIN_PASSWORD=your_admin_password

Create a .env file in the frontend folder as follows:

- VITE_BASE_URL=your_base_url
- VITE_IMAGE_BASE_URL=your_image_base_url
