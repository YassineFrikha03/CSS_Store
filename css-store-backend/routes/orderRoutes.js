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
// @desc    Récupérer l'historique complet des commandes d'un supporter spécifique
router.get('/', async (req, res) => {
  try {
    // ⚡ Le .populate('user', 'name') va chercher le 'name' dans la collection Users grâce à l'ID
    const orders = await Order.find({})
      .populate('user', 'name') 
      .sort({ createdAt: -1 });
      
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des commandes", error: error.message });
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
module.exports = router;