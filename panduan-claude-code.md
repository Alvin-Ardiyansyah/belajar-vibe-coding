# Panduan Lengkap Claude Code
### Dari Konfigurasi Awal hingga Eksekusi Project

---

## Daftar Isi
1. [Instalasi](#1-instalasi)
2. [Konfigurasi Awal](#2-konfigurasi-awal)
3. [Cara Kerja Dasar](#3-cara-kerja-dasar)
4. [Cara Prompt yang Efektif](#4-cara-prompt-yang-efektif)
5. [Workflow Membuat Project/Website](#5-workflow-membuat-projectwebsite)
6. [Perintah Penting](#6-perintah-penting)
7. [Tips & Trik](#7-tips--trik)
8. [Contoh Prompt Nyata](#8-contoh-prompt-nyata)

---

## 1. Instalasi

### Syarat
- Node.js versi 18 ke atas
- Langganan Claude Pro, Max, Team, atau Enterprise

### Install Node.js (Pop!_OS / Ubuntu)
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # pastikan v18+
```

### Install Claude Code
```bash
npm install -g @anthropic-ai/claude-code
```

### Login pertama kali
```bash
claude
# Akan membuka browser untuk login ke akun Anthropic
```

---

## 2. Konfigurasi Awal

### 2.1 CLAUDE.md Global (Paling Penting!)
File ini dibaca Claude di SEMUA project. Isi dengan identitas dan preferensi kamu.

```bash
mkdir -p ~/.claude
nano ~/.claude/CLAUDE.md
```

**Template lengkap:**
```markdown
# Profil Developer
- Nama: [nama kamu]
- Lokasi: Indonesia
- Selalu jawab dan komunikasi dalam Bahasa Indonesia
- Level: [junior/mid/senior]

# Tech Stack Utama
- Backend: Node.js + Express
- Frontend: React + TypeScript + Tailwind CSS
- Database: PostgreSQL
- Package manager: pnpm (bukan npm/yarn)
- Runtime: Node.js

# Coding Standards
- Gunakan TypeScript, bukan plain JavaScript
- Selalu tambahkan error handling (try/catch)
- Gunakan async/await, bukan .then().catch()
- Setiap fungsi harus ada JSDoc comment
- Maksimal 30 baris per fungsi
- Ikuti prinsip SOLID dan DRY

# Gaya Bekerja
- Sebelum mulai koding, jelaskan rencana/pendekatan dulu
- Kalau ada beberapa solusi, tampilkan trade-off masing-masing
- Jangan hapus kode yang ada kecuali aku minta eksplisit
- Selalu buat unit test untuk setiap fungsi baru
- Gunakan environment variable untuk semua credential, jangan hardcode

# Hal yang DILARANG
- Jangan gunakan var (pakai const/let)
- Jangan hardcode API key, password, atau secret apapun
- Jangan skip validasi input dari user
- Jangan buat fungsi lebih dari 30 baris tanpa alasan jelas
```

### 2.2 Settings — Izin & Perilaku
```bash
nano ~/.claude/settings.json
```

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(pnpm *)",
      "Bash(git *)",
      "Bash(node *)",
      "Bash(python3 *)",
      "Bash(ls:*)",
      "Bash(cat:*)",
      "Bash(mkdir:*)",
      "Bash(touch:*)"
    ],
    "deny": [
      "Bash(rm -rf /)",
      "Bash(sudo rm -rf *)",
      "Bash(format *)"
    ]
  }
}
```

### 2.3 Memory — Ingatan Permanen
```bash
# Tambah informasi yang selalu diingat Claude
claude memory add "Saya menggunakan pnpm sebagai package manager"
claude memory add "Project utama saya adalah aplikasi e-commerce"
claude memory add "Server production di Ubuntu 22.04 dengan Nginx dan PM2"
claude memory add "Database production: PostgreSQL 15 di port 5432"

# Lihat semua memory
claude memory list

# Hapus memory tertentu
claude memory remove
```

### 2.4 MCP Servers (Opsional tapi Powerful)
```bash
# Akses filesystem
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/projects

# Memory persistem antar sesi
claude mcp add memory -- npx -y @modelcontextprotocol/server-memory

# Kemampuan berpikir bertahap (bagus untuk problem kompleks)
claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking

# Cek MCP yang aktif
claude mcp list
```

---

## 3. Cara Kerja Dasar

### Mode Interaktif (paling sering dipakai)
```bash
cd /path/ke/project-kamu
claude
```
Setelah masuk, ketik perintah/pertanyaan langsung.

### Shortcut dalam sesi Claude
| Shortcut | Fungsi |
|---|---|
| `Ctrl+C` | Batalkan respons yang sedang berjalan |
| `Ctrl+D` | Keluar dari Claude |
| `/help` | Tampilkan semua perintah |
| `/clear` | Bersihkan konteks percakapan |
| `/status` | Cek status sesi & penggunaan token |

### Mode Satu Perintah (tanpa masuk sesi)
```bash
claude "jelaskan struktur folder project ini"
claude "cari semua bug di file src/api/users.ts"
```

### Lanjutkan sesi terakhir
```bash
claude --resume
# atau
claude --continue
```

---

## 4. Cara Prompt yang Efektif

### Prinsip Dasar: JELAS, SPESIFIK, BERIKAN KONTEKS

---

### ❌ Prompt Buruk vs ✅ Prompt Bagus

**Terlalu umum:**
```
❌ "buatkan website"
✅ "buatkan landing page untuk jasa laundry dengan section: hero, layanan, harga, kontak. Gunakan React + Tailwind, warna utama biru."
```

**Tanpa konteks:**
```
❌ "fix bug ini"
✅ "fungsi calculateTotal() di src/utils/cart.ts mengembalikan NaN ketika ada produk dengan harga 0. Cari penyebabnya dan perbaiki."
```

**Ambigu:**
```
❌ "tambah fitur login"
✅ "tambahkan fitur login dengan email + password menggunakan JWT. Simpan token di httpOnly cookie. Buat endpoint POST /api/auth/login dan middleware authenticateToken."
```

---

### Pola Prompt yang Terbukti Efektif

**1. Pola KONTEKS → TUGAS → FORMAT**
```
Konteks: Saya sedang membangun REST API dengan Express.js dan PostgreSQL.
Tugas: Buatkan endpoint GET /api/products dengan fitur pagination, filter by kategori, dan search by nama produk.
Format: Tampilkan kode lengkap beserta SQL query-nya. Jelaskan setiap bagian.
```

**2. Pola JELASKAN DULU**
```
Sebelum mulai koding, jelaskan dulu:
1. Pendekatan yang akan kamu ambil
2. Struktur file yang akan dibuat/diubah
3. Potensi masalah yang mungkin muncul

Setelah aku setuju, baru mulai eksekusi.
```

**3. Pola REVIEW DULU**
```
Tolong review kode di src/controllers/userController.ts dan identifikasi:
- Bug yang ada
- Potensi security vulnerability
- Bagian yang bisa dioptimasi
Jangan ubah apapun dulu, cukup laporkan temuannya.
```

**4. Pola STEP BY STEP**
```
Bantu saya setup project Node.js + TypeScript + PostgreSQL dari awal.
Kerjakan satu langkah setiap kali, tunggu konfirmasi saya sebelum lanjut ke langkah berikutnya.
```

---

### Prompt untuk Situasi Spesifik

**Saat ada error:**
```
Saya dapat error berikut:
[paste error message lengkap]

Konteks: error ini muncul ketika [jelaskan situasinya]
File yang relevan: [sebutkan nama file]

Tolong diagnosa penyebabnya dan berikan solusi.
```

**Saat minta refactor:**
```
Refactor fungsi getUserOrders() di src/services/orderService.ts.
Tujuan: pisahkan query database dari business logic.
Jangan ubah behavior/output fungsinya, hanya struktur internalnya.
```

**Saat minta fitur baru:**
```
Tambahkan fitur [nama fitur] dengan spesifikasi:
- [spesifikasi 1]
- [spesifikasi 2]
- [spesifikasi 3]

Pastikan:
- Tidak breaking existing functionality
- Ada validasi input
- Ada error handling
- Ikuti pola kode yang sudah ada di project
```

---

## 5. Workflow Membuat Project/Website

### FASE 1 — Persiapan Project

**Langkah 1: Buat folder project**
```bash
mkdir nama-project
cd nama-project
claude
```

**Langkah 2: Buat CLAUDE.md spesifik project**
Di dalam sesi Claude, ketik:
```
Bantu saya buat file CLAUDE.md untuk project ini dengan informasi:
- Nama project: [nama]
- Tujuan: [deskripsi singkat]
- Tech stack: [list teknologi]
- Struktur folder yang direncanakan
- Konvensi penamaan yang akan dipakai
```

---

### FASE 2 — Inisialisasi Project

**Prompt untuk memulai project baru:**
```
Saya ingin membuat [jenis project: website portfolio / toko online / blog / dashboard admin].

Spesifikasi:
- Tech stack: React + TypeScript + Tailwind CSS (frontend), Node.js + Express (backend), PostgreSQL (database)
- Fitur utama: [list fitur]
- Target pengguna: [deskripsi]

Tolong:
1. Inisialisasi struktur project yang proper
2. Setup konfigurasi dasar (tsconfig, eslint, prettier)
3. Buat README.md
4. Jelaskan setiap keputusan yang kamu buat

Mulai dari struktur folder dulu, tunggu persetujuan saya sebelum lanjut.
```

---

### FASE 3 — Development Bertahap

Jangan minta semua sekaligus. Kerjakan per fitur/modul:

**Urutan yang disarankan:**
```
1. Setup & konfigurasi dasar
      ↓
2. Database schema & migration
      ↓
3. Backend: Model → Service → Controller → Route
      ↓
4. Frontend: Layout → Components → Pages → Integrasi API
      ↓
5. Testing
      ↓
6. Deployment setup
```

**Contoh prompt per tahap:**

*Tahap Database:*
```
Buatkan database schema untuk aplikasi ini.
Entitas yang dibutuhkan: User, Product, Category, Order, OrderItem.
Gunakan PostgreSQL. Buat file migration SQL-nya.
Sertakan: primary key, foreign key, index yang dibutuhkan, dan timestamp (created_at, updated_at).
```

*Tahap Backend:*
```
Buatkan CRUD endpoint untuk entity Product.
Ikuti struktur yang sudah ada: Model → Service → Controller → Route.
Sertakan:
- Validasi input dengan Zod
- Error handling yang proper
- Pagination untuk endpoint GET all
- Response format yang konsisten
```

*Tahap Frontend:*
```
Buatkan halaman daftar produk (ProductList page).
Fitur yang dibutuhkan:
- Fetch data dari API GET /api/products
- Tampilkan loading state dan error state
- Tampilkan produk dalam grid layout
- Fitur search dan filter kategori
- Pagination
Gunakan React Query untuk data fetching.
```

---

### FASE 4 — Review & Testing

```
Setelah semua fitur selesai, lakukan review menyeluruh:
1. Cek semua endpoint apakah sudah ada validasi input
2. Cek apakah ada potensi SQL injection atau XSS
3. Cek apakah semua error ditangani dengan baik
4. Cek apakah ada kode duplikat yang bisa direfactor
5. Buatkan test cases untuk fungsi-fungsi kritis
```

---

### FASE 5 — Deployment

```
Bantu saya setup deployment untuk project ini ke VPS Ubuntu.
Environment: Ubuntu 22.04, Nginx, PM2, PostgreSQL.
Buatkan:
1. Dockerfile (opsional)
2. Nginx config
3. PM2 ecosystem config
4. Script deployment otomatis
5. Setup environment variables
```

---

## 6. Perintah Penting

### Navigasi & Konteks
```bash
# Lihat semua file di folder saat ini
ls -la

# Tanya Claude tentang struktur project
> jelaskan struktur folder project ini

# Beri Claude konteks file spesifik
> baca file src/app.ts dan jelaskan cara kerjanya

# Minta Claude cari sesuatu
> cari semua tempat di codebase yang menggunakan fungsi deprecated X
```

### Git Workflow dengan Claude
```bash
# Di dalam sesi Claude
> review perubahan yang belum di-commit dan buat pesan commit yang deskriptif

> bantu saya resolve merge conflict di file src/utils/helpers.ts

> buat .gitignore yang komprehensif untuk project Node.js + TypeScript ini
```

### Debug dengan Claude
```bash
# Paste error langsung ke sesi Claude
> Error ini muncul: TypeError: Cannot read property 'id' of undefined
  di src/controllers/userController.ts line 45
  Bantu diagnosa dan perbaiki.

# Minta Claude jalankan diagnostic
> jalankan npm run test dan analisis hasilnya, perbaiki test yang failing
```

---

## 7. Tips & Trik

### Tips Produktivitas

**Gunakan `/clear` dengan bijak**
Konteks Claude ada batasnya. Kalau sesi sudah panjang dan mulai lambat/tidak akurat, ketik `/clear` untuk reset konteks, lalu berikan ringkasan situasi terkini.

**Simpan "checkpoint" di CLAUDE.md**
Setiap kali progress signifikan, update CLAUDE.md project:
```
> update CLAUDE.md project ini dengan progress terkini: sudah selesai fitur auth dan product CRUD, selanjutnya akan mengerjakan order management
```

**Gunakan mode Plan sebelum eksekusi besar**
```
> sebelum kamu mengubah apapun, buat rencana detail perubahan yang akan dilakukan untuk menambah fitur payment gateway. Tampilkan semua file yang akan disentuh.
```

**Iterasi kecil lebih baik dari sekali besar**
Daripada: `"buatkan aplikasi e-commerce lengkap"`
Lakukan: satu fitur → review → approve → fitur berikutnya

### Hindari Kesalahan Umum

1. **Jangan terlalu pasif** — Selalu review apa yang Claude buat sebelum approve
2. **Jangan skip testing** — Minta Claude buat test setelah setiap fitur
3. **Jangan biarkan context overflow** — Gunakan `/clear` kalau sesi terlalu panjang
4. **Jangan langsung push ke production** — Test di local/staging dulu
5. **Selalu baca diff sebelum accept** — Pastikan Claude tidak menghapus kode penting

---

## 8. Contoh Prompt Nyata

### Contoh 1: Memulai Project Website Portfolio
```
Saya ingin membuat website portfolio personal.

Spesifikasi:
- Tech: Next.js 14 + TypeScript + Tailwind CSS
- Halaman: Home, About, Projects, Blog, Contact
- Fitur: dark mode, animasi halus, responsive
- Bahasa: Indonesia

Langkah pertama: inisialisasi project Next.js dengan konfigurasi yang sudah dioptimasi.
Jangan lanjut ke halaman dulu, tunggu konfirmasi saya.
```

### Contoh 2: Membuat REST API
```
Buatkan REST API sederhana untuk aplikasi todo list.

Tech: Node.js + Express + TypeScript + PostgreSQL + Prisma ORM

Endpoint yang dibutuhkan:
- POST /api/todos — buat todo baru
- GET /api/todos — ambil semua todo (dengan pagination)
- GET /api/todos/:id — ambil todo by ID
- PUT /api/todos/:id — update todo
- DELETE /api/todos/:id — hapus todo

Sertakan: validasi input (Zod), error handling, authentication dengan JWT.
Mulai dari setup project dan Prisma schema dulu.
```

### Contoh 3: Fix Bug
```
Ada bug di fungsi calculateDiscount() di src/utils/pricing.ts

Bug: diskon tidak diterapkan ketika user adalah member VIP dan total belanja di atas 500rb.

Expected behavior: VIP member dapat diskon 20% untuk belanja di atas 500rb.
Current behavior: diskon 0% meskipun kondisi terpenuhi.

Tolong diagnosa dan perbaiki. Jelaskan apa yang salah sebelum mengubah kode.
```

### Contoh 4: Refactor Kode Lama
```
File src/controllers/orderController.ts sudah terlalu besar (800+ baris) dan sulit di-maintain.

Tolong refactor dengan:
1. Pisahkan business logic ke service layer
2. Pisahkan validasi ke validator terpisah
3. Buat helper functions untuk operasi yang berulang
4. Jangan ubah behavior/interface yang sudah ada

Tampilkan rencana refactor dulu sebelum eksekusi.
```

---

## Referensi Cepat

| Kebutuhan | Perintah/Prompt |
|---|---|
| Mulai sesi baru | `claude` |
| Lanjut sesi lama | `claude --resume` |
| Satu perintah cepat | `claude "pertanyaan"` |
| Lihat memory | `claude memory list` |
| Lihat MCP | `claude mcp list` |
| Cek versi | `claude --version` |
| Bantuan | `claude --help` |

---

*Panduan ini dibuat untuk Claude Code versi terbaru (2026). Beberapa perintah mungkin berbeda di versi yang lebih lama.*
