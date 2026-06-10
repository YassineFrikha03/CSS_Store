import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminProfits = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders');
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Calculs dynamiques basés sur la réalité MongoDB Atlas
  const totalCA = orders.reduce((sum, o) => sum + Number(o.totalPrice || o.total || 0), 0);
  const netProfits = totalCA * 0.35; // Marge brute de 35%
  const averageCart = orders.length > 0 ? totalCA / orders.length : 0;

  if (loading) return <p className="text-xs font-mono text-zinc-400 p-4">Calcul financier...</p>;

  return (
    <div className="text-left">
      <h2 className="text-xl font-black uppercase tracking-wider mb-6">Profits & Indicateurs Financiers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-zinc-200 p-6">
          <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block">Chiffre d'affaires Global</span>
          <span className="text-2xl font-black font-mono text-black mt-1 block">{totalCA.toLocaleString('fr-FR')},000 DT</span>
        </div>
        <div className="bg-white border border-zinc-200 p-6">
          <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block">Bénéfice Net Estimé</span>
          <span className="text-2xl font-black font-mono text-black mt-1 block">{Math.round(netProfits).toLocaleString('fr-FR')},000 DT</span>
        </div>
        <div className="bg-white border border-zinc-200 p-6">
          <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block">Panier Moyen Supporter</span>
          <span className="text-2xl font-black font-mono text-black mt-1 block">{Math.round(averageCart).toLocaleString('fr-FR')},000 DT</span>
        </div>
      </div>
      <div className="bg-zinc-900 text-zinc-400 p-5 border border-black font-mono text-xs">
        📈 Données réelles calculées sur un volume global de <span className="text-white font-bold">{orders.length} transactions</span> passées.
      </div>
    </div>
  );
};

export default AdminProfits;