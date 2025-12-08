import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Upload, X, Plus } from 'lucide-react';
import Card from '../components/common/Card';
import categoryService from '../services/categoryService';
import { createProduct, clearError, clearSuccess } from '../redux/slices/productSlice';

export default function AddProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { loading, error: productError, success, message } = useSelector(state => state.product);

  // Debug auth state on mount
  useEffect(() => {
    console.log('🔐 Auth State on Mount:', { 
      user, 
      isAuthenticated,
      token: localStorage.getItem('authToken')?.substring(0, 20) + '...',
      userFromStorage: localStorage.getItem('user')
    });
  }, []);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    mrp: '',
    discount: '',
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
  const [categories, setCategories] = useState([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle success/error from Redux
  useEffect(() => {
    if (success) {
      // Reset form after successful creation
      setForm({ 
        name: '', 
        description: '',
        price: '', 
        mrp: '',
        discount: '',
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

      // Redirect after 2 seconds
      setTimeout(() => {
        dispatch(clearSuccess());
        navigate('/seller/products');
      }, 2000);
    }

    if (productError) {
      setError(productError);
      setTimeout(() => {
        dispatch(clearError());
        setError('');
      }, 5000);
    }
  }, [success, productError, navigate, dispatch]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data?.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    let processedValue = type === 'checkbox' ? checked : value;
    
    // Validate discount to be between 0 and 100
    if (name === 'discount') {
      const numVal = Number(value);
      if (numVal < 0) processedValue = '0';
      if (numVal > 100) processedValue = '100';
    }
    
    // Validate MRP to be positive
    if (name === 'mrp') {
      const numVal = Number(value);
      if (numVal < 0) processedValue = '0';
    }
    
    let updatedForm = { ...form, [name]: processedValue };
    
    // Auto-calculate sale price when MRP or discount changes
    if (name === 'mrp' || name === 'discount') {
      const mrp = name === 'mrp' ? Number(processedValue) : Number(form.mrp);
      const discount = name === 'discount' ? Number(processedValue) : Number(form.discount);
      if (mrp > 0 && discount >= 0 && discount <= 100) {
        const salePrice = Math.round(mrp - (mrp * discount / 100));
        updatedForm.price = salePrice.toString();
      }
    }
    
    setForm(updatedForm);
    setError('');
    dispatch(clearSuccess()); // Clear Redux success state
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setError('Please enter category name');
      return;
    }

    try {
      const response = await categoryService.createCategory({
        name: newCategoryName,
        slug: newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        isActive: true,
        order: categories.length + 1
      });
      
      // Show temporary success message
      const tempMsg = 'Category created successfully!';
      setError(''); // Clear any errors
      
      setNewCategoryName('');
      setShowNewCategory(false);
      
      // Refresh categories and select the new one
      await fetchCategories();
      setForm({ ...form, category: response.data.category._id });
      
      // Show success notification briefly
      alert(tempMsg);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🚀 Form submitted');
    console.log('👤 User:', user);
    console.log('🔑 Auth state:', { isAuthenticated });
    
    if (!form.name || !form.price || !form.stock || !form.category || !form.description) {
      setError('Please fill all required fields (Name, Description, Price, Stock, Category).');
      return;
    }

    if (!imageFile) {
      setError('Please select a product image.');
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('mrp', form.mrp || form.price);
    formData.append('discount', form.discount || 0);
    formData.append('category', form.category);
    formData.append('image', imageFile);
    formData.append('stock', JSON.stringify({
      quantity: Number(form.stock),
      status: Number(form.stock) > 0 ? 'in_stock' : 'out_of_stock',
      lowStockThreshold: 10
    }));
    formData.append('tags', form.tags);
    formData.append('isFreeShipping', form.isFreeShipping);
    formData.append('shippingCharge', form.isFreeShipping ? 0 : (form.shippingCharge || 0));
    formData.append('deliveryTimeMin', form.deliveryTimeMin || 3);
    formData.append('deliveryTimeMax', form.deliveryTimeMax || 7);
    formData.append('isFeatured', form.isFeatured);
    formData.append('isActive', true);

    // If seller, add seller ID
    if (user?.role === 'seller' && user?.sellerId) {
      formData.append('seller', user.sellerId);
      console.log('✅ Seller ID added:', user.sellerId);
    } else {
      console.warn('⚠️ No seller ID found in user:', user);
    }

    // Log FormData contents for debugging
    console.log('📦 FormData contents:');
    for (let [key, value] of formData.entries()) {
      if (key === 'image') {
        console.log(key + ':', value.name, value.size + ' bytes');
      } else {
        console.log(key + ':', value);
      }
    }

    // Dispatch Redux thunk to create product
    console.log('🚀 Dispatching createProduct...');
    dispatch(createProduct(formData));
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-2 text-purple-700">Add New Product</h2>
      <p className="text-purple-500 mb-4 text-base">Fill the form below to add a new product to your store.</p>
      <div className="max-w-xl w-full mx-auto">
        <Card className="p-4 sm:p-6 border border-purple-100 shadow-xl rounded-2xl bg-white">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {message || 'Product added successfully! Redirecting...'}
            </div>
          )}
          <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
            {/* Product Name */}
            <div>
              <label className="block text-lg font-bold mb-2 text-purple-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                placeholder="e.g., Women's Western Dress"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-bold mb-2 text-purple-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                placeholder="Describe your product in detail..."
                rows="4"
                required
              />
            </div>

            {/* Product Image */}
            <div>
              <label className="block text-lg font-bold mb-2 text-purple-700">
                Product Image <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  required
                />
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload product image (JPEG, PNG, GIF, WebP - Max 5MB)
                </p>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative inline-block">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-32 w-32 rounded-xl border-2 border-purple-200 object-cover shadow-lg" 
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Price, MRP & Discount */}
            <div className="bg-green-50 p-4 rounded-xl border border-green-200 space-y-4">
              <h3 className="text-lg font-bold text-green-700 flex items-center gap-2">
                💰 Pricing & Discount
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-bold mb-2 text-purple-700">
                    MRP / Original Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="mrp"
                    type="number"
                    value={form.mrp}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-white"
                    placeholder="e.g., 1000"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-2 text-purple-700">
                    Discount (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="discount"
                    type="number"
                    value={form.discount}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-white"
                    placeholder="e.g., 20"
                    required
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              
              {/* Auto-calculated Sale Price */}
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-xl border border-green-300">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-semibold text-green-700 mb-1">
                      Sale Price (Auto-calculated)
                    </label>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-green-700">
                        ₹{form.price || 0}
                      </span>
                      {form.mrp && form.discount && Number(form.discount) > 0 && (
                        <>
                          <span className="text-lg text-gray-500 line-through">
                            ₹{form.mrp}
                          </span>
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
                            {form.discount}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-green-600">
                    <p>Formula:</p>
                    <p className="font-mono">MRP - (MRP × Discount%)</p>
                  </div>
                </div>
                <input
                  name="price"
                  type="hidden"
                  value={form.price}
                />
              </div>
            </div>

            {/* Stock & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-bold mb-2 text-purple-700">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  placeholder="e.g., 50"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-lg font-bold mb-2 text-purple-700 flex items-center justify-between">
                  <span>Category <span className="text-red-500">*</span></span>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(!showNewCategory)}
                    className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    New Category
                  </button>
                </label>
                
                {showNewCategory ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="flex-1 px-4 py-2 border border-purple-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none"
                        placeholder="Enter new category name"
                      />
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewCategory(false);
                          setNewCategoryName('');
                        }}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                    required
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name} {cat.icon || ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-lg font-bold mb-2 text-purple-700">
                Tags (Optional)
              </label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                placeholder="e.g., trending, summer, women"
              />
              <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
            </div>

            {/* Shipping Details */}
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <h3 className="text-lg font-bold text-purple-700 mb-3">Shipping Details</h3>
              
              <div className="space-y-3">
                {/* Free Shipping Checkbox */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFreeShipping"
                    checked={form.isFreeShipping}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-purple-700 font-semibold">Free Shipping</span>
                </label>

                {/* Shipping Charge (if not free) */}
                {!form.isFreeShipping && (
                  <div>
                    <label className="block text-sm font-bold mb-2 text-purple-700">
                      Shipping Charge (₹)
                    </label>
                    <input
                      name="shippingCharge"
                      type="number"
                      value={form.shippingCharge}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none"
                      placeholder="e.g., 50"
                      min="0"
                    />
                  </div>
                )}

                {/* Delivery Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-purple-700">
                      Min Delivery (days)
                    </label>
                    <input
                      name="deliveryTimeMin"
                      type="number"
                      value={form.deliveryTimeMin}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none"
                      placeholder="3"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-purple-700">
                      Max Delivery (days)
                    </label>
                    <input
                      name="deliveryTimeMax"
                      type="number"
                      value={form.deliveryTimeMax}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none"
                      placeholder="7"
                      min="1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Product */}
            <label className="flex items-center gap-3 cursor-pointer bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 text-yellow-600 border-yellow-300 rounded focus:ring-yellow-500"
              />
              <span className="text-yellow-700 font-semibold">Mark as Featured Product</span>
            </label>

            {/* Action Buttons */}
            <div className="flex justify-between gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('/seller/products')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 px-7 py-3 font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-7 py-3 font-semibold rounded-xl shadow hover:from-purple-700 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
