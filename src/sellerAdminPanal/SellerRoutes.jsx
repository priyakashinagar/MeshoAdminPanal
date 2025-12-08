import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SellerLayout from '../components/layout/SellerLayout';

const SellerDashboard = React.lazy(() => import('./SellerDashboard'));
const MyProducts = React.lazy(() => import('./MyProducts'));
const AddProduct = React.lazy(() => import('./AddProduct'));
const AllOrders = React.lazy(() => import('./AllOrders'));
const Returns = React.lazy(() => import('./Returns'));
const Pricing = React.lazy(() => import('./Pricing'));
const AutoPricing = React.lazy(() => import('./AutoPricing'));
const ReduceRTOs = React.lazy(() => import('./ReduceRTOs'));
const Claims = React.lazy(() => import('./Claims'));
const Inventory = React.lazy(() => import('./Inventory'));
const CatalogUploads = React.lazy(() => import('./CatalogUploads'));
const ImageBulkUpload = React.lazy(() => import('./ImageBulkUpload'));
const Quality = React.lazy(() => import('./Quality'));
const Payments = React.lazy(() => import('./Payments'));
const Warehouse = React.lazy(() => import('./Warehouse'));
const InfluencerMarketing = React.lazy(() => import('./InfluencerMarketing'));
const Promotions = React.lazy(() => import('./Promotions'));
const InstantCash = React.lazy(() => import('./InstantCash'));
const BusinessDashboard = React.lazy(() => import('./BusinessDashboard'));
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
        <Route path="orders" element={<AllOrders />} />
        <Route path="returns" element={<Returns />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="auto-pricing" element={<AutoPricing />} />
        <Route path="reduce-rtos" element={<ReduceRTOs />} />
        <Route path="claims" element={<Claims />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="products" element={<MyProducts />} />
        <Route path="products/new" element={<AddProduct />} />
        <Route path="catalog-uploads" element={<CatalogUploads />} />
        <Route path="image-bulk-upload" element={<ImageBulkUpload />} />
        <Route path="quality" element={<Quality />} />
        <Route path="payments" element={<Payments />} />
        <Route path="warehouse" element={<Warehouse />} />
        <Route path="influencer-marketing" element={<InfluencerMarketing />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="instant-cash" element={<InstantCash />} />
        <Route path="business-dashboard" element={<BusinessDashboard />} />
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
