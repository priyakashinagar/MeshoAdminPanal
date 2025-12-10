import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Package, Loader2, Plus, Edit2 } from 'lucide-react';
import pricingService from '../services/pricingService';

export default function Pricing() {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [formData, setFormData] = useState({
    productId: '',
    basePrice: '',
    sellingPrice: '',
    mrp: '',
    autoPrice: { enabled: false, strategy: 'competitive' }
  });

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const sellerId = user.sellerId || user.seller?._id || user._id;
      
      const response = await pricingService.getAllPricing(sellerId);
      if (response.success) {
        setPricingData(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pricing data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const sellerId = user.sellerId || user.seller?._id || user._id;
      
      if (editingPrice) {
        await pricingService.updatePricing(editingPrice._id, formData);
      } else {
        await pricingService.createPricing({ ...formData, sellerId });
      }
      
      setShowModal(false);
      setEditingPrice(null);
      setFormData({ productId: '', basePrice: '', sellingPrice: '', mrp: '', autoPrice: { enabled: false, strategy: 'competitive' } });
      fetchPricing();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save pricing');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Pricing</h2>
          <p className="text-gray-600">Set and manage your product prices effectively.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          <Plus size={20} />
          Add Pricing
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Product Pricing</h3>
        {pricingData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No pricing data available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Selling Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">MRP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Margin</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Auto Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pricingData.map((price) => (
                  <tr key={price._id}>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{price.productId?.name || 'Unknown Product'}</div>
                    </td>
                    <td className="px-4 py-4">₹{price.basePrice}</td>
                    <td className="px-4 py-4 font-medium">₹{price.sellingPrice}</td>
                    <td className="px-4 py-4">₹{price.mrp}</td>
                    <td className="px-4 py-4">
                      <span className="text-green-600">{price.discount?.percentage?.toFixed(1)}%</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={price.margin >= 20 ? 'text-green-600' : 'text-orange-600'}>
                        {price.margin?.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${price.autoPrice?.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {price.autoPrice?.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => {
                          setEditingPrice(price);
                          setFormData({
                            productId: price.productId?._id,
                            basePrice: price.basePrice,
                            sellingPrice: price.sellingPrice,
                            mrp: price.mrp,
                            autoPrice: price.autoPrice || { enabled: false, strategy: 'competitive' }
                          });
                          setShowModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <Edit2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{editingPrice ? 'Edit Pricing' : 'Add Pricing'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
                  <input
                    type="text"
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                    disabled={!!editingPrice}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
                  <input
                    type="number"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MRP</label>
                  <input
                    type="number"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoPrice"
                    checked={formData.autoPrice.enabled}
                    onChange={(e) => setFormData({ ...formData, autoPrice: { ...formData.autoPrice, enabled: e.target.checked } })}
                    className="mr-2"
                  />
                  <label htmlFor="autoPrice" className="text-sm font-medium text-gray-700">Enable Auto Pricing</label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPrice(null);
                    setFormData({ productId: '', basePrice: '', sellingPrice: '', mrp: '', autoPrice: { enabled: false, strategy: 'competitive' } });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editingPrice ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
