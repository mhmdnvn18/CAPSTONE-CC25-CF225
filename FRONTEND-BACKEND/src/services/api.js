import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const SUPABASE_URL = 'https://gczyorsjoxzunuqlebdd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjenlvcnNqb3h6dW51cWxlYmRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNjM0MDEsImV4cCI6MjA2MTkzOTQwMX0.Nnv_elhMz4fy4GCOhAOXC7y67wPMb-4YYLzFZKFEJJU';
const API_BASE_URL = 'http://localhost:5000';

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test Supabase connection immediately
const testSupabaseConnection = async () => {
    try {
        const { data, error } = await supabase
            .from('cardiovascular_predictions')
            .select('count', { count: 'exact', head: true });
        
        if (error) {
            console.warn('⚠️ Supabase connection test failed:', error.message);
        } else {
            console.log('✅ Supabase connected successfully');
        }
    } catch (error) {
        console.warn('⚠️ Supabase connection error:', error.message);
    }
};

// Test connection on import
testSupabaseConnection();

// Supabase helper functions
export const SupabaseService = {
    // Save prediction to Supabase
    async savePrediction(inputData, predictionResult, metadata = {}) {
        try {
            console.log('💾 Saving prediction to Supabase...');
            
            const predictionData = {
                // Input data
                age: inputData.age,
                gender: inputData.gender,
                height: inputData.height,
                weight: inputData.weight,
                ap_hi: inputData.ap_hi,
                ap_lo: inputData.ap_lo,
                cholesterol: inputData.cholesterol,
                gluc: inputData.gluc,
                smoke: inputData.smoke,
                alco: inputData.alco,
                active: inputData.active,
                
                // Prediction results
                risk_prediction: predictionResult.risk !== undefined ? predictionResult.risk : (predictionResult.level === 'Tinggi' ? 1 : 0),
                confidence_score: predictionResult.percentage || predictionResult.confidence || null,
                probability: predictionResult.probability || null,
                bmi: parseFloat(predictionResult.bmi) || null,
                
                // Metadata
                prediction_source: metadata.source || 'flask_api',
                user_ip: metadata.userIP || null,
                user_agent: metadata.userAgent || navigator.userAgent,
                session_id: metadata.sessionId || this.generateSessionId()
            };

            console.log('📤 Sending data to Supabase:', predictionData);

            const { data, error } = await supabase
                .from('cardiovascular_predictions')
                .insert([predictionData])
                .select();

            if (error) {
                console.error('❌ Supabase save error:', error);
                throw new Error(`Supabase error: ${error.message}`);
            }

            console.log('✅ Prediction saved to Supabase successfully:', data[0]);
            return data[0];
        } catch (error) {
            console.error('❌ Failed to save prediction to Supabase:', error);
            throw error;
        }
    },

    // Get predictions with pagination
    async getPredictions(page = 1, perPage = 10, filters = {}) {
        try {
            console.log(`📊 Fetching predictions from Supabase (page ${page})...`);
            
            let query = supabase
                .from('cardiovascular_predictions')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false });

            // Apply filters
            if (filters.riskLevel !== undefined && filters.riskLevel !== '') {
                query = query.eq('risk_prediction', filters.riskLevel);
            }
            if (filters.minAge) {
                query = query.gte('age', filters.minAge);
            }
            if (filters.maxAge) {
                query = query.lte('age', filters.maxAge);
            }
            if (filters.gender && filters.gender !== '') {
                query = query.eq('gender', filters.gender);
            }
            if (filters.source && filters.source !== '') {
                query = query.eq('prediction_source', filters.source);
            }

            // Apply pagination
            const from = (page - 1) * perPage;
            const to = from + perPage - 1;
            query = query.range(from, to);

            const { data, error, count } = await query;

            if (error) {
                console.error('❌ Supabase fetch error:', error);
                throw new Error(`Supabase fetch error: ${error.message}`);
            }

            console.log(`✅ Retrieved ${data.length} predictions from Supabase`);

            return {
                data,
                total: count,
                page,
                perPage,
                totalPages: Math.ceil(count / perPage)
            };
        } catch (error) {
            console.error('❌ Failed to fetch predictions from Supabase:', error);
            throw error;
        }
    },

    // Get statistics
    async getStatistics() {
        try {
            console.log('📈 Calculating statistics from Supabase...');
            
            const { data, error } = await supabase
                .from('cardiovascular_predictions')
                .select('risk_prediction, gender, age, bmi, prediction_source');

            if (error) {
                console.error('❌ Supabase stats error:', error);
                throw new Error(`Supabase stats error: ${error.message}`);
            }

            // Calculate statistics
            const stats = {
                total: data.length,
                highRisk: data.filter(item => item.risk_prediction === 1).length,
                lowRisk: data.filter(item => item.risk_prediction === 0).length,
                byGender: {
                    male: data.filter(item => item.gender === 2).length,
                    female: data.filter(item => item.gender === 1).length
                },
                bySource: {
                    flask_api: data.filter(item => item.prediction_source === 'flask_api').length,
                    mock: data.filter(item => item.prediction_source === 'mock').length,
                    mock_api_fallback: data.filter(item => item.prediction_source === 'mock_api_fallback').length,
                    mock_offline: data.filter(item => item.prediction_source === 'mock_offline').length,
                    console_test: data.filter(item => item.prediction_source === 'console_test').length
                },
                averageAge: data.length > 0 ? data.reduce((sum, item) => sum + item.age, 0) / data.length : 0,
                averageBMI: data.filter(item => item.bmi).length > 0 ? 
                    data.filter(item => item.bmi).reduce((sum, item) => sum + parseFloat(item.bmi), 0) / data.filter(item => item.bmi).length : 0
            };

            console.log('✅ Statistics calculated:', stats);
            return stats;
        } catch (error) {
            console.error('❌ Failed to get statistics from Supabase:', error);
            throw error;
        }
    },

    // Test Supabase connection
    async testConnection() {
        try {
            console.log('🔄 Testing Supabase connection...');
            
            const { data, error } = await supabase
                .from('cardiovascular_predictions')
                .select('count', { count: 'exact', head: true });
            
            if (error) {
                throw new Error(`Connection test failed: ${error.message}`);
            }
            
            console.log('✅ Supabase connection successful');
            return { success: true, message: 'Connection successful' };
        } catch (error) {
            console.error('❌ Supabase connection test failed:', error);
            return { success: false, message: error.message };
        }
    },

    // Delete old records (cleanup)
    async cleanupOldRecords(daysOld = 30) {
        try {
            console.log(`🧹 Cleaning up records older than ${daysOld} days...`);
            
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);

            const { data, error } = await supabase
                .from('cardiovascular_predictions')
                .delete()
                .lt('created_at', cutoffDate.toISOString());

            if (error) {
                console.error('❌ Supabase cleanup error:', error);
                throw new Error(`Cleanup error: ${error.message}`);
            }

            console.log(`✅ Cleaned up records older than ${daysOld} days`);
            return data;
        } catch (error) {
            console.error('❌ Failed to cleanup old records:', error);
            throw error;
        }
    },

    // Generate session ID
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
    },

    // Get user's IP (for metadata)
    async getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.warn('Could not get user IP:', error);
            return null;
        }
    }
};

