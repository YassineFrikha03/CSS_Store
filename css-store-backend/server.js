const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// 1. Importation de toutes les routes de l'API REST
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const passport = require('passport');

// Initialisation de l'application Express
const app = express();

// Connexion à MongoDB
connectDB();

// =========================================================================
// ⚙️ MIDDLEWARES GLOBAUX (ordre important !)
// =========================================================================
// 🔓 CORS en premier — autoriser le frontend React et les redirections OAuth
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// 🛂 Passport — uniquement initialize() car on utilise des JWT (session: false)
require('./config/passport');
app.use(passport.initialize());

// =========================================================================
// 🧼 NETTOYAGE CONSOLE : INTERCEPTION DES REQUÊTES INTERNES DE CHROME
// =========================================================================
app.get('/com.chrome.devtools.json', (req, res) => {
  res.status(204).end();
});

app.use('/.well-known', (req, res) => {
  res.status(204).end();
});

// =========================================================================
// 🌐 BRANCHEMENT ET ACTIVATION DE TOUS LES ENDPOINTS DE L'API
// =========================================================================
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

// Route principale de test
app.get('/', (req, res) => {
  res.send('API CSS Store opérationnelle et routes chargées. 🖤🤍');
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur le port ${PORT}`);
});