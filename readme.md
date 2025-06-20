🎵 Melody Rent – Rental App
**Melody Rent** is a full-stack web application for managing product rentals. It provides user-friendly features for browsing, booking, and managing items, with an integrated dashboard.

✨ Fitur
- ✅ User authentication (JWT + Passport)
- 🎸 Browse and rent items
- 💳 Payment gateway (Midtrans integration)
- 📊 Admin dashboard (charts, analytics)
- 🌤️ Upload product images via Cloudinary
- 🧾 Role-based access with CASL
- 🔐 Protected routes with Redux & Persist)

🛠️ Teknologi
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

🚀 Cara Menjalankan
1. Clone project
git clone https://github.com/rezza66/melody_rent.git
cd melody_rent
2. Jalankan backend
cd backend
npm install
npm run dev
3. Jalankan frontend
cd ../frontend
npm install
npm run dev

📦 *Note*: Backend menggunakan `nodemon` untuk development. Pastikan sudah ter-install secara global atau lokal.

⚙️ Konfigurasi .env
Buat file .env di folder backend seperti berikut:
PORT=5001
MONGO_URI=your_mongo_uri
ADMIN_PASSWORD=your_admin_password

Buat file .env di folder frontend seperti berikut:
VITE_BASE_URL=your_base_url
VITE_IMAGE_BASE_URL=your_image_base_url

🧑‍💻 Author
Reza Pratama
