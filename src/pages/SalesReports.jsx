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
      if (response.success) {
        setReports(response.data.reports);
        setSummary(response.data.summary);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch sales reports');
      console.error('Error fetching reports:', err);
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
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-purple-900 dark:text-purple-50">Sales Reports</h2>
            <p className="text-purple-600 dark:text-purple-300 mt-2">Analyze your sales performance</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 rounded-xl border border-purple-200 bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-50"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            {loading && <Loader2 className="w-5 h-5 animate-spin text-purple-600" />}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold flex items-center mt-2">
                  <IndianRupee size={24} />{summary.totalRevenue?.toLocaleString() || 0}
                </p>
              </div>
              <TrendingUp size={40} className="text-purple-200" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-300 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-50 mt-2">
                  {summary.totalOrders?.toLocaleString() || 0}
                </p>
              </div>
              <ShoppingBag size={40} className="text-pink-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-300 text-sm">Avg Order Value</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-50 mt-2 flex items-center">
                  <IndianRupee size={20} />{summary.averageOrderValue?.toLocaleString() || 0}
                </p>
              </div>
              <BarChart3 size={40} className="text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-300 text-sm">Top Category</p>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-50 mt-2">
                  {summary.topCategory || 'N/A'}
                </p>
              </div>
              <Calendar size={40} className="text-green-500" />
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-bold">
                  {period === 'daily' ? 'Date' : period === 'weekly' ? 'Week' : 'Month'}
                </th>
                <th className="px-6 py-4 text-left font-bold">Total Sales</th>
                <th className="px-6 py-4 text-left font-bold">Orders</th>
                <th className="px-6 py-4 text-left font-bold">Avg Order Value</th>
                <th className="px-6 py-4 text-left font-bold">Growth</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-purple-600">
                    No sales data available for this period
                  </td>
                </tr>
              ) : (
                reports.map((report, index) => (
                  <tr key={report._id || index} className="border-b border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-purple-900 dark:text-purple-50">
                      {report.period}
                    </td>
                    <td className="px-6 py-4 text-purple-900 dark:text-purple-50 font-semibold">
                      <span className="flex items-center">
                        <IndianRupee size={14} />{report.totalSales?.toLocaleString() || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-purple-900 dark:text-purple-50">
                      {report.orderCount || 0}
                    </td>
                    <td className="px-6 py-4 text-purple-900 dark:text-purple-50">
                      <span className="flex items-center">
                        <IndianRupee size={14} />{report.averageOrderValue?.toLocaleString() || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        (report.growth || 0) >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {(report.growth || 0) >= 0 ? '+' : ''}{report.growth?.toFixed(1) || 0}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Visual Chart Placeholder */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-purple-900 dark:text-purple-50 mb-4">Sales Trend</h3>
          <div className="h-64 flex items-end justify-around gap-2 px-4">
            {reports.slice(0, 12).map((report, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-lg transition-all hover:from-purple-700 hover:to-pink-600"
                  style={{ 
                    height: `${Math.max(20, (report.totalSales / (Math.max(...reports.map(r => r.totalSales)) || 1)) * 200)}px` 
                  }}
                ></div>
                <p className="text-xs text-purple-600 dark:text-purple-300 mt-2 truncate w-full text-center">
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