class CardiovascularAPI {
    constructor() {
        this.isConnected = false;
        this.lastChecked = null;
        this.sessionId = SupabaseService.generateSessionId();
        console.log('🚀 CardiovascularAPI initialized with session:', this.sessionId);
    }

    async predict(data) {
        try {
            console.log('🔮 Making prediction request...');
            
            const response = await fetch(`${API_BASE_URL}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Prediction failed');
            }

            this.isConnected = true;
            const result = await response.json();
            
            console.log('✅ Flask API prediction successful:', result);
            
            // Save to Supabase after successful prediction
            try {
                const userIP = await SupabaseService.getUserIP();
                await SupabaseService.savePrediction(data, result.prediction, {
                    source: 'flask_api',
                    userIP,
                    sessionId: this.sessionId
                });
            } catch (supabaseError) {
                console.warn('⚠️ Failed to save to Supabase, but prediction succeeded:', supabaseError);
            }

            return result;
        } catch (error) {
            this.isConnected = false;
            console.error('❌ Prediction API Error:', error.message);
            throw error;
        }
    }

    async checkHealth() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(`${API_BASE_URL}/health`, {
                method: 'GET',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`Health check failed with status: ${response.status}`);
            }
            
            const data = await response.json();
            this.isConnected = true;
            this.lastChecked = new Date();
            
            return data;
        } catch (error) {
            this.isConnected = false;
            this.lastChecked = new Date();
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout (5s)');
            }
            throw error;
        }
    }

    async getConnectionStatus() {
        try {
            console.log('🔍 Checking connection status...');
            
            // Test both Flask API and Supabase
            const [flaskHealth, supabaseTest] = await Promise.allSettled([
                this.checkHealth(),
                SupabaseService.testConnection()
            ]);

            const flaskConnected = flaskHealth.status === 'fulfilled';
            const supabaseConnected = supabaseTest.status === 'fulfilled' && supabaseTest.value.success;

            const status = {
                connected: flaskConnected && supabaseConnected,
                status: `Flask: ${flaskConnected ? 'Connected' : 'Disconnected'}, Supabase: ${supabaseConnected ? 'Connected' : 'Disconnected'}`,
                timestamp: new Date(),
                message: flaskConnected && supabaseConnected ? 
                    'Both Flask API and Supabase are accessible' : 
                    'Some services are not accessible',
                details: {
                    flask: flaskConnected,
                    supabase: supabaseConnected,
                    flaskError: flaskHealth.status === 'rejected' ? flaskHealth.reason.message : null,
                    supabaseError: supabaseTest.status === 'rejected' ? supabaseTest.reason.message : 
                        (!supabaseTest.value.success ? supabaseTest.value.message : null)
                }
            };

            console.log('📊 Connection status:', status);
            return status;
        } catch (error) {
            console.error('❌ Connection status check failed:', error);
            return {
                connected: false,
                status: 'Connection Error',
                timestamp: new Date(),
                message: error.message,
                details: {
                    flask: false,
                    supabase: false,
                    error: error.message
                }
            };
        }
    }

    async testAllEndpoints() {
        const results = {
            health: null,
            predict: null,
            modelInfo: null,
            supabase: null
        };

        console.log('🧪 Starting full API endpoint test...');

        // Test Flask health endpoint
        try {
            const healthData = await this.checkHealth();
            results.health = { 
                status: 'OK', 
                message: 'Health endpoint working',
                data: healthData
            };
            console.log('✅ Health endpoint: OK');
        } catch (error) {
            results.health = { 
                status: 'FAIL', 
                message: error.message 
            };
            console.log('❌ Health endpoint: FAIL -', error.message);
        }

        // Test Flask predict endpoint
        try {
            const sampleData = {
                age: 50, gender: 2, height: 170, weight: 70,
                ap_hi: 120, ap_lo: 80, cholesterol: 1, gluc: 1,
                smoke: 0, alco: 0, active: 1
            };
            
            const predictData = await this.predict(sampleData);
            results.predict = { 
                status: 'OK', 
                message: 'Predict endpoint working',
                data: predictData
            };
            console.log('✅ Predict endpoint: OK');
        } catch (error) {
            results.predict = { 
                status: 'FAIL', 
                message: error.message 
            };
            console.log('❌ Predict endpoint: FAIL -', error.message);
        }

        // Test model-info endpoint
        try {
            const response = await fetch(`${API_BASE_URL}/model-info`);
            if (response.ok) {
                const modelData = await response.json();
                results.modelInfo = { 
                    status: 'OK', 
                    message: 'Model info endpoint working',
                    data: modelData
                };
                console.log('✅ Model Info endpoint: OK');
            } else {
                results.modelInfo = { 
                    status: 'FAIL', 
                    message: `Status: ${response.status}` 
                };
                console.log('❌ Model Info endpoint: FAIL - Status:', response.status);
            }
        } catch (error) {
            results.modelInfo = { 
                status: 'FAIL', 
                message: error.message 
            };
            console.log('❌ Model Info endpoint: FAIL -', error.message);
        }

        // Test Supabase connection
        try {
            const supabaseTest = await SupabaseService.testConnection();
            if (supabaseTest.success) {
                const stats = await SupabaseService.getStatistics();
                results.supabase = { 
                    status: 'OK', 
                    message: 'Supabase connection working',
                    data: { connection: supabaseTest, stats }
                };
                console.log('✅ Supabase endpoint: OK');
            } else {
                results.supabase = { 
                    status: 'FAIL', 
                    message: supabaseTest.message 
                };
                console.log('❌ Supabase endpoint: FAIL -', supabaseTest.message);
            }
        } catch (error) {
            results.supabase = { 
                status: 'FAIL', 
                message: error.message 
            };
            console.log('❌ Supabase endpoint: FAIL -', error.message);
        }

        console.log('🏁 Full API test completed:', results);
        return results;
    }

    // Supabase related methods
    async getSavedPredictions(page = 1, perPage = 10, filters = {}) {
        return await SupabaseService.getPredictions(page, perPage, filters);
    }

    async getStatistics() {
        return await SupabaseService.getStatistics();
    }

    // Getter untuk informasi koneksi
    getConnectionInfo() {
        return {
            isConnected: this.isConnected,
            lastChecked: this.lastChecked,
            apiUrl: API_BASE_URL,
            supabaseUrl: SUPABASE_URL,
            sessionId: this.sessionId
        };
    }
}

export default new CardiovascularAPI();
