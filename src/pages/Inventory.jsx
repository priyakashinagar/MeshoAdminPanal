import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Card from '../components/common/Card';
import { AlertTriangle, Package, TrendingUp, Loader2, Edit2, Search } from 'lucide-react';
import inventoryService from '../services/inventoryService';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
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
      console.log('📦 Fetching inventory...');
      // Admin can view all inventory (no sellerId filter)
      const response = await inventoryService.getAllInventory({});
      console.log('📦 Inventory API Response:', response);
      
      if (response.success && response.data) {
        const inventoryData = Array.isArray(response.data.inventory) ? response.data.inventory : [];
        const statsData = response.data.stats || {
          total: 0,
          inStock: 0,
          lowStock: 0,
          outOfStock: 0,
          totalValue: 0
        };
        
        console.log('📦 Inventory Data:', inventoryData);
        console.log('📦 First Item:', inventoryData[0]);
        console.log('📦 Stats:', statsData);
        
        setInventory(inventoryData);
        setStats(statsData);
      } else {
        console.warn('⚠️ No inventory data in response');
        setInventory([]);
      }
    } catch (err) {
      console.error('❌ Error fetching inventory:', err);
      console.error('❌ Error details:', err.response?.data);
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
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-purple-600 text-xl">Loading inventory...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="relative">
        {/* Success/Error Messages */}
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

        <div className="mb-2">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Inventory Management</h1>
        </div>

        {/* Search Bar and Add Inventory Button */}
        <div className="flex items-center mb-2">
          <div className="flex items-center gap-2 bg-purple-100 rounded-full px-5 py-2 shadow focus-within:ring-2 focus-within:ring-pink-400 w-96">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <input
              type="text"
              placeholder="Search by Product Name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent text-purple-900 outline-none w-full text-lg placeholder-purple-400"
            />
          </div>
          <button
            type="button"
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2 rounded-xl shadow ml-4 font-semibold text-base"
            onClick={() => window.location.href = '/products'}
          >
            Manage Products
          </button>
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

        {/* Dashboard Cards */}
        <div className="w-full mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            <Card className="p-6 border-0 shadow-lg bg-white w-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 mb-2">Total Items</p>
                  <p className="text-3xl font-normal text-purple-900">{stats.total}</p>
                </div>
                <Package className="text-purple-600" size={40} />
              </div>
            </Card>
            <Card className="p-6 border-0 shadow-lg bg-white w-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 mb-2">In Stock</p>
                  <p className="text-3xl font-normal text-green-900">{stats.inStock}</p>
                </div>
                <TrendingUp className="text-green-600" size={40} />
              </div>
            </Card>
            <Card className="p-6 border-0 shadow-lg bg-white w-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 mb-2">Low Stock</p>
                  <p className="text-3xl font-normal text-orange-900">{stats.lowStock}</p>
                </div>
                <AlertTriangle className="text-orange-600" size={40} />
              </div>
            </Card>
            <Card className="p-6 border-0 shadow-lg bg-white w-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 mb-2">Out of Stock</p>
                  <p className="text-3xl font-normal text-red-900">{stats.outOfStock}</p>
                </div>
                <Package className="text-red-600" size={40} />
              </div>
            </Card>
          </div>
        </div>

        {/* Inventory Table faded when modal is open */}
        <div className={showModal ? "opacity-40 pointer-events-none blur-sm" : "opacity-100"}>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">SKU</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Seller</th>
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
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
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
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded">
                          {item.sku}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-purple-700">
                          {item.sellerId?.shopName || item.sellerId?.businessDetails?.businessName || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-semibold text-purple-900">{item.stock?.available || 0}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-orange-600">{item.stock?.reserved || 0}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-semibold text-purple-700">{item.stock?.total || 0}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.status === 'in-stock' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">
                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                            In Stock
                          </span>
                        ) : item.status === 'low-stock' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium whitespace-nowrap">
                            <AlertTriangle size={12} />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium whitespace-nowrap">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleStockUpdate(item)}
                          className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium whitespace-nowrap inline-flex items-center gap-1"
                        >
                          <Edit2 size={12} />
                          Update Stock
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Inventory;
