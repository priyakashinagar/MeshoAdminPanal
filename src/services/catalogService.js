import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Bulk Catalog Upload
export const bulkCatalogUpload = async (file, sellerId) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sellerId', sellerId);

    const response = await axios.post(`${API_URL}/api/catalog/bulk-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Single Product Upload
export const singleProductUpload = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/api/catalog/single-upload`, productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Upload Stats
export const getCatalogStats = async (sellerId) => {
  try {
    const response = await axios.get(`${API_URL}/api/catalog/stats/${sellerId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get All Uploaded Catalogs
export const getAllCatalogs = async (sellerId) => {
  try {
    const response = await axios.get(`${API_URL}/api/catalog/${sellerId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete Catalog Item
export const deleteCatalogItem = async (itemId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/catalog/item/${itemId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
