import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Ajouter un maillot ou article au panier
  const addToCart = (product, size = 'M') => {
    setCartItems((prevItems) => {
      // On cherche si l'article avec la MÊME taille est déjà dans le panier
      const existingItemIndex = prevItems.findIndex(
        (item) => item._id === product._id && item.selectedSize === size
      );

      if (existingItemIndex > -1) {
        // Si oui, on incrémente juste sa quantité
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += 1;
        return newItems;
      }

      // Si non, on l'ajoute comme nouvel élément
      return [...prevItems, { ...product, quantity: 1, selectedSize: size }];
    });
    
    // Effet moderne : on ouvre automatiquement la sidebar du panier lors d'un achat
    setIsCartOpen(true);
  };

  // Modifier la quantité d'un article
  const updateQuantity = (productId, size, amount) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item._id === productId && item.selectedSize === size
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0) // Supprime l'article si la quantité tombe à 0
    );
  };

  // Calcul du prix total de la commande
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Nombre total d'articles dans le panier (pour le badge de l'icône)
  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // ==========================================
  // 🔥 ACTION REQUIS : PASSAGE DE COMMANDE (CHECKOUT)
  // ==========================================
  const checkoutCart = async (userId, shippingAddress) => {
    try {
      // Structuration des données selon le modèle Order de ton back-end
      const orderData = {
        user: userId,
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          priceAtPurchase: item.price,
          size: item.selectedSize
        })),
        totalAmount: getTotalPrice(),
        shippingAddress: shippingAddress || { city: "Sfax", country: "Tunisia" },
        paymentMethod: "COD" // Cash on Delivery par défaut
      };

      // Envoi de la requête POST vers ton API d'aiguillage
      const response = await axios.post('http://localhost:5000/api/orders/checkout', orderData);
      
      if (response.status === 201) {
        setCartItems([]); // Vide le panier après validation
        setIsCartOpen(false); // Ferme automatiquement la sidebar
        return { success: true, orderId: response.data._id };
      }
    } catch (error) {
      console.error("Erreur lors de la validation de la commande :", error);
      return { success: false, message: error.response?.data?.message || "Échec du checkout" };
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, isCartOpen, setIsCartOpen, addToCart, updateQuantity, getTotalPrice, getItemCount, checkoutCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);