import React, { useState, useEffect } from 'react';
import { Warehouse, MapPin, Package, Plus, Edit2, Trash2, X } from 'lucide-react';
import warehouseService from '../services/warehouseService';

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: { address: '', city: '', state: '', pincode: '', country: 'India' },
    capacity: { total: 1000 },
    contactPerson: { name: '', phone: '', email: '' }
  });

  const getSellerId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.sellerId || user?.seller?._id || user?._id;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const sellerId = getSellerId();
      const response = await warehouseService.getAllWarehouses({ sellerId });
      setWarehouses(response.data.warehouses || []);
    } catch (err) {
      console.error('Error fetching warehouses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingWarehouse(null);
    setFormData({
      name: '',
      location: { address: '', city: '', state: '', pincode: '', country: 'India' },
      capacity: { total: 1000 },
      contactPerson: { name: '', phone: '', email: '' }
    });
    setShowModal(true);
  };

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({
      name: warehouse.name || '',
      location: warehouse.location || { address: '', city: '', state: '', pincode: '', country: 'India' },
      capacity: warehouse.capacity || { total: 1000 },
      contactPerson: warehouse.contactPerson || { name: '', phone: '', email: '' }
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this warehouse?')) return;
    try {
      await warehouseService.deleteWarehouse(id);
      fetchWarehouses();
    } catch (err) {
      console.error('Error deleting warehouse:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sellerId = getSellerId();
      const data = { ...formData, sellerId };
      
      if (editingWarehouse) {
        await warehouseService.updateWarehouse(editingWarehouse._id, data);
      } else {
        await warehouseService.createWarehouse(data);
      }
      
      setShowModal(false);
      fetchWarehouses();
    } catch (err) {
      console.error('Error saving warehouse:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-purple-600 text-xl">Loading warehouses...</div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Warehouse Management</h2>
      <p className="text-gray-600 mb-6">Manage your warehouse locations and inventory distribution.</p>

      <div className="flex justify-end mb-6">
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          <Plus size={20} />
          Add Warehouse
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {warehouses.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Warehouse className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No warehouses added yet</p>
          </div>
        ) : (
          warehouses.map((warehouse) => (
            <div key={warehouse._id} className="bg-white rounded-xl p-6 shadow border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{warehouse.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin size={14} />
                    <span>{warehouse.location?.city}, {warehouse.location?.state}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  warehouse.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {warehouse.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-semibold">{warehouse.capacity?.total || 0} units</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Occupied:</span>
                  <span className="font-semibold">{warehouse.capacity?.occupied || 0} units</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-semibold text-green-600">{warehouse.capacity?.available || warehouse.capacity?.total || 0} units</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                <button 
                  onClick={() => handleEdit(warehouse)}
                  className="flex-1 flex items-center justify-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(warehouse._id)}
                  className="flex-1 flex items-center justify-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Warehouse Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={formData.location.city}
                    onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">State</label>
                  <input
                    type="text"
                    value={formData.location.state}
                    onChange={(e) => setFormData({ ...formData, location: { ...formData.location, state: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Address</label>
                <textarea
                  value={formData.location.address}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows="2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Pincode</label>
                  <input
                    type="text"
                    value={formData.location.pincode}
                    onChange={(e) => setFormData({ ...formData, location: { ...formData.location, pincode: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Total Capacity (units)</label>
                  <input
                    type="number"
                    value={formData.capacity.total}
                    onChange={(e) => setFormData({ ...formData, capacity: { ...formData.capacity, total: parseInt(e.target.value) } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editingWarehouse ? 'Update' : 'Add'} Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
