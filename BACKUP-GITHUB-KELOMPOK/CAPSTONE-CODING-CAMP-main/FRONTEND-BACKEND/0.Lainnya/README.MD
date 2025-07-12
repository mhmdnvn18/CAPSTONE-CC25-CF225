# Website Deteksi Dini Penyakit Kardiovaskular

Website ini dibuat untuk mendeteksi dini penyakit kardiovaskular dengan ketentuan sebagai berikut:

1. **Build responsive layout web apps for all device screen sizes**  
   Membuat aplikasi web yang tata letaknya dapat menyesuaikan diri secara otomatis dengan berbagai ukuran layar perangkat (misalnya, desktop, tablet, dan ponsel). Ini memastikan pengalaman pengguna yang baik di semua perangkat.

2. **Implement networking calls to interact with the project's API**  
   Mengimplementasikan panggilan jaringan (biasanya menggunakan HTTP request) dari sisi front-end untuk berkomunikasi dengan API (Application Programming Interface) proyek. API ini menyediakan data dan fungsionalitas yang dibutuhkan oleh front-end.

3. **Using module bundler (Webpack, Vite, dll.) untuk membangun proyek web app**  
   Menggunakan alat bantu seperti Webpack atau Vite untuk mengelola dan menggabungkan berbagai modul kode (JavaScript, CSS, gambar, dll.) menjadi file yang siap untuk dijalankan di browser. Ini membantu mengoptimalkan dan mengatur proyek.

4. **Building RESTful API to support Front-End App**  
   Membangun API (Application Programming Interface) di sisi back-end yang mengikuti prinsip-prinsip REST (Representational State Transfer). API ini akan digunakan oleh aplikasi front-end untuk meminta dan mengirim data.

5. **The RESTful API can save data with or without a database**  
   API RESTful yang dibangun harus mampu menyimpan data. Penyimpanan ini bisa dilakukan menggunakan database (seperti MySQL, PostgreSQL, MongoDB) atau tanpa database (misalnya, menyimpan data dalam file atau menggunakan solusi penyimpanan sementara).

6. **Creating RESTful APIs with URLs designed to match standard conventions**  
   Merancang URL (Uniform Resource Locator) untuk API RESTful sesuai dengan konvensi standar. Ini membuat API lebih mudah dipahami, digunakan, dan dipelihara. Contohnya, menggunakan kata benda jamak untuk sumber daya (misalnya, `/users` bukan `/user`).

7. **Integrate AI/ML capabilities as the app's main feature, either via back-end app or directly on-device (browser)**  
   Mengintegrasikan kemampuan Kecerdasan Buatan (AI) atau Pembelajaran Mesin (ML) sebagai fitur utama aplikasi. Ini bisa dilakukan dengan menjalankan model AI/ML di server (back-end) atau langsung di perangkat pengguna (browser).

8. **Ensure the implementation of the main features you aim to address in the project without causing the application to crash**  
   Memastikan bahwa semua fitur utama yang direncanakan untuk proyek telah diimplementasikan dengan benar dan stabil, tanpa menyebabkan aplikasi berhenti bekerja atau mengalami error (crash).

---

## Opsi-Opsi Teknis untuk Memenuhi Ketentuan

1. **Responsive Layout**
   - Gunakan framework CSS seperti Tailwind CSS, Bootstrap, atau Material UI.
   - Terapkan media queries secara manual di file CSS.
   - Gunakan komponen layout responsif dari library UI React.
   - Gunakan CSS-in-JS (styled-components, Emotion) untuk styling dinamis.
   - Manfaatkan Flexbox dan CSS Grid untuk layout fleksibel.

2. **Networking Calls**
   - Gunakan `fetch`, `axios`, atau library lain untuk HTTP request di React.
   - Buat custom hook (misal: `useFetch`) untuk pengambilan data dari API.
   - Gunakan React Query, SWR, atau TanStack Query untuk data fetching dan caching.
   - Integrasi GraphQL client (misal: Apollo Client) jika API berbasis GraphQL.

3. **Module Bundler**
   - Pilih dan konfigurasi Vite sebagai bundler utama.
   - Alternatif: Webpack (jika diperlukan fitur khusus).
   - Gunakan Parcel atau Snowpack sebagai alternatif ringan.
   - Manfaatkan fitur HMR (Hot Module Replacement) untuk pengembangan cepat.

4. **RESTful API**
   - Bangun API menggunakan Express.js (Node.js), FastAPI (Python), atau framework lain.
   - Gunakan arsitektur REST dengan endpoint yang jelas dan terstruktur.
   - Alternatif: Gunakan serverless function (Vercel, Netlify Functions, AWS Lambda).
   - Gunakan framework lain seperti Koa, Hapi, atau NestJS untuk Node.js.

5. **Penyimpanan Data**
   - Gunakan database seperti MongoDB, PostgreSQL, atau MySQL.
   - Alternatif tanpa database: simpan data di file JSON atau memory (untuk prototipe).
   - Gunakan database cloud (Firebase, Supabase, PlanetScale).
   - Gunakan ORM/ODM seperti Prisma, Sequelize, atau Mongoose untuk manajemen data.

