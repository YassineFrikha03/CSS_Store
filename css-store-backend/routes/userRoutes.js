const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const passport = require('passport'); // Requis pour l'authentification sociale
const User = require('../models/User');

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
// 👤 1. ENDPOINT : RÉCUPÉRER LE PROFIL CONNECTÉ (GET /api/users/me)
// =========================================================================
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // On récupère l'ID décodé par le middleware et on exclut le mot de passe haché
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "Supporter introuvable." });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("❌ Erreur /me :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération du profil." });
  }
});

// =========================================================================
// 🔐 2. ENDPOINT : CONNEXION STANDARD (POST /api/users/login)
// =========================================================================
router.post('/login', async (req, res) => {
  try {
    const identifier = req.body.identifier || req.body.email;
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Veuillez remplir tous les champs." });
    }

    const searchIdentifier = identifier.toLowerCase().trim();
    const user = await User.findOne({ 
      $or: [
        { email: searchIdentifier },
        { phoneNumber: identifier.trim() }
      ] 
    });
    
    if (!user) {
      return res.status(400).json({ message: "Identifiants invalides." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Identifiants invalides." });
    }

    // VÉRIFICATION FACEID
    if (user.hasFaceId) {
      // Si l'utilisateur a configuré FaceID, on ne le connecte pas tout de suite
      return res.status(200).json({
        requireFaceId: true,
        userId: user._id,
        message: "Scan facial requis pour terminer la connexion."
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'votre_cle_secrete_css',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("❌ Erreur lors de la connexion backend :", error);
    return res.status(500).json({ message: "Une erreur interne est survenue lors de la connexion." });
  }
});

// =========================================================================
// 🆕 3. ENDPOINT : INSCRIPTION (POST /api/users/register)
// =========================================================================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phoneNumber, shippingAddress, hasFaceId, faceDescriptor } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "L'adresse e-mail et le mot de passe sont obligatoires." });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ message: "Un compte existe déjà avec cette adresse e-mail." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phoneNumber,
      shippingAddress,
      hasFaceId: hasFaceId || false,
      faceDescriptor: faceDescriptor || [],
      role: 'supporter'
    });

    await newUser.save();
    return res.status(201).json({ message: "Compte supporter créé avec succès ! 🖤🤍" });

  } catch (error) {
    console.error("❌ Erreur lors de l'inscription :", error);
    return res.status(500).json({ message: "Une erreur interne est survenue lors de l'inscription." });
  }
});

// =========================================================================
// 📸 3.5 ENDPOINT : VÉRIFICATION FACEID (POST /api/users/verify-face)
// =========================================================================
router.post('/verify-face', async (req, res) => {
  try {
    const { userId, faceDescriptor } = req.body;

    if (!faceDescriptor || faceDescriptor.length === 0) {
      return res.status(400).json({ message: "Veuillez fournir vos données faciales." });
    }

    let user = null;

    if (userId) {
      // Cas 1 : Connexion après saisie email/mot de passe
      user = await User.findById(userId);
      if (!user || !user.hasFaceId || !user.faceDescriptor || user.faceDescriptor.length === 0) {
        return res.status(400).json({ message: "Cet utilisateur n'a pas configuré FaceID." });
      }

      let distance = 0;
      for (let i = 0; i < user.faceDescriptor.length; i++) {
        distance += Math.pow(user.faceDescriptor[i] - faceDescriptor[i], 2);
      }
      distance = Math.sqrt(distance);

      if (distance > 0.6) {
        return res.status(401).json({ message: "Reconnaissance faciale échouée. Visage non reconnu." });
      }
    } else {
      // Cas 2 : Connexion directe avec FaceID (comparaison globale)
      const users = await User.find({ hasFaceId: true });
      let bestMatch = null;
      let minDistance = 0.6; // Seuil de tolérance

      for (const u of users) {
        if (!u.faceDescriptor || u.faceDescriptor.length === 0) continue;
        let distance = 0;
        for (let i = 0; i < u.faceDescriptor.length; i++) {
          distance += Math.pow(u.faceDescriptor[i] - faceDescriptor[i], 2);
        }
        distance = Math.sqrt(distance);

        if (distance < minDistance) {
          minDistance = distance;
          bestMatch = u;
        }
      }

      if (bestMatch) {
        user = bestMatch;
      } else {
        return res.status(401).json({ message: "Reconnaissance faciale échouée. Aucun visage correspondant trouvé." });
      }
    }

    // Visage reconnu : on connecte l'utilisateur
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'votre_cle_secrete_css',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("❌ Erreur lors de la vérification FaceID :", error);
    return res.status(500).json({ message: "Erreur serveur lors de l'analyse biométrique." });
  }
});

