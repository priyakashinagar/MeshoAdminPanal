import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Moon, Sun, ChevronDown } from 'lucide-react';

const navItems = [
  { href: '/seller', label: 'Dashboard' },
  {
    label: 'Products',
    submenu: [
      { href: '/seller/products', label: 'My Products' },
      { href: '/seller/products/new', label: 'Add New Product' },
    ],
  },
  {
    label: 'Orders',
    submenu: [
      { href: '/seller/orders', label: 'All Orders' },
      { href: '/seller/returns', label: 'Returns' },
    ],
  },
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
  const [darkMode, setDarkMode] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) navigate('/login');
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
  }, [navigate]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
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
    <div className="min-h-screen flex bg-purple-10 dark:bg-slate-50" style={{ zoom: 0.92 }}>
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
        className={`bg-gradient-to-b from-purple-300 to-purple-100 dark:from-purple-900 dark:to-purple-950 fixed top-0 left-0 h-full min-h-screen border-r border-purple-200 overflow-y-auto shadow-lg z-[100] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:w-64 w-72`}
        style={{ color: '#59168B' }}
      >
        {/* Close icon for mobile */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X size={28} className="text-purple-700" />
          </button>
        </div>
        <div className="p-6 flex justify-between items-center border-b border-purple-500/30">
          <h1 className="text-2xl font-bold text-[#E639AC]">meesho Seller</h1>
        </div>
        <nav className="mt-8 space-y-2 px-3">
          {navItems.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isOpen = openSubmenu === item.label;
            const isItemActive = item.submenu ? item.submenu.some(s => isActive(s.href)) : isActive(item.href);
            const buttonClasses = isItemActive ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg scale-105' : 'hover:bg-purple-700/50';
            return (
              <div key={item.label || item.href}>
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
      <main className="flex-1 md:ml-64 transition-all">
        <div className="border-b border-purple-200 dark:border-purple-900 bg-white dark:bg-slate-900 sticky top-0 z-40 shadow-sm">
          <div className="px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent w-full md:w-auto text-center md:text-left">
              {location.pathname.split('/')[1]?.toUpperCase() || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-2 md:gap-4">
              <button onClick={toggleDarkMode} className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
                {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-slate-700" />}
              </button>
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-3 py-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {userEmail[0].toUpperCase()}
                  </div>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-lg shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-purple-200 dark:border-purple-800">
                      <p className="text-sm font-medium">{userEmail}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Seller</p>
                    </div>
                    <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-2 md:p-8">{children}</div>
      </main>
    </div>
  );
};

export default SellerLayout;
