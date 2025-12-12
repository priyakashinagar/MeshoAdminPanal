import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Menu, X, LogOut, Moon, Sun, ChevronDown, Settings, User, BarChart3, Headphones, Cog, CreditCard, Truck, Layers, ShoppingCart, Users, Package, Store, FileText, Award, AlertCircle, TrendingUp, DollarSign, UserCheck, Shield } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';

const navItems = [
  { href: '/', label: 'Dashboard', icon: BarChart3, section: 'Overview' },
  
  // Sellers Management
  {
    label: 'Sellers',
    icon: Store,
    section: 'Manage Sellers',
    submenu: [
      { href: '/users', label: 'All Sellers', icon: Store },
      { href: '/kyc', label: 'KYC Verification', icon: UserCheck },
      { href: '/seller-management', label: 'Seller Management', icon: Shield },
    ],
  },
  
  // Catalog Management
  {
    label: 'Catalog',
    icon: Layers,
    section: 'Manage Catalog',
    submenu: [
      { href: '/products', label: 'All Products', icon: Package },
      { href: '/categories', label: 'Categories', icon: Layers },
      { href: '/inventory', label: 'Inventory', icon: Layers },
    ],
  },
  
  // Orders Management
  {
    label: 'Orders',
    icon: ShoppingCart,
    section: 'Manage Orders',
    submenu: [
      { href: '/orders', label: 'All Orders', icon: ShoppingCart },
      { href: '/sales', label: 'Sales Reports', icon: BarChart3 },
      { href: '/shipping', label: 'Shipping Management', icon: Package },
      { href: '/delivery', label: 'Delivery Tracking', icon: Truck },
    ],
  },
  
  // Customers
  {
    label: 'Customers',
    icon: Users,
    section: 'Manage Customers',
    submenu: [
      { href: '/customers', label: 'All Customers', icon: Users },
      { href: '/reviews', label: 'Reviews & Ratings', icon: Award },
    ],
  },
  
  // Finance & Earnings
  {
    label: 'Finance',
    icon: DollarSign,
    section: 'Finance',
    submenu: [
      { href: '/earnings', label: 'Platform Earnings', icon: TrendingUp },
      { href: '/payouts', label: 'Seller Payouts', icon: CreditCard },
      { href: '/operations/payment', label: 'Payment Transactions', icon: CreditCard },
    ],
  },
  
  // Quality & Support
  {
    label: 'Quality & Support',
    icon: Headphones,
    section: 'Quality',
    submenu: [
      { href: '/quality', label: 'Quality Metrics', icon: Award },
      { href: '/support', label: 'Support Tickets', icon: Headphones },
      { href: '/claims', label: 'Claims & Disputes', icon: AlertCircle },
    ],
  },
  
  // Reports & Analytics
  {
    label: 'Reports',
    icon: FileText,
    section: 'Analytics',
    submenu: [
      { href: '/analytics', label: 'Platform Analytics', icon: BarChart3 },
      { href: '/sales-reports', label: 'Sales Reports', icon: TrendingUp },
      { href: '/performance', label: 'Performance Metrics', icon: Award },
    ],
  },
  
  // Settings
  {
    label: 'Settings',
    icon: Settings,
    section: 'Configuration',
    submenu: [
      { href: '/settings', label: 'Platform Settings', icon: Settings },
      { href: '/settings/payment', label: 'Payment Gateway', icon: CreditCard },
      { href: '/settings/shipping', label: 'Shipping Configuration', icon: Truck },
    ],
  },
];

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
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
    
    // Verify user role is admin
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        console.log('Unauthorized access attempt to admin panel by:', user.role);
        // Redirect based on role
        if (user.role === 'seller') {
          navigate('/seller');
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
  }, [navigate]);

  const handleLogout = () => {
    console.log('🚺 Logging out (Admin)...');
    
    // Dispatch Redux logout action to clear state
    dispatch(logout());
    
    // Navigate to login page
    navigate('/login', { replace: true });
    
    console.log('✅ Logout complete, redirected to login');
  };

  const isActive = (href) => location.pathname === href;
  const userEmail = localStorage.getItem('userEmail') || 'Admin';
  const sidebarClasses = sidebarOpen ? 'w-64' : 'w-20';
  const mainMarginClasses = sidebarOpen ? 'ml-64' : 'ml-20';

  // Responsive sidebar logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex bg-purple-10 overflow-x-hidden">
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
        className={`bg-gradient-to-b from-purple-300 to-purple-100 fixed top-0 left-0 h-full min-h-screen border-r border-purple-200 overflow-y-auto shadow-lg z-[100] transition-transform duration-300 scrollbar-hide ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:w-64 w-72`}
        style={{ color: '#59168B', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Close icon for mobile */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X size={28} className="text-purple-700" />
          </button>
        </div>
        <div className="p-6 flex justify-between items-center border-b border-purple-500/30">
          <h1 className="text-2xl font-bold text-[#E639AC]">meesho</h1>
        </div>
        <nav className="mt-6 space-y-1 px-3 pb-20 overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(100vh - 200px)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isOpen = openSubmenu === item.label;
            const isItemActive = item.submenu ? item.submenu.some(s => isActive(s.href)) : isActive(item.href);
            const buttonClasses = isItemActive ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg scale-105' : 'hover:bg-purple-700/50';
            
            // Check if we need to show a section heading
            const showSectionHeading = item.section && (index === 0 || navItems[index - 1].section !== item.section);
            
            return (
              <div key={item.label}>
                {showSectionHeading && (
                  <div className="text-xs font-semibold text-purple-700/60 uppercase tracking-wider px-4 pt-2 pb-0">
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
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${buttonClasses}`}
                >
                  <Icon size={20} />
                  <span className="flex-1 text-left font-medium" style={{ color: '#59168B' }}>{item.label}</span>
                  {hasSubmenu && <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
                </button>
                {hasSubmenu && isOpen && (
                  <div className="ml-3 mt-1 space-y-1 pl-3 border-l border-purple-500/30">
                    {item.submenu?.map((sub) => (
                      <Link
                        key={sub.href}
                        to={sub.href || '#'}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 ${isActive(sub.href) ? 'bg-purple-700/50 font-medium' : 'hover:bg-purple-700/30'}`}
                        style={{ color: '#59168B' }}
                        onClick={() => { if (window.innerWidth < 768) setSidebarOpen(false); }}
                      >
                        {sub.icon && <sub.icon size={16} />}
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
      <main className="flex-1 md:ml-64 transition-all">
        <div className="border-b border-purple-200 bg-white sticky top-0 z-40 shadow-sm">
          <div className="px-4 md:px-8 py-1 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent w-full md:w-auto text-center md:text-left">
              {location.pathname === '/' ? 'Dashboard' : location.pathname.split('/')[1]?.toUpperCase()}
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-3 py-2 hover:bg-purple-100 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {userEmail[0].toUpperCase()}
                  </div>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-purple-200 rounded-lg shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-purple-200">
                      <p className="text-sm font-medium">{userEmail}</p>
                      <p className="text-xs text-gray-600">Admin</p>
                    </div>
                    <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 md:p-4">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
