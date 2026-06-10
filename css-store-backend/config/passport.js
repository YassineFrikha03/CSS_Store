const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

// =========================================================================
// 🌐 Stratégie Google OAuth2
// =========================================================================
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.startsWith('votre_')) {
  passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/users/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email: email.toLowerCase().trim() });

        if (user) return done(null, user);

        user = new User({
          name: profile.displayName,
          email: email.toLowerCase().trim(),
          password: 'OAuthAccount_NoPasswordRequired',
          role: 'supporter'
        });

        await user.save();
        return done(null, user);

      } catch (err) {
        return done(err, null);
      }
    }
  ));
  console.log('✅ Stratégie Google activée');
} else {
  console.warn('⚠️  GOOGLE_CLIENT_ID non configuré — connexion Google désactivée. Ajoutez vos clés dans le fichier .env');
}

// =========================================================================
// 🔵 Stratégie Facebook OAuth2
// =========================================================================
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

if (FACEBOOK_APP_ID && !FACEBOOK_APP_ID.startsWith('votre_')) {
  passport.use(new FacebookStrategy({
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:5000/api/users/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails', 'name']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = (profile.emails && profile.emails[0] && profile.emails[0].value)
          ? profile.emails[0].value
          : `${profile.id}@facebook.com`;

        let user = await User.findOne({ email: email.toLowerCase().trim() });

        if (user) return done(null, user);

        user = new User({
          name: profile.displayName || (profile.name ? `${profile.name.givenName} ${profile.name.familyName}` : 'Supporter Facebook'),
          email: email.toLowerCase().trim(),
          password: 'OAuthAccount_NoPasswordRequired',
          role: 'supporter'
        });

        await user.save();
        return done(null, user);

      } catch (err) {
        return done(err, null);
      }
    }
  ));
  console.log('✅ Stratégie Facebook activée');
} else {
  console.warn('⚠️  FACEBOOK_APP_ID non configuré — connexion Facebook désactivée. Ajoutez vos clés dans le fichier .env');
}

// Requis par Passport même si on utilise des tokens JWT
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, { id }));