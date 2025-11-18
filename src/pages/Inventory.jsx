import React, { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Card from '../components/common/Card';
import { AlertTriangle, Package, TrendingUp } from 'lucide-react';

const inventoryData = [
  { id: 1, product: 'iPhone 15 Pro', sku: 'SKU-001', current: 45, minimum: 20, reorder: 100 },
  { id: 2, product: 'Premium Headphones', sku: 'SKU-002', current: 120, minimum: 30, reorder: 150 },
  { id: 3, product: 'Wireless Charger', sku: 'SKU-003', current: 200, minimum: 50, reorder: 300 },
  { id: 4, product: 'USB-C Cable', sku: 'SKU-004', current: 500, minimum: 100, reorder: 800 },
  { id: 5, product: 'Laptop Stand', sku: 'SKU-005', current: 15, minimum: 25, reorder: 75 },
];

const Inventory = () => {
  const [inventory, setInventory] = useState(inventoryData);
  const [form, setForm] = useState({ product: '', sku: '', current: '', minimum: '', reorder: '' });
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.product && form.sku && form.current && form.minimum && form.reorder) {
      setInventory([
        ...inventory,
        {
          id: inventory.length + 1,
          product: form.product,
          sku: form.sku,
          current: Number(form.current),
          minimum: Number(form.minimum),
          reorder: Number(form.reorder),
        },
      ]);
      setForm({ product: '', sku: '', current: '', minimum: '', reorder: '' });
      setShowModal(false);
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.product.toLowerCase().includes(search.toLowerCase())
  );

  const getLowStockItems = () => inventory.filter(item => item.current < item.minimum);
  const getTotalValue = () => inventory.reduce((sum, item) => sum + item.current, 0);

  return (
    <AdminLayout>
      <div className="relative ">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Inventory Management</h1>
        </div>

        {/* Search Bar and Add Inventory Button */}
        <div className="flex items-center mb-2">
          <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 rounded-full px-5 py-2 shadow focus-within:ring-2 focus-within:ring-pink-400 w-96">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600 dark:text-purple-300" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <input
              type="text"
              placeholder="Search Product Name"
              value={search}
              onChange={handleSearchChange}
              className="border-0 bg-transparent text-purple-900 dark:text-purple-50 outline-none w-full text-lg placeholder-purple-400"
            />
          </div>
          <button
            type="button"
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2 rounded-xl shadow ml-4 font-semibold text-base"
            onClick={() => setShowModal(true)}
          >
            Add Inventory
          </button>
        </div>

        {/* Modal for Add Inventory */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(8px)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-purple-200 relative px-10 py-8 mt-4 mb-4">
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 pb-4">
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Product Name</label>
                  <input
                    type="text"
                    name="product"
                    placeholder="Product Name"
                    value={form.product}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    placeholder="SKU"
                    value={form.sku}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Current Stock</label>
                  <input
                    type="number"
                    name="current"
                    placeholder="Current Stock"
                    value={form.current}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Minimum Stock</label>
                  <input
                    type="number"
                    name="minimum"
                    placeholder="Minimum Stock"
                    value={form.minimum}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Reorder Level</label>
                  <input
                    type="number"
                    name="reorder"
                    placeholder="Reorder Level"
                    value={form.reorder}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <button type="button" className="bg-gray-200 hover:bg-gray-300 px-7 py-2 font-semibold rounded-xl" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-7 py-2 font-semibold rounded-xl shadow">Add Inventory</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dashboard Cards - Always display in a single row for md and above */}
        <div className="w-full overflow-x-auto mb-4">
          <div className="flex flex-row gap-4 min-w-[700px]">
            <Card className="p-6 border-0 shadow-lg bg-white dark:bg-slate-900 min-w-[220px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-300 mb-2">Total Items</p>
                  <p className="text-3xl font-normal text-purple-900 dark:text-purple-50">{getTotalValue()}</p>
                </div>
                <Package className="text-pink-600 dark:text-pink-400" size={40} />
              </div>
            </Card>
            <Card className="p-6 border-0 shadow-lg bg-white dark:bg-slate-900 min-w-[220px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-300 mb-2">Low Stock Items</p>
                  <p className="text-3xl font-normal text-pink-600 dark:text-pink-400">{getLowStockItems().length}</p>
                </div>
                <AlertTriangle className="text-pink-600 dark:text-pink-400" size={40} />
              </div>
            </Card>
            <Card className="p-6 border-0 shadow-lg bg-white dark:bg-slate-900 min-w-[220px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-300 mb-2">Total Products</p>
                  <p className="text-3xl font-normal text-purple-900 dark:text-purple-50">{inventory.length}</p>
                </div>
                <TrendingUp className="text-pink-600 dark:text-pink-400" size={40} />
              </div>
            </Card>
          </div>
        </div>

        {/* Inventory Table faded when modal is open */}
        <div className={showModal ? "opacity-40 pointer-events-none blur-sm" : "opacity-100"}>
          <div className="bg-white rounded-lg shadow p-6 mt-0">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-3 py-4 text-left font-bold not-italic">Product</th>
                  <th className="px-3 py-4 text-left font-bold not-italic">SKU</th>
                  <th className="px-3 py-4 text-left font-bold not-italic">Current Stock</th>
                  <th className="px-3 py-4 text-left font-bold not-italic">Minimum Level</th>
                  <th className="px-3 py-4 text-left font-bold not-italic">Reorder Qty</th>
                  <th className="px-3 py-4 text-left font-bold not-italic">Status</th>
                  <th className="px-3 py-4 text-left font-bold not-italic">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                    <td className="px-3 py-4 font-normal not-italic text-purple-900">{item.product}</td>
                    <td className="px-3 py-4 font-normal not-italic text-purple-600 font-mono">{item.sku}</td>
                    <td className="px-3 py-4 font-normal not-italic text-purple-900">{item.current}</td>
                    <td className="px-3 py-4 font-normal not-italic text-purple-900">{item.minimum}</td>
                    <td className="px-3 py-4 font-normal not-italic text-purple-900">{item.reorder}</td>
                    <td className="px-3 py-4 font-normal not-italic">
                      <span className={`px-3 py-1 rounded-full text-sm font-normal not-italic ${item.current < item.minimum ? 'bg-pink-100 text-pink-700' : 'bg-green-100 text-green-700'}`}>{item.current < item.minimum ? 'Low Stock' : 'OK'}</span>
                    </td>
                    <td className="px-3 py-4 font-normal not-italic">
                      <button className="text-red-600 font-bold hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Inventory;
