
import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import DashboardCharts from '../components/common/DashboardCharts';
import { DollarSign, ShoppingCart, Package, Users, ArrowUpRight } from 'react-feather';
import AdminLayout from '../components/layout/AdminLayout';
import adminService from '../services/adminService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboard();
      const data = response.data || response;
      setStats(data.stats || {});
      
      // Fetch recent orders
      const ordersResponse = await adminService.getAllOrders({ limit: 4 });
      setRecentOrders(ordersResponse.data?.orders || []);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      'delivered': 'bg-green-100 text-green-700',
      'shipped': 'bg-blue-100 text-blue-700',
      'processing': 'bg-purple-100 text-purple-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'cancelled': 'bg-red-100 text-red-700'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  const statsCards = [
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'purple' },
    { label: 'Total Orders', value: stats.totalOrders?.toLocaleString() || '0', icon: ShoppingCart, color: 'pink' },
    { label: 'Products', value: stats.totalProducts?.toLocaleString() || '0', icon: Package, color: 'purple' },
    { label: 'Customers', value: stats.totalUsers?.toLocaleString() || '0', icon: Users, color: 'pink' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-purple-600 text-xl">Loading dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Welcome Back!</h1>
          <p className="text-purple-600 mt-1">Here's your store overview</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="p-6 shadow-md hover:shadow-lg border border-purple-200 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">{stat.label}</p>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stat.value}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <ArrowUpRight size={16} className="text-green-500" />
                      <span className="text-xs text-green-500">Live data</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color === 'purple' ? 'bg-purple-100' : 'bg-pink-100'}`}> 
                    <Icon className={stat.color === 'purple' ? 'text-purple-600' : 'text-pink-600'} size={24} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <DashboardCharts />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 border border-purple-200 bg-white shadow-md">
            <h3 className="text-lg font-bold text-purple-700 mb-4">Recent Orders</h3>
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent orders</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-purple-200">
                      <th className="text-left py-2 px-3 text-purple-600 text-sm">Order ID</th>
                      <th className="text-left py-2 px-3 text-purple-600 text-sm">Customer</th>
                      <th className="text-left py-2 px-3 text-purple-600 text-sm">Amount</th>
                      <th className="text-left py-2 px-3 text-purple-600 text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order._id} className="border-b border-purple-100">
                        <td className="py-2 px-3 font-bold text-purple-700">{order.orderNumber || order._id?.slice(-6)}</td>
                        <td className="py-2 px-3 text-purple-900">{order.user?.name || 'N/A'}</td>
                        <td className="py-2 px-3 text-pink-600 font-bold">{formatCurrency(order.totalAmount)}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>{order.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
          <Card className="p-6 border border-purple-200 bg-white shadow-md flex flex-col justify-center">
            <h3 className="text-lg font-bold text-purple-700 mb-4">Store Summary</h3>
            <ul className="space-y-2">
              <li className="flex justify-between text-purple-900"><span>Total Sellers:</span> <span className="font-bold">{stats.totalSellers || 0}</span></li>
              <li className="flex justify-between text-purple-900"><span>Total Products:</span> <span className="font-bold">{stats.totalProducts || 0}</span></li>
              <li className="flex justify-between text-purple-900"><span>Active Users:</span> <span className="font-bold">{stats.totalUsers || 0}</span></li>
              <li className="flex justify-between text-purple-900"><span>Pending Orders:</span> <span className="font-bold">{stats.pendingOrders || 0}</span></li>
              <li className="flex justify-between text-purple-900"><span>Total Revenue:</span> <span className="font-bold text-pink-600">{formatCurrency(stats.totalRevenue)}</span></li>
            </ul>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
