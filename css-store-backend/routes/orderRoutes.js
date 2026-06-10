const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// @route   GET /api/orders
// @desc    Récupérer toutes les commandes mondiales du store (Vue Admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.product');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération commandes", error: error.message });
  }
});

// @route   GET /api/orders/id/:id
// @desc    Suivre et analyser une commande spécifique via son ID unique
router.get('/id/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: "Commande introuvable" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Erreur interne", error: error.message });
  }
});

// @route   GET /api/orders/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('user', 'name').sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Erreur", error: error.message });
  }
});

// @route   POST /api/orders/checkout
// @desc    Valider l'achat et créer une nouvelle commande
router.post('/checkout', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: "Échec du passage de la commande", error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // Renvoie le document modifié
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la commande", error: error.message });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Supprimer une commande définitivement (Vue Admin)
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Commande introuvable" });
    }
    res.status(200).json({ message: "Commande supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la commande", error: error.message });
  }
});

module.exports = router;