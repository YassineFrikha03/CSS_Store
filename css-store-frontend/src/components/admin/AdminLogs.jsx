import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, UserPlus, Info } from 'lucide-react';

const AdminLogs = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const [usersRes, ordersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users'),
          axios.get('http://localhost:5000/api/orders')
        ]);
        
        // Formater les commandes en notifications
        const orderLogs = ordersRes.data.map(order => ({
          id: order._id,
          type: 'order',
          title: `Nouvelle commande de ${order.user?.name || 'Client inconnu'}`,
          description: `Commande #${order._id.slice(-6).toUpperCase()} d'un montant de ${order.totalPrice || order.total || 0} DT.`,
          date: new Date(order.createdAt || Date.now() - Math.random() * 100000000), // Fallback
          icon: <ShoppingCart size={16} className="text-blue-600" />,
          bgColor: 'bg-blue-100'
        }));

        // Formater les nouveaux utilisateurs en notifications
        const userLogs = usersRes.data.map(user => ({
          id: user._id,
          type: 'user',
          title: `Nouvel utilisateur inscrit`,
          description: `${user.name} (${user.email}) vient de rejoindre le CSS Store.`,
          date: new Date(user.createdAt || Date.now() - Math.random() * 100000000),
          icon: <UserPlus size={16} className="text-emerald-600" />,
          bgColor: 'bg-emerald-100'
        }));

        // Fusionner et trier par date décroissante
        const allLogs = [...orderLogs, ...userLogs].sort((a, b) => b.date - a.date).slice(0, 50);
        
        setActivities(allLogs);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) return <p className="text-xs font-mono text-zinc-400 p-4">Chargement des notifications...</p>;

  return (
    <div className="text-left max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black uppercase tracking-wider text-black">Notifications & Activités</h2>
        <span className="bg-black text-white px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest">
          {activities.length} récentes
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-lg p-8 text-center text-zinc-500 flex flex-col items-center">
          <Info size={32} className="mb-3 text-zinc-300" />
          <p>Aucune activité récente sur la plateforme.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-zinc-100">
            {activities.map((activity) => (
              <div key={activity.id + activity.type} className="p-5 flex gap-4 hover:bg-zinc-50 transition-colors items-start">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${activity.bgColor}`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-black">{activity.title}</h4>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {activity.date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 font-medium leading-relaxed">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogs;