import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Edit, Trash2, Eye, Plus, X, Upload } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import { getAllProducts, updateProduct, deleteProduct, clearError, clearSuccess } from '../redux/slices/productSlice';
import categoryService from '../services/categoryService';

const ProductsRedux = () => {
  const dispatch = useDispatch();
  const { products, loading, error: productError, success, message } = useSelector(state => state.product);
  
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
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [localError, setLocalError] = useState('');

  // Fetch products and categories
  useEffect(() => {
    dispatch(getAllProducts({ page: 1, limit: 100 }));
    fetchCategories();
  }, [dispatch]);

  // Handle success/error
  useEffect(() => {
    if (success) {
      setShowModal(false);
      setShowDeleteModal(false);
      resetForm();
      dispatch(getAllProducts({ page: 1, limit: 100 })); // Refresh list
      setTimeout(() => dispatch(clearSuccess()), 3000);
    }

    if (productError) {
      setTimeout(() => dispatch(clearError()), 5000);
    }
  }, [success, productError, dispatch]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const resetForm = () => {
    setForm({
      name: '', description: '', price: '', mrp: '', stock: '', 
      category: '', tags: '', isFreeShipping: false, shippingCharge: '',
      deliveryTimeMin: '3', deliveryTimeMax: '7', isFeatured: false
    });
    setImageFile(null);
    setImagePreview('');
    setEditId(null);
    setLocalError('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setLocalError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setLocalError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setLocalError('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setLocalError('');
    }
  };

  const handleEdit = (product) => {
    console.log('✏️ Editing product:', product);
    console.log('📦 Product category:', product.category);
    
    // Extract category ID properly
    let categoryId = '';
    if (typeof product.category === 'object' && product.category !== null) {
      categoryId = product.category._id || product.category.id || '';
    } else if (typeof product.category === 'string') {
      categoryId = product.category;
    }
    console.log('📦 Category ID extracted:', categoryId);
    
    setEditId(product._id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      mrp: product.mrp || product.price,
      stock: product.stock?.quantity || 0,
      category: categoryId,
      tags: product.tags?.join(', ') || '',
      isFreeShipping: product.shipping?.isFreeShipping || false,
      shippingCharge: product.shipping?.shippingCharge || '',
      deliveryTimeMin: product.shipping?.deliveryTime?.min || 3,
      deliveryTimeMax: product.shipping?.deliveryTime?.max || 7,
      isFeatured: product.isFeatured || false
    });
    
    // Set existing image preview
    if (product.images && product.images[0]?.url) {
      setImagePreview(product.images[0].url);
    }
    
    setShowModal(true);
  };

  const confirmDelete = (productId) => {
    console.log('🗑️ Confirming delete for:', productId);
    setDeleteId(productId);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      console.log('🗑️ Deleting product:', deleteId);
      dispatch(deleteProduct(deleteId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.price || !form.stock || !form.category || !form.description) {
      setLocalError('Please fill all required fields (Name, Description, Price, Stock, Category)');
      return;
    }

    // For new products, image is required
    if (!editId && !imageFile) {
      setLocalError('Please select a product image');
      return;
    }

    if (editId) {
      // For update - send as JSON (with or without new image)
      const updateData = new FormData();
      updateData.append('name', form.name);
      updateData.append('description', form.description);
      updateData.append('price', Number(form.price));
      updateData.append('mrp', Number(form.mrp || form.price));
      updateData.append('category', form.category);
      
      // Only append new image if selected
      if (imageFile) {
        updateData.append('image', imageFile);
      }
      
      // Properly structure nested objects for multipart/form-data
      updateData.append('stock[quantity]', Number(form.stock));
      updateData.append('stock[status]', Number(form.stock) > 0 ? 'in_stock' : 'out_of_stock');
      updateData.append('stock[lowStockThreshold]', 10);
      
      // Parse tags
      if (form.tags) {
        const tagsArray = form.tags.split(',').map(t => t.trim()).filter(t => t);
        tagsArray.forEach((tag, index) => {
          updateData.append(`tags[${index}]`, tag);
        });
      }
      
      updateData.append('shipping[isFreeShipping]', form.isFreeShipping);
      updateData.append('shipping[shippingCharge]', form.isFreeShipping ? 0 : (Number(form.shippingCharge) || 0));
      updateData.append('shipping[deliveryTime][min]', Number(form.deliveryTimeMin) || 3);
      updateData.append('shipping[deliveryTime][max]', Number(form.deliveryTimeMax) || 7);
      updateData.append('isFeatured', form.isFeatured);
      updateData.append('isActive', true);

      console.log('📝 Updating product:', editId);
      console.log('Update data entries:');
      for (let pair of updateData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      dispatch(updateProduct({ productId: editId, productData: updateData }));
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(search.toLowerCase()) ||
    product.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-purple-700">Products</h2>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message || 'Operation successful!'}
          </div>
        )}

        {/* Error Message */}
        {(productError || localError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {productError || localError}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <img
                          src={product.images?.[0]?.url || 'https://via.placeholder.com/50'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">₹{product.price}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.stock?.quantity || 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.category?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(product._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-purple-700">Edit Product</h3>
                <button onClick={() => { setShowModal(false); resetForm(); }}>
                  <X className="text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                {/* Price & MRP */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price *</label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">MRP</label>
                    <input
                      type="number"
                      name="mrp"
                      value={form.mrp}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Stock & Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product Image {!editId && '*'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="fashion, trending, bestseller"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFreeShipping"
                      checked={form.isFreeShipping}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Free Shipping
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={form.isFeatured}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Featured Product
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-red-600 mb-4">Confirm Delete</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteId(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductsRedux;
