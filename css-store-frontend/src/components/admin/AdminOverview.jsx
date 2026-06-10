import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const AdminOverview = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/orders'),
          axios.get('http://localhost:5000/api/products'),
          axios.get('http://localhost:5000/api/users')
        ]);
        setOrders(ordersRes.data);
        setProducts(productsRes.data);
        setUsers(usersRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-sm text-zinc-500 font-medium p-4">Chargement du tableau de bord...</p>;

  // 1. Calcul des Statistiques
  const totalCA = orders.reduce((sum, o) => sum + Number(o.totalPrice || o.total || 0), 0);
  const totalOrders = orders.length;
  const activeProducts = products.length;
  const totalClients = users.length;

  // 2. Préparation des données pour le Graphique (Simulées ou basées sur la date)
  // Ici on simule une progression mensuelle pour avoir une belle courbe comme la maquette
  const chartData = [
    { name: '1', ventes: 300 }, { name: '5', ventes: 800 },
    { name: '10', ventes: 1200 }, { name: '15', ventes: 2300 },
    { name: '20', ventes: 2900 }, { name: '25', ventes: 4100 },
    { name: '30', ventes: totalCA > 5000 ? totalCA : 5000 }
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-black tracking-tight">
          Tableau de bord <span className="font-normal text-zinc-500">- Bienvenue {user?.name || 'Administrateur'}</span>
        </h2>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenus */}
        <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-semibold text-zinc-800">Revenus</span>
            <TrendingUp size={20} className="text-zinc-400" />
          </div>
          <div>
            <div className="text-3xl font-bold text-black">{totalCA.toLocaleString('fr-FR')},00 DT</div>
            <p className="text-xs font-medium text-emerald-600 mt-1">+12% vs. mois dernier</p>
          </div>
        </div>

        {/* Card 2: Commandes */}
        <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-semibold text-zinc-800">Commandes</span>
            <ShoppingBag size={20} className="text-zinc-400" />
          </div>
          <div>
            <div className="text-3xl font-bold text-black">{totalOrders}</div>
            <p className="text-xs font-medium text-emerald-600 mt-1">+8.5% total orders</p>
          </div>
        </div>

        {/* Card 3: Produits */}
        <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-semibold text-zinc-800">Produits</span>
            <Package size={20} className="text-zinc-400" />
          </div>
          <div>
            <div className="text-3xl font-bold text-black">{activeProducts}</div>
            <p className="text-xs font-medium text-zinc-500 mt-1">total | Actifs</p>
          </div>
        </div>

        {/* Card 4: Clients */}
        <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-semibold text-zinc-800">Clients</span>
            <Users size={20} className="text-zinc-400" />
          </div>
          <div>
            <div className="text-3xl font-bold text-black">{totalClients}</div>
            <p className="text-xs font-medium text-zinc-500 mt-1">total | Inscrits</p>
          </div>
        </div>
      </div>

      {/* SALES CHART */}
      <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-black">Performance des Ventes</h3>
          <span className="text-sm font-semibold text-black">Total des ventes: {totalCA.toLocaleString('fr-FR')},00 DT</span>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#000', fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="ventes" 
                stroke="#000" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                activeDot={{ r: 6, fill: '#000' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BOTTOM TABLES (Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white p-0 rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-zinc-200 flex justify-between items-center">
            <h3 className="text-base font-bold text-black">Derniers Produits</h3>
          </div>
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50/50 text-zinc-500 font-semibold border-b border-zinc-200">
                <tr>
                  <th className="px-5 py-3">Produit</th>
                  <th className="px-5 py-3">Réf</th>
                  <th className="px-5 py-3">Prix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.slice(0, 4).map(p => (
                  <tr key={p._id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-3 flex items-center gap-3">
                      <img src={p.imageUrl || (p.images && p.images[0])} alt="" className="w-8 h-8 rounded-md object-contain border border-zinc-200 bg-white" />
                      <span className="font-medium text-black truncate max-w-[150px]">{p.name}</span>
                    </td>
                    <td className="px-5 py-3 text-zinc-500">{p.reference || p._id.slice(-6)}</td>
                    <td className="px-5 py-3 font-medium text-black">{p.price} DT</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-0 rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-zinc-200 flex justify-between items-center">
            <h3 className="text-base font-bold text-black">Dernières Commandes</h3>
          </div>
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50/50 text-zinc-500 font-semibold border-b border-zinc-200">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.slice(0, 4).map(o => (
                  <tr key={o._id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-blue-600">#{o._id.slice(-6).toUpperCase()}</td>
                    <td className="px-5 py-3 text-zinc-800">{o.user?.name || "Client"}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md ${
                        o.status === 'Livré' ? 'bg-emerald-100 text-emerald-800' 
                        : o.status === 'Annulé' ? 'bg-red-100 text-red-800'
                        : 'bg-zinc-100 text-zinc-800'
                      }`}>
                        {o.status || 'En attente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminOverview;
