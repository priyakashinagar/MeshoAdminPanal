import React from 'react';
import { DollarSign, TrendingUp, Package } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Manage Pricing</h2>
      <p className="text-gray-600 mb-6">Set and manage your product prices effectively.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-purple-600" size={24} />
            <h3 className="font-bold text-gray-900">Dynamic Pricing</h3>
          </div>
          <p className="text-gray-600 text-sm">Adjust prices based on market demand and competition.</p>
          <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">Configure</button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-green-600" size={24} />
            <h3 className="font-bold text-gray-900">Bulk Price Update</h3>
          </div>
          <p className="text-gray-600 text-sm">Update multiple product prices at once.</p>
          <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">Update</button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Package className="text-blue-600" size={24} />
            <h3 className="font-bold text-gray-900">Pricing Rules</h3>
          </div>
          <p className="text-gray-600 text-sm">Set automatic pricing rules for categories.</p>
          <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">Set Rules</button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Price Changes</h3>
        <div className="text-center py-12 text-gray-500">
          <p>No recent price changes</p>
        </div>
      </div>
    </div>
  );
}
