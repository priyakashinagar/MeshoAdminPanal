import React, { useState } from 'react';
import { Zap, TrendingUp, AlertCircle } from 'lucide-react';

export default function AutoPricing() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Auto-Pricing</h2>
      <p className="text-gray-600 mb-6">Let AI automatically optimize your product prices for maximum sales and profit.</p>

      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap size={32} />
          <div>
            <h3 className="text-xl font-bold">Enable Auto-Pricing</h3>
            <p className="text-purple-100">Increase sales by up to 30% with smart pricing</p>
          </div>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="w-6 h-6 rounded"
          />
          <span className="font-medium">Enable Auto-Pricing for all products</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <TrendingUp className="text-green-600 mb-3" size={32} />
          <h3 className="font-bold text-gray-900 mb-2">How it works</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>• Analyzes market trends and competitor prices</li>
            <li>• Adjusts prices in real-time for optimal sales</li>
            <li>• Maintains your profit margins</li>
            <li>• Increases visibility in search results</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <AlertCircle className="text-blue-600 mb-3" size={32} />
          <h3 className="font-bold text-gray-900 mb-2">Pricing Limits</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Minimum Price (%)</label>
              <input type="number" className="w-full mt-1 px-3 py-2 border rounded-lg" placeholder="-20" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Maximum Price (%)</label>
              <input type="number" className="w-full mt-1 px-3 py-2 border rounded-lg" placeholder="+20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
