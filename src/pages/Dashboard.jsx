
import React from 'react';
import Card from '../components/common/Card';
import DashboardCharts from '../components/common/DashboardCharts';
import { DollarSign, ShoppingCart, Package, Users, ArrowUpRight, ArrowDownRight } from 'react-feather';
import AdminLayout from '../components/layout/AdminLayout';

const stats = [
  { label: 'Total Sales', value: '$28,500', icon: DollarSign, color: 'purple' },
  { label: 'Total Orders', value: '1,420', icon: ShoppingCart, color: 'pink' },
  { label: 'Products', value: '254', icon: Package, color: 'purple' },
  { label: 'Customers', value: '892', icon: Users, color: 'pink' },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', amount: '$499.99', status: 'Completed' },
  { id: 'ORD-002', customer: 'Jane Smith', amount: '$249.50', status: 'Pending' },
  { id: 'ORD-003', customer: 'Mike Johnson', amount: '$1,299.99', status: 'Shipped' },
  { id: 'ORD-004', customer: 'Sarah Williams', amount: '$89.99', status: 'Processing' },
];

const Dashboard = () => (
  <AdminLayout>
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-purple-900">Welcome Back!</h1>
        <p className="text-purple-600 mt-1">Here's your store overview</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="p-6 shadow-md hover:shadow-lg border border-purple-200 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-purple-600 font-medium">{stat.label}</p>
                  <h3 className="text-3xl font-bold mt-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stat.value}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <ArrowUpRight size={16} className="text-green-500" />
                    <span className="text-xs text-green-500">+5% this week</span>
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
                <tr key={order.id} className="border-b border-purple-100">
                  <td className="py-2 px-3 font-bold text-purple-700">{order.id}</td>
                  <td className="py-2 px-3 text-purple-900">{order.customer}</td>
                  <td className="py-2 px-3 text-pink-600 font-bold">{order.amount}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{order.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card className="p-6 border border-purple-200 bg-white shadow-md flex flex-col justify-center">
          <h3 className="text-lg font-bold text-purple-700 mb-4">Store Summary</h3>
          <ul className="space-y-2">
            <li className="flex justify-between text-purple-900"><span>Total Categories:</span> <span className="font-bold">4</span></li>
            <li className="flex justify-between text-purple-900"><span>Total Inventory Items:</span> <span className="font-bold">5</span></li>
            <li className="flex justify-between text-purple-900"><span>Active Users:</span> <span className="font-bold">892</span></li>
            <li className="flex justify-between text-purple-900"><span>Pending Orders:</span> <span className="font-bold">2</span></li>
            <li className="flex justify-between text-purple-900"><span>Revenue This Month:</span> <span className="font-bold text-pink-600">$12,300</span></li>
          </ul>
        </Card>
      </div>
    </div>
  </AdminLayout>
);

export default Dashboard;
