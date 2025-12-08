import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { AlertTriangle } from 'lucide-react';
import sellerService from '../services/sellerService';
import orderService from '../services/orderService';
import earningsService from '../services/earningsService';

export default function SellerDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    pendingReturns: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const dashboardResponse = await sellerService.getDashboard();
      const dashboardData = dashboardResponse.data || dashboardResponse;
      setStats(dashboardData.stats || {});
      setRecentOrders(dashboardData.recentOrders || []);

      // Fetch products to check low stock
      try {
        const productsResponse = await sellerService.getProducts();
        const products = productsResponse.products || [];
        const lowStock = products.filter(p => {
          const stock = p.stock?.quantity || p.stock || 0;
          const threshold = p.stock?.lowStockThreshold || 10;
          return stock < threshold && stock > 0;
        });
        setLowStockProducts(lowStock);
      } catch (err) {
        console.error('Error fetching products:', err);
      }

      // Fetch earnings for chart
      try {
        const earningsResponse = await earningsService.getEarningsSummary();
        const monthlyEarnings = earningsResponse.data?.monthlyEarnings || [];
        setSalesData(monthlyEarnings.map(item => ({
          month: item.month,
          sales: item.amount || 0
        })));
      } catch {
        // Use fallback data if earnings fail
        setSalesData([]);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'delivered': 'bg-green-100 text-green-700',
      'shipped': 'bg-blue-100 text-blue-700',
      'processing': 'bg-purple-100 text-purple-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'cancelled': 'bg-red-100 text-red-700',
      'return_requested': 'bg-orange-100 text-orange-700',
      'return_approved': 'bg-green-100 text-green-700',
      'return_rejected': 'bg-red-100 text-red-700',
      'returned': 'bg-blue-100 text-blue-700'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  const summary = [
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: 'dollar', color: 'purple' },
    { label: 'Total Orders', value: (stats.totalOrders || 0).toLocaleString(), icon: 'cart', color: 'pink' },
    { label: 'Products', value: (stats.totalProducts || 0).toLocaleString(), icon: 'box', color: 'purple' },
    { label: 'Pending Returns', value: (stats.pendingReturns || 0).toLocaleString(), icon: 'return', color: 'orange' },
  ];

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="text-purple-600 text-xl">Loading dashboard...</div>
      </div>
    );
  }
  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-2 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-purple-700">Seller Dashboard</h2>
        <p className="text-purple-500 mb-6 sm:mb-4 text-base sm:text-lg">Overview of your sales, products, and orders.</p>
        
        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="mb-3 p-2 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-lg shadow-md">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-orange-600 mt-1" size={28} />
              <div className="flex-1">
                <h3 className="font-bold text-orange-900 text-lg mb-2">⚠️ Low Stock Alert!</h3>
                <p className="text-orange-800 mb-3">
                  {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} running low on stock. Please restock immediately to avoid stockouts!
                </p>
                <div className="space-y-2">
                  {lowStockProducts.slice(0, 3).map(product => {
                    const stock = product.stock?.quantity || product.stock || 0;
                    return (
                      <div key={product._id} className="bg-white p-2 rounded-lg border border-orange-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {product.images?.[0] && (
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-semibold text-purple-900">{product.name}</p>
                              <p className="text-sm text-orange-600">Only {stock} units left!</p>
                            </div>
                          </div>
                          <a 
                            href="/seller/inventory" 
                            className="px-3 py-1 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-colors"
                          >
                            Restock Now
                          </a>
                        </div>
                      </div>
                    );
                  })}
                  {lowStockProducts.length > 3 && (
                    <p className="text-sm text-orange-700 text-center mt-2">
                      + {lowStockProducts.length - 3} more products need restocking
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {summary.map((stat, i) => {
            let Icon;
            if (stat.icon === 'dollar') {
              Icon = <svg className="text-purple-600" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4" /></svg>;
            } else if (stat.icon === 'cart') {
              Icon = <svg className="text-pink-600" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.6 17h8.8a1 1 0 00.95-.68L21 9M7 13V6h13" /></svg>;
            } else if (stat.icon === 'box') {
              Icon = <svg className="text-purple-600" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V7m-16 6V7m16 6v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" /></svg>;
            } else if (stat.icon === 'return') {
              Icon = <svg className="text-orange-600" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>;
            } else if (stat.icon === 'users') {
              Icon = <svg className="text-pink-600" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M3 20h5v-2a4 4 0 013-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
            }
            return (
              <Card
                key={i}
                className="p-4 border border-purple-200 bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex justify-between items-start h-full">
                  <div>
                    <p className={`text-sm ${stat.color === 'purple' ? 'text-purple-600' : stat.color === 'orange' ? 'text-orange-600' : 'text-pink-600'} font-medium`}>{stat.label}</p>
                    <h3 className="text-3xl font-bold mt-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stat.value}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <svg width="16" height="16" fill="none" stroke="green" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" /></svg>
                      <span className="text-xs text-green-500">Live data</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color === 'purple' ? 'bg-purple-100' : stat.color === 'orange' ? 'bg-orange-100' : 'bg-pink-100'}`}>{Icon}</div>
                </div>
              </Card>
            );
          })}
        </div>
        {/* Sales Chart */}
        {salesData.length > 0 ? (
          <div className="bg-white rounded-xl shadow p-4 mb-8 border border-purple-100">
            <h3 className="text-xl font-bold mb-4 text-purple-700">Sales Trend</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#9333ea" />
                  <YAxis stroke="#9333ea" />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']} />
                  <Line type="monotone" dataKey="sales" stroke="#ec4899" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-4 mb-8 border border-purple-100">
            <h3 className="text-xl font-bold mb-4 text-purple-700">Sales Trend</h3>
            <p className="text-center text-gray-500 py-8">No sales data available yet. Complete orders to see your sales trend!</p>
          </div>
        )}
        {/* Recent Orders Table */}
        <div className="bg-white rounded-lg shadow p-4 border border-purple-100">
          <h3 className="text-lg font-bold mb-4 text-purple-700">Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No recent orders</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Order ID</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Date</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Product</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Amount</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const displayStatus = order.status?.replace('return_', '') || order.status;
                    return (
                    <tr key={order._id || order.orderNumber} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                      <td className="px-2 sm:px-4 py-2 sm:py-4 font-mono text-purple-900">{order.orderNumber || order._id?.slice(-8)}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-4">{formatDate(order.createdAt)}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-4">{order.items?.[0]?.product?.name || 'N/A'}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-4 font-bold text-purple-700">{formatCurrency(order.pricing?.total || order.totalAmount || 0)}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-4">
                        <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(order.status)}`}>
                          {displayStatus}
                        </span>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
