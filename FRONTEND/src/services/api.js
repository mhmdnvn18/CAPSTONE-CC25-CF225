import { createClient } from '@supabase/supabase-js';
import { API_URL, ENDPOINTS } from '../config/api.js';

// API Configuration - Updated to use deployed backend
const API_BASE_URL = import.meta.env.VITE_API_URL || API_URL;

// Supabase Configuration (kept for direct access if needed)
const SUPABASE_URL = 'https://gczyorsjoxzunuqlebdd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjenlvcnNqb3h6dW51cWxlYmRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNjM0MDEsImV4cCI6MjA2MTkzOTQwMX0.Nnv_elhMz4fy4GCOhAOXC7y67wPMb-4YYLzFZKFEJJU';

// Initialize Supabase Client for direct access
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class CardiovascularAPI {
    constructor() {
        this.baseURL = API_URL;
        this.isConnected = false;
        this.lastChecked = null;
        this.sessionId = this.generateSessionId();
        this.retryCount = 0;
        this.maxRetries = 2;
        this.retryDelay = 1000;
        this.offlineMode = false;
        this.offlineCheckInterval = 60000;
        this.lastOfflineCheck = null;
        this.connectionFailCount = 0;
        this.maxFailBeforeStop = 3;
        
        // Enhanced request interceptor
        this.requestInterceptors = [];
        this.responseInterceptors = [];
        
        console.log('🚀 CardiovascularAPI initialized with backend:', this.baseURL);
    }

    // Enhanced fetch with timeout and retry logic
    async fetchWithTimeout(url, options = {}, timeout = 8000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': this.sessionId,
                    ...options.headers
                }
            });
            
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }

    // Enhanced connection check with better CORS handling
    checkConnectionWithXHR(url) {
        return new Promise((resolve) => {
            // First try with a simple fetch to avoid CORS preflight
            fetch(url, {
                method: 'GET',
                mode: 'no-cors', // This avoids CORS preflight but limits response access
                cache: 'no-cache'
            })
            .then(() => {
                // If no-cors succeeded, try with CORS to get actual response
                return fetch(url, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            })
            .then(data => {
                resolve({ connected: true, data });
            })
            .catch(() => {
                // Fallback to XMLHttpRequest with better error handling
                const xhr = new XMLHttpRequest();
                const timeoutDuration = 3000;
                let timeout;
                
                xhr.onerror = () => {
                    clearTimeout(timeout);
                    resolve({ connected: false, message: 'Connection failed - CORS or network error' });
                };
                
                xhr.onload = () => {
                    clearTimeout(timeout);
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            resolve({ connected: true, data });
                        } catch (e) {
                            resolve({ connected: true, data: { success: true } });
                        }
                    } else if (xhr.status === 0) {
                        // Status 0 usually means CORS issue
                        resolve({ connected: false, message: 'CORS policy blocked request' });
                    } else {
                        resolve({ connected: false, message: `HTTP ${xhr.status}` });
                    }
                };
                
                xhr.ontimeout = () => {
                    resolve({ connected: false, message: 'Request timeout' });
                };
                
                timeout = setTimeout(() => {
                    xhr.abort();
                    resolve({ connected: false, message: 'Request timeout' });
                }, timeoutDuration);
                
                try {
                    xhr.open('GET', url, true);
                    xhr.timeout = timeoutDuration;
                    xhr.setRequestHeader('Accept', 'application/json');
                    xhr.setRequestHeader('X-Session-ID', this.sessionId);
                    xhr.send();
                } catch (e) {
                    clearTimeout(timeout);
                    resolve({ connected: false, message: `Request failed: ${e.message}` });
                }
            });
        });
    }

    // Enhanced health check with better CORS and development handling
    async checkHealth(retry = true) {
        // In development, be more lenient with connection checking
        const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (this.connectionFailCount >= this.maxFailBeforeStop) {
            if (!this.offlineMode) {
                console.log('⚠️ Too many connection failures, switching to offline mode.');
                this.offlineMode = true;
                this.lastOfflineCheck = new Date();
            }
            
            return {
                success: false,
                message: 'Offline mode active. Backend server unavailable.'
            };
        }
        
        if (this.offlineMode) {
            const now = new Date();
            if (this.lastOfflineCheck && (now - this.lastOfflineCheck) < this.offlineCheckInterval) {
                return {
                    success: false,
                    message: 'Operating in offline mode.'
                };
            }
            this.lastOfflineCheck = now;
        }

        try {
            // Use different health check strategy for development
            let healthCheck;
            
            if (isDevelopment) {
                // In development, try a simpler approach to avoid CORS issues
                console.log('🔧 Development mode: Using simplified health check');
                
                try {
                    const response = await fetch(ENDPOINTS.health, {
                        method: 'GET',
                        mode: 'cors',
                        credentials: 'omit',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        healthCheck = { connected: true, data };
                    } else {
                        throw new Error(`HTTP ${response.status}`);
                    }
                } catch (fetchError) {
                    console.warn('🔧 Development: Direct fetch failed, assuming offline mode for local development');
                    // In development, if backend is not available, just use offline mode
                    throw new Error('Backend not available in development');
                }
            } else {
                // Production behavior
                healthCheck = await this.checkConnectionWithXHR(ENDPOINTS.health);
            }
            
            if (healthCheck.connected) {
                this.isConnected = true;
                this.lastChecked = new Date();
                this.retryCount = 0;
                this.connectionFailCount = 0;
                this.offlineMode = false;
                
                console.log('✅ Backend health check successful:', healthCheck.data);
                return healthCheck.data || { success: true };
            } else {
                throw new Error(healthCheck.message);
            }
        } catch (error) {
            this.isConnected = false;
            this.lastChecked = new Date();
            this.connectionFailCount++;
            
            if (this.retryCount === 0 && !this.offlineMode) {
                console.warn(`⚠️ Backend health check failed:`, error.message);
                
                // In development, provide helpful CORS message
                if (isDevelopment && error.message.includes('CORS')) {
                    console.info('💡 CORS issue detected. Make sure backend is running and CORS is configured for localhost:3000');
                }
            }
            
            if (retry && this.retryCount < this.maxRetries && this.connectionFailCount < this.maxFailBeforeStop) {
                this.retryCount++;
                
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(this.checkHealth(true));
                    }, this.retryDelay);
                });
            }
            
            if (!this.offlineMode) {
                console.log('ℹ️ Backend unavailable. Switching to offline mode.');
                this.offlineMode = true;
                this.lastOfflineCheck = new Date();
            }
            
            return {
                success: false,
                message: isDevelopment 
                    ? 'Backend unavailable (development mode). Using local predictions.' 
                    : 'Backend unavailable. Running in offline mode.',
                error: error.message
            };
        }
    }

    // Enhanced prediction with better error handling
    async predict(inputData) {
        try {
            // Check connection status first
            if (!this.isConnected) {
                await this.checkHealth(false); // Quick check without retries
            }
            
            // If still not connected, fall back to local prediction
            if (!this.isConnected) {
                console.log('🔄 Backend unavailable, using local prediction');
                return this.localPredict(inputData);
            }
            
            console.log('📤 Sending prediction request to backend...');
            
            const response = await this.fetchWithTimeout(ENDPOINTS.predict, {
                method: 'POST',
                body: JSON.stringify({
                    ...inputData,
                    sessionId: this.sessionId,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'Prediction failed');
            }

            console.log('✅ Backend prediction successful:', result);
            return result;

        } catch (error) {
            console.error('❌ Backend prediction failed:', error);
            console.log('🔄 Falling back to local prediction...');
            return this.localPredict(inputData);
        }
    }

    // Enhanced local prediction with better risk assessment
    localPredict(formData) {
        const heightInM = formData.height / 100;
        const bmi = formData.weight / (heightInM * heightInM);
        
        // Enhanced risk calculation
        let riskScore = 0;
        const riskFactors = [];
        
        // BMI risk factor
        if (bmi > 30) {
            riskScore += 3;
            riskFactors.push('Obesitas (BMI > 30)');
        } else if (bmi > 25) {
            riskScore += 2;
            riskFactors.push('Overweight (BMI > 25)');
        }
        
        // Age risk factor
        if (formData.age > 65) {
            riskScore += 3;
            riskFactors.push('Usia > 65 tahun');
        } else if (formData.age > 45) {
            riskScore += 2;
            riskFactors.push('Usia > 45 tahun');
        }
        
        // Blood pressure risk factor
        if (formData.systolic > 140 || formData.diastolic > 90) {
            riskScore += 3;
            riskFactors.push('Hipertensi');
        }
        
        // Smoking risk factor
        if (formData.smoking === 1) {
            riskScore += 2;
            riskFactors.push('Merokok');
        }
        
        const risk = riskScore >= 4 ? 1 : 0;
        const confidence = Math.min(100, Math.max(50, 100 - (riskScore * 10)));
        
        return {
            success: true,
            prediction: {
                risk,
                confidence,
                probability: confidence / 100,
                risk_label: risk === 1 ? 'High Risk' : 'Low Risk',
                risk_factors: riskFactors,
                recommendations: this.getHealthRecommendations(risk, riskFactors)
            },
            saved: false,
            message: 'Local prediction (backend unavailable)',
            source: 'local'
        };
    }

    // Enhanced health recommendations
    getHealthRecommendations(risk, riskFactors) {
        const baseRecommendations = [
            'Lakukan pemeriksaan kesehatan rutin',
            'Jaga pola makan seimbang',
            'Olahraga teratur minimal 30 menit/hari',
            'Kelola stres dengan baik'
        ];
        
        if (risk === 1) {
            baseRecommendations.push(
                'Konsultasi segera dengan dokter spesialis jantung',
                'Pantau tekanan darah secara rutin'
            );
        }
        
        if (riskFactors.some(f => f.includes('Merokok'))) {
            baseRecommendations.push('Berhenti merokok segera');
        }
        
        return baseRecommendations;
    }

    // Enhanced data retrieval with caching
    async getSavedPredictions(page = 1, limit = 10, filters = {}) {
        try {
            if (!this.isConnected) {
                await this.checkHealth(false);
            }
            
            if (!this.isConnected) {
                console.log('📝 Using local storage for saved predictions');
                return this.getLocalSavedPredictions(page, limit, filters);
            }
            
            const queryParams = new URLSearchParams({
                page,
                limit,
                sessionId: this.sessionId,
                ...Object.entries(filters).reduce((acc, [key, value]) => {
                    if (value !== undefined && value !== '') {
                        acc[key] = value;
                    }
                    return acc;
                }, {})
            });
            
            const response = await this.fetchWithTimeout(
                `${ENDPOINTS.predictions}?${queryParams.toString()}`,
                { method: 'GET' }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const result = await response.json();
            
            // Cache result in localStorage
            localStorage.setItem(`predictions_${page}_${limit}`, JSON.stringify({
                data: result,
                timestamp: Date.now()
            }));
            
            return result;
        } catch (error) {
            console.error('❌ Failed to get saved predictions:', error);
            return this.getLocalSavedPredictions(page, limit, filters);
        }
    }
    
    // Enhanced local storage fallback
    getLocalSavedPredictions(page, limit, filters) {
        try {
            const cached = localStorage.getItem(`predictions_${page}_${limit}`);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                // Return cached data if less than 5 minutes old
                if (Date.now() - timestamp < 5 * 60 * 1000) {
                    return data;
                }
            }
        } catch (error) {
            console.warn('Error reading cached predictions:', error);
        }
        
        return {
            data: [],
            totalPages: 1,
            currentPage: 1,
            total: 0,
            message: 'No cached data available'
        };
    }
    
    // Enhanced statistics endpoint
    async getStatistics() {
        try {
            if (!this.isConnected) {
                await this.checkHealth(false);
            }
            
            if (!this.isConnected) {
                return this.getLocalStatistics();
            }
            
            const response = await this.fetchWithTimeout(ENDPOINTS.statistics);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('❌ Failed to get statistics:', error);
            return this.getLocalStatistics();
        }
    }
    
    // Local statistics fallback
    getLocalStatistics() {
        return {
            totalPredictions: 0,
            highRiskPredictions: 0,
            lowRiskPredictions: 0,
            averageRiskScore: 0,
            source: 'local'
        };
    }

    generateSessionId() {
        return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
}

// Create and export singleton instance
const cardiovascularAPI = new CardiovascularAPI();
export default cardiovascularAPI;

// Export the class for testing
export { CardiovascularAPI };