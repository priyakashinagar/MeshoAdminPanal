import React, { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Seller', store: 'John Fashion', phone: '9876543210', address: 'Delhi, India', kyc: 'Completed' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Seller', store: 'Jane Boutique', phone: '9123456780', address: 'Mumbai, India', kyc: 'Pending' },
  { id: 3, name: 'Amit Kumar', email: 'amit@example.com', role: 'Admin' },
];


const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });
  const [profile, setProfile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsers([...users, { id: users.length + 1, ...formData }]);
    setShowForm(false);
    setFormData({ name: '', email: '', role: '' });
  };

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleViewProfile = (user) => {
    setProfile(user);
  };

  const closeProfile = () => setProfile(null);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-purple-900">Users Management</h1>
          <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">Add User</Button>
        </div>
        {showForm && (
          <Card className="p-6 border border-purple-200 shadow-lg bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border rounded" required>
                  <option value="">Select role</option>
                  <option value="Admin">Admin</option>
                  <option value="Seller">Seller</option>
                  <option value="Manager">Manager</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 hover:bg-gray-300">Cancel</Button>
                <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">Add User</Button>
              </div>
            </form>
          </Card>
        )}
        <Card className="border border-purple-200 shadow-lg overflow-hidden bg-white">
          <div className="w-full overflow-x-auto">
            <table className="min-w-[600px] w-full">
              <thead style={{ background: '#9E1CF0' }} className="text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">Role</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id} className={`hover:bg-purple-50 transition-colors${idx === users.length - 1 ? '' : ' border-b border-purple-200'}`}> 
                    <td className="px-4 py-2 font-medium text-slate-900">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2">
                      {user.role === 'Seller' ? (
                        <span className={`px-3 py-1 rounded-full text-sm font-normal ${user.kyc === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{user.kyc || 'Pending'}</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm font-normal bg-purple-100 text-purple-700">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      {user.role === 'Seller' && (
                        <Button size="sm" onClick={() => handleViewProfile(user)} className="bg-purple-100 text-purple-700 px-4 py-1 font-semibold">View Profile</Button>
                      )}
                      <Button size="sm" onClick={() => handleDelete(user.id)} className="text-red-600 px-4 py-1 font-semibold">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Seller Profile Modal */}
        {profile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
              <button onClick={closeProfile} className="absolute top-3 right-3 text-xl text-purple-600 font-bold">&times;</button>
              <h2 className="text-2xl font-bold mb-4 text-purple-700">Seller Profile</h2>
              <div className="space-y-3">
                <div><span className="font-semibold">Name:</span> {profile.name}</div>
                <div><span className="font-semibold">Email:</span> {profile.email}</div>
                <div><span className="font-semibold">Store:</span> {profile.store || '-'}</div>
                <div><span className="font-semibold">Phone:</span> {profile.phone || '-'}</div>
                <div><span className="font-semibold">Address:</span> {profile.address || '-'}</div>
                <div><span className="font-semibold">KYC Status:</span> <span className={`px-3 py-1 rounded-full text-sm font-normal ${profile.kyc === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{profile.kyc || 'Pending'}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Users;
