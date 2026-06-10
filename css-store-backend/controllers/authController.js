const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Génération du token d'accès JWT (Valable 30 jours)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'CSS_SECRET_KEY_2026', {
    expiresIn: '30d',
  });
};

// 📝 1. INSCRIPTION (Register)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, shippingAddress } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Veuillez remplir tous les champs obligatoires" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Cet e-mail est déjà associé à un compte" });
    }

    // Hachage sécurisé du mot de passe avec bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const cleanShippingAddress = {
      street: shippingAddress?.street || '',
      city: shippingAddress?.city || '',
      postalCode: shippingAddress?.postalCode || '',
      country: shippingAddress?.country || 'Tunisia'
    };

    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      phoneNumber: phoneNumber || '', 
      shippingAddress: cleanShippingAddress 
    });

    const savedUser = await newUser.save();
    
    res.status(201).json({
      message: "Compte créé avec succès",
      token: generateToken(savedUser._id),
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    console.error("❌ Erreur Register :", error);
    res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
  }
};

// =========================================================================
// 🔓 2. CONNEXION (Login)
// =========================================================================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Veuillez fournir un e-mail et un mot de passe" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Vérification du mot de passe haché
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    res.status(200).json({ 
      message: "Connexion réussie", 
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, 
        phoneNumber: user.phoneNumber,
        shippingAddress: user.shippingAddress
      }
    });
  } catch (error) {
    console.error("❌ Erreur Login :", error);
    res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
  }
};

// ⚡ On exporte proprement les deux fonctions pour qu'elles soient lisibles dans userRoutes.js
module.exports = {
  registerUser,
  loginUser
};