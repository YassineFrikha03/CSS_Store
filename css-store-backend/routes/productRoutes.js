const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// =========================================================================
// 👕 1. RÉCUPÉRER TOUS LES PRODUITS (Filtres optionnels : catégorie, recherche, vedettes)
// =========================================================================
// @route   GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (featured) query.isFeatured = featured === 'true';
    if (search) query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des produits", error: error.message });
  }
});

// =========================================================================
// 🔍 2. RÉCUPÉRER UN PRODUIT UNIQUE PAR SON ID
// =========================================================================
// @route   GET /api/products/id/:id
router.get('/id/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit introuvable" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la récupération du produit", error: error.message });
  }
});

// =========================================================================
// ➕ 3. AJOUTER UN NOUVEL ARTICLE (Espace AdminStock.jsx)
// =========================================================================
// @route   POST /api/products
router.post('/', async (req, res) => {
  try {
    // 🟢 On extrait bien 'description' du corps de la requête HTTP
    const { name, category, price, stock, imageUrl, description, isFeatured } = req.body;
    
    const newProduct = new Product({
      name,
      category,
      price,
      stock,
      imageUrl,
      // On met une valeur de secours au cas où le front-end envoie un champ vide
      description: description || "Produit officiel du Club Sportif Sfaxien.", 
      isFeatured: isFeatured || false
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: "Impossible d'ajouter le produit au catalogue", error: error.message });
  }
});

// =========================================================================
// 🛠️ 4. MODIFIER UN ARTICLE (Prix, Stock...)
// =========================================================================
// @route   PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: "Produit introuvable" });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la modification du produit", error: error.message });
  }
});

// =========================================================================
// ❌ 5. SUPPRIMER UN ARTICLE DU CATALOGUE (Espace AdminStock.jsx)
// =========================================================================
// @route   DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Produit introuvable" });
    res.status(200).json({ message: "Produit supprimé du catalogue avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du produit", error: error.message });
  }
});

module.exports = router;