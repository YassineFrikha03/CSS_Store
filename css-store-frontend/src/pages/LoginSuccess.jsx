import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from 'axios';

const LoginSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginUser } = useUser();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // 1. Stockage immédiat du jeton d'authentification
      localStorage.setItem('token', token);

      // 2. Appel au backend pour récupérer le profil du supporter avec son nouveau token
      axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        const userPayload = res.data.user || res.data;
        
        // 3. Sauvegarde locale de la session et mise à jour du Contexte Global
        localStorage.setItem('user', JSON.stringify(userPayload));
        loginUser(userPayload);

        // 4. Redirection selon le rôle du supporter
        if (userPayload.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        // Petit rafraîchissement de sécurité pour synchroniser la Navbar et le Panier
        window.location.reload();
      })
      .catch((err) => {
        console.error("❌ Erreur lors de la récupération du profil social :", err);
        navigate('/login');
      });
    } else {
      // Si aucun token n'est détecté, on sécurise en renvoyant à la connexion
      navigate('/login');
    }
  }, [searchParams, navigate, loginUser]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white font-sans select-none">
      {/* ⏳ Spinner d'attente noir massif aux couleurs du club */}
      <div className="w-10 h-10 border-4 border-zinc-200 border-t-black rounded-full animate-spin"></div>
      <h2 className="text-xs font-black uppercase tracking-widest text-black mt-6 animate-pulse">
        Synchronisation de votre espace supporter...
      </h2>
      <p className="text-[11px] font-mono text-zinc-400 mt-1.5">
        Préparation de votre session sécurisée CSS Store
      </p>
    </div>
  );
};

export default LoginSuccess;