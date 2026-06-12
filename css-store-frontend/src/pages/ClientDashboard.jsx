import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useFavorites } from '../context/FavoritesContext';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Bell, User as UserIcon, LogOut, ChevronRight, Heart } from 'lucide-react';

const ClientDashboard = () => {
  const { user, logoutUser } = useUser();
  const { favorites, loadingFavorites } = useFavorites();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('COMMANDES');

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
    <div className="bg-zinc-950 text-white font-sans flex flex-col w-full min-h-screen selection:bg-white selection:text-black">

      <div className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row gap-8 relative z-10">
        
        {/* SIDEBAR PROFIL */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/10 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-500 to-white"></div>
            <div className="w-20 h-20 bg-black border border-white/20 text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4 group-hover:scale-105 transition-transform">
              {user.name ? user.name.substring(0, 2).toUpperCase() : 'SC'}
            </div>
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <p className="text-sm text-zinc-400 font-mono mt-1">{user.email}</p>
            
            <div className="mt-6 flex justify-center">
              <span className="bg-white/10 border border-white/20 text-zinc-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <UserIcon size={12} />
                Supporter Officiel
              </span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/10 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('COMMANDES')}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer ${activeTab === 'COMMANDES' ? 'bg-white text-black' : 'hover:bg-white/10 text-zinc-400'}`}
            >
              <div className="flex items-center gap-3 font-medium text-sm">
                <ShoppingBag size={18} />
                Mes Commandes
              </div>
              {activeTab === 'COMMANDES' && <ChevronRight size={16} />}
            </button>
            <button 
              onClick={() => setActiveTab('FAVORIS')}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer ${activeTab === 'FAVORIS' ? 'bg-white text-black' : 'hover:bg-white/10 text-zinc-400'}`}
            >
              <div className="flex items-center gap-3 font-medium text-sm">
                <Heart size={18} />
                Mes Favoris
              </div>
              {activeTab === 'FAVORIS' && <ChevronRight size={16} />}
            </button>
            <button className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-zinc-400 font-medium text-sm transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell size={18} />
                Notifications
              </div>
            </button>
            
            <div className="h-px bg-white/10 my-2"></div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-red-500/10 text-red-500 font-bold text-sm transition-colors cursor-pointer"
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
          
          {activeTab === 'COMMANDES' ? (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-black uppercase tracking-wider text-white mb-2">Historique d'Achats</h3>
                <div className="h-1 w-16 bg-gradient-to-r from-white to-zinc-600"></div>
              </div>
            
            {loading ? (
              <p className="text-zinc-500">Chargement de vos commandes...</p>
            ) : orders.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-sm border border-white/10 text-center flex flex-col items-center">
                <Package size={48} className="text-zinc-600 mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">Aucune commande</h4>
                <p className="text-sm text-zinc-400">Vous n'avez pas encore passé de commande sur notre boutique.</p>
                <button onClick={() => navigate('/textiles')} className="mt-6 bg-white text-black px-6 py-3 font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-colors">
                  Découvrir la boutique
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/30 transition-colors">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-white font-black text-sm">#{order._id.slice(-6).toUpperCase()}</span>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'Livré' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                          order.status === 'En cours' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                          order.status === 'Annulé' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                          'bg-zinc-500/20 text-zinc-400 border border-zinc-500/20'
                        }`}>
                          {order.status || 'En attente'}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-medium">
                        Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')} • {order.items?.length || 0} article(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-white">{Number(order.totalPrice || order.total || 0).toFixed(3)} DT</p>
                      <button className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest hover:text-white transition-colors mt-1 underline">
                        Voir détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-black uppercase tracking-wider text-white mb-2">Ma Liste d'Envies</h3>
                <div className="h-1 w-16 bg-gradient-to-r from-white to-zinc-600"></div>
              </div>
              
              {loadingFavorites ? (
                <p className="text-zinc-500">Chargement de vos favoris...</p>
              ) : favorites.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-sm border border-white/10 text-center flex flex-col items-center">
                  <Heart size={48} className="text-zinc-600 mb-4" />
                  <h4 className="text-lg font-bold text-white mb-2">Aucun favori</h4>
                  <p className="text-sm text-zinc-400">Vous n'avez pas encore ajouté de produit à votre liste d'envies.</p>
                  <button onClick={() => navigate('/textiles')} className="mt-6 bg-white text-black px-6 py-3 font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-colors">
                    Explorer la boutique
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {favorites.map((product) => (
                    <div key={product._id} className="bg-white/5 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/10 flex flex-col hover:border-white/30 transition-colors relative group overflow-hidden">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500 z-0"></div>
                      <div className="aspect-[4/5] bg-white rounded-xl overflow-hidden mb-4 relative flex items-center justify-center z-10">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="text-zinc-300 font-black tracking-widest text-[10px] font-mono">CSS STORE</div>
                        )}
                      </div>
                      <h4 className="font-bold text-sm uppercase text-white line-clamp-1 z-10">{product.name}</h4>
                      <p className="text-zinc-400 font-mono text-sm mt-1 z-10">{product.price} TND</p>
                      <button 
                        onClick={() => navigate(`/products/id/${product._id}`)}
                        className="mt-4 w-full bg-white/10 text-white border border-white/20 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer z-10"
                      >
                        Voir produit
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION ACTUALITÉS */}
          <div className="mt-8">
            <div className="mb-6">
              <h3 className="text-2xl font-black uppercase tracking-wider text-white mb-2">Actualités CSS Store</h3>
              <div className="h-1 w-16 bg-gradient-to-r from-white to-zinc-600"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-900 border border-white/10 text-white rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:border-white/30 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-zinc-900/80 to-transparent z-10"></div>
                <div className="relative z-20 flex flex-col h-full justify-end min-h-[120px]">
                  <span className="bg-white text-black text-[9px] font-black uppercase tracking-widest px-2 py-1 inline-block w-fit mb-3">Nouveau</span>
                  <h4 className="font-bold text-lg leading-tight mb-2 group-hover:text-zinc-300 transition-colors">Nouvelle Collection Matchwear 2026</h4>
                  <p className="text-xs text-zinc-400">Découvrez les nouveaux maillots officiels portés par les joueurs.</p>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-end min-h-[120px] group cursor-pointer hover:border-white/30 transition-colors">
                <span className="bg-zinc-800 text-zinc-300 text-[9px] font-black uppercase tracking-widest px-2 py-1 inline-block w-fit mb-3">Promo</span>
                <h4 className="font-bold text-white text-lg leading-tight mb-2 group-hover:text-zinc-300 transition-colors">Ventes Flash Hiver</h4>
                <p className="text-xs text-zinc-400">Jusqu'à -40% sur la collection Hiver. Connectez-vous vite.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
