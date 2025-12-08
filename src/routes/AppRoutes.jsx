import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import AdminLogin from '../pages/AdminLogin';
import SellerOnboarding from '../pages/SellerOnboarding';
import Dashboard from '../pages/Dashboard';
import SellerRoutes from '../sellerAdminPanal/SellerRoutes';
import Products from '../pages/Products';
import AdminEarnings from '../pages/Earnings';
import AdminLayout from '../components/layout/AdminLayout';
import Payouts from '../sellerAdminPanal/Payouts';
import Orders from '../pages/Orders';
import Users from '../pages/Users';
import Categories from '../pages/Categories';
import Inventory from '../pages/Inventory';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import SalesReports from '../pages/SalesReports';
import Shipping from '../pages/Shipping';
import Payments from '../pages/Payments';
import StoreSettings from '../pages/StoreSettings';
import Reviews from '../pages/Reviews';
import Customers from '../pages/Customers';

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      
      {/* Seller registration - requires OTP verification first */}
      <Route path="/seller-register" element={
        <ProtectedRoute>
          <SellerOnboarding />
        </ProtectedRoute>
      } />
      <Route path="/become-seller" element={
        <ProtectedRoute>
          <SellerOnboarding />
        </ProtectedRoute>
      } />
      
      {/* Seller routes */}
      <Route path="/seller/*" element={
        <ProtectedRoute>
          <SellerRoutes />
        </ProtectedRoute>
      } />
      
      {/* Admin routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/products" element={
        <ProtectedRoute>
          <Products />
        </ProtectedRoute>
      } />
      <Route path="/categories" element={
        <ProtectedRoute>
          <Categories />
        </ProtectedRoute>
      } />
      <Route path="/inventory" element={
        <ProtectedRoute>
          <Inventory />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      } />
      <Route path="/sales" element={
        <ProtectedRoute>
          <SalesReports />
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      } />
      <Route path="/customers" element={
        <ProtectedRoute>
          <Customers />
        </ProtectedRoute>
      } />
      <Route path="/reviews" element={
        <ProtectedRoute>
          <Reviews />
        </ProtectedRoute>
      } />
      <Route path="/shipping" element={
        <ProtectedRoute>
          <Shipping />
        </ProtectedRoute>
      } />
      <Route path="/payments" element={
        <ProtectedRoute>
          <Payments />
        </ProtectedRoute>
      } />
      <Route path="/payment" element={
        <ProtectedRoute>
          <Payments />
        </ProtectedRoute>
      } />
      <Route path="/earnings" element={
        <ProtectedRoute>
          <AdminEarnings />
        </ProtectedRoute>
      } />
      <Route path="/payouts" element={
        <ProtectedRoute>
          <AdminLayout><Payouts /></AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <StoreSettings />
        </ProtectedRoute>
      } />
      <Route path="/settings/payment" element={
        <ProtectedRoute>
          <Payments />
        </ProtectedRoute>
      } />
      <Route path="/store-settings" element={
        <ProtectedRoute>
          <StoreSettings />
        </ProtectedRoute>
      } />
      <Route path="/operations/payment" element={
        <ProtectedRoute>
          <Payments />
        </ProtectedRoute>
      } />
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default AppRoutes;
