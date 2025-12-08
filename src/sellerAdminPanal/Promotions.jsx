import React from 'react';
import { Tag, TrendingUp, Gift, Percent } from 'lucide-react';

export default function Promotions() {
  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Promotions</h2>
      <p className="text-gray-600 mb-6">Create and manage promotional campaigns for your products.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <Tag className="text-purple-600 mb-2" size={24} />
          <h3 className="font-semibold text-gray-700 mb-1">Active Offers</h3>
          <div className="text-3xl font-bold text-gray-900">0</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <TrendingUp className="text-green-600 mb-2" size={24} />
          <h3 className="font-semibold text-gray-700 mb-1">Sales Boost</h3>
          <div className="text-3xl font-bold text-gray-900">0%</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <Gift className="text-blue-600 mb-2" size={24} />
          <h3 className="font-semibold text-gray-700 mb-1">Products On Sale</h3>
          <div className="text-3xl font-bold text-gray-900">0</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <Percent className="text-orange-600 mb-2" size={24} />
          <h3 className="font-semibold text-gray-700 mb-1">Avg Discount</h3>
          <div className="text-3xl font-bold text-gray-900">0%</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Promotional Campaigns</h3>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
            Create Promotion
          </button>
        </div>
        <div className="text-center py-12 text-gray-500">
          <Tag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>No active promotions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-6">
          <h4 className="font-bold mb-2">Flash Sale</h4>
          <p className="text-sm mb-4">24-hour limited offer</p>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium w-full hover:bg-gray-100">
            Create Flash Sale
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl p-6">
          <h4 className="font-bold mb-2">Bundle Offer</h4>
          <p className="text-sm mb-4">Combo deals for more sales</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium w-full hover:bg-gray-100">
            Create Bundle
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl p-6">
          <h4 className="font-bold mb-2">Seasonal Sale</h4>
          <p className="text-sm mb-4">Festival & event offers</p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium w-full hover:bg-gray-100">
            Create Sale
          </button>
        </div>
      </div>
    </div>
  );
}
