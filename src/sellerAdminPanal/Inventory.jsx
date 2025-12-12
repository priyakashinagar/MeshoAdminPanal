import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Edit2, Search, TrendingDown, TrendingUp, Warehouse, Loader2 } from 'lucide-react';
import inventoryService from '../services/inventoryService';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stockForm, setStockForm] = useState({ 
    quantity: 0, 
    type: 'addition',
    reason: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const sellerId = user.sellerId || user.seller?._id || user._id;
      
      const response = await inventoryService.getAllInventory({ sellerId });
      
      if (response.success && response.data) {
        // Data structure: response.data.inventory (array)
        const inventoryData = Array.isArray(response.data.inventory) ? response.data.inventory : [];
        const statsData = response.data.stats || {
          total: 0,
          inStock: 0,
          lowStock: 0,
          outOfStock: 0,
          totalValue: 0
        };
        
        setInventory(inventoryData);
        setStats(statsData);
      } else {
        setInventory([]);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to fetch inventory');
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = (item) => {
    setSelectedItem(item);
    setStockForm({ 
      quantity: 0,
      type: 'addition',
      reason: ''
    });
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
        quantity: parseInt(stockForm.quantity),
        type: stockForm.type,
        reason: stockForm.reason
      });
      
      setSuccessMessage('Stock updated successfully!');
      setShowModal(false);
      fetchInventory();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating stock:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to update stock');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const filteredInventory = Array.isArray(inventory) ? inventory.filter(item => {
    const productName = item.productId?.name || '';
    const sku = item.sku || '';
    return productName.toLowerCase().includes(search.toLowerCase()) ||
           sku.toLowerCase().includes(search.toLowerCase());
  }) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="w-full md:p-3">
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
      {stats.lowStock > 0 && (
        <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg flex items-start gap-3">
          <AlertTriangle className="text-orange-500 mt-1" size={24} />
          <div>
            <h3 className="font-bold text-orange-800">Low Stock Alert!</h3>
            <p className="text-orange-700">
              {stats.lowStock} item{stats.lowStock > 1 ? 's' : ''} running low on stock. Please restock soon.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Items</p>
              <h3 className="text-3xl font-bold text-purple-900 mt-1">{stats.total}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">In Stock</p>
              <h3 className="text-3xl font-bold text-green-900 mt-1">{stats.inStock}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Low Stock</p>
              <h3 className="text-3xl font-bold text-orange-900 mt-1">{stats.lowStock}</h3>
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
              <h3 className="text-3xl font-bold text-red-900 mt-1">{stats.outOfStock}</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="text-red-600" size={24} />
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
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">SKU</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Available</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Reserved</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Total</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    No inventory items found
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item._id} className="border-b border-purple-100 hover:bg-purple-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {item.productId?.images?.[0]?.url && (
                          <img 
                            src={item.productId.images[0].url} 
                            alt={item.productId.name}
                            className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-purple-900 text-sm truncate">{item.productId?.name || 'Unknown Product'}</p>
                          {item.variant?.size && (
                            <p className="text-xs text-purple-600 truncate">
                              {item.variant.size} - {item.variant.color}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded whitespace-nowrap">{item.sku}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold text-purple-900 text-sm">{item.stock?.available || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-orange-600 text-sm">{item.stock?.reserved || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-purple-700 text-sm">{item.stock?.total || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.status === 'out-of-stock' ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium inline-block whitespace-nowrap">
                          Out of Stock
                        </span>
                      ) : item.status === 'low-stock' ? (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium inline-flex items-center gap-1 whitespace-nowrap">
                          <AlertTriangle size={12} />
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium inline-block whitespace-nowrap">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleStockUpdate(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium whitespace-nowrap"
                      >
                        <Edit2 size={14} />
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Stock Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-purple-900">Update Stock</h3>
            <p className="text-purple-700 mb-4">
              Product: <strong>{selectedItem.productId?.name || 'Unknown'}</strong><br/>
              SKU: <strong className="font-mono">{selectedItem.sku}</strong><br/>
              Current Available: <strong>{selectedItem.stock?.available || 0}</strong>
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-purple-700 font-medium mb-2">
                  Stock Update Type
                </label>
                <select
                  value={stockForm.type}
                  onChange={(e) => setStockForm({ ...stockForm, type: e.target.value })}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="addition">Addition (Add Stock)</option>
                  <option value="sale">Sale (Reduce Stock)</option>
                  <option value="return">Return (Add Back)</option>
                  <option value="damage">Damage (Move to Damaged)</option>
                  <option value="adjustment">Adjustment (Set Exact)</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-700 font-medium mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={stockForm.quantity}
                  onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="0"
                  required
                />
                <p className="text-sm text-purple-600 mt-1">
                  {stockForm.type === 'adjustment' ? 'Set exact stock quantity' : 'Enter quantity to add/remove'}
                </p>
              </div>

              <div>
                <label className="block text-purple-700 font-medium mb-2">
                  Reason
                </label>
                <input
                  type="text"
                  value={stockForm.reason}
                  onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter reason for stock update"
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
