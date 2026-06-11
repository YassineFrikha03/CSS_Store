import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { LayoutDashboard, Package, ShoppingCart, Users, Activity, Settings, Search, Bell, LogOut } from 'lucide-react';
import AdminStock from '../components/admin/AdminStock';
import AdminOrders from '../components/admin/AdminOrders';
import AdminOverview from '../components/admin/AdminOverview';
import AdminUsers from '../components/admin/AdminUsers';
import AdminLogs from '../components/admin/AdminLogs';
import AdminReviews from '../components/admin/AdminReviews';
import { Star } from 'lucide-react';
import Logo from '../assets/logocss.png';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useUser();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', label: 'Tableau de bord', icon: <LayoutDashboard size={18} /> },
    { id: 'stock', label: 'Produits', icon: <Package size={18} /> },
    { id: 'orders', label: 'Commandes', icon: <ShoppingCart size={18} /> },
    { id: 'users', label: 'Clients', icon: <Users size={18} /> },
    { id: 'reviews', label: 'Avis en attente', icon: <Star size={18} /> },
    { id: 'logs', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-[#f4f6f8] font-sans text-black overflow-hidden">
      
      {/* SIDEBAR (Gauche) - NOIRE */}
      <aside className="w-64 bg-[#111111] text-zinc-300 flex flex-col flex-shrink-0 h-full">
        {/* LOGO AREA */}
        <div className="p-6 flex flex-col items-center border-b border-zinc-800">
          <img src={Logo} alt="CSS Store" className="w-16 h-16 object-contain mb-3" />
          <h1 className="text-white font-black tracking-widest text-sm uppercase">CSS Store</h1>
        </div>

        {/* ADMIN INFO */}
        <div className="px-6 py-4 flex items-center gap-3 border-b border-zinc-800 mb-4 cursor-pointer hover:bg-zinc-800/50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold text-xs">
            {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
          </div>
          <div className="flex-1">
            <p className="text-xs text-zinc-400">Admin</p>
            <p className="text-sm text-white font-semibold truncate">{user?.name || 'Administrateur'}</p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === item.id
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* LOGOUT / RETOUR SITE */}
        <div className="p-4 border-t border-zinc-800 mt-auto">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            Quitter l'Admin
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA (Droite) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 flex-shrink-0">
          <h2 className="text-lg font-bold text-black capitalize">
            {menuItems.find(m => m.id === activeTab)?.label || 'Dashboard'}
          </h2>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-9 pr-4 py-1.5 bg-zinc-100 border-none rounded-md text-sm outline-none focus:ring-1 focus:ring-zinc-300 w-64 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-4 border-l border-zinc-200 pl-6">
              <button 
                onClick={() => setActiveTab('logs')}
                className="relative text-zinc-500 hover:text-black transition-colors cursor-pointer"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs">
                  {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* DYNAMIC CONTENT */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'overview' && <AdminOverview />}
            {activeTab === 'stock' && <AdminStock />}
            {activeTab === 'orders' && <AdminOrders />}
            {activeTab === 'users' && <AdminUsers />}
            {activeTab === 'reviews' && <AdminReviews />}
            {activeTab === 'logs' && <AdminLogs />}
            {activeTab === 'settings' && (
              <div className="bg-white p-8 rounded-lg border border-zinc-200 text-center">
                <p className="text-zinc-500 font-medium">Page des paramètres en construction.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;