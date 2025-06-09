import { createClient } from '@supabase/supabase-js';

// API Configuration - Updated for port 5001
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Supabase Configuration (kept for direct access if needed)
const SUPABASE_URL = 'https://gczyorsjoxzunuqlebdd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjenlvcnNqb3h6dW51cWxlYmRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNjM0MDEsImV4cCI6MjA2MTkzOTQwMX0.Nnv_elhMz4fy4GCOhAOXC7y67wPMb-4YYLzFZKFEJJU';

// Initialize Supabase Client for direct access
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class CardiovascularAPI {
    constructor() {
        this.isConnected = false;
        this.lastChecked = null;
        this.sessionId = this.generateSessionId();
        this.retryCount = 0;
        this.maxRetries = 2;
        this.retryDelay = 1000;
        this.offlineMode = false;
        this.offlineCheckInterval = 60000; // Diperpanjang menjadi 60 detik
        this.lastOfflineCheck = null;
        this.connectionFailCount = 0;
        this.maxFailBeforeStop = 3; // Berhenti mencoba setelah 3 kali gagal
        console.log('🚀 CardiovascularAPI diinisialisasi dengan backend:', API_BASE_URL);
    }

    // Add the missing fetchWithTimeout method
    async fetchWithTimeout(url, options = {}, timeout = 8000) {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), timeout)
            )
        ]);
    }

    // Metode baru untuk memeriksa koneksi dengan pendekatan yang berbeda
    checkConnectionWithXHR(url) {
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            const timeoutDuration = 3000;
            let timeout;
            
            // Mencegah error di konsol dengan event listener
            xhr.onerror = () => {
                clearTimeout(timeout);
                resolve({ connected: false, message: 'Koneksi gagal' });
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
                } else {
                    resolve({ connected: false, message: `HTTP ${xhr.status}` });
                }
            };
            
            xhr.ontimeout = () => {
                resolve({ connected: false, message: 'Permintaan timeout' });
            };
            
            // Set timeout manual
            timeout = setTimeout(() => {
                xhr.abort();
                resolve({ connected: false, message: 'Permintaan timeout' });
            }, timeoutDuration);
            
            try {
                xhr.open('GET', url, true);
                xhr.timeout = timeoutDuration;
                xhr.send();
            } catch (e) {
                clearTimeout(timeout);
                resolve({ connected: false, message: e.message });
            }
        });
    }

    async checkHealth(retry = true) {
        // Cek apakah kita sudah mencapai batas kegagalan
        if (this.connectionFailCount >= this.maxFailBeforeStop) {
            if (!this.offlineMode) {
                console.log('⚠️ Terlalu banyak kegagalan koneksi, beralih ke mode offline permanen.');
                this.offlineMode = true;
                this.lastOfflineCheck = new Date();
            }
            
            return {
                success: false,
                message: 'Mode offline aktif. Server backend tidak tersedia.'
            };
        }
        
        // Jika dalam mode offline, periksa kurang sering
        if (this.offlineMode) {
            const now = new Date();
            if (this.lastOfflineCheck && (now - this.lastOfflineCheck) < this.offlineCheckInterval) {
                return {
                    success: false,
                    message: 'Beroperasi dalam mode offline.'
                };
            }
            this.lastOfflineCheck = now;
        }

        try {
            // Gunakan metode XHR untuk mengurangi error di konsol
            const healthCheck = await this.checkConnectionWithXHR(`${API_BASE_URL}/api/health`);
            
            if (healthCheck.connected) {
                this.isConnected = true;
                this.lastChecked = new Date();
                this.retryCount = 0;
                this.connectionFailCount = 0;
                this.offlineMode = false;
                
                console.log('✅ Pemeriksaan kesehatan backend berhasil:', healthCheck.data);
                return healthCheck.data || { success: true };
            } else {
                throw new Error(healthCheck.message);
            }
        } catch (error) {
            this.isConnected = false;
            this.lastChecked = new Date();
            this.connectionFailCount++;
            
            // Hanya log pesan kesalahan pertama kali atau saat keluar dari mode offline
            if (this.retryCount === 0 && !this.offlineMode) {
                console.warn(`⚠️ Pemeriksaan kesehatan backend gagal:`, error.message);
            }
            
            // Implementasi logika percobaan ulang
            if (retry && this.retryCount < this.maxRetries && this.connectionFailCount < this.maxFailBeforeStop) {
                this.retryCount++;
                
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(this.checkHealth(true));
                    }, this.retryDelay);
                });
            }
            
            // Masuk ke mode offline jika belum
            if (!this.offlineMode) {
                console.log('ℹ️ Backend tidak tersedia. Beralih ke mode offline.');
                this.offlineMode = true;
                this.lastOfflineCheck = new Date();
            }
            
            return {
                success: false,
                message: 'Backend tidak tersedia. Menjalankan dalam mode offline.',
                error: error.message
            };
        }
    }

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
            
            const response = await this.fetchWithTimeout(`${API_BASE_URL}/api/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputData)
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

    localPredict(formData) {
        const heightInM = formData.height / 100;
        const bmi = formData.weight / (heightInM * heightInM);
        
        // Simplified risk assessment logic for local prediction
        const risk = bmi > 25 ? 1 : 0;
        const confidence = Math.min(100, Math.max(0, 100 - (bmi - 25) * 4));
        
        return {
            success: true,
            prediction: {
                risk,
                confidence,
                probability: confidence / 100,
                risk_label: risk === 1 ? 'High Risk' : 'Low Risk'
            },
            saved: false,
            message: 'Local prediction (backend unavailable)'
        };
    }

    generateSessionId() {
        return 'sess_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Method to get saved predictions from backend or local storage
    async getSavedPredictions(page = 1, limit = 10, filters = {}) {
        try {
            // Check if backend is available
            if (!this.isConnected) {
                await this.checkHealth(false);
            }
            
            if (!this.isConnected) {
                // Fallback to local storage if backend is not available
                console.log('📝 Using local storage for saved predictions');
                return this.getLocalSavedPredictions(page, limit, filters);
            }
            
            const queryParams = new URLSearchParams({
                page,
                limit,
                ...Object.entries(filters).reduce((acc, [key, value]) => {
                    if (value !== undefined && value !== '') {
                        acc[key] = value;
                    }
                    return acc;
                }, {})
            });
            
            const response = await this.fetchWithTimeout(
                `${API_BASE_URL}/api/predictions?${queryParams.toString()}`,
                { method: 'GET' }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('❌ Failed to get saved predictions:', error);
            return this.getLocalSavedPredictions(page, limit, filters);
        }
    }
    
    // Local fallback for getting saved predictions
    getLocalSavedPredictions(page, limit, filters) {
        // Implementation for local storage fallback
        // This is a simplified version that returns an empty array
        return {
            data: [],
            totalPages: 1,
            currentPage: 1,
            total: 0
        };
    }
    
    // Method to get statistics from backend or calculated locally
    async getStatistics() {
        try {
            // Check if backend is available
            if (!this.isConnected) {
                await this.checkHealth(false);
            }
            
            if (!this.isConnected) {
                // Fallback to local calculation if backend is not available
                console.log('📊 Using local calculation for statistics');
                return this.getLocalStatistics();
            }
            
            const response = await this.fetchWithTimeout(
                `${API_BASE_URL}/api/statistics`,
                { method: 'GET' }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('❌ Failed to get statistics:', error);
            return this.getLocalStatistics();
        }
    }
    
    // Local fallback for calculating statistics
    getLocalStatistics() {
        // Simplified statistics for local mode
        return {
            total: 0,
            highRisk: 0,
            lowRisk: 0,
            averageAge: 0
        };
    }
}

// Export singleton instance
export default new CardiovascularAPI();