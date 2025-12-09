import React, { useState, useEffect, useRef } from 'react';
import { Upload, Package, FileSpreadsheet, X, CheckCircle, AlertCircle, Trash2, Eye, Download } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function CatalogUploads() {
  const [activeTab, setActiveTab] = useState('bulk');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({
    totalUploads: 0,
    bulkUploads: 0,
    singleUploads: 0
  });
  const [catalogs, setCatalogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [singleProductData, setSingleProductData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    mrp: '',
    stock: '',
    sku: '',
    brand: '',
    color: '',
    size: ''
  });
  const fileInputRef = useRef(null);

  // Get seller ID from localStorage (logged in user)
  const getSellerId = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.sellerId || user.seller?._id || user._id;
      }
      return null;
    } catch (error) {
      console.error('Error getting seller ID:', error);
      return null;
    }
  };

  const sellerId = getSellerId();

  useEffect(() => {
    fetchCategories();
    if (sellerId) {
      fetchStats();
      fetchCatalogs();
    }
  }, [sellerId]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories/category/all`);
      if (response.data.success) {
        setCategories(response.data.data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/catalog/stats/${sellerId}`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchCatalogs = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/catalog/${sellerId}`);
      if (response.data.success) {
        setCatalogs(response.data.data.catalogs);
      }
    } catch (error) {
      console.error('Error fetching catalogs:', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile) {
      const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
      if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
        setUploadStatus(null);
        setMessage('');
      } else {
        setUploadStatus('error');
        setMessage('Please upload only Excel (.xlsx, .xls) or CSV (.csv) files');
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadStatus(null);
    setMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBulkUpload = async () => {
    if (!file) {
      setUploadStatus('error');
      setMessage('Please select a file');
      return;
    }

    if (!sellerId) {
      setUploadStatus('error');
      setMessage('Seller ID not found. Please login again.');
      return;
    }

    setUploading(true);
    setUploadStatus(null);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sellerId', sellerId);

      const response = await axios.post(`http://localhost:5000/api/catalog/bulk-upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setUploadStatus('success');
        setMessage(response.data.message || 'Products successfully uploaded!');
        setTimeout(() => {
          handleRemoveFile();
          fetchStats();
          fetchCatalogs();
        }, 2000);
      }
    } catch (error) {
      setUploadStatus('error');
      setMessage(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSingleProductChange = (e) => {
    const { name, value } = e.target;
    setSingleProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleSingleUpload = async (e) => {
    e.preventDefault();
    
    if (!sellerId) {
      setUploadStatus('error');
      setMessage('Seller ID not found. Please login again.');
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      const response = await axios.post(`http://localhost:5000/api/catalog/single-upload`, {
        sellerId,
        productData: singleProductData
      });

      if (response.data.success) {
        setUploadStatus('success');
        setMessage('Product uploaded successfully!');
        setSingleProductData({
          name: '', description: '', category: '', price: '', mrp: '', stock: '', sku: '', brand: '', color: '', size: ''
        });
        setTimeout(() => {
          fetchStats();
          fetchCatalogs();
        }, 2000);
      }
    } catch (error) {
      setUploadStatus('error');
      setMessage(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCatalog = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/catalog/item/${id}`);
      if (response.data.success) {
        fetchStats();
        fetchCatalogs();
      }
    } catch (error) {
      alert('Delete failed');
    }
  };

  // Show error if seller ID not found
  if (!sellerId) {
    return (
      <div className="w-full p-4 md:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold text-red-800 mb-2">Seller ID Not Found</h3>
          <p className="text-red-600">Please login again to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Catalog Uploads</h2>
      <p className="text-gray-600 mb-6">Upload products using bulk upload or single product form</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all hover:scale-105 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide opacity-90">Total Uploads</h3>
              <FileSpreadsheet className="w-7 h-7 opacity-30" />
            </div>
            <p className="text-3xl font-bold">{stats.totalUploads}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all hover:scale-105 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide opacity-90">Bulk Uploads</h3>
              <Upload className="w-7 h-7 opacity-30" />
            </div>
            <p className="text-3xl font-bold">{stats.bulkUploads}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-600 via-green-500 to-teal-500 text-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all hover:scale-105 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide opacity-90">Single Uploads</h3>
              <Package className="w-7 h-7 opacity-30" />
            </div>
            <p className="text-3xl font-bold">{stats.singleUploads}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow border border-gray-200 mb-6">
        <div className="flex border-b">
          <button onClick={() => setActiveTab('bulk')} className={`flex-1 px-6 py-3 font-medium ${activeTab === 'bulk' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}>
            <FileSpreadsheet className="inline mr-2" size={20} /> Bulk Upload
          </button>
          <button onClick={() => setActiveTab('single')} className={`flex-1 px-6 py-3 font-medium ${activeTab === 'single' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}>
            <Package className="inline mr-2" size={20} /> Single Upload
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'bulk' ? (
            <div>
              {/* Info Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Bulk Upload Guide</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Upload multiple products at once using Excel or CSV file. Download the template below, fill in your product details, and upload the file.
                    </p>
                  </div>
                </div>
              </div>

              {/* Download Sample Template Button */}
              <div className="mb-6">
                <a 
                  href="/sample-catalog-template.csv" 
                  download="sample-catalog-template.csv"
                  className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg font-medium text-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Sample Template
                </a>
                <p className="text-xs text-gray-500 mt-2 ml-1">Get the Excel/CSV template with sample data</p>
              </div>

              {/* Upload Area */}
              <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${isDragging ? 'border-purple-500 bg-purple-50 scale-[1.02]' : 'border-gray-300 bg-gradient-to-b from-gray-50 to-white'}`}>
                <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileSelect} className="hidden" />
                {!file ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                        <Upload className="w-10 h-10 text-purple-600" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">+</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium mb-3">Drop your file here, or click to browse</p>
                      <button 
                        onClick={() => fileInputRef.current?.click()} 
                        className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold shadow-md hover:shadow-lg transition-all"
                      >
                        Choose File
                      </button>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs">.xlsx</span>
                      <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs">.xls</span>
                      <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs">.csv</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                        <FileSpreadsheet className="w-10 h-10 text-green-600" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-md mx-auto">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileSpreadsheet className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                        <button 
                          onClick={handleRemoveFile} 
                          className="flex-shrink-0 w-8 h-8 rounded-lg text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center" 
                          disabled={uploading}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {message && (
                <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 border ${uploadStatus === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                  {uploadStatus === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                  <span className="text-sm font-medium">{message}</span>
                </div>
              )}

              {file && (
                <button 
                  onClick={handleBulkUpload} 
                  disabled={uploading} 
                  className={`w-full mt-6 py-3.5 px-6 rounded-lg font-semibold text-white transition-all ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'}`}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading Catalog...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Catalog File
                    </span>
                  )}
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSingleUpload} className="space-y-3">
              {/* Product Basic Info */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-2.5 rounded-lg">
                <h3 className="text-xs font-semibold text-purple-900 mb-1.5 flex items-center">
                  <Package className="w-3.5 h-3.5 mr-1.5" />
                  Product Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">Product Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={singleProductData.name} 
                      onChange={handleSingleProductChange} 
                      placeholder="Enter product name" 
                      required 
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">Category *</label>
                    <select 
                      name="category" 
                      value={singleProductData.category} 
                      onChange={handleSingleProductChange} 
                      required 
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing Info */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-2.5 rounded-lg">
                <h3 className="text-xs font-semibold text-green-900 mb-1.5">💰 Pricing Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">Selling Price *</label>
                    <input 
                      type="number" 
                      name="price" 
                      value={singleProductData.price} 
                      onChange={handleSingleProductChange} 
                      placeholder="₹ 0" 
                      required 
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">MRP</label>
                    <input 
                      type="number" 
                      name="mrp" 
                      value={singleProductData.mrp} 
                      onChange={handleSingleProductChange} 
                      placeholder="₹ 0" 
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    />
                  </div>
                </div>
              </div>

              {/* Inventory & Details */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-2.5 rounded-lg">
                <h3 className="text-xs font-semibold text-blue-900 mb-1.5">📦 Inventory & Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">Stock</label>
                    <input 
                      type="number" 
                      name="stock" 
                      value={singleProductData.stock} 
                      onChange={handleSingleProductChange} 
                      placeholder="Quantity" 
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">SKU</label>
                    <input 
                      type="text" 
                      name="sku" 
                      value={singleProductData.sku} 
                      onChange={handleSingleProductChange} 
                      placeholder="e.g., PRD-001" 
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">Brand</label>
                    <input 
                      type="text" 
                      name="brand" 
                      value={singleProductData.brand} 
                      onChange={handleSingleProductChange} 
                      placeholder="Brand name" 
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">Color</label>
                    <input 
                      type="text" 
                      name="color" 
                      value={singleProductData.color} 
                      onChange={handleSingleProductChange} 
                      placeholder="e.g., Red, Blue" 
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-0.5">Size</label>
                    <input 
                      type="text" 
                      name="size" 
                      value={singleProductData.size} 
                      onChange={handleSingleProductChange} 
                      placeholder="e.g., M, L, XL" 
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">📝 Description</label>
                <textarea 
                  name="description" 
                  value={singleProductData.description} 
                  onChange={handleSingleProductChange} 
                  placeholder="Product description..." 
                  rows="2.5" 
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                ></textarea>
              </div>

              {message && (
                <div className={`p-2 rounded-lg flex items-center gap-2 text-xs ${uploadStatus === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {uploadStatus === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span className="font-medium">{message}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={uploading} 
                className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm text-white transition-all ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'}`}
              >
                {uploading ? 'Uploading...' : 'Upload Product'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Upload History */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-base font-bold text-gray-900 flex items-center">
            <FileSpreadsheet className="w-4 h-4 mr-2 text-purple-600" />
            Upload History
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">View and manage your catalog uploads</p>
        </div>
        
        {catalogs.length === 0 ? (
          <div className="text-center py-10">
            <Package className="w-14 h-14 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 font-medium text-sm">No uploads yet</p>
            <p className="text-xs text-gray-400 mt-0.5">Start uploading products to see them here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="text-center py-2.5 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {catalogs.map(catalog => (
                  <tr key={catalog._id} className="hover:bg-purple-50 transition-colors">
                    <td className="py-2 px-3">
                      <div className="font-medium text-gray-900 text-sm">{catalog.productData.name}</div>
                      {catalog.productData.sku && <div className="text-xs text-gray-500">SKU: {catalog.productData.sku}</div>}
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-700">{catalog.productData.category}</td>
                    <td className="py-2 px-3">
                      <span className="font-semibold text-gray-900 text-sm">₹{catalog.productData.price}</span>
                      {catalog.productData.mrp && catalog.productData.mrp > catalog.productData.price && (
                        <div className="text-xs text-gray-400 line-through">₹{catalog.productData.mrp}</div>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${catalog.uploadType === 'bulk' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
                        {catalog.uploadType === 'bulk' ? '📊 Bulk' : '📦 Single'}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center ${
                        catalog.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 
                        catalog.status === 'published' ? 'bg-green-100 text-green-700 border border-green-200' : 
                        'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          catalog.status === 'pending' ? 'bg-yellow-500' : 
                          catalog.status === 'published' ? 'bg-green-500' : 
                          'bg-gray-500'
                        }`}></span>
                        {catalog.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-600">
                      {new Date(catalog.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button 
                        onClick={() => handleDeleteCatalog(catalog._id)} 
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
