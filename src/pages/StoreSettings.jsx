import React, { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Card from '../components/common/Card';

const initialSettings = [
  { id: 1, name: 'Store Name', value: 'My Online Shop' },
  { id: 2, name: 'Contact Email', value: 'support@myshop.com' },
  { id: 3, name: 'Currency', value: 'INR' },
  { id: 4, name: 'Timezone', value: 'Asia/Kolkata' },
];

const StoreSettings = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', value: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.value) {
      setSettings([
        ...settings,
        {
          id: settings.length + 1,
          name: form.name,
          value: form.value,
        },
      ]);
      setForm({ name: '', value: '' });
      setShowModal(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 px-2 sm:px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-900 dark:text-purple-50">Store Settings</h1>
          <p className="text-purple-600 dark:text-purple-300 mt-2 text-base md:text-lg">Total Settings: {settings.length}</p>
        </div>
        <div className="flex items-center mb-2">
          <button
            type="button"
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded shadow text-base md:text-lg"
            onClick={() => setShowModal(true)}
          >
            Add Setting
          </button>
        </div>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(8px)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-purple-200 relative px-4 sm:px-8 py-8 mt-4 mb-4">
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 pb-4">
                <div>
                  <label className="block text-base md:text-lg font-bold mb-1 text-purple-700">Setting Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Setting Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50 text-base md:text-lg"
                  />
                </div>
                <div>
                  <label className="block text-base md:text-lg font-bold mb-1 text-purple-700">Value</label>
                  <input
                    type="text"
                    name="value"
                    placeholder="Value"
                    value={form.value}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50 text-base md:text-lg"
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-4">
                  <button type="button" className="bg-gray-200 hover:bg-gray-300 px-5 py-2 font-semibold rounded-xl text-base md:text-lg" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2 font-semibold rounded-xl shadow text-base md:text-lg">Add Setting</button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="bg-white rounded-lg shadow p-2 sm:p-4 md:p-6 mt-0 w-full overflow-x-auto">
          <table className="min-w-[340px] w-full text-base md:text-lg">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left">Setting Name</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((item) => (
                <tr key={item.id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-purple-900">{item.name}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-purple-900">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StoreSettings;