// =========================================================================
// 📨 4. ENDPOINT : MOT DE PASSE OUBLIÉ (POST /api/users/forgot-password)
// =========================================================================
router.post('/forgot-password', async (req, res) => {
  try {
    const identifier = req.body.identifier || req.body.email;

    if (!identifier) {
      return res.status(400).json({ message: "L'identifiant (e-mail ou téléphone) est obligatoire." });
    }

    const searchIdentifier = identifier.toLowerCase().trim();
    const user = await User.findOne({
      $or: [
        { email: searchIdentifier },
        { phoneNumber: identifier.trim() }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "Aucun compte associé à cet identifiant." });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Si c'est un numéro de téléphone qui a été entré (pas l'email)
    if (identifier.trim() !== user.email && user.phoneNumber === identifier.trim()) {
      // 📱 SIMULATION D'ENVOI SMS
      console.log(`\n\n=== 📱 SMS SIMULÉ POUR ${user.phoneNumber} ===`);
      console.log(`Club Sportif Sfaxien : Vous avez demandé la réinitialisation de votre mot de passe.`);
      console.log(`Cliquez sur ce lien sécurisé pour le changer : ${resetUrl}`);
      console.log(`====================================================\n\n`);
      
      return res.status(200).json({ 
        message: "Un message de sécurité vous a été envoyé par SMS ! 📱",
        simulatedSmsLink: resetUrl 
      });
    }

    // Sinon on envoie un e-mail classiquement
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const mailOptions = {
      from: `"CSS Store 🖤🤍" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe - Club Sportif Sfaxien',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="text-transform: uppercase; color: #000; border-bottom: 2px solid #000; padding-bottom: 10px; font-weight: 900;">Club Sportif Sfaxien</h2>
          <p>Bonjour <strong>${user.name || 'Cher Supporter'}</strong>,</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe sur la boutique officielle du CSS.</p>
          <p>Veuillez cliquer sur le bouton ci-dessous pour configurer vos nouveaux identifiants :</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${resetUrl}" style="background-color: #000; color: #fff; text-decoration: none; padding: 14px 28px; font-weight: bold; text-transform: uppercase; display: inline-block;">Réinitialiser mon mot de passe</a>
          </div>
          <p style="font-size: 11px; color: #666; border-top: 1px solid #f1f1f1; padding-top: 15px; margin-top: 25px;">
            Ce lien est valide pendant 1 heure. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.
          </p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: "Un e-mail de récupération vous a été envoyé ! 📩" });
    } catch (mailError) {
      console.error("❌ Erreur Nodemailer :", mailError);
      return res.status(500).json({ message: "Le serveur a rencontré un problème pour envoyer l'e-mail." });
    }

  } catch (error) {
    console.error("❌ Erreur forgot-password :", error);
    return res.status(500).json({ message: "Une erreur interne est survenue." });
  }
});

// =========================================================================
// 🔄 5. ENDPOINT : RESET PASSWORD VALIDATION (POST /api/users/reset-password/:token)
// =========================================================================
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Le jeton de récupération est invalide ou a expiré." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Votre mot de passe a été réinitialisé avec succès ! 🖤🤍" });

  } catch (error) {
    console.error("❌ Erreur lors du reset-password :", error);
    return res.status(500).json({ message: "Une erreur interne est survenue lors de la réinitialisation." });
  }
});

// =========================================================================
// 🌐 6. ENDPOINTS PASSPORT.JS : OAUTH GOOGLE
// =========================================================================
router.get('/auth/google', (req, res, next) => {
  try {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  } catch (err) {
    console.error('❌ Erreur Google OAuth:', err);
    return res.status(503).json({ message: 'La connexion Google n\'est pas configurée. Veuillez ajouter GOOGLE_CLIENT_ID dans le .env' });
  }
});

router.get('/auth/google/callback',
  (req, res, next) => {
    passport.authenticate('google', {
      failureRedirect: 'http://localhost:5173/login?error=google_failed',
      session: false
    })(req, res, next);
  },
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET || 'votre_cle_secrete_css',
      { expiresIn: '7d' }
    );
    res.redirect(`http://localhost:5173/login/success?token=${token}`);
  }
);

// =========================================================================
// 🔵 7. ENDPOINTS PASSPORT.JS : OAUTH FACEBOOK
// =========================================================================
router.get('/auth/facebook', (req, res, next) => {
  try {
    passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
  } catch (err) {
    console.error('❌ Erreur Facebook OAuth:', err);
    return res.status(503).json({ message: 'La connexion Facebook n\'est pas configurée. Veuillez ajouter FACEBOOK_APP_ID dans le .env' });
  }
});

router.get('/auth/facebook/callback',
  (req, res, next) => {
    passport.authenticate('facebook', {
      failureRedirect: 'http://localhost:5173/login?error=facebook_failed',
      session: false
    })(req, res, next);
  },
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET || 'votre_cle_secrete_css',
      { expiresIn: '7d' }
    );
    res.redirect(`http://localhost:5173/login/success?token=${token}`);
  }
);

// =========================================================================
// 👥 8. ENDPOINT : RECUPERER TOUS LES UTILISATEURS (GET /api/users)
// =========================================================================
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: error.message });
  }
});

// =========================================================================
// 🔄 9. ENDPOINT : MODIFIER LE ROLE (PUT /api/users/:id/role)
// =========================================================================
router.put('/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { role }, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la modification du rôle", error: error.message });
  }
});

// =========================================================================
// ❌ 10. ENDPOINT : SUPPRIMER UN UTILISATEUR (DELETE /api/users/:id)
// =========================================================================
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.status(200).json({ message: "Compte utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error: error.message });
  }
});

module.exports = router;