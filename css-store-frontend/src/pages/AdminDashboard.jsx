import React, { useState } from 'react';
import AdminStock from '../components/admin/AdminStock';
import AdminOrders from '../components/admin/AdminOrders';
import AdminProfits from '../components/admin/AdminProfits';
import AdminUsers from '../components/admin/AdminUsers';
import AdminLogs from '../components/admin/AdminLogs';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stock');

  const menuItems = [
    { id: 'logs', label: '📊 Mouvements Site', icon: '⚡' },
    { id: 'stock', label: '📦 Gestion Stock', icon: '👕' },
    { id: 'orders', label: '🛒 Commandes', icon: '📝' },
    { id: 'profits', label: '💰 Profits & Revenus', icon: '📈' },
    { id: 'users', label: '👥 Gestion Users', icon: '🔒' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] flex flex-col lg:flex-row font-sans text-black">
      
      {/* SIDEBAR ADMIN (CÔTÉ GAUCHE) */}
      <aside className="w-full lg:w-64 bg-black text-white p-6 flex flex-col justify-between select-none lg:sticky lg:top-[140px] lg:h-[calc(100vh-140px)]">
        <div>
          <div className="border-b border-zinc-800 pb-4 mb-6 text-left">
            <h2 className="text-sm font-black tracking-widest text-white uppercase">PANNEL SÉCURISÉ</h2>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Admin: Yassine Frikha</p>
          </div>
          
          <nav className="space-y-1.5 text-left">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-bold transition-all rounded-none cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-white text-black font-black'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="text-[10px] text-zinc-600 font-mono border-t border-zinc-900 pt-4 text-left">
          CSS STORE v2.0 • 2026
        </div>
      </aside>

      {/* ZONE DE CONTENU (CÔTÉ DROIT) */}
      <main className="flex-grow p-6 md:p-10 text-left">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'logs' && <AdminLogs />}
          {activeTab === 'stock' && <AdminStock />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'profits' && <AdminProfits />}
          {activeTab === 'users' && <AdminUsers />}
        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;