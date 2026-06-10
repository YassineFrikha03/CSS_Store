import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Bell, User as UserIcon, LogOut, ChevronRight } from 'lucide-react';

const ClientDashboard = () => {
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/user/${user.id}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Erreur de récupération des commandes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="bg-[#f8f9fa] font-sans flex flex-col w-full h-full">

      <div className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR PROFIL */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200 text-center">
            <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">
              {user.name ? user.name.substring(0, 2).toUpperCase() : 'SC'}
            </div>
            <h2 className="text-xl font-bold text-black">{user.name}</h2>
            <p className="text-sm text-zinc-500 font-mono mt-1">{user.email}</p>
            
            <div className="mt-6 flex justify-center">
              <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <UserIcon size={12} />
                Supporter Officiel
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-200 flex flex-col gap-2">
            <button className="flex items-center justify-between p-3 rounded-xl bg-black text-white font-medium text-sm transition-colors">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} />
                Mes Commandes
              </div>
              <ChevronRight size={16} />
            </button>
            <button className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 text-zinc-600 font-medium text-sm transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell size={18} />
                Notifications
              </div>
            </button>
            
            <div className="h-px bg-zinc-100 my-2"></div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-red-50 text-red-600 font-bold text-sm transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <LogOut size={18} />
                Se déconnecter
              </div>
            </button>
          </div>
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-8">
          
          {/* SECTION COMMANDES */}
          <div>
            <h3 className="text-2xl font-black uppercase tracking-wider text-black mb-6">Historique d'Achats</h3>
            
            {loading ? (
              <p className="text-zinc-500">Chargement de vos commandes...</p>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-200 text-center flex flex-col items-center">
                <Package size={48} className="text-zinc-300 mb-4" />
                <h4 className="text-lg font-bold text-black mb-2">Aucune commande</h4>
                <p className="text-sm text-zinc-500">Vous n'avez pas encore passé de commande sur notre boutique.</p>
                <button onClick={() => navigate('/boutique')} className="mt-6 bg-black text-white px-6 py-3 font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-zinc-800 transition-colors">
                  Découvrir la boutique
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-black transition-colors">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-black font-black text-sm">#{order._id.slice(-6).toUpperCase()}</span>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'Livré' ? 'bg-emerald-100 text-emerald-700' :
                          order.status === 'En cours' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'Annulé' ? 'bg-red-100 text-red-700' :
                          'bg-zinc-100 text-zinc-700'
                        }`}>
                          {order.status || 'En attente'}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 font-medium">
                        Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')} • {order.items?.length || 0} article(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-black">{Number(order.totalPrice || order.total || 0).toFixed(3)} DT</p>
                      <button className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest hover:text-black transition-colors mt-1 underline">
                        Voir détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION ACTUALITÉS */}
          <div>
            <h3 className="text-2xl font-black uppercase tracking-wider text-black mb-6">Actualités CSS Store</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-black text-white rounded-2xl p-6 relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/80 to-transparent z-10"></div>
                <div className="relative z-20 flex flex-col h-full justify-end min-h-[120px]">
                  <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 inline-block w-fit mb-3">Nouveau</span>
                  <h4 className="font-bold text-lg leading-tight mb-2 group-hover:text-zinc-300 transition-colors">Nouvelle Collection Matchwear 2026</h4>
                  <p className="text-xs text-zinc-400">Découvrez les nouveaux maillots officiels portés par les joueurs.</p>
                </div>
              </div>
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col justify-end min-h-[120px] group cursor-pointer hover:border-black transition-colors">
                <span className="bg-zinc-100 text-zinc-600 text-[9px] font-black uppercase tracking-widest px-2 py-1 inline-block w-fit mb-3">Promo</span>
                <h4 className="font-bold text-black text-lg leading-tight mb-2 group-hover:text-zinc-600 transition-colors">Ventes Flash Hiver</h4>
                <p className="text-xs text-zinc-500">Jusqu'à -40% sur la collection Hiver. Connectez-vous vite.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
