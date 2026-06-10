import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";

// Importation des composants globaux
import Navbar from "./components/Navbar";
import CartSidebar from "./components/CartSidebar";
import AuthModal from "./components/AuthModal";
import Footer from "./components/Footer";

// Importation des pages
import HomePage from "./pages/HomePage";
import MaillotsPage from "./pages/MaillotsPage";
import AccessoiresPage from "./pages/AccessoiresPage";
import PromotionsPage from "./pages/PromotionsPage";
import ContactPage from "./pages/ContactPage";
import AProposPage from "./pages/AProposPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProductDetails from "./pages/ProductDetails";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import LoginSuccess from './pages/LoginSuccess';
import ProtectedRoute from "./components/ProtectedRoute";
import ClientDashboard from "./pages/ClientDashboard";

function AppContent() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="bg-white min-h-screen text-black antialiased relative flex flex-col justify-between">
      {/* 🟢 Maintenant la Navbar est BIEN à l'intérieur du Provider (appelé dans App) */}
      {!isAdmin && <Navbar onOpenAuth={() => setIsAuthOpen(true)} />}

      {/* Zone de routage dynamique */}
      <main className={`${isAdmin ? '' : 'pt-[140px]'} flex-grow`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/textiles" element={<MaillotsPage />} />
          <Route path="/accessoires" element={<AccessoiresPage />} />
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/a-propos" element={<AProposPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/products/id/:id" element={<ProductDetails />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/login/success" element={<LoginSuccess />} />
          <Route path="/profile" element={<ClientDashboard />} />
        </Routes>
      </main>

      {/* Tiroirs globaux */}
      {!isAdmin && <CartSidebar />}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Le Footer unique global */}
      {!isAdmin && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <CartProvider>
          {/* AppContent hérite maintenant de TOUS les contextes sans exception */}
          <AppContent />
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;