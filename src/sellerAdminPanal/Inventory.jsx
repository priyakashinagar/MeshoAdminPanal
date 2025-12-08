import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Edit2, Search } from 'lucide-react';
import sellerService from '../services/sellerService';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockForm, setStockForm] = useState({ quantity: '', minimum: 10 });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await sellerService.getProducts();
      setProducts(response.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setErrorMessage('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = (product) => {
    setSelectedProduct(product);
    setStockForm({
      quantity: product.stock?.quantity || product.stock || 0,
      minimum: product.stock?.lowStockThreshold || 10
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !selectedProduct._id) {
      setErrorMessage('Product ID is missing');
      return;
    }

    try {
      const stockQuantity = Number(stockForm.quantity) || 0;
      const updatedData = {
        stock: {
          quantity: stockQuantity,
          status: stockQuantity > 0 ? 'in_stock' : 'out_of_stock',
          lowStockThreshold: Number(stockForm.minimum) || 10
        }
      };
      
      await sellerService.updateProduct(selectedProduct._id, updatedData);
      setSuccessMessage('Stock updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update stock');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const filteredProducts = products.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getLowStockItems = () => products.filter(item => {
    const stock = item.stock?.quantity || item.stock || 0;
    const threshold = item.stock?.lowStockThreshold || 10;
    return stock < threshold && stock > 0;
  });

  const getOutOfStock = () => products.filter(item => {
    const stock = item.stock?.quantity || item.stock || 0;
    return stock === 0;
  });

  const lowStockCount = getLowStockItems().length;
  const outOfStockCount = getOutOfStock().length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-purple-600 text-xl">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="w-full  md:p-3">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-2 text-purple-900">Inventory Management</h2>
      <p className="text-purple-700 mb-6">Monitor and manage your product stock levels.</p>

      {/* Alerts */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg flex items-start gap-3">
          <AlertTriangle className="text-orange-500 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-orange-800">Low Stock Alert!</h3>
            <p className="text-orange-700">
              {lowStockCount} product{lowStockCount > 1 ? 's' : ''} running low on stock. Please restock soon.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Products</p>
              <h3 className="text-3xl font-bold text-purple-900 mt-1">{products.length}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Low Stock</p>
              <h3 className="text-3xl font-bold text-orange-900 mt-1">{lowStockCount}</h3>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Out of Stock</p>
              <h3 className="text-3xl font-bold text-red-900 mt-1">{outOfStockCount}</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Package className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <tr>
                <th className="px-4 py-4 text-left">Product</th>
                <th className="px-4 py-4 text-left">Current Stock</th>
                <th className="px-4 py-4 text-left">Low Stock Alert</th>
                <th className="px-4 py-4 text-left">Status</th>
                <th className="px-4 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stock = product.stock?.quantity || product.stock || 0;
                const threshold = product.stock?.lowStockThreshold || 10;
                const isLowStock = stock < threshold && stock > 0;
                const isOutOfStock = stock === 0;

                return (
                  <tr key={product._id} className="border-b border-purple-100 hover:bg-purple-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] && (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className="font-medium text-purple-900">{product.name}</p>
                          <p className="text-sm text-purple-600">₹{product.price}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-purple-900">{stock}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-purple-700">{threshold} units</span>
                    </td>
                    <td className="px-4 py-4">
                      {isOutOfStock ? (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium flex items-center gap-1 w-fit">
                          <AlertTriangle size={14} />
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleStockUpdate(product)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Edit2 size={16} />
                        Update Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Stock Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-purple-900">Update Stock</h3>
            <p className="text-purple-700 mb-4">Product: <strong>{selectedProduct?.name}</strong></p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-purple-700 font-medium mb-2">
                  Current Stock Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={stockForm.quantity}
                  onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-700 font-medium mb-2">
                  Low Stock Alert Threshold
                </label>
                <input
                  type="number"
                  name="minimum"
                  value={stockForm.minimum}
                  onChange={(e) => setStockForm({ ...stockForm, minimum: e.target.value })}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="1"
                  required
                />
                <p className="text-sm text-purple-600 mt-1">
                  You'll be alerted when stock falls below this number
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
