/**
 * @fileoverview Category service for admin/seller panel
 * @module services/categoryService
 */

import api from './api';

const categoryService = {
  // Parent categories (level 0)
  addParentCategory: async (data) => {
    const config = data instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await api.post('/categories/category/add', data, config);
    return response.data;
  },

  getAllParentCategories: async () => {
    const response = await api.get('/categories/category/all');
    return response.data;
  },

  // Subcategories (level 1)
  addSubcategory: async (data) => {
    const config = data instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await api.post('/categories/subcategory/add', data, config);
    return response.data;
  },

  getSubcategories: async (parentId) => {
    const response = await api.get(`/categories/subcategory/${parentId}`);
    return response.data;
  },

  // Child subcategories (level 2)
  addChildCategory: async (data) => {
    const config = data instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await api.post('/categories/child-category/add', data, config);
    return response.data;
  },

  getChildCategories: async (subCategoryId) => {
    const response = await api.get(`/categories/child-category/${subCategoryId}`);
    return response.data;
  },

  // Legacy/generic operations
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getCategoryById: async (categoryId) => {
    const response = await api.get(`/categories/${categoryId}`);
    return response.data;
  },

  createCategory: async (categoryData) => {
    const config = categoryData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await api.post('/categories', categoryData, config);
    return response.data;
  },

  updateCategory: async (categoryId, categoryData) => {
    const config = categoryData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await api.put(`/categories/${categoryId}`, categoryData, config);
    return response.data;
  },

  deleteCategory: async (categoryId) => {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  },
};

export default categoryService;
