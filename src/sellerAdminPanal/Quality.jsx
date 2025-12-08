import React from 'react';
import { Award, TrendingUp, AlertCircle, Star } from 'lucide-react';

export default function Quality() {
  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Quality</h2>
      <p className="text-gray-600 mb-6">Monitor and improve your product quality metrics.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Star className="text-yellow-500" size={24} />
            <h3 className="font-semibold text-gray-700">Quality Score</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">85/100</div>
          <div className="text-sm text-green-600 mt-1">+5 this month</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Award className="text-blue-600" size={24} />
            <h3 className="font-semibold text-gray-700">Return Rate</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">3.2%</div>
          <div className="text-sm text-green-600 mt-1">-1.2% this month</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-green-600" size={24} />
            <h3 className="font-semibold text-gray-700">Customer Rating</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">4.5</div>
          <div className="text-sm text-gray-500 mt-1">out of 5.0</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-orange-600" size={24} />
            <h3 className="font-semibold text-gray-700">Complaints</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">2</div>
          <div className="text-sm text-orange-600 mt-1">Pending resolution</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200 mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quality Improvement Tips</h3>
        <div className="space-y-3">
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-1">✓ Good Product Images</h4>
            <p className="text-sm text-green-700">You're using high-quality images for most products</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <h4 className="font-semibold text-orange-900 mb-1">⚠ Improve Descriptions</h4>
            <p className="text-sm text-orange-700">Add more detailed product descriptions to reduce returns</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">ℹ Fast Shipping</h4>
            <p className="text-sm text-blue-700">Continue maintaining quick dispatch times</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Quality Issues</h3>
        <div className="text-center py-8 text-gray-500">
          <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>No quality issues reported</p>
        </div>
      </div>
    </div>
  );
}
