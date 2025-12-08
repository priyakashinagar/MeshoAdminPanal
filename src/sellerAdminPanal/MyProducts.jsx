
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  // Fetch products and categories on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllParentCategories();
      console.log('Categories response:', response);
      const categoryData = response.data?.categories || response.categories || response.data || [];
      setCategories(Array.isArray(categoryData) ? categoryData : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      // If seller, fetch only their products
      if (user?.role === 'seller' && user?.sellerId) {
        const response = await productService.getProductsBySeller(user.sellerId);
        setProducts(response.data || []);
      } else {
        // Admin can see all products
        const response = await productService.getProducts({ page: 1, limit: 100 });
        setProducts(response.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // Edit logic
  const handleEditClick = (product) => {
    setEditProduct(product);
    setEditForm({ 
      ...product,
      category: product.category?._id || product.category || '',
      stock: product.stock?.quantity || product.stock || 0,
      mrp: product.mrp || product.price || 0,
      discount: product.discount || 0
    });
  };
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setEditForm({ ...editForm, image: files[0] });
    } else {
      let updatedForm = { ...editForm, [name]: value };
      
      // Auto-calculate sale price when MRP or discount changes
      if (name === 'mrp' || name === 'discount') {
        const mrp = name === 'mrp' ? Number(value) : Number(editForm.mrp);
        const discount = name === 'discount' ? Number(value) : Number(editForm.discount);
        if (mrp > 0 && discount >= 0 && discount <= 100) {
          const salePrice = Math.round(mrp - (mrp * discount / 100));
          updatedForm.price = salePrice;
        }
      }
      
      setEditForm(updatedForm);
    }
  };
  const handleEditSave = async () => {
    try {
      setLoading(true);
      const stockQuantity = Number(editForm.stock) || 0;
      await productService.updateProduct(editProduct._id || editProduct.id, {
        name: editForm.name,
        description: editForm.description,
        price: Number(editForm.price),
        mrp: Number(editForm.mrp) || Number(editForm.price),
        discount: Number(editForm.discount) || 0,
        stock: { 
          quantity: stockQuantity,
          status: stockQuantity > 0 ? 'in_stock' : 'out_of_stock'
        },
        category: editForm.category
      });
      setEditProduct(null);
      fetchProducts(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  // Delete logic
  const handleDeleteClick = (product) => {
    setDeleteProduct(product);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProduct) return;
    
    try {
      setLoading(true);
      await productService.deleteProduct(deleteProduct._id || deleteProduct.id);
      setDeleteProduct(null);
      fetchProducts(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  // Detail logic
  const handleDetailClick = async (product) => {
    try {
      setLoading(true);
      const response = await productService.getProductById(product._id || product.id);
      setDetailProduct(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product details');
      console.error('Error fetching product details:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 overflow-x-hidden flex flex-col gap-4 items-center w-full max-w-full">
      <h2 className="text-2xl font-bold mb-2">My Products</h2>
      <p className="text-purple-700 mb-6">Manage your products inventory and details.</p>

      {/* Error Message */}
      {error && (
        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">×</button>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center mb-6 gap-3 sm:gap-4 w-full">
        <div className="flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 shadow focus-within:ring-2 focus-within:ring-pink-400 w-full max-w-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
          <input
            type="text"
            placeholder="Search Product Name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border-0 bg-transparent text-purple-900 outline-none w-full text-lg placeholder-purple-400"
          />
        </div>
        <button
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2 rounded-xl shadow font-semibold text-base w-full sm:w-auto"
          onClick={() => navigate('/seller/products/new')}
        >
          Add Product
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-2 sm:p-4 md:p-6 border border-purple-100 w-full">
        <div className="overflow-x-auto w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="min-w-[350px] sm:min-w-[500px] md:min-w-[700px] w-full text-left max-w-full table-fixed">
          <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <tr>
              <th className="px-2 sm:px-4 py-2 sm:py-4 text-left w-[8%]">ID</th>
              <th className="px-2 sm:px-4 py-2 sm:py-4 text-left w-[32%]">Name</th>
              <th className="px-2 sm:px-4 py-2 sm:py-4 text-left w-[15%]">Price</th>
              <th className="px-2 sm:px-4 py-2 sm:py-4 text-left w-[15%]">Stock</th>
              <th className="px-2 sm:px-4 py-2 sm:py-4 text-left w-[30%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product._id || product.id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                <td className="px-2 sm:px-4 py-2 sm:py-4 font-medium text-purple-900">{index + 1}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-4 truncate" title={product.name}>{product.name}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-4 font-bold text-purple-700">₹{product.price?.toLocaleString()}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-4">{product.stock?.quantity || product.stock || 0}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-4">
                  <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
                    <button className="text-purple-600 font-bold hover:underline whitespace-nowrap text-sm" onClick={() => handleDetailClick(product)}>Detail</button>
                    <button className="font-bold hover:underline text-purple-600 whitespace-nowrap text-sm" onClick={() => handleEditClick(product)}>Edit</button>
                    <button className="text-red-600 font-bold hover:underline whitespace-nowrap text-sm" onClick={() => handleDeleteClick(product)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal - Blurred, Scrollable, Modern UI */}
      {editProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(10px)' }}>
          <div
            className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg border border-purple-200 relative hide-scrollbar"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
          >
            <style>{`
              .hide-scrollbar::-webkit-scrollbar { display: none; }
              .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
            `}</style>
            <h2 className="text-xl font-bold mb-6 text-purple-700">Edit Product</h2>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
              <div>
                <label className="block text-lg font-bold mb-2 text-purple-700">Product Name</label>
                <input name="name" value={editForm.name} onChange={handleEditChange} className="w-full px-4 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50" placeholder="Name" required />
              </div>
              {/* Pricing Section */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-200 space-y-3">
                <h4 className="font-bold text-green-700 flex items-center gap-2">
                  💰 Pricing & Discount
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold mb-1 text-purple-700">MRP (₹)</label>
                    <input name="mrp" type="number" value={editForm.mrp} onChange={handleEditChange} className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-white" placeholder="1000" required min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1 text-purple-700">Discount (%)</label>
                    <input name="discount" type="number" value={editForm.discount} onChange={handleEditChange} className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-white" placeholder="20" min="0" max="100" />
                  </div>
                </div>
                {/* Auto-calculated Sale Price */}
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-lg border border-green-300">
                  <label className="block text-sm font-semibold text-green-700 mb-1">Sale Price (Auto-calculated)</label>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-green-700">₹{editForm.price || 0}</span>
                    {editForm.mrp && editForm.discount > 0 && (
                      <>
                        <span className="text-sm text-gray-500 line-through">₹{editForm.mrp}</span>
                        <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">{editForm.discount}% OFF</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-lg font-bold mb-2 text-purple-700">Stock</label>
                <input name="stock" type="number" value={editForm.stock} onChange={handleEditChange} className="w-full px-4 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50" placeholder="Stock" required />
              </div>
              <div>
                <label className="block text-lg font-bold mb-2 text-purple-700">Category</label>
                <select 
                  name="category" 
                  value={editForm.category} 
                  onChange={handleEditChange} 
                  className="w-full px-4 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-lg font-bold mb-2 text-purple-700">Description</label>
                <textarea name="description" value={editForm.description} onChange={handleEditChange} className="w-full px-4 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50" placeholder="Description" rows={2} />
              </div>
              <div>
                <label className="block text-lg font-bold mb-2 text-purple-700">Image</label>
                <input name="image" type="file" accept="image/*" onChange={handleEditChange} className="w-full px-4 py-2 border border-purple-200 rounded-xl shadow-sm bg-white" />
                {editForm.image && (typeof editForm.image === 'object' ? (
                  <img src={URL.createObjectURL(editForm.image)} alt="Preview" className="h-20 rounded-lg border mt-2 object-cover" />
                ) : (
                  <img src={editForm.image} alt="Preview" className="h-20 rounded-lg border mt-2 object-cover" />
                ))}
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button type="button" className="bg-gray-200 hover:bg-gray-300 px-7 py-2 font-semibold rounded-xl" onClick={() => setEditProduct(null)}>Cancel</button>
                <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-7 py-2 font-semibold rounded-xl shadow">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal - blurred, modern UI */}
      {deleteProduct && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(10px)' }}>
            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md border border-purple-200 relative">
              <h2 className="text-xl font-bold mb-6 text-red-600">Delete Product</h2>
              <p className="mb-6 text-purple-700">Do you want to delete product <span className="font-bold">{deleteProduct.name}</span>?</p>
              <div className="flex justify-end gap-4 mt-6">
                <button className="bg-gray-200 hover:bg-gray-300 px-7 py-2 font-semibold rounded-xl" onClick={() => setDeleteProduct(null)}>Cancel</button>
                <button className="bg-gradient-to-r from-red-600 to-pink-500 text-white px-7 py-2 font-semibold rounded-xl shadow" onClick={() => { handleDeleteConfirm(); setDeleteProduct(null); }}>Delete</button>
              </div>
            </div>
          </div>
      )}

      {/* Detail Modal - Blurred, Scrollable, Modern UI */}
      {detailProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backdropFilter: 'blur(10px)' }}>
          <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
          `}</style>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl border border-purple-200 relative hide-scrollbar" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-t-2xl">
              <h2 className="text-2xl font-bold">Product Details</h2>
            </div>

            <div className="p-6">
              {/* Image and Basic Info Section */}
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                {/* Image */}
                {detailProduct.images && detailProduct.images[0]?.url && (
                  <div className="flex-shrink-0 flex justify-center items-center bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <img 
                      src={detailProduct.images[0].url} 
                      alt={detailProduct.name} 
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                )}
                
                {/* Basic Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-purple-900">{detailProduct.name}</h3>
                    <p className="text-gray-600 mt-1">{detailProduct.category?.name || 'N/A'}</p>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-purple-700">₹{detailProduct.price?.toLocaleString()}</span>
                    {detailProduct.mrp && detailProduct.mrp > detailProduct.price && (
                      <>
                        <span className="text-lg text-gray-500 line-through">₹{detailProduct.mrp?.toLocaleString()}</span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold">
                          {detailProduct.discount}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-gray-600 text-sm">Stock:</span>
                      <p className="text-lg font-semibold">{detailProduct.stock?.quantity || 0} units</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      detailProduct.stock?.status === 'in_stock' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {detailProduct.stock?.status === 'in_stock' ? '✓ In Stock' : '✗ Out of Stock'}
                    </span>
                  </div>

                  {detailProduct.isFeatured && (
                    <div>
                      <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2">
                        ⭐ Featured Product
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Info Card */}
              {detailProduct.shipping && (
                <div className="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-100">
                  <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Shipping Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600 text-sm">Shipping Cost:</span>
                      <p className="font-semibold">
                        {detailProduct.shipping.isFreeShipping ? (
                          <span className="text-green-600">FREE Shipping</span>
                        ) : (
                          <span>₹{detailProduct.shipping.shippingCharge}</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Delivery Time:</span>
                      <p className="font-semibold">
                        {detailProduct.shipping.deliveryTime?.min}-{detailProduct.shipping.deliveryTime?.max} days
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              {detailProduct.description && (
                <div className="mb-6">
                  <h4 className="font-bold text-purple-900 mb-2 text-lg">Description</h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                    {detailProduct.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {detailProduct.tags && detailProduct.tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-purple-900 mb-2 text-lg">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {detailProduct.tags.map((tag, idx) => (
                      <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ratings */}
              {detailProduct.ratings && detailProduct.ratings.count > 0 && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                    <span className="text-xl">⭐</span>
                    Customer Reviews
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-amber-600">
                      {detailProduct.ratings.average?.toFixed(1) || 0}
                    </span>
                    <div>
                      <p className="text-gray-600 text-sm">out of 5</p>
                      <p className="text-gray-500 text-xs">{detailProduct.ratings.count} reviews</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end rounded-b-2xl">
              <button 
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow" 
                onClick={() => setDetailProduct(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}