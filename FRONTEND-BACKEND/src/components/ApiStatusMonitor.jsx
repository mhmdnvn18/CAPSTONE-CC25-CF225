import React, { useState, useEffect, useCallback } from 'react';
import CardiovascularAPI, { SupabaseService } from '../services/api';

const ApiStatusMonitor = () => {
    const [status, setStatus] = useState({
        connected: false,
        loading: true,
        message: 'Checking...',
        lastCheck: null
    });

    const [showDetails, setShowDetails] = useState(false);
    const [testResults, setTestResults] = useState(null);
    const [testLoading, setTestLoading] = useState(false);

    const checkApiStatus = useCallback(async () => {
        try {
            setStatus(prev => ({ ...prev, loading: true }));
            
            const result = await CardiovascularAPI.getConnectionStatus();
            setStatus({
                connected: result.connected,
                loading: false,
                message: result.status,
                lastCheck: result.timestamp,
                suggestions: result.suggestions,
                details: result.details
            });
            
            return result;
        } catch (error) {
            const errorStatus = {
                connected: false,
                loading: false,
                message: 'Connection failed',
                lastCheck: new Date(),
                error: error.message
            };
            
            setStatus(errorStatus);
            return errorStatus;
        }
    }, []);

    const runFullTest = useCallback(async () => {
        try {
            setTestLoading(true);
            setTestResults(null);
            
            console.log('🧪 Starting full API test...');
            const results = await CardiovascularAPI.testAllEndpoints();
            setTestResults(results);
            console.log('✅ Full API Test completed:', results);
            
            return results;
        } catch (error) {
            console.error('❌ Full test failed:', error);
            const errorResults = {
                error: {
                    status: 'FAIL',
                    message: error.message || 'Full test failed'
                }
            };
            setTestResults(errorResults);
            return errorResults;
        } finally {
            setTestLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        
        const initializeStatus = () => {
            checkApiStatus().catch(error => {
                if (isMounted) {
                    console.error('Initial API check failed:', error);
                }
            });
        };
        
        initializeStatus();
        
        const interval = setInterval(() => {
            if (isMounted) {
                checkApiStatus().catch(error => {
                    console.error('Periodic API check failed:', error);
                });
            }
        }, 30000);
        
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [checkApiStatus]);

    // Expose functions to window for console testing
    useEffect(() => {
        // Basic Flask API tests
        window.testFlaskAPI = {
            health: () => {
                console.log('🔄 Testing Flask Health...');
                return fetch('http://localhost:5000/health')
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        }
                        throw new Error(`HTTP ${response.status}`);
                    })
                    .then(data => {
                        console.log('✅ Health Check Success:', data);
                        return data;
                    })
                    .catch(error => {
                        console.error('❌ Health Check Failed:', error.message);
                        throw error;
                    });
            },

            predict: () => {
                console.log('🔄 Testing Flask Prediction...');
                const testData = {
                    age: 35, gender: 1, height: 165, weight: 60,
                    ap_hi: 120, ap_lo: 80, cholesterol: 1, gluc: 1,
                    smoke: 0, alco: 0, active: 1
                };

                return fetch('http://localhost:5000/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(testData)
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error(`HTTP ${response.status}`);
                })
                .then(data => {
                    console.log('✅ Prediction Success:', {
                        risk: data.prediction.risk_label,
                        confidence: data.prediction.confidence,
                        probability: data.prediction.probability
                    });
                    return data;
                })
                .catch(error => {
                    console.error('❌ Prediction Failed:', error.message);
                    throw error;
                });
            },

            all: async () => {
                console.log('🧪 Running All Flask API Tests');
                console.log('================================');
                
                try {
                    await window.testFlaskAPI.health();
                    await window.testFlaskAPI.predict();
                    console.log('🎉 All Flask Tests Completed Successfully!');
                } catch (error) {
                    console.error('💥 Some Flask tests failed');
                }
            },

            status: () => {
                return checkApiStatus()
                    .then(result => {
                        console.log('📊 API Status:', result);
                        return result;
                    })
                    .catch(error => {
                        console.error('❌ Status Check Failed:', error);
                        throw error;
                    });
            }
        };

        // Supabase tests
        window.testSupabase = {
            connection: async () => {
                console.log('🔄 Testing Supabase Connection...');
                try {
                    const result = await SupabaseService.testConnection();
                    if (result.success) {
                        console.log('✅ Supabase Connection: OK');
                    } else {
                        console.error('❌ Supabase Connection Failed:', result.message);
                    }
                    return result;
                } catch (error) {
                    console.error('❌ Supabase Connection Error:', error);
                    throw error;
                }
            },

            saveSample: async () => {
                console.log('🔄 Testing Supabase Save...');
                const sampleData = {
                    age: 35, gender: 1, height: 165, weight: 60,
                    ap_hi: 120, ap_lo: 80, cholesterol: 1, gluc: 1,
                    smoke: 0, alco: 0, active: 1
                };
                
                const prediction = {
                    risk: 0,
                    percentage: 25,
                    bmi: 22.0,
                    level: 'Rendah'
                };
                
                try {
                    const result = await SupabaseService.savePrediction(sampleData, prediction, {
                        source: 'console_test'
                    });
                    console.log('✅ Sample saved to Supabase:', result);
                    return result;
                } catch (error) {
                    console.error('❌ Save to Supabase failed:', error);
                    throw error;
                }
            },
            
            getData: async () => {
                console.log('🔄 Testing Supabase Get Data...');
                try {
                    const data = await CardiovascularAPI.getSavedPredictions(1, 5);
                    console.log('✅ Data retrieved from Supabase:', data);
                    return data;
                } catch (error) {
                    console.error('❌ Get data from Supabase failed:', error);
                    throw error;
                }
            },
            
            getStats: async () => {
                console.log('🔄 Testing Supabase Statistics...');
                try {
                    const stats = await CardiovascularAPI.getStatistics();
                    console.log('✅ Statistics from Supabase:', stats);
                    return stats;
                } catch (error) {
                    console.error('❌ Get stats from Supabase failed:', error);
                    throw error;
                }
            },

            all: async () => {
                console.log('🧪 Running All Supabase Tests');
                console.log('==============================');
                
                try {
                    await window.testSupabase.connection();
                    await window.testSupabase.saveSample();
                    await window.testSupabase.getData();
                    await window.testSupabase.getStats();
                    console.log('🎉 All Supabase Tests Completed Successfully!');
                } catch (error) {
                    console.error('💥 Some Supabase tests failed');
                }
            }
        };

        // Combined tests
        window.testAll = async () => {
            console.log('🚀 Running ALL System Tests');
            console.log('============================');
            
            try {
                console.log('\n1️⃣ Testing Flask API...');
                await window.testFlaskAPI.all();
                
                console.log('\n2️⃣ Testing Supabase...');
                await window.testSupabase.all();
                
                console.log('\n🎊 ALL SYSTEM TESTS COMPLETED SUCCESSFULLY!');
            } catch (error) {
                console.error('💥 Some system tests failed');
            }
        };

        // Clean up on unmount
        return () => {
            delete window.testFlaskAPI;
            delete window.testSupabase;
            delete window.testAll;
        };
    }, [checkApiStatus]);

    const handleRefresh = () => {
        checkApiStatus().catch(error => {
            console.error('Manual refresh failed:', error);
        });
    };

    const handleFullTest = () => {
        runFullTest().catch(error => {
            console.error('Manual test failed:', error);
        });
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className={`px-4 py-2 rounded-lg shadow-lg text-white text-sm font-medium ${
                status.loading ? 'bg-blue-500' : 
                status.connected ? 'bg-green-500' : 'bg-red-500'
            }`}>
                <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                        status.loading ? 'bg-blue-200 animate-pulse' :
                        status.connected ? 'bg-green-200' : 'bg-red-200'
                    }`}></div>
                    <span>{status.message}</span>
                    <button 
                        onClick={() => setShowDetails(!showDetails)}
                        className="ml-2 text-xs underline hover:no-underline"
                    >
                        {showDetails ? 'Hide' : 'Details'}
                    </button>
                </div>
            </div>

            {showDetails && (
                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-96">
                    <h3 className="font-bold text-gray-800 mb-3">API Status Details</h3>
                    
                    <div className="space-y-2 text-sm">
                        {status.details && (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Flask API:</span>
                                    <span className={status.details.flask ? 'text-green-600' : 'text-red-600'}>
                                        {status.details.flask ? 'Connected' : 'Disconnected'}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Supabase:</span>
                                    <span className={status.details.supabase ? 'text-green-600' : 'text-red-600'}>
                                        {status.details.supabase ? 'Connected' : 'Disconnected'}
                                    </span>
                                </div>
                            </>
                        )}
                        
                        <div className="flex justify-between">
                            <span className="text-gray-600">Last Check:</span>
                            <span className="text-gray-800">
                                {status.lastCheck ? status.lastCheck.toLocaleTimeString() : 'Never'}
                            </span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="text-gray-600">Flask URL:</span>
                            <span className="text-gray-800 text-xs">localhost:5000</span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="text-gray-600">Supabase:</span>
                            <span className="text-gray-800 text-xs">gczyorsjoxzunuqlebdd</span>
                        </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                        <button
                            onClick={handleRefresh}
                            disabled={status.loading}
                            className="flex-1 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {status.loading ? 'Checking...' : 'Refresh'}
                        </button>
                        
                        <button
                            onClick={handleFullTest}
                            disabled={testLoading}
                            className="flex-1 px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 disabled:opacity-50"
                        >
                            {testLoading ? 'Testing...' : 'Full Test'}
                        </button>
                    </div>

                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                        <p className="font-medium text-blue-800 mb-1">Console Commands:</p>
                        <div className="text-blue-700 space-y-1">
                            <div>• <code>testFlaskAPI.all()</code> - Test Flask API</div>
                            <div>• <code>testSupabase.all()</code> - Test Supabase</div>
                            <div>• <code>testAll()</code> - Test Everything</div>
                        </div>
                    </div>

                    {testResults && (
                        <div className="mt-3 text-xs">
                            <p className="font-medium text-gray-800 mb-2">Test Results:</p>
                            {testResults.error ? (
                                <div className="text-red-600">
                                    Error: {testResults.error.message}
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {Object.entries(testResults).map(([endpoint, result]) => (
                                        <div key={endpoint} className="flex justify-between">
                                            <span className="text-gray-600 capitalize">{endpoint}:</span>
                                            <span className={result.status === 'OK' ? 'text-green-600' : 'text-red-600'}>
                                                {result.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ApiStatusMonitor;