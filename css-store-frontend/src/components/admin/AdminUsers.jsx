import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangeRole = async (id, currentRole) => {
    // Cycle de basculement des rôles définis dans ton User.js
    let nextRole = 'supporter';
    if (currentRole === 'supporter') nextRole = 'premium_subscriber';
    else if (currentRole === 'premium_subscriber') nextRole = 'admin';

    try {
      await axios.put(`http://localhost:5000/api/users/${id}/role`, { role: nextRole });
      fetchUsers();
    } catch (err) {
      alert("Erreur lors de la modification des privilèges");
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Voulez-vous vraiment bannir/supprimer cet utilisateur définitivement ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert("Erreur lors de la suppression de l'utilisateur");
      }
    }
  };

  if (loading) return <p className="text-xs font-mono text-zinc-400 p-4">Chargement des membres...</p>;

  return (
    <div className="text-left">
      <h2 className="text-xl font-black uppercase tracking-wider mb-6">Gestion des Comptes ({users.length})</h2>
      <div className="bg-white border border-zinc-200 divide-y divide-zinc-100 rounded-lg shadow-sm overflow-hidden">
        {users.map(u => (
          <div key={u._id} className="p-4 flex justify-between items-center text-xs font-medium hover:bg-zinc-50/40 transition-colors">
            <div>
              <h4 className="font-bold text-black">{u.name}</h4>
              <p className="text-zinc-400 font-mono text-[11px] mt-0.5">{u.email}</p>
            </div>
            
            {/* Actions Administratives */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleChangeRole(u._id, u.role)}
                className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider transition-transform active:scale-95 cursor-pointer ${
                  u.role === 'admin' 
                    ? 'bg-black text-white' 
                    : u.role === 'premium_subscriber' 
                      ? 'bg-zinc-800 text-zinc-100' 
                      : 'bg-zinc-100 text-zinc-500'
                }`}
                title="Cliquez pour modifier le rôle"
              >
                {u.role || 'supporter'} ⚙️
              </button>
              
              <button 
                onClick={() => handleDeleteUser(u._id)}
                className="text-red-600 hover:text-red-800 font-bold uppercase text-[10px] tracking-wider cursor-pointer"
                title="Supprimer l'utilisateur"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;