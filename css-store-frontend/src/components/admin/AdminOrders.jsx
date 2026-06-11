import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, { status });
      setOrders(orders.map(o => (o._id === id ? { ...o, status } : o)));
      toast.success("Statut mis à jour !");
    } catch (err) {
      toast.error("Erreur lors du changement de statut");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm("Supprimer cette commande définitivement ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/orders/${id}`);
        setOrders(orders.filter(o => o._id !== id));
        toast.success("Commande supprimée !");
      } catch (err) {
        toast.error("Erreur lors de la suppression de la commande");
      }
    }
  };

  if (loading) return <p className="text-xs font-mono text-zinc-400 p-4">Chargement des paniers...</p>;

  return (
    <div className="text-left">
      <h2 className="text-xl font-black uppercase tracking-wider mb-6">Suivi des Commandes ({orders.length})</h2>
      <div className="bg-white border border-zinc-200 divide-y divide-zinc-100 rounded-lg shadow-sm overflow-hidden">
        {orders.map(order => {
          const price = order.totalPrice || order.total || 0;
          const isDone = order.status === 'Livré' || order.isDelivered;

          return (
            <div key={order._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-medium gap-4 hover:bg-zinc-50/60 transition-colors">
              <div>
                <span className="font-mono font-black text-black block text-sm">#{order._id.slice(-6).toUpperCase()}</span>
                <span className="text-zinc-500 mt-1 block">
                  {order.user?.name || "Supporter CSS"} — {order.shippingAddress?.city || "Tunisie"}
                </span>
              </div>
              <div className="flex items-center gap-6 justify-between sm:justify-end">
                <span className="font-mono font-black text-base text-black">{price},000 DT</span>
                
                {/* Sélecteur de statut */}
                <select
                  value={order.status || 'En attente'}
                  onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                  className={`px-3 py-1.5 font-bold uppercase text-[9px] tracking-wider transition-all cursor-pointer outline-none border-none appearance-none text-center ${
                    order.status === 'Livré' ? 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200' 
                    : order.status === 'Annulé' ? 'bg-red-50 text-red-600'
                    : 'bg-black text-white hover:bg-zinc-800'
                  }`}
                >
                  <option value="En attente">En attente</option>
                  <option value="En cours">En cours</option>
                  <option value="Expédié">Expédié</option>
                  <option value="Livré">Livré</option>
                  <option value="Annulé">Annulé</option>
                </select>

                <button 
                  onClick={() => handleDeleteOrder(order._id)}
                  className="text-red-600 hover:text-red-800 font-bold uppercase text-[10px] tracking-wider cursor-pointer ml-2"
                  title="Supprimer la commande"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOrders;