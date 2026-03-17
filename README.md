# 🌱 0waste: Sustainable Food Marketplace

![Production Status](https://img.shields.io/badge/Status-Production--Ready-green?style=for-the-badge)
![Expo Version](https://img.shields.io/badge/Expo-v55-40407a?style=for-the-badge&logo=expo)
![Supabase](https://img.shields.io/badge/Backend-Supabase-3ec976?style=for-the-badge&logo=supabase)
![AI](https://img.shields.io/badge/AI-Gemini--1.5--Flash-blue?style=for-the-badge&logo=google-gemini)

**0waste** adalah platform ekonomi sirkular modern yang dirancang untuk menyelamatkan makanan berkualitas tinggi (*surplus meal*) dari restoran, hotel, dan kafe untuk didistribusikan kepada masyarakat dengan harga diskon yang signifikan.

> **Visi:** Mengurangi limbah makanan di Indonesia melalui teknologi yang aman, cerdas, dan transparan.

---

## 🚀 Fitur Unggulan

### 1. Manajemen Peran (Role-Based Access)
*   **User/Customer:** Menjelajah makanan sisa berkualitas, melakukan pemesanan, dan melacak riwayat belanja.
*   **Verified Partner:** Restoran atau hotel yang telah divalidasi oleh sistem untuk memposting dan menjual surplus makanan mereka.

### 2. Keamanan & Verifikasi
*   **Sistem Verifikasi Partner:** Alur pendaftaran partner yang ketat dengan panel verifikasi admin internal untuk menjaga kepercayaan pengguna.
*   **Row Level Security (RLS):** Keamanan data tingkat tinggi di sisi database untuk melindungi privasi setiap pengguna.
*   **Security UI:** Fitur tampilkan/sembunyikan password dan alur pemulihan akun (*Forgot Password*).

### 3. Marketplace Modern
*   **Real Image Upload:** Penjual dapat mengunggah foto makanan langsung dari galeri HP ke *Supabase Storage*.
*   **Smart Search & Filtering:** Pencarian cepat dan filter berbasis kategori (Bakery, Buffet, Beverages, dll).
*   **Real-time Stock:** Sistem otomatis yang menangani perubahan status barang menjadi *Sold Out* seketika setelah dipesan.

### 4. AI Assistant 2.0 (Gemini Powered)
Integrasi cerdas dengan **Google Gemini AI** yang berfungsi sebagai:
*   Konsultan lingkungan (edukasi dampak food waste).
*   Asisten inventaris yang membantu pengguna menemukan promo terbaik.
*   Panduan identitas brand (Brand awareness).

---

## 🛠️ Tech Stack

*   **Framework:** React Native via [Expo SDK 55](https://expo.dev/)
*   **Navigation:** Expo Router (File-based routing)
*   **Styling:** [NativeWind](https://nativewind.dev/) (Tailwind CSS for React Native)
*   **Backend:** [Supabase](https://supabase.com/) (Auth, Database, Storage)
*   **AI Engine:** [Google Generative AI](https://aistudio.google.com/) (Gemini 1.5 Flash)
*   **Language:** TypeScript

---

## 📦 Instalasi & Setup

### 1. Clone Repositori
```bash
git clone https://github.com/aryamusthofa/0waste-production-proj.git
cd 0waste-mobile-web
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment
Salin file `.env.example` menjadi `.env` dan lengkapi kuncinya:
```bash
cp .env.example .env
```
Isi variabel berikut:
*   `EXPO_PUBLIC_SUPABASE_URL`
*   `EXPO_PUBLIC_SUPABASE_ANON_KEY`
*   `EXPO_PUBLIC_GEMINI_API_KEY`

### 4. Setup Database
Jalankan file SQL berikut di SQL Editor Supabase Anda secara berurutan:
1.  `databasesetup1.sql` (Initial Schema)
2.  `databasesetup2.sql` (Security & RLS)
3.  `databasesetup3.sql` (Scalability & Categories)

---

## 📱 Menjalankan Aplikasi

Jalankan server pengembangan:
```bash
npx expo start --clear
```
*   **Android:** Tekan `a` atau scan QR via Expo Go.
*   **iOS:** Tekan `i` atau scan QR via Expo Go.
*   **Web:** Tekan `w` untuk melihat versi web.

---

## 🔒 Developer Mode (Internal Testing)
Untuk keperluan pengujian di tahap produksi:
1.  Masuk ke halaman **Profil**.
2.  **Tap Foto Profil sebanyak 10x**.
3.  Menu **Verifikasi Partner** akan muncul untuk menyetujui akun partner baru secara manual.

---

## 📄 Lisensi & Kontribusi
Proyek ini dikembangkan oleh **Arya Musthofa Roja** sebagai bagian dari Final Project. Penggunaan kode untuk tujuan komersial tanpa izin adalah dilarang sesuai dengan regulasi hak cipta yang berlaku.

---

**0waste** - *Selamatkan makanan, selamatkan bumi.* 🌍🍱
