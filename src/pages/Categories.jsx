import React, { useState, useEffect } from "react";
import AdminLayout from '../components/layout/AdminLayout';
import categoryService from '../services/categoryService';

const Categories = () => {
  const [activeTab, setActiveTab] = useState('parent'); // parent, sub, child
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    icon: '',
    order: 0,
    parent: '',
    commission: 0,
  });

  const [imageFile, setImageFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [iconPreview, setIconPreview] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      if (activeTab === 'parent') {
        const response = await categoryService.getAllParentCategories();
        setCategories(response.data.categories || []);
        setParentCategories(response.data.categories || []);
      } else if (activeTab === 'sub') {
        const response = await categoryService.getAllParentCategories();
        setParentCategories(response.data.categories || []);
        
        // Fetch all subcategories from all parents
        const allSubs = [];
        for (const parent of response.data.categories || []) {
          try {
            const subResponse = await categoryService.getSubcategories(parent._id);
            allSubs.push(...(subResponse.data.subcategories || []));
          } catch (err) {
            console.error(`Failed to fetch subcategories for ${parent.name}:`, err);
          }
        }
        setCategories(allSubs);
        setSubcategories(allSubs);
      } else if (activeTab === 'child') {
        // First get parent categories
        const parentResponse = await categoryService.getAllParentCategories();
        setParentCategories(parentResponse.data.categories || []);
        
        // Get all subcategories
        const allSubs = [];
        for (const parent of parentResponse.data.categories || []) {
          try {
            const subResponse = await categoryService.getSubcategories(parent._id);
            allSubs.push(...(subResponse.data.subcategories || []));
          } catch (err) {
            console.error(`Failed to fetch subcategories for ${parent.name}:`, err);
          }
        }
        setSubcategories(allSubs);
        
        // Get all child categories from all subcategories
        const allChildren = [];
        for (const sub of allSubs) {
          try {
            const childResponse = await categoryService.getChildCategories(sub._id);
            allChildren.push(...(childResponse.data.childCategories || []));
          } catch (err) {
            console.error(`Failed to fetch child categories for ${sub.name}:`, err);
          }
        }
        setCategories(allChildren);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('name', form.name);
      if (form.slug) formData.append('slug', form.slug);
      if (form.description) formData.append('description', form.description);
      if (form.order) formData.append('order', form.order);
      if (form.parent) formData.append('parent', form.parent);
      formData.append('commission', form.commission || 0);
      
      // Add image file only if new one is uploaded
      // Don't send existing image - backend will keep it
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      // Add icon file only if new one is uploaded
      if (iconFile) {
        formData.append('icon', iconFile);
      }
      
      if (editMode) {
        await categoryService.updateCategory(editId, formData);
        setSuccess('Category updated successfully');
      } else {
        if (activeTab === 'parent') {
          await categoryService.addParentCategory(formData);
          setSuccess('Parent category added successfully');
        } else if (activeTab === 'sub') {
          if (!form.parent) {
            setError('Please select a parent category');
            setLoading(false);
            return;
          }
          await categoryService.addSubcategory(formData);
          setSuccess('Subcategory added successfully');
        } else if (activeTab === 'child') {
          if (!form.parent) {
            setError('Please select a subcategory');
            setLoading(false);
            return;
          }
          await categoryService.addChildCategory(formData);
          setSuccess('Child category added successfully');
        }
      }

      resetForm();
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
      console.error('Error saving category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) return;

    try {
      setLoading(true);
      setError('');
      await categoryService.deleteCategory(id);
      setSuccess('Category deleted successfully');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
      console.error('Error deleting category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setForm({
      name: category.name,
      slug: category.slug || '',
      description: category.description || '',
      image: category.image?.url || '',
      icon: category.icon || '',
      order: category.order || 0,
      parent: category.parent?._id || category.parent || '',
      commission: category.commission || 0,
    });
    setImagePreview(category.image?.url || '');
    setIconPreview(category.icon || '');
    setEditId(category._id);
    setEditMode(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({
      name: '',
      slug: '',
      description: '',
      image: '',
      icon: '',
      order: 0,
      parent: '',
      commission: 0,
    });
    setImageFile(null);
    setIconFile(null);
    setImagePreview('');
    setIconPreview('');
    setEditMode(false);
    setEditId(null);
    setShowModal(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Icon size should be less than 2MB');
        return;
      }
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setForm({ ...form, image: '' });
  };

  const removeIcon = () => {
    setIconFile(null);
    setIconPreview('');
    setForm({ ...form, icon: '' });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-purple-900">Categories Management</h2>
          <button
            onClick={() => { setShowModal(true); setEditMode(false); }}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
          >
            + Add Category
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4 shadow">
            ✓ {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 shadow">
            ✗ {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b-2 border-purple-200 pb-0">
          <button
            onClick={() => setActiveTab('parent')}
            className={`px-6 py-3 font-semibold border-b-4 transition-all rounded-t-lg ${
              activeTab === 'parent'
                ? 'border-purple-600 text-purple-600 bg-purple-50'
                : 'border-transparent text-gray-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            📁 Parent Categories
          </button>
          <button
            onClick={() => setActiveTab('sub')}
            className={`px-6 py-3 font-semibold border-b-4 transition-all rounded-t-lg ${
              activeTab === 'sub'
                ? 'border-purple-600 text-purple-600 bg-purple-50'
                : 'border-transparent text-gray-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            📂 Subcategories
          </button>
          <button
            onClick={() => setActiveTab('child')}
            className={`px-6 py-3 font-semibold border-b-4 transition-all rounded-t-lg ${
              activeTab === 'child'
                ? 'border-purple-600 text-purple-600 bg-purple-50'
                : 'border-transparent text-gray-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            🗂️ Child Categories
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-purple-100 rounded-full px-5 py-2 shadow mb-6 focus-within:ring-2 focus-within:ring-pink-400 w-96">
          <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            type="text"
            placeholder="Search Category Name"
            value={search}
            onChange={handleSearchChange}
            className="border-0 bg-transparent text-purple-900 outline-none w-full text-lg placeholder-purple-400"
          />
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-purple-200 relative max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-purple-700">
                {editMode ? 'Edit Category' : `Add ${activeTab === 'parent' ? 'Parent' : activeTab === 'sub' ? 'Sub' : 'Child'} Category`}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Parent/Subcategory Selection */}
                {(activeTab === 'sub' || activeTab === 'child') && (
                  <div>
                    <label className="block text-sm font-bold mb-2 text-purple-700">
                      {activeTab === 'sub' ? 'Parent Category *' : 'Subcategory *'}
                    </label>
                    <select
                      name="parent"
                      value={form.parent}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                    >
                      <option value="">-- Select {activeTab === 'sub' ? 'Parent Category' : 'Subcategory'} --</option>
                      {activeTab === 'sub'
                        ? parentCategories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))
                        : subcategories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                    </select>
                  </div>
                )}

                {/* Category Name */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-purple-700">Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter category name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-purple-700">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    placeholder="category-url-slug"
                    value={form.slug}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-purple-700">Description</label>
                  <textarea
                    name="description"
                    placeholder="Category description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-purple-700">Category Image</label>
                  <div className="space-y-3">
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="relative inline-block">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-xl border-2 border-purple-200"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    
                    {/* File Upload Button */}
                    <div className="flex gap-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-500 transition-colors bg-purple-50">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium text-purple-700">
                            {imageFile ? imageFile.name : 'Upload Image'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    {/* Or URL Input */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-purple-200"></div>
                      <span className="text-xs text-gray-500">OR</span>
                      <div className="flex-1 h-px bg-purple-200"></div>
                    </div>
                    <input
                      type="text"
                      name="image"
                      placeholder="https://example.com/image.jpg"
                      value={form.image}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Upload an image or provide URL (max 5MB)</p>
                </div>

                {/* Icon Upload */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-purple-700">Category Icon</label>
                  <div className="space-y-3">
                    {/* Icon Preview */}
                    {iconPreview && (
                      <div className="relative inline-block">
                        {iconPreview.startsWith('data:') || iconPreview.startsWith('http') ? (
                          <img 
                            src={iconPreview} 
                            alt="Icon Preview" 
                            className="w-16 h-16 object-cover rounded-xl border-2 border-purple-200"
                          />
                        ) : (
                          <div className="w-16 h-16 flex items-center justify-center text-3xl border-2 border-purple-200 rounded-xl bg-purple-50">
                            {iconPreview}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={removeIcon}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    
                    {/* File Upload Button */}
                    <div className="flex gap-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-500 transition-colors bg-purple-50">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                          <span className="text-sm font-medium text-purple-700">
                            {iconFile ? iconFile.name : 'Upload Icon'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleIconChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    {/* Or Text Input */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-purple-200"></div>
                      <span className="text-xs text-gray-500">OR</span>
                      <div className="flex-1 h-px bg-purple-200"></div>
                    </div>
                    <input
                      type="text"
                      name="icon"
                      placeholder="🛍️ or icon-class or URL"
                      value={form.icon}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Upload icon, enter emoji, or provide URL/class (max 2MB)</p>
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-purple-700">Display Order</label>
                  <input
                    type="number"
                    name="order"
                    placeholder="0"
                    value={form.order}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>

                {/* Commission (Admin Only - Hidden from Sellers) */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">💰</span>
                    <label className="text-sm font-bold text-purple-700">Commission Rate (%)</label>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">Admin Only</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">This commission percentage will be deducted from seller earnings. Sellers cannot see this.</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      name="commission"
                      placeholder="0"
                      min="0"
                      max="100"
                      step="0.1"
                      value={form.commission}
                      onChange={handleChange}
                      className="w-32 px-4 py-3 border border-purple-300 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-white text-center text-lg font-bold"
                    />
                    <span className="text-xl font-bold text-purple-700">%</span>
                    <div className="flex-1 text-right">
                      <p className="text-sm text-gray-600">
                        Example: If product is ₹1000, you get <span className="font-bold text-green-600">₹{((form.commission || 0) * 10).toFixed(0)}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-purple-200">
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="bg-gray-200 hover:bg-gray-300 px-8 py-3 font-semibold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : editMode ? 'Update Category' : 'Add Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Categories Table */}
        <div className={showModal ? "opacity-40 pointer-events-none blur-sm transition-all" : "opacity-100 transition-all"}>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Name</th>
                    <th className="px-6 py-4 text-left font-bold">Slug</th>
                    <th className="px-6 py-4 text-left font-bold">Description</th>
                    <th className="px-6 py-4 text-left font-bold">Commission</th>
                    <th className="px-6 py-4 text-left font-bold">Order</th>
                    <th className="px-6 py-4 text-left font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500 text-lg">
                        {search ? 'No categories found matching your search' : 'No categories yet. Click "Add Category" to create one!'}
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((cat) => (
                      <tr key={cat._id} className="border-b border-purple-100 hover:bg-purple-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-purple-900 flex items-center gap-3">
                          {/* Category Image/Icon */}
                          {(cat.image?.url || cat.image || cat.icon) && (
                            <img 
                              src={
                                cat.image?.url 
                                  ? (cat.image.url.startsWith('http') ? cat.image.url : `http://localhost:5000${cat.image.url}`)
                                  : cat.image?.startsWith?.('http') 
                                    ? cat.image 
                                    : cat.icon?.startsWith?.('/uploads') 
                                      ? `http://localhost:5000${cat.icon}`
                                      : cat.icon?.startsWith?.('http')
                                        ? cat.icon
                                        : null
                              }
                              alt={cat.name}
                              className="w-10 h-10 object-cover rounded-lg border border-purple-200"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}
                          {cat.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{cat.slug || '-'}</td>
                        <td className="px-6 py-4 text-gray-600">{cat.description || '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            (cat.commission || 0) > 0 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {cat.commission || 0}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{cat.order || 0}</td>
                        <td className="px-6 py-4 flex gap-3 items-center">
                          <button 
                            onClick={() => handleEdit(cat)}
                            className="font-bold hover:underline transition-all"
                            style={{ color: '#A259F7' }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(cat._id)}
                            className="text-red-600 font-bold hover:underline transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Categories;
