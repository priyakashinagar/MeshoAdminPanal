import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SellerLayout from '../components/layout/SellerLayout';

const SellerDashboard = React.lazy(() => import('./SellerDashboard'));
const MyProducts = React.lazy(() => import('./MyProducts'));
const AddProduct = React.lazy(() => import('./AddProduct'));
const AllOrders = React.lazy(() => import('./AllOrders'));
const Returns = React.lazy(() => import('./Returns'));
const Earnings = React.lazy(() => import('./Earnings'));
const Payouts = React.lazy(() => import('./Payouts'));
const MyProfile = React.lazy(() => import('./MyProfile'));
const KYC = React.lazy(() => import('./KYC'));
const Support = React.lazy(() => import('./Support'));

const SellerRoutes = () => (
  <SellerLayout>
    <Routes>
      <Route path="/seller" element={<SellerDashboard />} />
      <Route path="/seller/products" element={<MyProducts />} />
      <Route path="/seller/products/new" element={<AddProduct />} />
      <Route path="/seller/orders" element={<AllOrders />} />
      <Route path="/seller/returns" element={<Returns />} />
      <Route path="/seller/earnings" element={<Earnings />} />
      <Route path="/seller/payouts" element={<Payouts />} />
      <Route path="/seller/profile" element={<MyProfile />} />
      <Route path="/seller/kyc" element={<KYC />} />
      <Route path="/seller/support" element={<Support />} />
    </Routes>
  </SellerLayout>
);

export default SellerRoutes;
