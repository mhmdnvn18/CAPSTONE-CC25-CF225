import React, { useState, useEffect } from 'react';
import CardiovascularAPI from '../services/api';

const DataViewer = () => {
    const [data, setData] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        riskLevel: '',
        gender: '',
        minAge: '',
        maxAge: ''
    });

    useEffect(() => {
        loadData();
        loadStats();
    }, [currentPage, filters]);

    const loadData = async () => {
        try {
            setLoading(true);
            const result = await CardiovascularAPI.getSavedPredictions(currentPage, 10, filters);
            setData(result.data);
            setTotalPages(result.totalPages);
            console.log('✅ Data loaded successfully:', result);
        } catch (error) {
            console.error('❌ Failed to load data:', error);
            alert('Gagal memuat data dari backend. Pastikan backend server berjalan.');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const statistics = await CardiovascularAPI.getStatistics();
            setStats(statistics);
            console.log('✅ Statistics loaded:', statistics);
        } catch (error) {
            console.error('❌ Failed to load stats:', error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value === '' ? '' : (isNaN(value) ? value : parseInt(value))
        }));
        setCurrentPage(1); // Reset to first page when filtering
    };

    const resetFilters = () => {
        setFilters({
            riskLevel: '',
            gender: '',
            minAge: '',
            maxAge: ''
        });
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRiskBadge = (risk) => {
        if (risk === 1) {
            return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">High Risk</span>;
        } else {
            return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Low Risk</span>;
        }
    };

    const getGenderText = (gender) => {
        return gender === 1 ? 'Perempuan' : 'Laki-laki';
    };

    const getSourceBadge = (source) => {
        const colors = {
            flask_api: 'bg-blue-100 text-blue-800',
            mock: 'bg-yellow-100 text-yellow-800',
            local_model: 'bg-purple-100 text-purple-800'
        };
        
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[source] || 'bg-gray-100 text-gray-800'}`}>
                {source}
            </span>
        );
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Data Prediksi Cardiovascular</h2>
            
            {/* Statistics Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-medium text-blue-800">Total Prediksi</h3>
                        <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <h3 className="font-medium text-red-800">High Risk</h3>
                        <p className="text-2xl font-bold text-red-900">{stats.highRisk}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="font-medium text-green-800">Low Risk</h3>
                        <p className="text-2xl font-bold text-green-900">{stats.lowRisk}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h3 className="font-medium text-purple-800">Rata-rata Usia</h3>
                        <p className="text-2xl font-bold text-purple-900">{stats.averageAge?.toFixed(1)}</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-3">Filter Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                        <select
                            name="riskLevel"
                            value={filters.riskLevel}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                            <option value="">Semua</option>
                            <option value={0}>Low Risk</option>
                            <option value={1}>High Risk</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                            name="gender"
                            value={filters.gender}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                            <option value="">Semua</option>
                            <option value={1}>Perempuan</option>
                            <option value={2}>Laki-laki</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Age</label>
                        <input
                            type="number"
                            name="minAge"
                            value={filters.minAge}
                            onChange={handleFilterChange}
                            placeholder="18"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Age</label>
                        <input
                            type="number"
                            name="maxAge"
                            value={filters.maxAge}
                            onChange={handleFilterChange}
                            placeholder="80"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={resetFilters}
                            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usia/Gender</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BP</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                        Tidak ada data
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(item.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.age}th / {getGenderText(item.gender)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.bmi || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.ap_hi}/{item.ap_lo}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getRiskBadge(item.risk_prediction)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.confidence_score}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getSourceBadge(item.prediction_source)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                                <span className="font-medium">{totalPages}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataViewer;