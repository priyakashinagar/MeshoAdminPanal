
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const dummyProducts = [
  {
    id: 1,
    name: 'Kurti',
    price: 1200,
    stock: 45,
    category: 'Women',
    description: 'Stylish kurti for women.',
    image: null,
  },
  {
    id: 2,
    name: 'Saree',
    price: 2000,
    stock: 30,
    category: 'Women',
    description: 'Traditional saree.',
    image: null,
  },
  {
    id: 3,
    name: 'Jeans',
    price: 900,
    stock: 80,
    category: 'Men',
    description: 'Comfortable jeans for men.',
    image: null,
  },
];


export default function MyProducts() {
  const [products, setProducts] = useState(dummyProducts);
  const [search, setSearch] = useState('');
  const [editProduct, setEditProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // Edit logic
  const handleEditClick = (product) => {
    setEditProduct(product);
    setEditForm({ ...product });
  };
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setEditForm({ ...editForm, image: files[0] });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };
  const handleEditSave = () => {
    setProducts(products.map(p => p.id === editProduct.id ? { ...editForm, id: p.id } : p));
    setEditProduct(null);
  };

  // Delete logic
  const handleDeleteClick = (product) => {
    window.alert(`Product "${product.name}" deleted!`);
    setProducts(products.filter(p => p.id !== product.id));
  };

  // Detail logic
  const handleDetailClick = (product) => {
    setDetailProduct(product);
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-2">My Products</h2>
      <p className="text-purple-700 mb-6">Manage your products inventory and details.</p>
      <div className="flex items-center mb-6 gap-4">
        <div className="flex items-center gap-2 bg-purple-100 rounded-full px-5 py-2 shadow focus-within:ring-2 focus-within:ring-pink-400 w-full max-w-xl">
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
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2 rounded-xl shadow font-semibold text-base"
          onClick={() => navigate('/seller/products/new')}
        >
          Add Product
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-2 sm:p-4 md:p-6 border border-purple-100 w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px] max-w-full">
          <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <tr>
              <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">ID</th>
              <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Name</th>
              <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Price</th>
              <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Stock</th>
              <th className="px-2 sm:px-4 py-2 sm:py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                <td className="px-2 sm:px-4 py-2 sm:py-4 font-medium text-purple-900">{product.id}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-4">{product.name}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-4 font-bold text-purple-700">₹{product.price.toLocaleString()}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-4">{product.stock}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-4 flex flex-row items-center justify-between">
                  <button className="text-purple-600 font-bold hover:underline" onClick={() => handleDetailClick(product)}>Detail</button>
                  <button className="font-bold hover:underline text-purple-600 ml-16 mr-4" onClick={() => handleEditClick(product)}>Edit</button>
                  <button className="text-red-600 font-bold hover:underline" onClick={() => handleDeleteClick(product)}>Delete</button>
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
              <div>
                <label className="block text-lg font-bold mb-2 text-purple-700">Price</label>
                <input name="price" type="number" value={editForm.price} onChange={handleEditChange} className="w-full px-4 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50" placeholder="Price" required />
              </div>
              <div>
                <label className="block text-lg font-bold mb-2 text-purple-700">Stock</label>
                <input name="stock" type="number" value={editForm.stock} onChange={handleEditChange} className="w-full px-4 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50" placeholder="Stock" required />
              </div>
              <div>
                <label className="block text-lg font-bold mb-2 text-purple-700">Category</label>
                <input name="category" value={editForm.category} onChange={handleEditChange} className="w-full px-4 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50" placeholder="Category" />
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
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(10px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg border border-purple-200 relative hide-scrollbar" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 className="text-xl font-bold mb-6 text-purple-700">Product Details</h2>
            <div className="flex flex-col gap-4">
              <div><span className="font-semibold">Name:</span> {detailProduct.name}</div>
              <div><span className="font-semibold">Price:</span> ₹{detailProduct.price}</div>
              <div><span className="font-semibold">Stock:</span> {detailProduct.stock}</div>
              <div><span className="font-semibold">Category:</span> {detailProduct.category}</div>
              <div><span className="font-semibold">Description:</span> {detailProduct.description}</div>
              {detailProduct.image && (typeof detailProduct.image === 'object' ? (
                <img src={URL.createObjectURL(detailProduct.image)} alt="Preview" className="h-20 rounded-lg border mt-2 object-cover" />
              ) : (
                <img src={detailProduct.image} alt="Preview" className="h-20 rounded-lg border mt-2 object-cover" />
              ))}
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button className="bg-gray-200 hover:bg-gray-300 px-7 py-2 font-semibold rounded-xl" onClick={() => setDetailProduct(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}