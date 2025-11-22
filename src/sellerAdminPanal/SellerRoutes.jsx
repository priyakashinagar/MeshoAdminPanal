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
const SellersProfile = React.lazy(() => import('./SellersProfile'));
const KYC = React.lazy(() => import('./KYC'));
const Support = React.lazy(() => import('./Support'));

const SellerRoutes = () => (
  <SellerLayout>
    <React.Suspense fallback={<div className="p-8 text-center text-purple-500">Loading...</div>}>
      <Routes>
        <Route index element={<SellerDashboard />} />
        <Route path="products" element={<MyProducts />} />
        <Route path="products/new" element={<AddProduct />} />
        <Route path="orders" element={<AllOrders />} />
        <Route path="returns" element={<Returns />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="payouts" element={<Payouts />} />
        <Route path="profile" element={<SellersProfile />} />
        <Route path="kyc" element={<KYC />} />
        <Route path="support" element={<Support />} />
      </Routes>
    </React.Suspense>
  </SellerLayout>
);

export default SellerRoutes;
