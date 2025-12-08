import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Loader2, AlertCircle, IndianRupee, Calendar, Users } from 'lucide-react';
import adminService from '../services/adminService';

const Earnings = () => {
  const [earnings, setEarnings] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [analytics, setAnalytics] = useState(null);
  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('6months');
  const [search, setSearch] = useState('');

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getEarnings({ period });
      console.log('📊 Admin Earnings Response:', response);
      if (response.success || response.data) {
        const data = response.data || response;
        setEarnings(data.monthlyEarnings || []);
        setTotalEarnings(data.totalAdminEarnings || data.totalCommission || 0);
        setTotalOrders(data.totalOrders || 0);
        setAnalytics(data.analytics || null);
        setTopSellers(data.topSellers || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch earnings');
      console.error('Error fetching earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [period]);

  const filteredEarnings = earnings.filter(item =>
    item.month.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-2 text-purple-600">Loading earnings...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-500 text-lg">{error}</p>
          <button onClick={fetchEarnings} className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg">
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-purple-900">Platform Earnings</h1>
            <p className="text-purple-600 mt-1">Revenue from all completed orders</p>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 rounded-xl border border-purple-200 bg-white text-purple-900"
          >
            <option value="1month">Last 1 Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last 1 Year</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Commission Earnings</p>
                <p className="text-3xl font-bold flex items-center mt-1">
                  <IndianRupee size={24} />{totalEarnings.toLocaleString()}
                </p>
                <p className="text-xs opacity-75 mt-1">From {totalOrders} orders</p>
              </div>
              <DollarSign size={40} className="opacity-50" />
            </div>
          </div>

          {analytics && (
            <>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">This Month Commission</p>
                    <p className="text-3xl font-bold flex items-center mt-1">
                      <IndianRupee size={24} />{Number(analytics.thisMonth).toLocaleString()}
                    </p>
                  </div>
                  <Calendar size={40} className="opacity-50" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Growth Rate</p>
                    <p className="text-3xl font-bold flex items-center mt-1">
                      {Number(analytics.growthRate) >= 0 ? (
                        <TrendingUp size={24} className="mr-1" />
                      ) : (
                        <TrendingDown size={24} className="mr-1" />
                      )}
                      {analytics.growthRate}%
                    </p>
                  </div>
                  <TrendingUp size={40} className="opacity-50" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Avg Commission/Order</p>
                    <p className="text-3xl font-bold flex items-center mt-1">
                      <IndianRupee size={24} />{Number(analytics.averageOrderCommission).toLocaleString()}
                    </p>
                  </div>
                  <ShoppingCart size={40} className="opacity-50" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Top Sellers Section */}
        {topSellers.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
              <Users size={24} className="text-pink-500" />
              Top Revenue Generating Sellers (Commission)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {topSellers.slice(0, 5).map((seller, idx) => (
                <div key={seller.sellerId} className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-400' : 'bg-purple-500'
                    }`}>
                      #{idx + 1}
                    </span>
                    <div className="flex-1 truncate">
                      <p className="font-semibold text-purple-900 text-sm truncate">{seller.shopName}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-600">Commission:</span>
                      <span className="font-semibold">₹{seller.commission.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-600">Tax:</span>
                      <span className="font-semibold">₹{seller.tax.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-purple-200 pt-1">
                      <div className="flex justify-between">
                        <span className="text-xs font-semibold text-purple-600">Total:</span>
                        <span className="text-lg font-bold text-green-600">₹{seller.totalAdminEarning.toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="text-xs text-purple-500">{seller.orders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Earnings Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-purple-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-bold text-purple-900">Monthly Breakdown</h2>
              <div className="flex items-center gap-2 bg-purple-100 rounded-full px-5 py-2 w-full md:w-80">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600" width="20" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by month..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-0 bg-transparent text-purple-900 outline-none w-full placeholder-purple-400"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Month</th>
                  <th className="px-6 py-4 text-left">Orders</th>
                  <th className="px-6 py-4 text-left">Sales</th>
                  <th className="px-6 py-4 text-left">Commission</th>
                  <th className="px-6 py-4 text-left">Tax (GST)</th>
                  <th className="px-6 py-4 text-left">Admin Earnings</th>
                </tr>
              </thead>
              <tbody>
                {filteredEarnings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-purple-600">
                      No earnings data available
                    </td>
                  </tr>
                ) : (
                  filteredEarnings.map((item, idx) => (
                    <tr key={idx} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-purple-900">{item.month}</td>
                      <td className="px-6 py-4 text-purple-700">{item.orders}</td>
                      <td className="px-6 py-4 text-purple-700 flex items-center">
                        <IndianRupee size={14} />{item.sales?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 font-semibold text-orange-600 flex items-center">
                        <IndianRupee size={14} />{item.commission?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 font-semibold text-blue-600 flex items-center">
                        <IndianRupee size={14} />{item.tax?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 font-bold text-green-600 flex items-center">
                        <IndianRupee size={16} />{item.adminEarnings?.toLocaleString() || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div className="p-4 bg-purple-50 flex justify-between items-center">
            <span className="font-semibold text-purple-900">Total</span>
            <div className="flex items-center gap-8">
              <span className="text-purple-700">{totalOrders} orders</span>
              <span className="font-bold text-purple-900 flex items-center text-xl">
                <IndianRupee size={18} />{totalEarnings.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Earnings;
