const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Review = require('../models/Review');
const Product = require('../models/Product');

// =========================================================================
// 🛡️ MIDDLEWARE DE SÉCURITÉ (VÉRIFICATION DU TOKEN JWT)
// =========================================================================
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Accès refusé. Aucun jeton fourni." });
  }

  const token = authHeader.split(' ')[1];
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'votre_cle_secrete_css');
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Jeton de sécurité invalide." });
  }
};

// =========================================================================
// 🛡️ MIDDLEWARE ADMIN
// =========================================================================
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Accès refusé. Réservé aux administrateurs." });
  }
};

// =========================================================================
// 📝 1. SOUMETTRE UN AVIS (POST /api/reviews/:productId)
// =========================================================================
router.post('/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: "La note et le commentaire sont obligatoires." });
    }

    // Créer le nouvel avis en attente d'approbation
    const review = new Review({
      product: productId,
      user: req.user.id,
      rating: Number(rating),
      comment,
      status: 'pending' // En attente de validation admin
    });

    await review.save();
    return res.status(201).json({ message: "Votre avis a été soumis avec succès. Il sera publié après validation par un administrateur." });
  } catch (error) {
    console.error("Erreur POST /api/reviews :", error);
    return res.status(500).json({ message: "Erreur lors de la soumission de l'avis." });
  }
});

// =========================================================================
// 📖 2. RÉCUPÉRER LES AVIS APPROUVÉS POUR UN PRODUIT (GET /api/reviews/product/:productId)
// =========================================================================
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await Review.find({ product: productId, status: 'approved' })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Erreur GET /api/reviews/product :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des avis." });
  }
});

// =========================================================================
// 🌟 2.5 RÉCUPÉRER TOUS LES AVIS APPROUVÉS GLOBAUX (GET /api/reviews/all/approved)
// =========================================================================
router.get('/all/approved', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' })
      .populate('user', 'name')
      .populate('product', 'name imageUrl')
      .sort({ createdAt: -1 })
      .limit(10); // Limiter aux 10 derniers avis pour la page d'accueil

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Erreur GET /api/reviews/all/approved :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des avis globaux." });
  }
});

// =========================================================================
// 👮‍♂️ 3. RÉCUPÉRER TOUS LES AVIS EN ATTENTE (GET /api/reviews/admin/pending)
// =========================================================================
router.get('/admin/pending', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'pending' })
      .populate('user', 'name email')
      .populate('product', 'name imageUrl')
      .sort({ createdAt: -1 });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Erreur GET /api/reviews/admin/pending :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des avis en attente." });
  }
});

// =========================================================================
// ⚖️ 4. APPROUVER OU REJETER UN AVIS (PUT /api/reviews/admin/:reviewId)
// =========================================================================
router.put('/admin/:reviewId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body; // 'approved' ou 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Statut invalide." });
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { status },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Avis introuvable." });
    }

    return res.status(200).json({ message: `L'avis a été ${status === 'approved' ? 'approuvé' : 'rejeté'} avec succès.` });
  } catch (error) {
    console.error("Erreur PUT /api/reviews/admin :", error);
    return res.status(500).json({ message: "Erreur lors du traitement de l'avis." });
  }
});

// =========================================================================
// ❌ 5. SUPPRIMER UN AVIS (DELETE /api/reviews/admin/:reviewId)
// =========================================================================
router.delete('/admin/:reviewId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Avis introuvable." });
    }

    return res.status(200).json({ message: "Avis supprimé avec succès." });
  } catch (error) {
    console.error("Erreur DELETE /api/reviews/admin :", error);
    return res.status(500).json({ message: "Erreur lors de la suppression de l'avis." });
  }
});

module.exports = router;
