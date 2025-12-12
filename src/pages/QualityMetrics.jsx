import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, TrendingDown, Package, Star, AlertTriangle, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import adminService from '../services/adminService';

const QualityMetrics = () => {
  const [metrics, setMetrics] = useState({
    overallQualityScore: 0,
    productReturnRate: 0,
    averageRating: 0,
    defectRate: 0,
    customerSatisfaction: 0,
    onTimeDelivery: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getQualityMetrics();
      const metricsData = response.data || response.metrics || response;
      setMetrics({
        overallQualityScore: metricsData.overallQualityScore || 0,
        productReturnRate: metricsData.productReturnRate || 0,
        averageRating: metricsData.averageRating || 0,
        defectRate: metricsData.defectRate || 0,
        customerSatisfaction: metricsData.customerSatisfaction || 0,
        onTimeDelivery: metricsData.onTimeDelivery || 0
      });
    } catch (err) {
      console.error('Error fetching quality metrics:', err);
      setError(err.message || 'Failed to fetch quality metrics');
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, icon: Icon, trend, unit = '', color = 'purple' }) => {
    const colorClasses = {
      purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-800',
      green: 'from-green-50 to-green-100 border-green-200 text-green-800',
      blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-800',
      orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-800',
      red: 'from-red-50 to-red-100 border-red-200 text-red-800'
    };

    return (
      <div className={`bg-gradient-to-br ${colorClasses[color]} p-4 rounded-lg border`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium opacity-75">{title}</p>
            <p className="text-2xl font-bold mt-1">
              {value}{unit}
            </p>
            {trend !== undefined && (
              <div className={`flex items-center gap-1 mt-1 text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span className="font-semibold">{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
          <Icon className="w-10 h-10 opacity-20" />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500" />
          <p className="text-red-600 font-semibold">{error}</p>
          <button onClick={fetchMetrics} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quality Metrics</h1>
        <p className="text-sm text-gray-600 mt-1">Monitor platform quality and customer satisfaction</p>
      </div>

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold opacity-90">Overall Quality Score</h2>
            <p className="text-4xl font-bold mt-2">{metrics.overallQualityScore}%</p>
            <p className="text-purple-100 mt-1 text-sm">Excellent performance</p>
          </div>
          <Award className="w-16 h-16 opacity-20" />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Customer Satisfaction"
          value={metrics.customerSatisfaction}
          unit="%"
          icon={CheckCircle}
          trend={2.5}
          color="green"
        />
        <MetricCard
          title="Average Rating"
          value={metrics.averageRating}
          unit="/5"
          icon={Star}
          trend={0.3}
          color="blue"
        />
        <MetricCard
          title="On-Time Delivery"
          value={metrics.onTimeDelivery}
          unit="%"
          icon={Package}
          trend={1.2}
          color="purple"
        />
        <MetricCard
          title="Product Return Rate"
          value={metrics.productReturnRate}
          unit="%"
          icon={AlertTriangle}
          trend={-0.5}
          color="orange"
        />
        <MetricCard
          title="Defect Rate"
          value={metrics.defectRate}
          unit="%"
          icon={XCircle}
          trend={-0.3}
          color="red"
        />
      </div>

      {/* Quality Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Score Breakdown</h3>
        <div className="space-y-4">
          {[
            { label: 'Product Quality', score: 90, color: 'bg-green-500' },
            { label: 'Delivery Performance', score: 88, color: 'bg-blue-500' },
            { label: 'Customer Service', score: 85, color: 'bg-purple-500' },
            { label: 'Return Management', score: 87, color: 'bg-orange-500' }
          ].map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700 font-medium">{item.label}</span>
                <span className="text-gray-900 font-semibold">{item.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`${item.color} h-2 rounded-full transition-all`} style={{ width: `${item.score}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default QualityMetrics;
