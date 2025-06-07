# CardioPredict (Capstone Project)

> **Catatan:** Semua file website kini berada di dalam folder `FRONTEDN-BACKEND/`.

## Struktur Project

```
FRONTEDN-BACKEND/
  public/
    model/
      model.json
      group1-shard1of1.bin
    result.html
  src/
    components/
    pages/
    services/
    utils/
    App.jsx
    main.jsx
  index.html
  vite.config.js
  vercel.json
  package.json
  ...
```

## Cara Menjalankan

1. Masuk ke folder FRONTEDN-BACKEND:
   ```bash
   cd FRONTEDN-BACKEND
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Jalankan development server:
   ```bash
   npm run dev
   ```

4. Build production:
   ```bash
   npm run build
   ```

5. Preview production:
   ```bash
   npm run serve
   ```

6. Deploy ke Vercel:  
   Deploy folder `FRONTEDN-BACKEND` sebagai root project di Vercel.

> Pastikan semua path di konfigurasi (`vite.config.js`, `vercel.json`, dsb) sudah sesuai dengan struktur baru.
