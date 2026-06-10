const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Rappelle-toi des URLs configurées dans ton AuthModal.jsx
router.post('/register', registerUser);
router.post('/login', loginUser);

const router = require('express').Router();
const passport = require('passport');

// 🌐 Route de déclenchement Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// ↩️ Callback Google (Où l'utilisateur est renvoyé après validation)
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Connexion réussie : On redirige vers le Front-end en passant le Token JWT dans l'URL
    const token = generateToken(req.user);
    res.redirect(`http://localhost:5173/login-success?token=${token}`);
  }
);

// =========================================================================
// 📩 ENDPOINT : MOT DE PASSE OUBLIÉ
// =========================================================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Vérifier si l'utilisateur existe en base de données
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Aucun compte associé à cette adresse e-mail." });
    }

    // 2. Générer un jeton (token) temporaire de récupération sécurisé
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // On sauvegarde le token et sa date d'expiration (ex: 1 heure) dans le modèle User
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure en millisecondes
    await user.save();

    // 3. Configuration du transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Tu peux utiliser Gmail, Outlook, ou Mailtrap pour tes tests
      auth: {
        user: process.env.EMAIL_USER, // Ton adresse e-mail dans ton fichier .env
        pass: process.env.EMAIL_PASS  // Ton mot de passe d'application ou secret .env
      }
    });

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // 4. Contenu de l'e-mail officiel CSS Store
    const mailOptions = {
      from: `"CSS Store 🖤🤍" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe - Club Sportif Sfaxien',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="text-transform: uppercase; color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">Club Sportif Sfaxien</h2>
          <p>Bonjour ${user.name || 'Cher Supporter'},</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe sur la boutique officielle du CSS.</p>
          <p>Veuillez cliquer sur le bouton ci-dessous pour configurer un nouveau mot de passe (ce lien est valide pendant 1 heure) :</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${resetUrl}" style="background-color: #000; color: #fff; text-decoration: none; padding: 12px 24px; font-weight: bold; uppercase; display: inline-block;">Réinitialiser mon mot de passe</a>
          </div>
          <p style="font-size: 11px; color: #666;">Si vous n'avez pas demandé cette action, vous pouvez ignorer cet e-mail en toute sécurité.</p>
        </div>
      `
    };

    // 5. Envoi effectif de l'e-mail
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Un e-mail de récupération contenant les instructions vous a été envoyé !" });

  } catch (error) {
    console.error("Erreur forgot-password backend:", error);
    res.status(500).json({ message: "Une erreur interne est survenue lors de l'envoi de l'e-mail." });
  }
});

module.exports = router;

module.exports = router;