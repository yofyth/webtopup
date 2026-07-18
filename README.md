# 🎮 YofyTopup — Game Top-Up Website

Website top-up game full-stack dengan sistem wallet, flash deals, dan simulasi payment gateway, dibangun menggunakan Laravel, React, dan Inertia.js.

---

## 📖 Tentang Project

YofyTopup adalah platform top-up game yang memungkinkan pengguna melakukan pembelian item/voucher game secara online. Website ini dilengkapi dengan sistem wallet internal (BagusCoins), promo flash deals, serta dashboard admin untuk mengelola produk, banner, dan transaksi.

---

## ✨ Fitur

- 💰 **BagusCoins** — sistem wallet internal untuk transaksi
- ⚡ **Flash Deals** — promo top-up dengan waktu terbatas
- 🔐 **Two-role authentication** — akses terpisah untuk admin dan customer
- 🖼️ **Banner carousel CMS** — pengelolaan banner promosi melalui dashboard admin
- 💳 **Payment gateway** — integrasi Tripay (mode simulasi, siap dikonfigurasi ke production)

---

## 🛠️ Tech Stack

- **Backend:** Laravel 13
- **Frontend:** React + Inertia.js
- **Styling:** Tailwind CSS
- **Bundler:** Vite

---

## 🚀 Setup & Instalasi

### 1. Clone repository

\`\`\`bash
git clone https://github.com/yofyth/webtopup.git
cd webtopup
\`\`\`

### 2. Install dependencies PHP

\`\`\`bash
composer install
\`\`\`

### 3. Install dependencies JavaScript

\`\`\`bash
npm install
\`\`\`

### 4. Konfigurasi environment

Copy file `.env.example` menjadi `.env`, lalu sesuaikan konfigurasi database dan kredensial lainnya:

\`\`\`bash
cp .env.example .env
php artisan key:generate
\`\`\`

### 5. Konfigurasi Payment Gateway (Tripay)

Isi kredensial Tripay pada file `.env` sesuai akun kamu sendiri (mode sandbox/simulasi tersedia untuk development):

\`\`\`env
TRIPAY_API_KEY=
TRIPAY_PRIVATE_KEY=
TRIPAY_MERCHANT_CODE=
TRIPAY_MODE=sandbox
\`\`\`

### 6. Migrasi database

\`\`\`bash
php artisan migrate
\`\`\`

### 7. Jalankan development server

Jalankan backend Laravel:

\`\`\`bash
php artisan serve
\`\`\`

Di terminal terpisah, jalankan Vite untuk frontend:

\`\`\`bash
npm run dev
\`\`\`

Akses aplikasi di `http://localhost:8000`.

---

## 📂 Struktur Project

\`\`\`
app/            # Logic backend Laravel (Controllers, Models)
resources/
├── js/         # Komponen React (Pages, Components)
└── css/        # Styling Tailwind
routes/         # Definisi routing Laravel
\`\`\`

---

## 📌 Catatan

- Payment gateway Tripay saat ini berjalan dalam mode simulasi, sudah terstruktur untuk mudah diintegrasikan ke mode production.
- Role admin dan customer memiliki akses dashboard yang berbeda.

---

## 👤 Author

**Yofy Taufik Hidayat**
Sistem Informasi — Institut Pendidikan Indonesia Garut
