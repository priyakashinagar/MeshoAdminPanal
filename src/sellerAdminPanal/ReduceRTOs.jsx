import React from 'react';
import { ShieldCheck, Package, TrendingDown, AlertTriangle } from 'lucide-react';

export default function ReduceRTOs() {
  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Reduce RTOs & Returns</h2>
      <p className="text-gray-600 mb-6">Minimize return-to-origin orders and product returns to improve profitability.</p>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="text-red-500 mt-1" size={20} />
        <div>
          <h3 className="font-bold text-red-900">High RTO Rate Detected</h3>
          <p className="text-red-700 text-sm">Your current RTO rate is 15%. Implement these strategies to reduce it below 5%.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <ShieldCheck className="text-green-600 mb-3" size={32} />
          <h3 className="font-bold text-gray-900 mb-2">Quality Check</h3>
          <p className="text-gray-600 text-sm mb-4">Ensure product quality before dispatch to reduce returns.</p>
          <div className="text-2xl font-bold text-gray-900">85%</div>
          <div className="text-sm text-gray-500">Quality Score</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <Package className="text-blue-600 mb-3" size={32} />
          <h3 className="font-bold text-gray-900 mb-2">Accurate Packaging</h3>
          <p className="text-gray-600 text-sm mb-4">Use proper packaging to prevent damage during transit.</p>
          <div className="text-2xl font-bold text-gray-900">92%</div>
          <div className="text-sm text-gray-500">Packaging Score</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <TrendingDown className="text-purple-600 mb-3" size={32} />
          <h3 className="font-bold text-gray-900 mb-2">RTO Trend</h3>
          <p className="text-gray-600 text-sm mb-4">Monitor your RTO rate over time.</p>
          <div className="text-2xl font-bold text-red-600">15%</div>
          <div className="text-sm text-gray-500">Current RTO Rate</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Best Practices to Reduce RTOs</h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-green-500 font-bold">✓</span>
            <span>Add accurate product images and descriptions</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 font-bold">✓</span>
            <span>Confirm orders with customers via call before dispatch</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 font-bold">✓</span>
            <span>Use quality packaging materials to prevent damage</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 font-bold">✓</span>
            <span>Ship products quickly to reduce cancellations</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 font-bold">✓</span>
            <span>Maintain accurate inventory to avoid order failures</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