6. **Konvensi URL RESTful**
   - Gunakan kata benda jamak untuk endpoint (misal: `/patients`, `/results`).
   - Terapkan standar HTTP method (GET, POST, PUT, DELETE).
   - Gunakan versioning pada URL API (misal: `/api/v1/users`).
   - Terapkan nested resource jika diperlukan (misal: `/users/{id}/results`).

7. **Integrasi AI/ML**
   - Jalankan model ML di back-end (misal: TensorFlow, scikit-learn, PyTorch).
   - Alternatif: gunakan TensorFlow.js atau ONNX.js untuk inference langsung di browser.
   - Gunakan layanan AI/ML cloud (Google Cloud AI, AWS SageMaker, Azure ML).
   - Integrasi API eksternal untuk prediksi (misal: RapidAPI, HuggingFace Inference API).

8. **Stabilitas Fitur**
   - Buat pengujian otomatis (unit test, integration test).
   - Terapkan error handling di front-end dan back-end.
   - Gunakan monitoring/logging untuk mendeteksi crash.
   - Terapkan CI/CD pipeline untuk deployment otomatis dan pengujian berkelanjutan.
   - Gunakan tools analisis performa (Lighthouse, Sentry, New Relic).

---

## Contoh Stack Full Stack yang Bisa Digunakan

1. **React + Express.js + MongoDB**
   - Frontend: React (Vite, Tailwind CSS/Bootstrap)
   - Backend: Express.js (Node.js)
   - Database: MongoDB (Mongoose)

2. **React + FastAPI + PostgreSQL**
   - Frontend: React (Vite, Material UI)
   - Backend: FastAPI (Python)
   - Database: PostgreSQL (SQLAlchemy)

3. **Next.js (Fullstack React) + Prisma + PostgreSQL**
   - Frontend & Backend: Next.js (React, API Routes)
   - ORM: Prisma
   - Database: PostgreSQL

4. **Vue.js + Laravel + MySQL**
   - Frontend: Vue.js
   - Backend: Laravel (PHP)
   - Database: MySQL

5. **React + NestJS + MongoDB**
   - Frontend: React (Vite)
   - Backend: NestJS (Node.js, TypeScript)
   - Database: MongoDB

6. **React + Serverless (Vercel/Netlify Functions) + Firebase**
   - Frontend: React (Vite)
   - Backend: Serverless Functions (Node.js)
   - Database & Auth: Firebase

7. **React + Django REST Framework + PostgreSQL**
   - Frontend: React (Vite)
   - Backend: Django REST Framework (Python)
   - Database: PostgreSQL

8. **SvelteKit + Supabase**
   - Frontend & Backend: SvelteKit
   - Database & Auth: Supabase (PostgreSQL)

9. **React + Spring Boot + MySQL**
   - Frontend: React (Vite)
   - Backend: Spring Boot (Java)
   - Database: MySQL

10. **React + Flask + SQLite**
    - Frontend: React (Vite)
    - Backend: Flask (Python)
    - Database: SQLite

Silakan pilih stack yang sesuai dengan kebutuhan tim dan keahlian yang dimiliki.

---


> ### Daftar Framework, Bundler, dan Library Populer
>
> **Framework Front-End:**
> - [React](https://react.dev/)
> - [Vue.js](https://vuejs.org/)
> - [Svelte](https://svelte.dev/)
> - [SolidJS](https://www.solidjs.com/)
> - [Angular](https://angular.io/)
> - [Preact](https://preactjs.com/)
>
> **Framework JavaScript Lain & SSG/SSR:**
> - [Next.js](https://nextjs.org/) (React, SSR/SSG)
> - [Nuxt.js](https://nuxt.com/) (Vue, SSR/SSG)
> - [Remix](https://remix.run/) (React, fullstack)
> - [Gatsby](https://www.gatsbyjs.com/) (React, static site)
> - [Astro](https://astro.build/) (multi-framework)
> - [Qwik](https://qwik.builder.io/) (resumable)
> - [Eleventy (11ty)](https://www.11ty.dev/) (static site)
>
> **Module Bundler/Build Tool:**
> - [Vite](https://vitejs.dev/)
> - [Webpack](https://webpack.js.org/)
> - [Parcel](https://parceljs.org/)
> - [Rollup](https://rollupjs.org/)
> - [Snowpack](https://www.snowpack.dev/)
>
> **Library UI/Komponen:**
> - [Tailwind CSS](https://tailwindcss.com/)
> - [Chakra UI](https://chakra-ui.com/)
> - [Material UI](https://mui.com/)
> - [Ant Design](https://ant.design/)
> - [Bootstrap](https://getbootstrap.com/)
>
> **Library HTTP/Networking:**
> - [Axios](https://axios-http.com/)
> - [ky](https://github.com/sindresorhus/ky)
> - [SWR](https://swr.vercel.app/)
> - [React Query](https://tanstack.com/query/latest)
> - Native `fetch` API