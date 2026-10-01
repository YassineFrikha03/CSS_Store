# CSS Store 🛒

Bienvenue sur le dépôt du projet **CSS Store**, une plateforme d'e-commerce full-stack moderne.

## 🚀 Présentation

CSS Store est une application web complète qui permet aux utilisateurs de naviguer parmi des produits, de gérer leur panier, et de passer des commandes. L'application intègre également un tableau de bord administrateur pour gérer le magasin, ainsi que des fonctionnalités avancées (comme la reconnaissance faciale avec `face-api.js` et l'authentification OAuth).

## 🛠️ Technologies utilisées

### Frontend (Dossier `css-store-frontend`)
* **React 19** avec **Vite** pour des performances optimales.
* **Tailwind CSS 4** pour le style et un design responsive.
* **React Router Dom** pour la navigation.
* **Axios** pour les requêtes HTTP.
* **Recharts** pour les graphiques du tableau de bord d'administration.
* **Face-api.js** / **React Webcam** pour les fonctionnalités de détection faciale.
* **Lucide React** pour les icônes.

### Backend (Dossier `css-store-backend`)
* **Node.js** & **Express.js** pour l'API REST.
* **MongoDB** (avec **Mongoose**) pour la base de données.
* **JSON Web Tokens (JWT)** & **Passport.js** (Google & Facebook) pour l'authentification sécurisée.
* **Bcryptjs** pour le hachage des mots de passe.
* **Nodemailer** pour l'envoi d'emails.

## ⚙️ Prérequis

Avant de commencer, assurez-vous d'avoir installé :
* [Node.js](https://nodejs.org/) (version 18+ recommandée)
* [MongoDB](https://www.mongodb.com/) (en local ou via MongoDB Atlas)

## 📦 Installation et Lancement

### 1. Configuration du Backend

1. Naviguez dans le dossier du backend :
   ```bash
   cd css-store-backend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Créez un fichier `.env` à la racine de `css-store-backend` en vous basant sur le fichier `.env.example` et ajoutez vos variables d'environnement (Port, URI MongoDB, secrets JWT, clés OAuth, etc.).
4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
   *Le serveur démarrera (par défaut sur le port 5000 ou celui défini dans votre .env).*

### 2. Configuration du Frontend

1. Naviguez dans le dossier du frontend depuis la racine du projet :
   ```bash
   cd css-store-frontend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez l'application en mode développement :
   ```bash
   npm run dev
   ```
   *L'application sera accessible sur `http://localhost:5173`.*

## 📂 Structure du projet

* `/css-store-backend` : Contient toute la logique de l'API, les modèles de base de données, les routes et l'authentification.
* `/css-store-frontend` : Contient l'interface utilisateur, les composants React, et la logique client.
