import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Menu, X, LogOut, Moon, Sun, ChevronDown } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import sellerService from '../../services/sellerService';

const navItems = [
  { href: '/seller', label: 'Dashboard', section: 'Manage Business' },
  {
    label: 'Orders',
    section: 'Manage Business',
    submenu: [
      { href: '/seller/orders', label: 'All Orders' },
      { href: '/seller/returns', label: 'Returns' },
    ],
  },
  { 
    label: 'Pricing', 
    section: 'Manage Business',
    submenu: [
      { href: '/seller/pricing', label: 'Manage Pricing' },
      { href: '/seller/auto-pricing', label: 'Auto-Pricing' },
      { href: '/seller/reduce-rtos', label: 'Reduce RTOs & Returns' },
    ],
  },
  { href: '/seller/claims', label: 'Claims', section: 'Manage Business' },
  { href: '/seller/inventory', label: 'Inventory', section: 'Manage Business' },
  {
    label: 'Products',
    section: 'Manage Business',
    submenu: [
      { href: '/seller/products', label: 'My Products' },
      { href: '/seller/products/new', label: 'Add New Product' },
      { href: '/seller/catalog-uploads', label: 'Catalog Uploads' },
      { href: '/seller/image-bulk-upload', label: 'Image Bulk Upload' },
    ],
  },
  { href: '/seller/quality', label: 'Quality', section: 'Manage Business' },
  { href: '/seller/payments', label: 'Payments', section: 'Manage Business' },
  { href: '/seller/warehouse', label: 'Warehouse', section: 'Manage Business' },
  
  { href: '/seller/influencer-marketing', label: 'Influencer Marketing', section: 'Boost Sales' },
  { href: '/seller/promotions', label: 'Promotions', section: 'Boost Sales' },
  { href: '/seller/instant-cash', label: 'Instant Cash', section: 'Boost Sales' },
  
  { href: '/seller/business-dashboard', label: 'Business Dashboard', section: 'Performance' },
  
  {
    label: 'Earnings',
    submenu: [
      { href: '/seller/earnings', label: 'Earnings' },
      { href: '/seller/payouts', label: 'Payouts' },
    ],
  },
  {
    label: 'Profile',
    submenu: [
      { href: '/seller/profile', label: 'My Profile' },
      { href: '/seller/kyc', label: 'KYC' },
    ],
  },
  { href: '/seller/support', label: 'Support' },
];

const SellerLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [storeName, setStoreName] = useState(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const parsed = JSON.parse(userStr);
        // user may contain seller or shopName depending on login flow
        return parsed?.seller?.shopName || parsed?.shopName || parsed?.storeName || 'My Store';
      }
    } catch (e) {
      // ignore parse errors
    }
    return 'My Store';
  });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    
    // Check if user is authenticated
    if (!authToken || !userStr) {
      console.log('No auth found, redirecting to login');
      navigate('/login');
      return;
    }
    
    // Verify user role is seller
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'seller') {
        console.log('Unauthorized access attempt to seller panel by:', user.role);
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/login');
        }
        return;
      }
    } catch (err) {
      console.error('Invalid user data:', err);
      localStorage.clear();
      navigate('/login');
      return;
    }
    
    // Ensure light mode always
    document.documentElement.classList.remove('dark');
    
    // Fetch seller profile to get store name
    const fetchSellerProfile = async () => {
      try {
        const response = await sellerService.getProfile();
        // seller may be nested or returned directly
        const seller = response?.seller || response?.data?.seller || response;
        if (seller?.shopName) {
          setStoreName(seller.shopName);
          // update localStorage user object so UI shows backend-authoritative name
          try {
            const userStr = localStorage.getItem('user');
            const userObj = userStr ? JSON.parse(userStr) : {};
            userObj.seller = seller;
            // also sync top-level shopName if desired
            if (!userObj.shopName) userObj.shopName = seller.shopName;
            localStorage.setItem('user', JSON.stringify(userObj));
          } catch (e) {
            // ignore storage errors
          }
        }
      } catch (err) {
        console.log('Could not fetch seller profile:', err);
        // If API fails with 401/403, clear auth and redirect
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.clear();
          navigate('/login');
        }
      }
    };
    if (authToken) fetchSellerProfile();
  }, [navigate]);

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    
    // Dispatch Redux logout action to clear state
    dispatch(logout());
    
    // Navigate to login page
    navigate('/login', { replace: true });
    
    console.log('✅ Logout complete, redirected to login');
  };

  const isActive = (href) => location.pathname === href;
  const userEmail = localStorage.getItem('userEmail') || 'Seller';

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Burger icon for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-[101] bg-white rounded-full p-2 shadow-lg border border-purple-200"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
        style={{ display: sidebarOpen ? 'none' : 'block' }}
      >
        <Menu size={28} className="text-purple-700" />
      </button>

      {/* Sidebar - responsive */}
      <aside
        className={`bg-gradient-to-b from-purple-300 to-purple-100 fixed top-0 left-0 h-full min-h-screen border-r border-purple-200 overflow-y-auto shadow-lg z-[100] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:w-64 w-72`}
        style={{ color: '#59168B' }}
      >
        {/* Close icon for mobile */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X size={28} className="text-purple-700" />
          </button>
        </div>
        <div className="p-6 flex justify-between items-center border-b border-purple-500/30">
          <h1 className="text-2xl font-bold text-[#E639AC] truncate" title={storeName}>{storeName}</h1>
        </div>
        <nav className="mt-8 space-y-2 px-3 pb-20 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {navItems.map((item, index) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isOpen = openSubmenu === item.label;
            const isItemActive = item.submenu ? item.submenu.some(s => isActive(s.href)) : isActive(item.href);
            const buttonClasses = isItemActive ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg scale-105' : 'hover:bg-purple-700/50';
            
            // Check if we need to show a section heading
            const showSectionHeading = item.section && (index === 0 || navItems[index - 1].section !== item.section);
            
            return (
              <div key={item.label || item.href}>
                {showSectionHeading && (
                  <div className="text-xs font-semibold text-purple-700/60 uppercase tracking-wider px-4 py-2 mt-4">
                    {item.section}
                  </div>
                )}
                <button
                  onClick={() => {
                    if (hasSubmenu) {
                      setOpenSubmenu(isOpen ? null : item.label);
                    } else if (item.href) {
                      navigate(item.href);
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${buttonClasses}`}
                >
                  <span className="flex-1 text-left font-medium" style={{ color: '#59168B' }}>{item.label}</span>
                  {hasSubmenu && <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
                </button>
                {hasSubmenu && isOpen && (
                  <div className="ml-4 mt-2 space-y-2 pl-4 border-l border-purple-500/30">
                    {item.submenu?.map((sub) => (
                      <Link
                        key={sub.href}
                        to={sub.href || '#'}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${isActive(sub.href) ? 'bg-purple-700/50 font-medium' : 'hover:bg-purple-700/30'}`}
                        style={{ color: '#59168B' }}
                        onClick={() => { if (window.innerWidth < 768) setSidebarOpen(false); }}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-500/30 bg-gradient-to-t from-purple-900">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-600/20 text-[#59168B] font-medium transition-colors">
            <LogOut size={20} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content - responsive margin */}
      <main className="flex-1 md:ml-64 transition-all w-full max-w-full overflow-x-hidden">
        <div className="border-b border-purple-200 bg-white sticky top-0 z-50 shadow-sm">
          <div className="px-4 md:px-8 py-1 flex justify-between items-center">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {location.pathname.split('/')[1]?.toUpperCase() || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-3 py-2 hover:bg-purple-100 rounded-lg transition-colors">
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center font-bold">
                    {userEmail[0].toUpperCase()}
                  </div>
                  <ChevronDown size={16} className="text-gray-600" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-purple-200 rounded-lg shadow-xl z-[100]">
                    <div className="px-4 py-3 border-b border-purple-200">
                      <p className="text-sm font-semibold text-gray-900">{userEmail}</p>
                      <p className="text-xs text-purple-600 font-medium mt-1">Seller Account</p>
                    </div>
                    <button onClick={handleLogout} className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-full overflow-x-hidden p-2 md:p-3">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SellerLayout;
