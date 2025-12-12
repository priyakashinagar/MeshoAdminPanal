import React, { useState, useEffect } from "react";
import AdminLayout from '../components/layout/AdminLayout';
import { Loader2, AlertCircle, IndianRupee, TrendingUp, ShoppingBag, Calendar, BarChart3 } from 'lucide-react';
import adminService from '../services/adminService';

const SalesReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topCategory: ''
  });

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getSalesReports({ period });
      console.log('📊 Sales Reports Response:', response);
      
      if (response.success || response.data) {
        const reportsData = response.data?.reports || response.reports || [];
        const summaryData = response.data?.summary || response.summary || {
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0,
          topCategory: 'N/A'
        };
        
        setReports(reportsData);
        setSummary(summaryData);
      } else {
        // Set default values if no data
        setReports([]);
        setSummary({
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0,
          topCategory: 'N/A'
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch sales reports');
      console.error('Error fetching reports:', err);
      // Set default values on error
      setSummary({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        topCategory: 'N/A'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [period]);

  if (loading && reports.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-2 text-purple-600">Loading sales reports...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error && reports.length === 0) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-500 text-lg">{error}</p>
          <button onClick={fetchReports} className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg">
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-purple-900">Sales Reports</h1>
            <p className="text-sm text-gray-600 mt-1">Analyze your sales performance and trends</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            {loading && <Loader2 className="w-5 h-5 animate-spin text-purple-600" />}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-600 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-purple-800 mt-1 flex items-center">
              ₹{summary.totalRevenue?.toLocaleString() || 0}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-600 font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-blue-800 mt-1">
              {summary.totalOrders?.toLocaleString() || 0}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
            <p className="text-xs text-green-600 font-medium">Avg Order Value</p>
            <p className="text-2xl font-bold text-green-800 mt-1">
              ₹{summary.averageOrderValue?.toLocaleString() || 0}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg border border-orange-200">
            <p className="text-xs text-orange-600 font-medium">Top Category</p>
            <p className="text-lg font-bold text-orange-800 mt-1 truncate" title={summary.topCategory || 'N/A'}>
              {summary.topCategory || 'N/A'}
            </p>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow-lg p-4 border border-purple-100">
          <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
            <table className="min-w-[800px] w-full text-left table-fixed">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-2 py-3 text-left font-semibold w-[20%] whitespace-nowrap">
                    {period === 'daily' ? 'Date' : period === 'weekly' ? 'Week' : 'Month'}
                  </th>
                  <th className="px-2 py-3 text-left font-semibold w-[20%] whitespace-nowrap">Total Sales</th>
                  <th className="px-2 py-3 text-left font-semibold w-[15%] whitespace-nowrap">Orders</th>
                  <th className="px-2 py-3 text-left font-semibold w-[20%] whitespace-nowrap">Avg Order Value</th>
                  <th className="px-2 py-3 text-left font-semibold w-[15%] whitespace-nowrap">Growth</th>
                  <th className="px-2 py-3 text-left font-semibold w-[10%] whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-2 py-8 text-center text-gray-500">
                      No sales data available for this period
                    </td>
                  </tr>
                ) : (
                  reports.map((report, index) => (
                    <tr key={report._id || index} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                      <td className="px-2 py-3 font-medium text-purple-900">
                        {report.period}
                      </td>
                      <td className="px-2 py-3 font-semibold text-gray-900">
                        ₹{report.totalSales?.toLocaleString() || 0}
                      </td>
                      <td className="px-2 py-3 text-gray-900">
                        {report.orderCount || 0}
                      </td>
                      <td className="px-2 py-3 text-gray-900">
                        ₹{report.averageOrderValue?.toLocaleString() || 0}
                      </td>
                      <td className="px-2 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          (report.growth || 0) >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {(report.growth || 0) >= 0 ? '↑' : '↓'} {Math.abs(report.growth || 0).toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <button className="text-purple-600 font-bold hover:underline text-sm">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visual Chart Placeholder */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-purple-900 mb-4">Sales Trend</h3>
          <div className="h-64 flex items-end justify-around gap-2 px-4">
            {reports.slice(0, 12).map((report, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-lg transition-all hover:from-purple-700 hover:to-pink-600"
                  style={{ 
                    height: `${Math.max(20, (report.totalSales / (Math.max(...reports.map(r => r.totalSales)) || 1)) * 200)}px` 
                  }}
                ></div>
                <p className="text-xs text-purple-600 mt-2 truncate w-full text-center">
                  {report.period?.slice(0, 3) || `#${index + 1}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SalesReports;
