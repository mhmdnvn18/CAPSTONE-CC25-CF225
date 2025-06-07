# CardioPredict (Capstone Project)

A web application for early prediction of cardiovascular disease risk using a TensorFlow.js model and React, ready for deployment on Vercel.

## Features

- Predicts cardiovascular risk based on user input.
- Uses a trained TensorFlow.js model (browser-based, no backend required).
- Modern UI with Bootstrap and Font Awesome.
- SPA routing and static export, works seamlessly on Vercel.

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```
The production-ready files will be in the `dist` folder.

### Preview Production Build

```bash
npm run serve
```

### Deploy to Vercel

1. Push your code to a GitHub repository.
2. [Import your repo to Vercel](https://vercel.com/import).
3. No special configuration is needed; Vercel will detect Vite and build automatically.
4. Ensure your model files are in `public/model/` (`model.json` and `group1-shard1of1.bin`).
5. The `vercel.json` file ensures SPA routing works.

## Project Structure

```
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
```

## Notes

- All predictions run in the browser; no user data is sent to a server.
- For SPA routing, all non-static routes are rewritten to `/` (see `vercel.json`).
- The result page (`result.html`) reads prediction results from `localStorage`.

## License

MIT or as specified by your organization.
