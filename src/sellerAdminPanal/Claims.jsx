import React from 'react';
import { FileText, Upload, CheckCircle } from 'lucide-react';

export default function Claims() {
  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Claims</h2>
      <p className="text-gray-600 mb-6">Manage and track your claims for damaged or lost products.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-blue-600" size={24} />
            <h3 className="font-bold text-gray-900">Active Claims</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900 mt-2">0</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Upload className="text-purple-600" size={24} />
            <h3 className="font-bold text-gray-900">Pending Review</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900 mt-2">0</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-green-600" size={24} />
            <h3 className="font-bold text-gray-900">Resolved</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900 mt-2">0</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Claims</h3>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
            New Claim
          </button>
        </div>
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>No claims found</p>
        </div>
      </div>
    </div>
  );
}
