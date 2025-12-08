import React from 'react';
import { Image as ImageIcon, Upload, CheckCircle } from 'lucide-react';

export default function ImageBulkUpload() {
  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Image Bulk Upload</h2>
      <p className="text-gray-600 mb-6">Upload product images in bulk for faster catalog creation.</p>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200 mb-6">
        <h3 className="font-bold text-gray-900 mb-4">Upload Guidelines</h3>
        <ul className="space-y-2 text-gray-700 text-sm">
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-green-500 mt-1" />
            <span>Image format: JPG, PNG</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-green-500 mt-1" />
            <span>Minimum size: 500 x 500 pixels</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-green-500 mt-1" />
            <span>Maximum file size: 5MB per image</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-green-500 mt-1" />
            <span>Use product SKU as filename (e.g., SKU123.jpg)</span>
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
        <div className="border-2 border-dashed border-purple-300 rounded-lg p-12 text-center">
          <input type="file" accept="image/*" multiple className="hidden" id="image-upload" />
          <label htmlFor="image-upload" className="cursor-pointer">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <p className="text-gray-700 font-medium mb-2">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500">Upload multiple images at once</p>
            <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              Select Images
            </button>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200 mt-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Uploads</h3>
        <div className="text-center py-8 text-gray-500">
          <p>No images uploaded yet</p>
        </div>
      </div>
    </div>
  );
}
