import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';

const initialState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  success: false,
  message: '',
};

// Create product thunk
export const createProduct = createAsyncThunk(
  'product/create',
  async (productData, { rejectWithValue }) => {
    try {
      console.log('🚀 Creating product with data:', productData);
      const response = await productService.createProduct(productData);
      console.log('✅ Product created successfully:', response);
      return response; // productService already returns response.data
    } catch (error) {
      console.error('❌ Product creation failed:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create product';
      return rejectWithValue(errorMessage);
    }
  }
);

// Get all products thunk
export const fetchProducts = createAsyncThunk(
  'product/getAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('🔍 Fetching products with params:', params);
      const response = await productService.getProducts(params);
      console.log('📦 API Response:', response);
      console.log('📦 Products array:', response?.data?.products || response?.products);
      return response; // productService already returns response.data
    } catch (error) {
      console.error('❌ Failed to fetch products:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch products';
      return rejectWithValue(errorMessage);
    }
  }
);

// Alias for backward compatibility
export const getAllProducts = fetchProducts;

// Get products by seller thunk
export const getProductsBySeller = createAsyncThunk(
  'product/getBySeller',
  async (sellerId, { rejectWithValue }) => {
    try {
      const response = await productService.getProductsBySeller(sellerId);
      return response; // productService already returns response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch seller products'
      );
    }
  }
);

// Get product by ID thunk
export const getProductById = createAsyncThunk(
  'product/getById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productService.getProduct(productId);
      return response; // productService already returns response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch product';
      return rejectWithValue(errorMessage);
    }
  }
);

// Update product thunk
export const updateProduct = createAsyncThunk(
  'product/update',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await productService.updateProduct(productId, productData);
      return response; // productService already returns response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update product';
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete product thunk
export const deleteProduct = createAsyncThunk(
  'product/delete',
  async (productId, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(productId);
      return productId;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete product';
      return rejectWithValue(errorMessage);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = '';
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Product created successfully';
        // action.payload is already the product data
        const productData = action.payload.data || action.payload;
        state.products.unshift(productData);
        state.currentProduct = productData;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Get all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Backend returns: { success: true, count: X, total: Y, page: Z, pages: N, data: [...products] }
        console.log('✅ Redux fulfilled - action.payload:', action.payload);
        state.products = action.payload?.data || [];
        console.log('✅ Products set in state:', state.products);
        console.log('✅ Products count:', state.products.length);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get products by seller
      .addCase(getProductsBySeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductsBySeller.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProductsBySeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get product by ID
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Product updated successfully';
        // action.payload is already the product data
        const productData = action.payload.data || action.payload;
        const index = state.products.findIndex(
          (p) => p._id === productData._id
        );
        if (index !== -1) {
          state.products[index] = productData;
        }
        state.currentProduct = productData;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Product deleted successfully';
        state.products = state.products.filter(
          (p) => p._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
