import React from 'react';
import { Warehouse, MapPin, Package, Plus } from 'lucide-react';

export default function WarehousePage() {
  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Warehouse Management</h2>
      <p className="text-gray-600 mb-6">Manage your warehouse locations and inventory distribution.</p>

      <div className="flex justify-end mb-6">
        <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
          <Plus size={20} />
          Add Warehouse
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Main Warehouse</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin size={14} />
                <span>Delhi, India</span>
              </div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Products:</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Capacity:</span>
              <span className="font-semibold">1000 units</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              View Details
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Warehouse Guidelines</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Warehouse className="text-purple-600 mt-1 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-semibold text-gray-900">Proper Storage</h4>
              <p className="text-sm text-gray-600">Maintain optimal temperature and humidity levels</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Package className="text-blue-600 mt-1 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-semibold text-gray-900">Inventory Organization</h4>
              <p className="text-sm text-gray-600">Use proper labeling and organize by category</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="text-green-600 mt-1 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-semibold text-gray-900">Location Accuracy</h4>
              <p className="text-sm text-gray-600">Update warehouse addresses for faster shipping</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
