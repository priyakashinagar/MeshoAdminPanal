import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle } from 'lucide-react';
import { bulkCatalogUpload } from '../../services/catalogService';

const BulkCatalogUpload = ({ sellerId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

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
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      
      if (validTypes.includes(selectedFile.type) || 
          selectedFile.name.endsWith('.csv') || 
          selectedFile.name.endsWith('.xlsx') || 
          selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
        setUploadStatus(null);
        setMessage('');
      } else {
        setUploadStatus('error');
        setMessage('कृपया सिर्फ Excel (.xlsx, .xls) या CSV (.csv) file upload करें');
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

  const handleUpload = async () => {
    if (!file || !sellerId) {
      setUploadStatus('error');
      setMessage('File और Seller ID दोनों जरूरी हैं');
      return;
    }

    setUploading(true);
    setUploadStatus(null);
    setMessage('');

    try {
      const result = await bulkCatalogUpload(file, sellerId);
      setUploadStatus('success');
      setMessage(result.message || 'Products successfully uploaded!');
      
      // Clear file after successful upload
      setTimeout(() => {
        handleRemoveFile();
        if (onUploadSuccess) {
          onUploadSuccess(result);
        }
      }, 2000);
    } catch (error) {
      setUploadStatus('error');
      setMessage(error.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Bulk Catalog Upload
        </h3>
        <p className="text-sm text-gray-600">
          एक बार में बहुत सारे products upload करने के लिए Excel या CSV file upload करें
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!file ? (
          <div className="space-y-4">
            <Upload className="w-16 h-16 mx-auto text-gray-400" />
            <div>
              <p className="text-gray-600 mb-2">
                Drag and drop your file here, or
              </p>
              <button
                onClick={handleBrowseClick}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Browse Files
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Supported formats: Excel (.xlsx, .xls) or CSV (.csv)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <FileSpreadsheet className="w-16 h-16 mx-auto text-green-500" />
            <div className="flex items-center justify-center gap-3">
              <span className="text-gray-700 font-medium">{file.name}</span>
              <button
                onClick={handleRemoveFile}
                className="text-red-500 hover:text-red-700"
                disabled={uploading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Size: {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {message && (
        <div
          className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
            uploadStatus === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {uploadStatus === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message}</span>
        </div>
      )}

      {/* Upload Button */}
      {file && (
        <div className="mt-6">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
              uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </span>
            ) : (
              'Upload Catalog'
            )}
          </button>
        </div>
      )}

      {/* Download Template */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">
          Need a template? Download our sample file:
        </p>
        <a
          href="/sample-catalog-template.xlsx"
          download
          className="text-purple-600 hover:text-purple-700 text-sm font-medium"
        >
          Download Template
        </a>
      </div>
    </div>
  );
};

export default BulkCatalogUpload;
