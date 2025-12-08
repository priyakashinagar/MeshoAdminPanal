import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../components/layout/AdminLayout';
import Card from '../components/common/Card';
import { AlertTriangle, Package, TrendingUp } from 'lucide-react';
import { fetchProducts, updateProduct } from '../redux/slices/productSlice';

const Inventory = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product || { products: [], loading: false });
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockForm, setStockForm] = useState({ quantity: '', minimum: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleStockUpdate = (product) => {
    setSelectedProduct(product);
    setStockForm({
      quantity: product.stock?.quantity || product.stock || 0,
      minimum: product.minimumStock || 10
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    setStockForm({ ...stockForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const stockQuantity = Number(stockForm.quantity) || 0;
      const updatedData = {
        stock: {
          quantity: stockQuantity,
          status: stockQuantity > 0 ? 'in_stock' : 'out_of_stock',
          lowStockThreshold: Number(stockForm.minimum) || 10
        }
      };
      
      await dispatch(updateProduct({ id: selectedProduct._id, productData: updatedData })).unwrap();
      setSuccessMessage('Stock updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
      dispatch(fetchProducts());
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update stock');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const filteredInventory = products.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getLowStockItems = () => products.filter(item => {
    const stock = item.stock?.quantity || item.stock || 0;
    const minimum = item.minimumStock || 10;
    return stock < minimum;
  });
  
  const getTotalValue = () => products.reduce((sum, item) => {
    const stock = item.stock?.quantity || item.stock || 0;
    return sum + stock;
  }, 0);

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
            onClick={() => window.location.href = '/products'}
          >
            Manage Products
          </button>
        </div>

        {/* Modal for Update Stock */}
        {showModal && selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pl-[280px] pr-8 py-8">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-purple-200 relative px-10 py-8">
              <h2 className="text-2xl font-bold text-purple-900 mb-6">Update Stock - {selectedProduct.name}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Current Stock</label>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Current Stock"
                    value={stockForm.quantity}
                    onChange={handleFormChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Minimum Stock Level</label>
                  <input
                    type="number"
                    name="minimum"
                    placeholder="Minimum Stock"
                    value={stockForm.minimum}
                    onChange={handleFormChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button type="button" className="bg-gray-200 hover:bg-gray-300 px-7 py-2 font-semibold rounded-xl" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-7 py-2 font-semibold rounded-xl shadow">Update Stock</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dashboard Cards - Full width on laptop screens */}
        <div className="w-full mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <Card className="p-6 border-0 shadow-lg bg-white dark:bg-slate-900 w-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-300 mb-2">Total Items</p>
                  <p className="text-3xl font-normal text-purple-900 dark:text-purple-50">{getTotalValue()}</p>
                </div>
                <Package className="text-pink-600 dark:text-pink-400" size={40} />
              </div>
            </Card>
            <Card className="p-6 border-0 shadow-lg bg-white dark:bg-slate-900 w-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-300 mb-2">Low Stock Items</p>
                  <p className="text-3xl font-normal text-pink-600 dark:text-pink-400">{getLowStockItems().length}</p>
                </div>
                <AlertTriangle className="text-pink-600 dark:text-pink-400" size={40} />
              </div>
            </Card>
            <Card className="p-6 border-0 shadow-lg bg-white dark:bg-slate-900 w-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-300 mb-2">Total Products</p>
                  <p className="text-3xl font-normal text-purple-900 dark:text-purple-50">{products.length}</p>
                </div>
                <TrendingUp className="text-pink-600 dark:text-pink-400" size={40} />
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
                  <th className="px-3 py-4 text-left font-bold not-italic">Product</th>
                  <th className="px-3 py-4 text-left font-bold not-italic">SKU</th>
                  <th className="px-3 py-4 text-left font-bold not-italic">Current Stock</th>
                  <th className="px-3 py-4 text-left font-bold not-italic">Minimum Level</th>
                  <th className="px-3 py-4 text-left font-bold not-italic">Price</th>
                  <th className="px-3 py-4 text-left font-bold not-italic">Status</th>
                  <th className="px-3 py-4 text-left font-bold not-italic">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => {
                  const stock = item.stock?.quantity || item.stock || 0;
                  const minimum = item.minimumStock || 10;
                  const isLowStock = stock < minimum;
                  
                  return (
                    <tr key={item._id || item.id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                      <td className="px-3 py-4 font-normal not-italic text-purple-900">{item.name}</td>
                      <td className="px-3 py-4 font-normal not-italic text-purple-600 font-mono">{item.sku || 'N/A'}</td>
                      <td className="px-3 py-4 font-normal not-italic text-purple-900">{stock}</td>
                      <td className="px-3 py-4 font-normal not-italic text-purple-900">{minimum}</td>
                      <td className="px-3 py-4 font-normal not-italic text-purple-900">₹{item.price}</td>
                      <td className="px-3 py-4 font-normal not-italic">
                        <span className={`px-3 py-1 rounded-full text-sm font-normal not-italic whitespace-nowrap ${isLowStock ? 'bg-pink-100 text-pink-700' : 'bg-green-100 text-green-700'}`}>
                          {isLowStock ? 'Low Stock' : 'OK'}
                        </span>
                      </td>
                      <td className="px-3 py-4 font-normal not-italic">
                        <button 
                          className="text-purple-600 font-bold hover:underline"
                          onClick={() => handleStockUpdate(item)}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
