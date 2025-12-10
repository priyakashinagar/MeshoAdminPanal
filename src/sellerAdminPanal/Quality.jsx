import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, AlertCircle, Star, Loader2 } from 'lucide-react';
import qualityService from '../services/qualityService';

export default function Quality() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    averageScore: 0,
    averageRating: 0,
    totalReturns: 0,
    averageReturnRate: 0
  });

  useEffect(() => {
    fetchQualityMetrics();
  }, []);

  const fetchQualityMetrics = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const sellerId = user.sellerId || user.seller?._id || user._id;
      
      const response = await qualityService.getAllMetrics(sellerId);
      if (response.success) {
        setMetrics(response.data);
        setStats(response.stats || {
          averageScore: 0,
          averageRating: 0,
          totalReturns: 0,
          averageReturnRate: 0
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch quality metrics');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Quality</h2>
      <p className="text-gray-600 mb-6">Monitor and improve your product quality metrics.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Star className="text-yellow-500" size={24} />
            <h3 className="font-semibold text-gray-700">Quality Score</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.averageScore?.toFixed(0) || 0}/100</div>
          <div className="text-sm text-gray-500 mt-1">Average across products</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Award className="text-blue-600" size={24} />
            <h3 className="font-semibold text-gray-700">Return Rate</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.averageReturnRate?.toFixed(1) || 0}%</div>
          <div className="text-sm text-gray-500 mt-1">{stats.totalReturns || 0} total returns</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-green-600" size={24} />
            <h3 className="font-semibold text-gray-700">Customer Rating</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.averageRating?.toFixed(1) || 0}</div>
          <div className="text-sm text-gray-500 mt-1">out of 5.0</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-orange-600" size={24} />
            <h3 className="font-semibold text-gray-700">Products</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">{metrics.length || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Tracked products</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200 mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Product Quality Details</h3>
        {metrics.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No quality metrics available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quality Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {metrics.map((metric) => (
                  <tr key={metric._id}>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">
                        {metric.productId?.name || 'Unknown Product'}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-2xl font-bold text-gray-900">{metric.score}/100</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-500" size={16} />
                        <span className="font-medium">{metric.metrics?.averageRating?.toFixed(1) || 0}</span>
                        <span className="text-gray-500 text-sm">({metric.metrics?.totalReviews || 0})</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-medium">{metric.metrics?.returnRate?.toFixed(1) || 0}%</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        metric.status === 'excellent' ? 'bg-green-100 text-green-700' :
                        metric.status === 'good' ? 'bg-blue-100 text-blue-700' :
                        metric.status === 'average' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {metric.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
