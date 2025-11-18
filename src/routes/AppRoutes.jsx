import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
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
