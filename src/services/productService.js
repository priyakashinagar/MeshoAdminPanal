/**
 * @fileoverview Product service for product-related operations
 * @module services/productService
 */

import api from './api';

/**
 * Product API endpoints
 */
const productService = {
  /**
   * Get all products with filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.category - Category filter
   * @param {number} params.minPrice - Minimum price
   * @param {number} params.maxPrice - Maximum price
   * @param {string} params.search - Search query
   * @param {string} params.sort - Sort option
   * @returns {Promise<Object>} Products list
   */
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  /**
   * Get product by ID
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Product details
   */
  getProductById: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  /**
   * Create new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product
   */
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  /**
   * Update product
   * @param {string} productId - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise<Object>} Updated product
   */
  updateProduct: async (productId, productData) => {
    const response = await api.put(`/products/${productId}`, productData);
    return response.data;
  },

  /**
   * Delete product
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Deletion result
   */
  deleteProduct: async (productId) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },

  /**
   * Get products by seller
   * @param {string} sellerId - Seller ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Products list
   */
  getProductsBySeller: async (sellerId, params = {}) => {
    const response = await api.get(`/products/seller/${sellerId}`, { params });
    return response.data;
  },

  /**
   * Get featured products
   * @param {number} limit - Number of products
   * @returns {Promise<Object>} Featured products
   */
  getFeaturedProducts: async (limit = 10) => {
    const response = await api.get('/products/featured', { params: { limit } });
    return response.data;
  }
};

export default productService;
