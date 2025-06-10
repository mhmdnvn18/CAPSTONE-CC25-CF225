export const API_URL = 'https://backend-api-cgkk.onrender.com';

// You can also add specific endpoints here
export const ENDPOINTS = {
  // Main API endpoints from server.js
  root: `${API_URL}/`,
  health: `${API_URL}/api/health`,
  status: `${API_URL}/api/status`,
  predict: `${API_URL}/api/predict`,
  predictions: `${API_URL}/api/predictions`,
  statistics: `${API_URL}/api/statistics`,
  mlHealth: `${API_URL}/api/ml-health`
};

// Gender mapping to match backend expectations
export const GENDER_MAPPING = {
  // Frontend format: 1=Perempuan, 2=Laki-laki
  // Backend expects: sex: 0=Female, 1=Male
  FRONTEND_TO_BACKEND: {
    1: 0, // Perempuan -> Female
    2: 1  // Laki-laki -> Male
  },
  BACKEND_TO_FRONTEND: {
    0: 1, // Female -> Perempuan
    1: 2  // Male -> Laki-laki
  }
};

// API request defaults
export const API_DEFAULTS = {
  timeout: 30000,
  retries: 3,
  retryDelay: 1000
};
