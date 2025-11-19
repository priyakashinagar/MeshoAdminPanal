import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import SellerRoutes from '../sellerAdminPanal/SellerRoutes';
import Products from '../pages/Products';
import Earnings from '../sellerAdminPanal/Earnings';
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

const AppRoutes = () => (
  <Router>
    <Routes>
                              <Route path="/operations/payment" element={
                                <ProtectedRoute>
                                  <Payments />
                                </ProtectedRoute>
                              } />
                              <Route path="/settings/payment" element={
                                <ProtectedRoute>
                                  <Payments />
                                </ProtectedRoute>
                              } />
                        <Route path="/settings" element={
                          <ProtectedRoute>
                            <StoreSettings />
                          </ProtectedRoute>
                        } />
                  <Route path="/store-settings" element={
                    <ProtectedRoute>
                      <StoreSettings />
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
      <Route path="/login" element={<Login />} />
      {/* Seller routes only for /seller path */}
      <Route path="/seller/*" element={
        <ProtectedRoute>
          <SellerRoutes />
        </ProtectedRoute>
      } />
      {/* Admin and general routes for / */}
      <Route path="/*" element={
        <ProtectedRoute>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/sales" element={<SalesReports />} />
            <Route path="/users" element={<Users />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/payment" element={<Payments />} />
            <Route path="/earnings" element={<AdminLayout><Earnings /></AdminLayout>} />
            <Route path="/payouts" element={<AdminLayout><Payouts /></AdminLayout>} />
            <Route path="/settings" element={<StoreSettings />} />
            <Route path="/settings/payment" element={<Payments />} />
            <Route path="/store-settings" element={<StoreSettings />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
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
      <Route path="/reviews" element={
        <ProtectedRoute>
          <Reviews />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default AppRoutes;
