export const API_URL = 'https://backend-api-cgkk.onrender.com';

// You can also add specific endpoints here
export const ENDPOINTS = {
  // Main API endpoints from server.js
  root: `${API_URL}/`,
  health: `${API_URL}/api/health`,
  status: `${API_URL}/api/status`,
  predict: `${API_URL}/api/predict`,
  predictions: `${API_URL}/api/predictions`,
  statistics: `${API_URL}/api/statistics`
};
