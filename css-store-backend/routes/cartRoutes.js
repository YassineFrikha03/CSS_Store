const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// @route   GET /api/carts/user/:userId
// @desc    Récupérer le panier actif d'un supporter
router.get('/user/:userId', async (req, res) => {
  try {
    // .populate('items.product') permet de récupérer les détails (nom, prix, image) du maillot associé
    const cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
    if (!cart) return res.status(200).json({ items: [] });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération panier", error: error.message });
  }
});

// @route   POST /api/carts/add
// @desc    Ajouter ou incrémenter un produit dans le panier
router.post('/add', async (req, res) => {
  try {
    const { user, product, quantity, selectedSize } = req.body;
    let cart = await Cart.findOne({ user });

    if (!cart) {
      // Si le panier n'existe pas encore pour ce client, on le génère
      cart = new Cart({ user, items: [{ product, quantity, selectedSize }] });
    } else {
      // Si le panier existe, on vérifie si l'article avec la MÊME TAILLE y est déjà
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === product && item.selectedSize === selectedSize
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product, quantity, selectedSize });
      }
    }

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: "Impossible d'ajouter au panier", error: error.message });
  }
});

// @route   DELETE /api/carts/clear/:userId
// @desc    Vider intégralement le panier d'un utilisateur (généralement après validation de la commande)
router.delete('/clear/:userId', async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.params.userId });
    res.status(200).json({ message: "Panier vidé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du panier", error: error.message });
  }
});

module.exports = router;