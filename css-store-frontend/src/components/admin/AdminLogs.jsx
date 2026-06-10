import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminLogs = () => {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const [u, p, o] = await Promise.all([
          axios.get('http://localhost:5000/api/users'),
          axios.get('http://localhost:5000/api/products'),
          axios.get('http://localhost:5000/api/orders')
        ]);
        setStats({ users: u.data.length, products: p.data.length, orders: o.data.length });
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchGlobalStats();
  }, []);

  if (loading) return <p className="text-xs font-mono text-zinc-400 p-4">Analyse de flux...</p>;

  const activeLogs = [
    { type: "👤 ACCOUNTS", text: `${stats.users} supporters enregistrés au total sur la plateforme.` },
    { type: "👕 CATALOGUE", text: `${stats.products} articles gérés activement en catalogue.` },
    { type: "📦 LOGISTIQUE", text: `${stats.orders} bons de commande stockés en base Atlas.` }
  ];

  return (
    <div className="text-left">
      <h2 className="text-xl font-black uppercase tracking-wider mb-6">Mouvements Site & État Global</h2>
      <div className="bg-white border border-zinc-200 divide-y divide-zinc-100">
        {activeLogs.map((log, index) => (
          <div key={index} className="p-4 flex justify-between items-center text-xs font-medium">
            <div className="flex gap-4 items-center">
              <span className="bg-black text-white px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest">{log.type}</span>
              <span className="text-zinc-800">{log.text}</span>
            </div>
            <span className="text-green-600 font-mono text-[10px] uppercase font-bold">● Actif</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLogs;