import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, X } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import { createProduct, getAllProducts, updateProduct, deleteProduct, clearError, clearSuccess } from '../redux/slices/productSlice';
import categoryService from '../services/categoryService';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error: productError, success, message } = useSelector(state => state.product);
  const { user } = useSelector(state => state.auth);  // Get logged-in user info
  
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    mrp: '',
    stock: '', 
    category: '',
    tags: '',
    isFreeShipping: false,
    shippingCharge: '',
    deliveryTimeMin: '3',
    deliveryTimeMax: '7',
    isFeatured: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [localError, setLocalError] = useState('');

  // Fetch products and categories on component mount
  useEffect(() => {
    console.log('🎯 Component mounted - fetching products');
    dispatch(getAllProducts({ page: 1, limit: 100 }));
    fetchCategories();
  }, [dispatch]);

  // Log products when they change
  useEffect(() => {
    console.log('📊 Products in component:', products);
    console.log('📊 Products type:', Array.isArray(products) ? 'Array' : typeof products);
    console.log('📊 Products length:', products?.length);
  }, [products]);

  // Handle success/error from Redux
  useEffect(() => {
    if (success) {
      // Show success message for 2 seconds before closing modal
      setTimeout(() => {
        setShowModal(false);
        setShowDeleteModal(false);
        resetForm();
        dispatch(clearSuccess());
        // Refresh products list to show new product
        dispatch(getAllProducts({ page: 1, limit: 100 }));
      }, 2000);
    }

    if (productError) {
      setTimeout(() => {
        dispatch(clearError());
      }, 5000);
    }
  }, [success, productError, dispatch]);

  const fetchCategories = async () => {
    try {
      console.log('🔍 Fetching categories...');
      const response = await categoryService.getAllParentCategories();
      console.log('📁 Categories response:', response);
      // Backend returns: { success: true, message: "...", data: { categories: [...], count: X } }
      const categoriesData = response.data?.categories || [];
      console.log('📁 Categories list:', categoriesData);
      console.log('📁 Categories count:', categoriesData.length);
      setCategories(categoriesData);
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      setLocalError('Failed to load categories');
    }
  };

  const resetForm = () => {
    setForm({
      name: '', 
      description: '', 
      price: '', 
      mrp: '',
      stock: '', 
      category: '',
      tags: '',
      isFreeShipping: false,
      shippingCharge: '',
      deliveryTimeMin: '3',
      deliveryTimeMax: '7',
      isFeatured: false
    });
    setImageFile(null);
    setImagePreview('');
    setImageUrl('');
    setEditId(null);
    setLocalError('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImagePreview(url);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setLocalError('Please select an image file');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setLocalError('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setLocalError('');
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setImageUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 Form submitted with data:', form);
    
    if (form.name && form.price && form.stock && form.category && form.description) {
      if (!imageUrl && !imageFile && !editId) {
        setLocalError('Please provide a product image');
        return;
      }

      try {
        setLocalError('');
        console.log('🚀 Creating FormData...');
        
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('price', Number(form.price));
        formData.append('mrp', Number(form.mrp || form.price));
        
        // Add seller field - use logged-in user's ID (admin)
        if (user && user._id) {
          formData.append('seller', user._id);
          console.log('👤 Seller ID (Admin):', user._id);
        }
        
        formData.append('stock', JSON.stringify({
          quantity: Number(form.stock),
          status: Number(form.stock) > 0 ? 'in_stock' : 'out_of_stock',
          lowStockThreshold: 10
        }));
        formData.append('category', form.category);
        if (form.tags) {
          form.tags.split(',').forEach(tag => {
            formData.append('tags', tag.trim());
          });
        }
        formData.append('shipping', JSON.stringify({
          isFreeShipping: form.isFreeShipping,
          shippingCharge: form.isFreeShipping ? 0 : Number(form.shippingCharge || 0),
          deliveryTime: {
            min: Number(form.deliveryTimeMin || 3),
            max: Number(form.deliveryTimeMax || 7)
          }
        }));
        formData.append('isFeatured', form.isFeatured);

        // Add image file if uploaded, otherwise use URL
        if (imageFile) {
          console.log('📷 Adding image file:', imageFile.name);
          formData.append('image', imageFile);  // Backend expects 'image' not 'images'
        } else if (imageUrl) {
          console.log('🔗 Adding image URL:', imageUrl);
          formData.append('imageUrl', imageUrl);
        }
        
        console.log('📤 Sending request...');
        if (editId) {
          await dispatch(updateProduct({ productId: editId, productData: formData })).unwrap();
          console.log('✅ Product updated successfully');
        } else {
          await dispatch(createProduct(formData)).unwrap();
          console.log('✅ Product created successfully');
        }
        
        // Note: Products list will be refreshed after success message (in useEffect)
        // No need to refresh here, Redux slice already handles it
        resetForm();
        setShowModal(false);
      } catch (err) {
        console.error('❌ Error submitting form:', err);
        setLocalError(err?.message || err || 'Failed to save product');
      }
    } else {
      console.warn('⚠️ Missing required fields:', { form });
      setLocalError('Please fill all required fields.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        dispatch(getAllProducts({ page: 1, limit: 100 }));
      } catch (err) {
        setLocalError(err || 'Failed to delete product');
      }
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleEdit = (product) => {
    setForm({ 
      name: product.name, 
      description: product.description || '',
      price: product.price, 
      mrp: product.mrp || product.price,
      stock: product.stock?.quantity || 0,
      category: product.category?._id || product.category || '',
      tags: product.tags?.join(', ') || '',
      isFreeShipping: product.shipping?.isFreeShipping || false,
      shippingCharge: product.shipping?.shippingCharge || '',
      deliveryTimeMin: product.shipping?.deliveryTime?.min || 3,
      deliveryTimeMax: product.shipping?.deliveryTime?.max || 7,
      isFeatured: product.isFeatured || false
    });
    
    // Set image
    const productImage = product.image || (product.images && product.images[0]?.url) || '';
    setImageUrl(productImage);
    setImagePreview(productImage);
    
    setEditId(product._id || product.id);
    setShowModal(true);
  };

  const filteredProducts = Array.isArray(products) 
    ? products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <AdminLayout>
      <div className="relative">
        <h1 className="text-3xl font-bold text-purple-900 mb-6">Products Management</h1>

        {/* Error Message */}
        {(productError || localError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {productError || localError}
          </div>
        )}

        {/* Success Message */}
        {success && message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
            <span className="text-green-500 text-xl">✓</span>
            {message}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}
        {/* Search Bar and Add Product Button */}
        <div className="flex items-center mb-6">
          <div className="flex items-center gap-2 bg-purple-100 rounded-full px-5 py-2 shadow focus-within:ring-2 focus-within:ring-pink-400 w-96">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <input
              type="text"
              placeholder="Search Product Name"
              value={search}
              onChange={handleSearchChange}
              className="border-0 bg-transparent text-purple-900 outline-none w-full text-lg placeholder-purple-400"
            />
          </div>
          <button
            type="button"
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2 rounded-xl shadow ml-4 font-semibold text-base"
            onClick={() => setShowModal(true)}
          >
            Add Product
          </button>
        </div>

        {/* Modal for Add/Edit Product */}
        {showModal && (
          <div className="fixed inset-0 flex items-start justify-center z-50 p-4 overflow-y-auto" style={{ backdropFilter: 'blur(8px)' }}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl border border-purple-200 relative my-8">
              <h2 className="text-2xl font-bold mb-6 text-purple-700">{editId ? 'Edit Product' : 'Add New Product'}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product Name & Category - Category first for dropdown space */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-purple-700">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g., Women's Western Dress"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-purple-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.icon && `${cat.icon} `}{cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-purple-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe your product..."
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>

                {/* Product Image */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-purple-700">
                    Product Image <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="relative inline-block">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="h-32 w-32 rounded-xl border-2 border-purple-200 object-cover" 
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    
                    {/* File Upload Button */}
                    <label className="cursor-pointer">
                      <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-500 transition-colors bg-purple-50">
                        <Upload className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">
                          {imageFile ? imageFile.name : 'Upload Image'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                    
                    {/* OR Divider */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-purple-200"></div>
                      <span className="text-xs text-gray-500">OR</span>
                      <div className="flex-1 h-px bg-purple-200"></div>
                    </div>
                    
                    {/* URL Input */}
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={handleImageUrlChange}
                      className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                      placeholder="Or paste image URL here..."
                    />
                    <p className="text-xs text-gray-500">Upload an image or provide URL (max 5MB)</p>
                  </div>
                </div>

                {/* Price, MRP & Stock */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-purple-700">
                      Selling Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      placeholder="799"
                      value={form.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-purple-700">MRP (₹)</label>
                    <input
                      type="number"
                      name="mrp"
                      placeholder="2199"
                      value={form.mrp}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-purple-700">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      placeholder="50"
                      value={form.stock}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-purple-700">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="trending, summer, women"
                    value={form.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                </div>

                {/* Shipping Section */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-bold text-purple-700 mb-3">Shipping Details</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isFreeShipping"
                        checked={form.isFreeShipping}
                        onChange={handleChange}
                        className="w-4 h-4 text-purple-600 border-purple-300 rounded"
                      />
                      <span className="text-sm font-semibold text-purple-700">Free Shipping</span>
                    </label>

                    {!form.isFreeShipping && (
                      <div>
                        <label className="block text-xs font-bold mb-1 text-purple-700">Shipping Charge (₹)</label>
                        <input
                          type="number"
                          name="shippingCharge"
                          placeholder="50"
                          value={form.shippingCharge}
                          onChange={handleChange}
                          min="0"
                          className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:border-pink-400 focus:ring-1 focus:ring-pink-100 outline-none text-sm"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold mb-1 text-purple-700">Min Days</label>
                        <input
                          type="number"
                          name="deliveryTimeMin"
                          value={form.deliveryTimeMin}
                          onChange={handleChange}
                          min="1"
                          className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:border-pink-400 focus:ring-1 focus:ring-pink-100 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1 text-purple-700">Max Days</label>
                        <input
                          type="number"
                          name="deliveryTimeMax"
                          value={form.deliveryTimeMax}
                          onChange={handleChange}
                          min="1"
                          className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:border-pink-400 focus:ring-1 focus:ring-pink-100 outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured */}
                <label className="flex items-center gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={form.isFeatured}
                    onChange={handleChange}
                    className="w-4 h-4 text-yellow-600 border-yellow-300 rounded"
                  />
                  <span className="text-sm font-semibold text-yellow-700">Mark as Featured</span>
                </label>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    type="button" 
                    className="bg-gray-200 hover:bg-gray-300 px-6 py-2 font-semibold rounded-lg transition-colors" 
                    onClick={() => {
                      setShowModal(false);
                      setEditId(null);
                      setImageUrl('');
                      setImagePreview('');
                      setForm({
                        name: '', description: '', price: '', mrp: '', stock: '', category: '',
                        tags: '', isFreeShipping: false, shippingCharge: '', 
                        deliveryTimeMin: '3', deliveryTimeMax: '7', isFeatured: false
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 font-semibold rounded-lg shadow hover:from-purple-700 hover:to-pink-600 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editId ? 'Update' : 'Add Product')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Product Detail Modal */}
        {showDetailModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pl-[280px] pr-8 py-8">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
                <h2 className="text-2xl font-bold">Product Details</h2>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 sm:p-8 md:p-10 lg:p-12 space-y-6">
                {/* Product Image */}
                {(selectedProduct.images?.[0]?.url || selectedProduct.image) && (
                  <div className="flex justify-center">
                    <img 
                      src={selectedProduct.images?.[0]?.url || selectedProduct.image} 
                      alt={selectedProduct.name}
                      className="max-h-64 rounded-lg border-2 border-purple-200 object-cover"
                    />
                  </div>
                )}

                {/* Product Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 sm:px-0">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold">Product Name</p>
                    <p className="text-lg font-bold text-purple-900">{selectedProduct.name}</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold">Category</p>
                    <p className="text-lg font-bold text-purple-900">
                      {selectedProduct.category?.name || 'N/A'}
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold">Price</p>
                    <p className="text-2xl font-bold text-green-600">₹{selectedProduct.price}</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold">MRP</p>
                    <p className="text-2xl font-bold text-blue-600">₹{selectedProduct.mrp || selectedProduct.price}</p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold">Stock</p>
                    <p className="text-lg font-bold text-orange-600">
                      {selectedProduct.stock?.quantity || selectedProduct.stock || 0} units
                    </p>
                  </div>

                  <div className="bg-pink-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold">Status</p>
                    <p className="text-lg font-bold text-pink-600">
                      {selectedProduct.stock?.status || (selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock')}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-semibold mb-2">Description</p>
                  <p className="text-gray-700">{selectedProduct.description || 'No description available'}</p>
                </div>

                {/* Tags */}
                {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag, idx) => (
                        <span key={idx} className="bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shipping Info */}
                {selectedProduct.shipping && (
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-2">Shipping Information</p>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-semibold">Free Shipping:</span> {selectedProduct.shipping.isFreeShipping ? 'Yes' : 'No'}
                      </p>
                      {!selectedProduct.shipping.isFreeShipping && (
                        <p className="text-gray-700">
                          <span className="font-semibold">Charge:</span> ₹{selectedProduct.shipping.shippingCharge}
                        </p>
                      )}
                      <p className="text-gray-700">
                        <span className="font-semibold">Delivery Time:</span> {selectedProduct.shipping.deliveryTime?.min || 3} - {selectedProduct.shipping.deliveryTime?.max || 7} days
                      </p>
                    </div>
                  </div>
                )}

                {/* Featured Badge */}
                {selectedProduct.isFeatured && (
                  <div className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded-lg text-center">
                    <p className="text-yellow-700 font-bold text-lg">⭐ Featured Product</p>
                  </div>
                )}

                {/* Close Button */}
                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => setShowDetailModal(false)}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 font-semibold rounded-lg shadow hover:from-purple-700 hover:to-pink-600 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table faded when modal is open */}
        <div className={showModal ? "opacity-40 pointer-events-none blur-sm" : "opacity-100"}>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">ID</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Name</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Price</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Stock</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={product._id || product.id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                    <td className="px-2 sm:px-4 py-2 sm:py-4 font-medium text-purple-900">{index + 1}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4">{product.name}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4">₹{product.price}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4">{product.stock?.quantity || product.stock || 0}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4">
                      <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
                        <button 
                          className="text-purple-600 font-bold hover:underline whitespace-nowrap text-sm" 
                          onClick={() => handleViewDetails(product)}
                        >
                          Detail
                        </button>
                        <button 
                          className="font-bold hover:underline text-purple-600 whitespace-nowrap text-sm" 
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-red-600 font-bold hover:underline whitespace-nowrap text-sm" 
                          onClick={() => handleDelete(product._id || product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Products;
