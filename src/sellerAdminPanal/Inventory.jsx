import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Edit2, Search, TrendingDown, TrendingUp, Warehouse } from 'lucide-react';
import inventoryService from '../services/inventoryService';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({ total: 0, inStock: 0, lowStock: 0, outOfStock: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stockForm, setStockForm] = useState({ quantity: 0, type: 'addition', reason: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const getSellerId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.sellerId || user?.seller?._id || user?._id;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [statusFilter]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const sellerId = getSellerId();
      const response = await inventoryService.getAllInventory({ sellerId, status: statusFilter });
      setInventory(response.data.inventory || []);
      setStats(response.data.stats || {});
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setErrorMessage('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = (item) => {
    setSelectedItem(item);
    setStockForm({ quantity: 0, type: 'addition', reason: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem?._id) {
      setErrorMessage('Inventory item is missing');
      return;
    }

    try {
      await inventoryService.updateStock(selectedItem._id, {
        quantity: Number(stockForm.quantity),
        type: stockForm.type,
        reason: stockForm.reason || 'Stock update'
      });
      
      setSuccessMessage('Stock updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
      fetchInventory();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to update stock');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const productName = item.productId?.name || '';
    return productName.toLowerCase().includes(search.toLowerCase());
  });

  const lowStockCount = stats.lowStock || 0;
  const outOfStockCount = stats.outOfStock || 0;

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
              <p className="text-sm text-purple-600 font-medium">Total Items</p>
              <h3 className="text-3xl font-bold text-purple-900 mt-1">{stats.total || 0}</h3>
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
              {filteredInventory.map((item) => {
                const stock = item.totalStock || 0;
                const threshold = item.lowStockThreshold || 10;
                const isLowStock = stock < threshold && stock > 0;
                const isOutOfStock = stock === 0;
                const product = item.productId || {};

                return (
                  <tr key={item._id} className="border-b border-purple-100 hover:bg-purple-50">
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
                          <p className="font-medium text-purple-900">{product.name || 'Unknown Product'}</p>
                          <p className="text-sm text-purple-600">₹{product.price || 'N/A'}</p>
                          {item.sku && (
                            <p className="text-xs text-purple-500">SKU: {item.sku}</p>
                          )}
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
                        onClick={() => handleStockUpdate(item)}
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
            <p className="text-purple-700 mb-4">
              Product: <strong>{selectedItem?.productId?.name || 'Unknown'}</strong>
            </p>
            {selectedItem?.variants && (
              <p className="text-purple-600 text-sm mb-4">
                SKU: {selectedItem.sku || 'N/A'}
              </p>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-purple-700 font-medium mb-2">
                  Stock Operation Type
                </label>
                <select
                  name="type"
                  value={stockForm.type}
                  onChange={(e) => setStockForm({ ...stockForm, type: e.target.value })}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="addition">Addition (Add Stock)</option>
                  <option value="sale">Sale (Remove Stock)</option>
                  <option value="return">Return (Add Stock)</option>
                  <option value="damage">Damage (Remove Stock)</option>
                  <option value="adjustment">Adjustment</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-700 font-medium mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={stockForm.quantity}
                  onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="1"
                  required
                />
                <p className="text-sm text-purple-600 mt-1">
                  Current Stock: <strong>{selectedItem?.totalStock || 0}</strong> units
                </p>
              </div>

              <div>
                <label className="block text-purple-700 font-medium mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  name="reason"
                  value={stockForm.reason}
                  onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="2"
                  placeholder="Enter reason for stock update..."
                />
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
