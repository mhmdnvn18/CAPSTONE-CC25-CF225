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
        console.log('🚀 CardiovascularAPI initialized with backend:', API_BASE_URL);
    }

    async checkHealth() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            this.isConnected = data.success;
            this.lastChecked = new Date();
            
            console.log('✅ Backend health check:', data);
            return data;
        } catch (error) {
            console.error('❌ Backend health check failed:', error);
            this.isConnected = false;
            this.lastChecked = new Date();
            throw error;
        }
    }

    async predict(inputData) {
        try {
            console.log('📤 Sending prediction request to backend...');
            
            const response = await fetch(`${API_BASE_URL}/api/predict`, {
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
}

// Export singleton instance
export default new CardiovascularAPI();