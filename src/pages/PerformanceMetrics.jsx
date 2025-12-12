import React, { useState } from 'react';
import { TrendingUp, Award, Package, ShoppingCart, Clock, Target, Users, Star } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';

const PerformanceMetrics = () => {
  const [topSellers] = useState([
    { rank: 1, name: 'Fashion Store', revenue: 125000, orders: 450, rating: 4.8, growth: 15.5 },
    { rank: 2, name: 'Electronics Hub', revenue: 98000, orders: 320, rating: 4.7, growth: 12.3 },
    { rank: 3, name: 'Home Decor', revenue: 87000, orders: 280, rating: 4.6, growth: 10.8 },
    { rank: 4, name: 'Beauty Products', revenue: 76000, orders: 350, rating: 4.9, growth: 18.2 },
    { rank: 5, name: 'Sports Gear', revenue: 65000, orders: 220, rating: 4.5, growth: 8.5 }
  ]);

  const [topProducts] = useState([
    { rank: 1, name: 'Wireless Earbuds', sales: 1250, revenue: 62500, rating: 4.8 },
    { rank: 2, name: 'Cotton T-Shirt', sales: 980, revenue: 39200, rating: 4.7 },
    { rank: 3, name: 'Running Shoes', sales: 750, revenue: 67500, rating: 4.9 },
    { rank: 4, name: 'Laptop Bag', sales: 680, revenue: 27200, rating: 4.6 },
    { rank: 5, name: 'Water Bottle', sales: 620, revenue: 12400, rating: 4.5 }
  ]);

  const MetricCard = ({ title, value, icon: Icon, subtitle, color = 'purple' }) => {
    const colorClasses = {
      purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-800',
      blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-800',
      green: 'from-green-50 to-green-100 border-green-200 text-green-800',
      orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-800'
    };

    return (
      <div className={`bg-gradient-to-br ${colorClasses[color]} p-6 rounded-lg border`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium opacity-75">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {subtitle && <p className="text-sm opacity-75 mt-1">{subtitle}</p>}
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
        <h1 className="text-2xl font-bold text-gray-900">Performance Metrics</h1>
        <p className="text-sm text-gray-600 mt-1">Track top performers and key metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Avg. Response Time"
          value="2.4h"
          subtitle="15% faster than last month"
          icon={Clock}
          color="blue"
        />
        <MetricCard
          title="Order Fulfillment"
          value="94.8%"
          subtitle="On-time delivery rate"
          icon={Target}
          color="green"
        />
        <MetricCard
          title="Customer Retention"
          value="87.5%"
          subtitle="Repeat purchase rate"
          icon={Users}
          color="purple"
        />
        <MetricCard
          title="Platform Rating"
          value="4.7/5"
          subtitle="Average seller rating"
          icon={Star}
          color="orange"
        />
      </div>

      {/* Top Sellers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            Top Performing Sellers
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topSellers.map((seller) => (
                <tr key={seller.rank} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      seller.rank === 1 ? 'bg-yellow-500' :
                      seller.rank === 2 ? 'bg-gray-400' :
                      seller.rank === 3 ? 'bg-orange-600' :
                      'bg-purple-600'
                    }`}>
                      {seller.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{seller.name}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="font-semibold text-gray-900">₹{seller.revenue.toLocaleString('en-IN')}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="font-semibold text-gray-900">{seller.orders}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-900">{seller.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600 font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      {seller.growth}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Top Performing Products
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProducts.map((product) => (
                <tr key={product.rank} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      product.rank === 1 ? 'bg-yellow-500' :
                      product.rank === 2 ? 'bg-gray-400' :
                      product.rank === 3 ? 'bg-orange-600' :
                      'bg-blue-600'
                    }`}>
                      {product.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <ShoppingCart className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-900">{product.sales}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="font-semibold text-gray-900">₹{product.revenue.toLocaleString('en-IN')}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-900">{product.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default PerformanceMetrics;
