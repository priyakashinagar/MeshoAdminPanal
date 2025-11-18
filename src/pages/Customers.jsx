import React, { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Mail, Phone, MapPin, Trash2, Search } from 'lucide-react';

const initialCustomers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1-555-0101', location: 'New York, USA', joinDate: '2024-01-15', orders: 5 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1-555-0102', location: 'Los Angeles, USA', joinDate: '2024-02-20', orders: 8 },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1-555-0103', location: 'Chicago, USA', joinDate: '2024-03-10', orders: 3 },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '+1-555-0104', location: 'Houston, USA', joinDate: '2024-04-05', orders: 12 },
  { id: 5, name: 'Robert Brown', email: 'robert@example.com', phone: '+1-555-0105', location: 'Phoenix, USA', joinDate: '2024-05-12', orders: 7 },
];

const Customers = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '', joinDate: '', orders: '' });
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.phone && form.location && form.joinDate && form.orders) {
      if (editId !== null) {
        setCustomers(customers.map(c => c.id === editId ? {
          ...c,
          name: form.name,
          email: form.email,
          phone: form.phone,
          location: form.location,
          joinDate: form.joinDate,
          orders: Number(form.orders),
        } : c));
      } else {
        setCustomers([
          ...customers,
          {
            id: customers.length + 1,
            name: form.name,
            email: form.email,
            phone: form.phone,
            location: form.location,
            joinDate: form.joinDate,
            orders: Number(form.orders),
          },
        ]);
      }
      setForm({ name: '', email: '', phone: '', location: '', joinDate: '', orders: '' });
      setShowModal(false);
      setEditId(null);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (customer) => {
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      location: customer.location,
      joinDate: customer.joinDate,
      orders: customer.orders,
    });
    setEditId(customer.id);
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-50">Customers Management</h1>
          <p className="text-purple-600 dark:text-purple-300 mt-2">Total Customers: {customers.length}</p>
        </div>

        {/* Search Bar and Add Customer Button */}
        <div className="flex items-center mb-2">
          <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 rounded-full px-5 py-2 shadow focus-within:ring-2 focus-within:ring-pink-400 w-96">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600 dark:text-purple-300" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-transparent text-purple-900 dark:text-purple-50 outline-none w-full text-lg placeholder-purple-400"
            />
          </div>
          <button
            type="button"
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2 rounded-xl shadow ml-4 font-semibold text-base"
            onClick={() => setShowModal(true)}
          >
            Add Customer
          </button>
        </div>

        {/* Modal for Add Customer */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(8px)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-purple-200 relative px-10 py-8 mt-4 mb-4">
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 pb-4">
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Customer Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Join Date</label>
                  <input
                    type="date"
                    name="joinDate"
                    placeholder="Join Date"
                    value={form.joinDate}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Orders</label>
                  <input
                    type="number"
                    name="orders"
                    placeholder="Orders"
                    value={form.orders}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <button type="button" className="bg-gray-200 hover:bg-gray-300 px-7 py-2 font-semibold rounded-xl" onClick={() => { setShowModal(false); setEditId(null); setForm({ name: '', email: '', phone: '', location: '', joinDate: '', orders: '' }); }}>Cancel</button>
                  <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-7 py-2 font-semibold rounded-xl shadow">{editId ? 'Update Customer' : 'Add Customer'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="p-6 border-0 shadow-lg hover:shadow-xl transition-all bg-white dark:bg-slate-900">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-purple-900 dark:text-purple-50">{customer.name}</h3>
                <div className="flex gap-3">
                  <Button onClick={() => handleEdit(customer)} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg font-semibold hover:bg-purple-200" style={{ color: '#A259FF' }}>
                    Edit
                  </Button>
                  <Button onClick={() => setCustomers(customers.filter(c => c.id !== customer.id))} className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-2 py-1 rounded-lg">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-300">
                  <Mail size={16} className="text-pink-600 dark:text-pink-400" />
                  <a href={`mailto:${customer.email}`} className="hover:text-pink-600 dark:hover:text-pink-400">{customer.email}</a>
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-300">
                  <Phone size={16} className="text-pink-600 dark:text-pink-400" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-300">
                  <MapPin size={16} className="text-pink-600 dark:text-pink-400" />
                  <span>{customer.location}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800 flex justify-between">
                <div>
                  <p className="text-xs text-purple-600 dark:text-purple-300">Orders</p>
                  <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{customer.orders}</p>
                </div>
                <div>
                  <p className="text-xs text-purple-600 dark:text-purple-300">Joined</p>
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-50">{customer.joinDate}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Customers;
