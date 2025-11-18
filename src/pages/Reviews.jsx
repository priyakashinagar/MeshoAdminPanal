import React, { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Card from '../components/common/Card';
import { Star, User, MessageCircle, Trash2, Search } from 'lucide-react';

const initialReviews = [
  { id: 1, user: 'John Doe', rating: 5, comment: 'Great product!', date: '2025-11-01' },
  { id: 2, user: 'Jane Smith', rating: 4, comment: 'Very useful.', date: '2025-11-02' },
  { id: 3, user: 'Mike Johnson', rating: 3, comment: 'Average experience.', date: '2025-11-03' },
  { id: 4, user: 'Sarah Williams', rating: 5, comment: 'Highly recommend!', date: '2025-11-04' },
  { id: 5, user: 'Robert Brown', rating: 2, comment: 'Not satisfied.', date: '2025-11-05' },
];

const Reviews = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ user: '', rating: '', comment: '', date: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.user && form.rating && form.comment && form.date) {
      setReviews([
        ...reviews,
        {
          id: reviews.length + 1,
          user: form.user,
          rating: Number(form.rating),
          comment: form.comment,
          date: form.date,
        },
      ]);
      setForm({ user: '', rating: '', comment: '', date: '' });
      setShowModal(false);
    }
  };

  const filteredReviews = reviews.filter(r =>
    r.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-50">Reviews & Ratings</h1>
          <p className="text-purple-600 dark:text-purple-300 mt-2">Total Reviews: {reviews.length}</p>
        </div>

        {/* Search Bar and Add Review Button */}
        <div className="flex items-center mb-2">
          <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 rounded-full px-5 py-2 shadow focus-within:ring-2 focus-within:ring-pink-400 w-96">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600 dark:text-purple-300" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <input
              type="text"
              placeholder="Search reviews by user or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-transparent text-purple-900 dark:text-purple-50 outline-none w-full text-lg placeholder-purple-400"
            />
          </div>
          <button
            type="button"
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2 rounded-xl shadow ml-4 font-semibold text-base not-italic font-normal"
            style={{fontStyle:'normal'}}
            onClick={() => setShowModal(true)}
          >
            Add Review
          </button>
        </div>

        {/* Modal for Add Review */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(8px)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-purple-200 relative px-10 py-8 mt-4 mb-4">
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 pb-4">
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">User</label>
                  <input
                    type="text"
                    name="user"
                    placeholder="User Name"
                    value={form.user}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                  <div className="text-xs text-purple-400 mt-1">e.g. John Doe</div>
                </div>
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Rating</label>
                  <input
                    type="number"
                    name="rating"
                    min="1"
                    max="5"
                    placeholder="Rating (1-5)"
                    value={form.rating}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                  <div className="text-xs text-purple-400 mt-1">e.g. 5</div>
                </div>
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Comment</label>
                  <input
                    type="text"
                    name="comment"
                    placeholder="Comment"
                    value={form.comment}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                  <div className="text-xs text-purple-400 mt-1">e.g. Great product!</div>
                </div>
                <div>
                  <label className="block text-lg font-bold mb-1 text-purple-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    placeholder="Date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-2 border border-purple-200 rounded-xl shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all outline-none bg-purple-50"
                  />
                  <div className="text-xs text-purple-400 mt-1">e.g. 2025-11-01</div>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <button type="button" className="bg-gray-200 hover:bg-gray-300 px-7 py-2 font-semibold rounded-xl" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-7 py-2 font-semibold rounded-xl shadow">Add Review</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mt-0">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">User</th>
                <th className="px-6 py-4 text-left">Rating</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr key={review.id} className="border-b border-purple-200 hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-purple-900">
                    <div className="flex items-center gap-2"><User size={16} />{review.user}</div>
                    {/* Sample text removed */}
                  </td>
                  <td className="px-6 py-4 text-yellow-500 font-bold">
                    <div className="flex items-center gap-1">{Array(review.rating).fill(0).map((_, i) => <Star key={i} size={16} />)}</div>
                    {/* Sample text removed */}
                  </td>
                  <td className="px-6 py-4 text-purple-900">
                    {review.date}
                    {/* Sample text removed */}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-red-600 font-bold not-italic hover:underline" style={{fontStyle:'normal'}} onClick={() => setReviews(reviews.filter(r => r.id !== review.id))}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reviews;
