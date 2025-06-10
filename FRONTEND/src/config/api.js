export const API_URL = 'https://backend-api-cgkk.onrender.com';
export const ML_API_URL = 'https://api-ml-production.up.railway.app';

// You can also add specific endpoints here
export const ENDPOINTS = {
  // Main API endpoints from server.js
  root: `${API_URL}/`,
  health: `${API_URL}/api/health`,
  status: `${API_URL}/api/status`,
  predict: `${API_URL}/api/predict`,
  predictions: `${API_URL}/api/predictions`,
  statistics: `${API_URL}/api/statistics`,
  
  // ML API endpoints - corrected
  ml_root: `${ML_API_URL}/`,
  ml_health: `${ML_API_URL}/`,
  ml_predict: `${ML_API_URL}/predict`,
  ml_model_info: `${ML_API_URL}/`
};

// Gender mapping constants
export const GENDER_MAPPING = {
  FRONTEND_TO_DATASET: {
    0: 1, // Frontend Female (0) -> Dataset Female (1)
    1: 2  // Frontend Male (1) -> Dataset Male (2)
  },
  DATASET_TO_FRONTEND: {
    1: 0, // Dataset Female (1) -> Frontend Female (0)
    2: 1  // Dataset Male (2) -> Frontend Male (1)
  }
};
