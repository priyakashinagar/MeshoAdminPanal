import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, DollarSign, Star, AlertTriangle, Activity, BarChart3 } from 'lucide-react';
import adminService from '../services/adminService';
import AdminLayout from '../components/layout/AdminLayout';

const PlatformAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalSellers: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
    revenueGrowth: 0,
    orderGrowth: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching platform analytics...');
      
      const response = await adminService.getAnalytics();
      console.log('📊 Analytics Response:', response);

      if (response.data?.analytics) {
        setAnalytics(response.data.analytics);
      } else if (response.analytics) {
        setAnalytics(response.analytics);
      } else if (response.data) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('❌ Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, icon: Icon, trend, trendValue, color = 'purple' }) => {
    const colorClasses = {
      purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-800',
      blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-800',
      green: 'from-green-50 to-green-100 border-green-200 text-green-800',
      orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-800',
      pink: 'from-pink-50 to-pink-100 border-pink-200 text-pink-800'
    };

    return (
      <div className={`bg-gradient-to-br ${colorClasses[color]} p-6 rounded-lg border`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium opacity-75">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {trend !== undefined && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-semibold">{Math.abs(trend)}%</span>
                <span className="opacity-75">{trendValue}</span>
              </div>
            )}
          </div>
          <Icon className="w-12 h-12 opacity-20" />
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-sm text-gray-600 mt-1">Comprehensive platform performance metrics</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Revenue"
              value={`₹${analytics.totalRevenue?.toLocaleString('en-IN') || 0}`}
              icon={DollarSign}
              trend={analytics.revenueGrowth}
              trendValue="vs last month"
              color="green"
            />
            <MetricCard
              title="Total Orders"
              value={analytics.totalOrders?.toLocaleString('en-IN') || 0}
              icon={ShoppingCart}
              trend={analytics.orderGrowth}
              trendValue="vs last month"
              color="blue"
            />
            <MetricCard
              title="Active Sellers"
              value={analytics.totalSellers?.toLocaleString('en-IN') || 0}
              icon={Package}
              color="purple"
            />
            <MetricCard
              title="Total Customers"
              value={analytics.totalCustomers?.toLocaleString('en-IN') || 0}
              icon={Users}
              color="pink"
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Total Products"
              value={analytics.totalProducts?.toLocaleString('en-IN') || 0}
              icon={Package}
              color="orange"
            />
            <MetricCard
              title="Average Order Value"
              value={`₹${analytics.avgOrderValue?.toLocaleString('en-IN') || 0}`}
              icon={Activity}
              color="blue"
            />
            <MetricCard
              title="Conversion Rate"
              value={`${analytics.conversionRate || '0.0'}%`}
              icon={TrendingUp}
              color="green"
            />
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Revenue Trend
              </h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">Chart will be displayed here</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Order Statistics
              </h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">Chart will be displayed here</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
    </AdminLayout>
  );
};

export default PlatformAnalytics;
