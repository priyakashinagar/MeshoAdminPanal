import React from 'react';
import { Upload, Package, Image as ImageIcon, FileSpreadsheet } from 'lucide-react';

export default function CatalogUploads() {
  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Catalog Uploads</h2>
      <p className="text-gray-600 mb-6">Upload multiple products at once using our catalog templates.</p>

      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold mb-2">Bulk Product Upload</h3>
        <p className="mb-4">Save time by uploading hundreds of products using our Excel template</p>
        <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100">
          Download Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <FileSpreadsheet className="text-green-600 mb-3" size={32} />
          <h3 className="font-bold text-gray-900 mb-2">Step 1: Download Template</h3>
          <p className="text-gray-600 text-sm mb-4">Download the Excel template with all required fields.</p>
          <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
            Download
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <Package className="text-blue-600 mb-3" size={32} />
          <h3 className="font-bold text-gray-900 mb-2">Step 2: Fill Product Details</h3>
          <p className="text-gray-600 text-sm mb-4">Add product information in the template.</p>
          <div className="text-sm text-gray-500">Follow the format carefully</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
        <Upload className="text-purple-600 mb-3" size={32} />
        <h3 className="font-bold text-gray-900 mb-3">Step 3: Upload Catalog</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input type="file" accept=".xlsx,.xls" className="hidden" id="catalog-upload" />
          <label htmlFor="catalog-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500">Excel files only (.xlsx, .xls)</p>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200 mt-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Upload History</h3>
        <div className="text-center py-8 text-gray-500">
          <p>No uploads yet</p>
        </div>
      </div>
    </div>
  );
}
