import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { Star, User, Trash2, Loader2, AlertCircle, Package } from 'lucide-react';
import adminService from '../services/adminService';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0, ratingDistribution: {} });
  const [deleting, setDeleting] = useState(null);

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getReviews({ 
        page, 
        limit: 15, 
        search: searchTerm,
        rating: ratingFilter 
      });
      if (response.success) {
        setReviews(response.data.reviews);
        setPagination(response.data.pagination);
        setStats(response.data.stats);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReviews(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, ratingFilter]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      setDeleting(reviewId);
      await adminService.deleteReview(reviewId);
      fetchReviews(pagination.page);
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review');
    } finally {
      setDeleting(null);
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} 
      />
    ));
  };

  if (loading && reviews.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-2 text-purple-600">Loading reviews...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-500 text-lg">{error}</p>
          <button onClick={() => fetchReviews(1)} className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg">
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-50">Reviews & Ratings</h1>
          <p className="text-purple-600 dark:text-purple-300 mt-2">Total Reviews: {pagination.total}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow col-span-2">
            <p className="text-sm text-purple-600 dark:text-purple-300">Average Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-50">
                {stats.averageRating?.toFixed(1) || '0.0'}
              </p>
              <div className="flex">{renderStars(Math.round(stats.averageRating || 0))}</div>
            </div>
          </div>
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-sm font-medium">{rating}</span>
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-xl font-bold text-purple-900 dark:text-purple-50">
                {stats.ratingDistribution?.[rating] || 0}
              </p>
            </div>
          )).slice(0, 4)}
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 rounded-full px-5 py-2 shadow focus-within:ring-2 focus-within:ring-pink-400 w-80">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-purple-600 dark:text-purple-300" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <input
              type="text"
              placeholder="Search by user or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-transparent text-purple-900 dark:text-purple-50 outline-none w-full text-base placeholder-purple-400"
            />
          </div>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-purple-200 bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-50"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          {loading && <Loader2 className="w-5 h-5 animate-spin text-purple-600" />}
        </div>

        {/* Reviews Table */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">User</th>
                <th className="px-6 py-4 text-left">Product</th>
                <th className="px-6 py-4 text-left">Rating</th>
                <th className="px-6 py-4 text-left">Comment</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-purple-600">
                    No reviews found
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review._id} className="border-b border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <User size={16} className="text-purple-600" />
                        </div>
                        <span className="font-medium text-purple-900 dark:text-purple-50">
                          {review.userName || 'Anonymous'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-pink-500" />
                        <span className="text-purple-900 dark:text-purple-50 text-sm">
                          {review.productName || 'Unknown Product'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-purple-700 dark:text-purple-300 text-sm max-w-xs truncate" title={review.review}>
                        {review.review || 'No comment'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-purple-900 dark:text-purple-50 text-sm">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDeleteReview(review._id)}
                        disabled={deleting === review._id}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        {deleting === review._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => fetchReviews(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-purple-700">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => fetchReviews(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Reviews;
