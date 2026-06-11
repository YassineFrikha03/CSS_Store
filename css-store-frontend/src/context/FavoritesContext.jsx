import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import toast from 'react-hot-toast';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user, logoutUser } = useUser();
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  // Charger les favoris au démarrage ou changement d'utilisateur
  useEffect(() => {
    if (user && user.id) {
      fetchFavorites();
    } else {
      setFavorites([]); // Vider les favoris à la déconnexion
    }
  }, [user]);

  const fetchFavorites = async () => {
    setLoadingFavorites(true);
    try {
      const t = sessionStorage.getItem('token');
      if (!t) return; // Si pas de token, on ne peut pas charger les favoris
      
      const res = await axios.get('http://localhost:5000/api/users/favorites', {
        headers: { Authorization: `Bearer ${t}` }
      });
      setFavorites(res.data);
    } catch (err) {
      console.error("Erreur chargement favoris", err);
      // Si l'utilisateur n'existe plus en base (ex: DB réinitialisée) ou token invalide (401)
      if (err.response && err.response.status === 401) {
        if (logoutUser) logoutUser();
      }
    } finally {
      setLoadingFavorites(false);
    }
  };

  const addFavorite = async (productId) => {
    if (!user) {
      toast.error("Veuillez vous connecter pour ajouter aux favoris.");
      return;
    }
    try {
      const t = sessionStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/users/favorites/${productId}`, {}, {
        headers: { Authorization: `Bearer ${t}` }
      });
      fetchFavorites();
      toast.success("Ajouté aux favoris ! ❤️");
    } catch (err) {
      toast.error("Erreur lors de l'ajout.");
    }
  };

  const removeFavorite = async (productId) => {
    try {
      const t = sessionStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/favorites/${productId}`, {
        headers: { Authorization: `Bearer ${t}` }
      });
      fetchFavorites();
      toast.success("Retiré des favoris.");
    } catch (err) {
      toast.error("Erreur lors du retrait.");
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(fav => fav._id === productId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, loadingFavorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
