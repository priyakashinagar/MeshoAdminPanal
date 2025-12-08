import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

// Admin-only routes that require admin role
const ADMIN_ONLY_ROUTES = [
  '/',
  '/products',
  '/categories',
  '/inventory',
  '/orders',
  '/sales',
  '/users',
  '/reviews',
  '/shipping',
  '/payments',
  '/payment',
  '/settings',
  '/store-settings'
];

// Seller routes
const SELLER_ROUTES = ['/seller', '/seller-register', '/become-seller'];

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();
  
  console.log('🛡️ ProtectedRoute Check:', { isAuthenticated, path: location.pathname, userRole: user?.role });
  
  // Check multiple token storage keys
  const token = localStorage.getItem('authToken') || 
                localStorage.getItem('token') || 
                localStorage.getItem('seller_token');
  
  // Clean and validate token
  let validToken = null;
  if (token) {
    const cleanToken = token.replace(/^["']|["']$/g, '').trim();
    // Check if token has JWT format (header.payload.signature)
    if (cleanToken.split('.').length === 3) {
      validToken = cleanToken;
    }
  }
  
  // If no valid token and not authenticated, redirect to login
  if (!isAuthenticated && !validToken) {
    console.warn('⚠️ No valid authentication found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Get user from localStorage if not in redux state
  let currentUser = user;
  if (!currentUser) {
    try {
      const storedUser = localStorage.getItem('user');
      currentUser = storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      currentUser = null;
    }
  }

  // Check role-based access
  const currentPath = location.pathname;
  
  // Check if trying to access admin routes
  const isAdminRoute = ADMIN_ONLY_ROUTES.some(route => 
    currentPath === route || currentPath.startsWith(route + '/')
  );
  
  // Check if trying to access seller routes
  const isSellerRoute = SELLER_ROUTES.some(route => 
    currentPath === route || currentPath.startsWith(route)
  );

  // ADMIN ROUTE PROTECTION - Only admin can access admin routes
  if (isAdminRoute && currentUser?.role !== 'admin') {
    console.warn('🚫 Non-admin trying to access admin route, redirecting');
    // Redirect seller to seller dashboard, others to login
    if (currentUser?.role === 'seller') {
      if (currentUser?.sellerId) {
        return <Navigate to="/seller" replace />;
      } else {
        return <Navigate to="/seller-register" replace />;
      }
    }
    return <Navigate to="/login" replace />;
  }

  // SELLER ROUTE PROTECTION - Only sellers can access seller routes
  if (isSellerRoute && currentUser?.role === 'admin') {
    console.warn('🚫 Admin trying to access seller route, redirecting to admin dashboard');
    return <Navigate to="/" replace />;
  }
  
  // Check if seller needs to complete onboarding
  if (currentUser?.role === 'seller' && !currentUser?.sellerId && 
      currentPath.startsWith('/seller') && 
      !currentPath.includes('/seller-register')) {
    console.warn('⚠️ Seller profile incomplete, redirecting to onboarding');
    return <Navigate to="/seller-register" state={{ from: location }} replace />;
  }
  
  console.log('✅ Authentication and authorization valid');
  return children;
};

export default ProtectedRoute;
