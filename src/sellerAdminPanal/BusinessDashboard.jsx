import React from 'react';
import { BarChart3, TrendingUp, Package, IndianRupee, Users } from 'lucide-react';

export default function BusinessDashboard() {
  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Business Dashboard</h2>
      <p className="text-gray-600 mb-6">Comprehensive analytics and insights for your business.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <IndianRupee className="text-green-600 mb-2" size={24} />
          <h3 className="text-sm text-gray-600 mb-1">Total Revenue</h3>
          <div className="text-2xl font-bold text-gray-900">₹0</div>
          <div className="text-xs text-green-600 mt-1">+0% vs last month</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <Package className="text-blue-600 mb-2" size={24} />
          <h3 className="text-sm text-gray-600 mb-1">Total Orders</h3>
          <div className="text-2xl font-bold text-gray-900">0</div>
          <div className="text-xs text-blue-600 mt-1">+0% vs last month</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <Users className="text-purple-600 mb-2" size={24} />
          <h3 className="text-sm text-gray-600 mb-1">Total Customers</h3>
          <div className="text-2xl font-bold text-gray-900">0</div>
          <div className="text-xs text-purple-600 mt-1">+0 new customers</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <TrendingUp className="text-orange-600 mb-2" size={24} />
          <h3 className="text-sm text-gray-600 mb-1">Avg Order Value</h3>
          <div className="text-2xl font-bold text-gray-900">₹0</div>
          <div className="text-xs text-gray-500 mt-1">No change</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Sales Trend</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <BarChart3 size={64} className="opacity-20" />
          </div>
          <p className="text-center text-gray-500 text-sm">No sales data available</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Products</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <Package size={64} className="opacity-20" />
          </div>
          <p className="text-center text-gray-500 text-sm">No product data available</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
            <div className="text-2xl font-bold text-gray-900">0%</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Customer Satisfaction</div>
            <div className="text-2xl font-bold text-gray-900">0/5</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Return Rate</div>
            <div className="text-2xl font-bold text-gray-900">0%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
