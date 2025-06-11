import { createClient } from '@supabase/supabase-js';
import { API_URL, ENDPOINTS, GENDER_MAPPING } from '../config/api.js';

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
        
        // Initialize Supabase client
        this.supabase = supabase;
        
        console.log('🚀 CardiovascularAPI initialized with backend:', this.baseURL);
        console.log('🗄️ Supabase client initialized');
    }

    // Enhanced fetch with timeout and retry logic - Remove problematic headers for ML API
    async fetchWithTimeout(url, options = {}, timeout = 8000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            // Don't add X-Session-ID for ML API requests to avoid CORS issues
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };
            
            // Only add session ID for our own backend, not external APIs
            if (url.includes(this.baseURL)) {
                headers['X-Session-ID'] = this.sessionId;
            }
            
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers
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

    // Simplified health check - only check backend
    async checkHealth(retry = true) {
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

        try {
            // Only check backend health - ML is handled by backend
            const backendCheck = await this.checkConnectionWithXHR(ENDPOINTS.health);
            
            const backendConnected = backendCheck.connected;
            this.isConnected = backendConnected;
            
            if (backendConnected) {
                this.lastChecked = new Date();
                this.retryCount = 0;
                this.connectionFailCount = 0;
                this.offlineMode = false;
                
                console.log('✅ Backend health check successful');
                
                return { 
                    success: true, 
                    backend: backendConnected,
                    message: 'Backend service available'
                };
            } else {
                throw new Error('Backend API unavailable');
            }
        } catch (error) {
            this.isConnected = false;
            this.lastChecked = new Date();
            this.connectionFailCount++;
            
            if (this.retryCount === 0 && !this.offlineMode) {
                console.warn(`⚠️ Health check failed:`, error.message);
                
                if (isDevelopment) {
                    console.info('💡 Development mode: Backend may have CORS issues, will prioritize ML API and local predictions');
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
                console.log('ℹ️ Switching to offline mode with local predictions.');
                this.offlineMode = true;
                this.lastOfflineCheck = new Date();
            }
            
            return {
                success: false,
                message: 'Using offline mode with local predictions.',
                error: error.message
            };
        }
    }

    // Helper method to get connection status message - simplified
    getConnectionMessage(backend) {
        return backend ? 'Backend service available' : 'Offline mode - local predictions only';
    }

    // Remove direct ML API calls - commented out
    /*
    async predictWithML(data) {
        // Remove direct calls to ML service
        // const response = await fetch('https://api-ml-production.up.railway.app/predict', ...);
    }
    */

    // New method to predict through backend - Fixed to handle errors properly
    async predictWithBackend(data) {
        try {
            console.log('🔗 Sending request to backend:', `${API_BASE_URL}/api/predict`);
            console.log('📋 Request data:', data);
            
            const response = await fetch(`${API_BASE_URL}/api/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': this.sessionId,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            console.log('📡 Response status:', response.status);
            console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Backend error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            
            const result = await response.json();
            console.log('✅ Backend response success:', result);
            
            return result;
        } catch (error) {
            console.error('❌ Backend API error:', error);
            throw error;
        }
    }

    // Updated prediction method to use backend first, then fallback
    async predict(inputData) {
        try {
            console.log('🚀 Starting prediction with data:', inputData);
            
            // First try backend API
            try {
                console.log('📤 Attempting backend prediction...');
                const backendResult = await this.predictWithBackend(inputData);
                
                if (backendResult && backendResult.success) {
                    console.log('✅ Backend prediction successful');
                    
                    // Save successful prediction
                    try {
                        this.savePredictionToLocalStorage(backendResult, inputData);
                        backendResult.saved = true;
                        backendResult.saved_to = 'localStorage';
                    } catch (saveError) {
                        console.warn('⚠️ Failed to save to localStorage:', saveError);
                        backendResult.saved = false;
                    }
                    
                    return backendResult;
                } else {
                    throw new Error('Backend returned unsuccessful response');
                }
            } catch (backendError) {
                console.warn('❌ Backend prediction failed:', backendError.message);
                
                // If it's a validation error, don't fallback
                if (backendError.message.includes('400') || backendError.message.includes('validation')) {
                    throw backendError;
                }
                
                // For other errors, try fallback
                console.log('🔄 Attempting local fallback prediction...');
                const localResult = this.localPredict(inputData);
                localResult.source = 'local-fallback';
                localResult.fallback_reason = backendError.message;
                
                try {
                    this.savePredictionToLocalStorage(localResult, inputData);
                    localResult.saved = true;
                    localResult.saved_to = 'localStorage';
                } catch (saveError) {
                    localResult.saved = false;
                }
                
                return localResult;
            }
        } catch (error) {
            console.error('❌ All prediction methods failed:', error);
            throw error;
        }
    }

    // Enhanced local prediction with correct gender mapping
    localPredict(formData) {
        const heightInM = formData.height / 100;
        const bmi = formData.weight / (heightInM * heightInM);
        
        // Enhanced risk calculation with correct gender mapping
        let riskScore = 0;
        const riskFactors = [];
        
        // Gender risk factor (sex: 0=Female, 1=Male)
        if (formData.sex === 1) { // Male
            riskScore += 1;
            riskFactors.push('Jenis kelamin laki-laki (faktor risiko tambahan)');
        }
        
        // Age risk factor
        if (formData.age > 65) {
            riskScore += 3;
            riskFactors.push('Usia > 65 tahun (risiko tinggi)');
        } else if (formData.age > 50) {
            riskScore += 2;
            riskFactors.push('Usia > 50 tahun (risiko sedang)');
        } else if (formData.age > 40) {
            riskScore += 1;
            riskFactors.push('Usia > 40 tahun (perlu perhatian)');
        }
        
        // BMI risk factor
        if (bmi > 30) {
            riskScore += 3;
            riskFactors.push('Obesitas (BMI > 30)');
        } else if (bmi > 25) {
            riskScore += 2;
            riskFactors.push('Overweight (BMI 25-30)');
        } else if (bmi < 18.5) {
            riskScore += 1;
            riskFactors.push('Underweight (BMI < 18.5)');
        }
        
        // Blood pressure risk factor
        if (formData.ap_hi > 140 || formData.ap_lo > 90) {
            riskScore += 3;
            riskFactors.push('Hipertensi (BP > 140/90)');
        } else if (formData.ap_hi > 130 || formData.ap_lo > 80) {
            riskScore += 2;
            riskFactors.push('Prehipertensi (BP 130-140/80-90)');
        }
        
        // Cholesterol risk factor
        if (formData.cholesterol === 3) {
            riskScore += 3;
            riskFactors.push('Kolesterol sangat tinggi');
        } else if (formData.cholesterol === 2) {
            riskScore += 2;
            riskFactors.push('Kolesterol tinggi');
        }
        
        // Glucose risk factor
        if (formData.gluc === 3) {
            riskScore += 3;
            riskFactors.push('Glukosa sangat tinggi (diabetes)');
        } else if (formData.gluc === 2) {
            riskScore += 2;
            riskFactors.push('Glukosa tinggi (prediabetes)');
        }
        
        // Smoking risk factor
        if (formData.smoke === 1) {
            riskScore += 2;
            riskFactors.push('Merokok aktif');
        }
        
        // Alcohol risk factor
        if (formData.alco === 1) {
            riskScore += 1;
            riskFactors.push('Konsumsi alkohol');
        }
        
        // Physical inactivity risk factor
        if (formData.active === 0) {
            riskScore += 2;
            riskFactors.push('Kurang aktivitas fisik');
        }
        
        // Calculate final risk and confidence
        const risk = riskScore >= 6 ? 1 : 0;
        const confidence = Math.min(95, Math.max(60, 95 - (riskScore * 3)));
        const probability = confidence / 100;
        
        return {
            success: true,
            prediction: {
                risk,
                confidence,
                probability,
                risk_label: risk === 1 ? 'High Risk' : 'Low Risk',
                bmi: bmi.toFixed(1),
                source: 'local'
            },
            patient_data: {
                age: formData.age,
                sex: formData.sex,
                gender: formData.sex === 0 ? 'Female' : 'Male',
                height: formData.height,
                weight: formData.weight,
                bmi: bmi.toFixed(1),
                blood_pressure: `${formData.ap_hi}/${formData.ap_lo}`,
                cholesterol: formData.cholesterol === 1 ? 'Normal' : formData.cholesterol === 2 ? 'Above Normal' : 'Well Above Normal',
                glucose: formData.gluc === 1 ? 'Normal' : formData.gluc === 2 ? 'Above Normal' : 'Well Above Normal',
                lifestyle: {
                    smoking: formData.smoke === 1 ? 'Yes' : 'No',
                    alcohol: formData.alco === 1 ? 'Yes' : 'No',
                    physical_activity: formData.active === 1 ? 'Yes' : 'No'
                }
            },
            data: {
                risk_factors: riskFactors,
                recommendations: this.getHealthRecommendations(risk, riskFactors),
                interpretation: `Local prediction based on ${riskFactors.length} risk factors (score: ${riskScore})`,
                result_message: risk === 1 
                    ? 'Konsultasi dengan dokter spesialis jantung sangat disarankan' 
                    : 'Lanjutkan gaya hidup sehat dan lakukan pemeriksaan rutin'
            },
            message: 'Local prediction completed',
            source: 'local'
        };
    }

    // Enhanced health recommendations
    getHealthRecommendations(risk, riskFactors = []) {
        const baseRecommendations = [
            'Lakukan pemeriksaan kesehatan rutin setiap 6 bulan',
            'Jaga pola makan seimbang rendah lemak dan garam',
            'Olahraga teratur minimal 30 menit/hari, 5 kali seminggu',
            'Kelola stres dengan teknik relaksasi dan meditasi'
        ];
        
        if (risk === 1) {
            baseRecommendations.unshift('Konsultasi segera dengan dokter spesialis jantung');
            baseRecommendations.push('Pantau tekanan darah secara rutin setiap hari');
        }
        
        // Specific recommendations based on risk factors
        if (riskFactors.some(f => f.includes('Merokok'))) {
            baseRecommendations.push('Berhenti merokok segera dan konsultasi dengan ahli');
        }
        
        if (riskFactors.some(f => f.includes('BMI') || f.includes('Overweight'))) {
            baseRecommendations.push('Program penurunan berat badan dengan diet sehat');
        }
        
        if (riskFactors.some(f => f.includes('Hipertensi'))) {
            baseRecommendations.push('Batasi konsumsi garam dan makanan olahan');
        }
        
        if (riskFactors.some(f => f.includes('Kolesterol'))) {
            baseRecommendations.push('Hindari makanan tinggi lemak jenuh');
        }
        
        if (riskFactors.some(f => f.includes('Glukosa'))) {
            baseRecommendations.push('Kontrol kadar gula darah dan batasi makanan manis');
        }
        
        if (riskFactors.some(f => f.includes('aktivitas'))) {
            baseRecommendations.push('Mulai dengan olahraga ringan seperti jalan kaki');
        }
        
        return baseRecommendations;
    }

    // Calculate BMI helper - Add missing method
    calculateBMI(height, weight) {
        if (!height || !weight) return null;
        const heightInM = height / 100;
        return Math.round((weight / (heightInM * heightInM)) * 100) / 100;
    }

    // New method to save predictions to Supabase
    async savePredictionToSupabase(predictionResult, inputData) {
        try {
            const predictionData = {
                age: parseInt(inputData.age),
                gender: parseInt(inputData.gender),
                height: parseFloat(inputData.height),
                weight: parseFloat(inputData.weight),
                systolic_bp: parseInt(inputData.systolic),
                diastolic_bp: parseInt(inputData.diastolic),
                cholesterol: parseInt(inputData.cholesterol),
                glucose: parseInt(inputData.glucose),
                smoking: parseInt(inputData.smoking),
                alcohol: parseInt(inputData.alcohol),
                physical_activity: parseInt(inputData.physical_activity),
                risk_prediction: parseInt(predictionResult.prediction?.risk || 0),
                risk_probability: parseFloat(predictionResult.prediction?.probability || 0),
                risk_confidence: parseFloat(predictionResult.prediction?.confidence || 0),
                risk_label: String(predictionResult.prediction?.risk_label || 'Unknown'),
                risk_factors: predictionResult.prediction?.risk_factors || [],
                recommendations: predictionResult.prediction?.recommendations || [],
                prediction_source: String(predictionResult.source || 'unknown'),
                session_id: String(this.sessionId),
                bmi: this.calculateBMI(inputData.height, inputData.weight)
            };

            console.log('💾 Attempting to save to Supabase:', predictionData);

            // Try multiple possible table names based on your database structure
            const tableNames = [
                'Cardiovascular Predictions Table',  // Exact name you mentioned
                'cardiovascular_predictions_table',  // Snake case version
                'cardiovascular-predictions-table',  // Kebab case version
                'cardiovascular_predictions',        // Common naming
                'predictions',                       // Simple version
                'prediction_data',                   // Alternative
                'cardio_predictions'                 // Short version
            ];
            
            let saveSuccess = false;
            let lastError = null;

            for (const tableName of tableNames) {
                try {
                    console.log(`🔍 Trying table name: '${tableName}'`);
                    
                    const { data, error } = await this.supabase
                        .from(tableName)
                        .insert([predictionData]);

                    if (error) {
                        lastError = error;
                        console.warn(`Failed to save to table '${tableName}':`, error.message);
                        continue;
                    }

                    console.log(`✅ Data saved to Supabase table '${tableName}':`, data);
                    saveSuccess = true;
                    
                    // Store successful table name for future use
                    localStorage.setItem('supabase_table_name', tableName);
                    break;

                } catch (tableError) {
                    lastError = tableError;
                    console.warn(`Error accessing table '${tableName}':`, tableError.message);
                    continue;
                }
            }

            if (!saveSuccess) {
                throw new Error(`Supabase error: ${lastError?.message || 'All table attempts failed'}`);
            }

            return true;

        } catch (error) {
            console.error('❌ Supabase save error:', error);
            throw error;
        }
    }

    // Enhanced getSavedPredictions with multiple table support
    async getSavedPredictions(page = 1, limit = 10, filters = {}) {
        try {
            // Check if we have a previously successful table name
            const storedTableName = localStorage.getItem('supabase_table_name');
            
            // Try multiple table names, prioritizing the previously successful one
            const tableNames = storedTableName 
                ? [storedTableName, 'Cardiovascular Predictions Table', 'cardiovascular_predictions_table', 'cardiovascular_predictions', 'predictions', 'prediction_data']
                : ['Cardiovascular Predictions Table', 'cardiovascular_predictions_table', 'cardiovascular_predictions', 'predictions', 'prediction_data', 'cardio_predictions'];
            
            for (const tableName of tableNames) {
                try {
                    console.log(`🔍 Trying to read from table: '${tableName}'`);
                    
                    let query = this.supabase
                        .from(tableName)
                        .select('*', { count: 'exact' })
                        .order('created_at', { ascending: false });

                    // Apply filters
                    if (filters.risk_level) {
                        query = query.eq('risk_prediction', filters.risk_level === 'high' ? 1 : 0);
                    }
                    
                    if (filters.date_from) {
                        query = query.gte('created_at', filters.date_from);
                    }
                    
                    if (filters.date_to) {
                        query = query.lte('created_at', filters.date_to);
                    }

                    // Apply pagination
                    const from = (page - 1) * limit;
                    const to = from + limit - 1;
                    query = query.range(from, to);

                    const { data, error, count } = await query;

                    if (!error && data) {
                        console.log(`📊 Retrieved predictions from table '${tableName}':`, data.length);
                        
                        // Store successful table name for future use
                        localStorage.setItem('supabase_table_name', tableName);
                        
                        return {
                            data: data || [],
                            totalPages: Math.ceil((count || 0) / limit),
                            currentPage: page,
                            total: count || 0,
                            source: 'supabase',
                            table: tableName
                        };
                    }
                } catch (tableError) {
                    console.warn(`Failed to access table '${tableName}':`, tableError.message);
                    continue;
                }
            }
            
            throw new Error('No accessible Supabase table found');

        } catch (error) {
            console.error('❌ Failed to get Supabase predictions:', error);
            
            // Fallback to localStorage
            try {
                const localPredictions = JSON.parse(localStorage.getItem('illdetect_predictions') || '[]');
                
                let filteredData = localPredictions;
                if (filters.risk_level) {
                    filteredData = filteredData.filter(p => 
                        filters.risk_level === 'high' ? p.prediction?.risk === 1 : p.prediction?.risk === 0
                    );
                }
                
                const from = (page - 1) * limit;
                const to = from + limit;
                const paginatedData = filteredData.slice(from, to);
                
                return {
                    data: paginatedData,
                    totalPages: Math.ceil(filteredData.length / limit),
                    currentPage: page,
                    total: filteredData.length,
                    source: 'localStorage'
                };
                
            } catch (localError) {
                console.error('❌ Failed to get localStorage predictions:', localError);
                return {
                    data: [],
                    totalPages: 1,
                    currentPage: 1,
                    total: 0,
                    source: 'none'
                };
            }
        }
    }

    // Enhanced statistics with multiple table support
    async getStatistics() {
        try {
            // Check if we have a previously successful table name
            const storedTableName = localStorage.getItem('supabase_table_name');
            
            const tableNames = storedTableName 
                ? [storedTableName, 'Cardiovascular Predictions Table', 'cardiovascular_predictions_table', 'cardiovascular_predictions', 'predictions']
                : ['Cardiovascular Predictions Table', 'cardiovascular_predictions_table', 'cardiovascular_predictions', 'predictions', 'prediction_data'];
            
            for (const tableName of tableNames) {
                try {
                    console.log(`🔍 Trying to get stats from table: '${tableName}'`);
                    
                    const { data, error } = await this.supabase
                        .from(tableName)
                        .select('risk_prediction, risk_probability, created_at')
                        .order('created_at', { ascending: false });

                    if (!error && data) {
                        const stats = {
                            totalPredictions: data.length,
                            highRiskPredictions: data.filter(p => p.risk_prediction === 1).length,
                            lowRiskPredictions: data.filter(p => p.risk_prediction === 0).length,
                            averageRiskScore: data.length > 0 ? 
                                data.reduce((sum, p) => sum + (p.risk_probability || 0), 0) / data.length : 0,
                            recentPredictions: data.slice(0, 5),
                            source: 'supabase',
                            table: tableName
                        };

                        console.log(`📊 Statistics from table '${tableName}':`, stats);
                        
                        // Store successful table name for future use
                        localStorage.setItem('supabase_table_name', tableName);
                        
                        return stats;
                    }
                } catch (tableError) {
                    console.warn(`Failed to get stats from table '${tableName}':`, tableError.message);
                    continue;
                }
            }
            
            throw new Error('No accessible Supabase table found for statistics');

        } catch (error) {
            console.error('❌ Failed to get Supabase statistics:', error);
            return this.getLocalStatistics();
        }
    }

    // Local statistics fallback
    getLocalStatistics() {
        try {
            const localPredictions = JSON.parse(localStorage.getItem('illdetect_predictions') || '[]');
            
            return {
                totalPredictions: localPredictions.length,
                highRiskPredictions: localPredictions.filter(p => p.prediction?.risk === 1).length,
                lowRiskPredictions: localPredictions.filter(p => p.prediction?.risk === 0).length,
                averageRiskScore: localPredictions.length > 0 ? 
                    localPredictions.reduce((sum, p) => sum + (p.prediction?.probability || 0), 0) / localPredictions.length : 0,
                recentPredictions: localPredictions.slice(0, 5),
                source: 'localStorage'
            };
        } catch (error) {
            console.error('❌ Failed to get local statistics:', error);
            return {
                totalPredictions: 0,
                highRiskPredictions: 0,
                lowRiskPredictions: 0,
                averageRiskScore: 0,
                recentPredictions: [],
                source: 'error'
            };
        }
    }

    // Fallback localStorage saving
    savePredictionToLocalStorage(predictionResult, inputData) {
        try {
            const predictions = JSON.parse(localStorage.getItem('illdetect_predictions') || '[]');
            
            const newPrediction = {
                id: Date.now().toString(),
                ...inputData,
                prediction: predictionResult.prediction,
                source: predictionResult.source,
                timestamp: new Date().toISOString(),
                bmi: this.calculateBMI(inputData.height, inputData.weight)
            };
            
            predictions.unshift(newPrediction);
            
            // Keep only last 50 predictions in localStorage
            if (predictions.length > 50) {
                predictions.splice(50);
            }
            
            localStorage.setItem('illdetect_predictions', JSON.stringify(predictions));
            console.log('💾 Prediction saved to localStorage');
            
        } catch (error) {
            console.error('❌ localStorage save error:', error);
            throw error;
        }
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