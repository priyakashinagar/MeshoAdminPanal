import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, CheckCircle, X, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function ImageBulkUpload() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const imageInputRef = useRef(null);

  // Get seller ID from localStorage
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

  const handleImageSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setImages(selectedFiles);
      setUploadStatus(null);
      setMessage('');
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleBulkImageUpload = async () => {
    if (images.length === 0) {
      setUploadStatus('error');
      setMessage('Please select at least one image');
      return;
    }

    const sellerId = getSellerId();
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
      images.forEach(image => {
        formData.append('images', image);
      });
      formData.append('sellerId', sellerId);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const response = await axios.post(`${API_URL.replace('/api/v1', '')}/api/catalog/bulk-image-upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setUploadStatus('success');
        setMessage(response.data.message || 'Images uploaded successfully!');
        setUploadedImages([...response.data.data.images, ...uploadedImages]);
        setTimeout(() => {
          setImages([]);
          if (imageInputRef.current) {
            imageInputRef.current.value = '';
          }
        }, 2000);
      }
    } catch (error) {
      setUploadStatus('error');
      setMessage(error.response?.data?.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

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
        <div className="border-2 border-dashed border-purple-300 rounded-xl p-10 text-center">
          <input 
            ref={imageInputRef}
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleImageSelect}
            className="hidden" 
            id="image-upload" 
          />
          
          {images.length === 0 ? (
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-purple-600" />
                </div>
                <div className="absolute top-0 right-1/2 translate-x-[30px] -translate-y-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
              <p className="text-gray-700 font-medium mb-2 mt-4">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500 mb-4">Upload multiple images at once</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
                <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs">.jpg</span>
                <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs">.png</span>
                <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs">.webp</span>
              </div>
            </label>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-green-600" />
                </div>
                <div className="absolute top-0 right-1/2 translate-x-[30px] -translate-y-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900">{images.length} image(s) selected</p>
              
              {/* Image Preview Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-gray-600 mt-1 truncate">{image.name}</p>
                  </div>
                ))}
              </div>
              
              <label htmlFor="image-upload">
                <button 
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="px-4 py-2 text-sm text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Add More Images
                </button>
              </label>
            </div>
          )}
        </div>

        {message && (
          <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 border ${uploadStatus === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
            {uploadStatus === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        {images.length > 0 && (
          <button 
            onClick={handleBulkImageUpload} 
            disabled={uploading} 
            className={`w-full mt-6 py-3.5 px-6 rounded-lg font-semibold text-white transition-all ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'}`}
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading Images...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload {images.length} Image(s)
              </span>
            )}
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200 mt-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Uploads</h3>
        
        {uploadedImages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">No images uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {uploadedImages.map((img, index) => (
              <div key={index} className="group relative">
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                  <img 
                    src={img.url} 
                    alt={img.originalName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <a 
                    href={img.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white text-purple-600 rounded-lg text-sm font-semibold shadow-lg"
                  >
                    View
                  </a>
                </div>
                <p className="text-xs text-gray-600 mt-2 truncate">{img.originalName}</p>
                <p className="text-xs text-gray-400">{(img.size / 1024).toFixed(1)} KB</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
