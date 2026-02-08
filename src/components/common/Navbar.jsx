import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaPhone,
  FaWhatsapp,
  FaLock,
  FaUser,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Utiliser le contexte d'authentification
  const { user, isAuthenticated, logout, currentRole } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { path: "/", label: "Accueil" },
    { path: "/urologie", label: "Urologie" },
    { path: "/laboratoire", label: "Laboratoire" },
    { path: "/a-propos", label: "À Propos" },
    { path: "/equipe", label: "Équipe" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        {/* Bande supérieure (contacts) */}
        <div className="bg-primary text-white py-2">
          <div className="container-custom flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <a
                href="tel:+269333XXXX"
                className="flex items-center gap-2 hover:text-primary-200 transition"
              >
                <FaPhone size={14} />
                <span className="hidden sm:inline">+269 XX XX XX</span>
              </a>

              <a
                href="https://wa.me/269XXXXXXX"
                className="flex items-center gap-2 hover:text-primary-200 transition"
              >
                <FaWhatsapp size={16} />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
            <div className="text-xs hidden md:block">
              Urgences 24/7 : +269 XX XX XX
            </div>
          </div>
        </div>

        {/* Menu principal */}
        <div className="container-custom">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">CMC</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">
                  Clinique CMC-UA
                </h1>
                <p className="text-xs text-gray-600">
                  Excellence en Soins Médicaux
                </p>
              </div>
            </Link>

            {/* Menu Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-primary-50 hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Boutons CTA Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              {!isAuthenticated ? (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <FaLock size={16} />
                  <span>Espace Pro</span>
                </button>
              ) : (
                // Si connecté : Avatar avec menu dropdown
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <FaUser className="text-white" size={14} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-700 text-sm">
                        {user?.fullname}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {currentRole}
                      </p>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition rounded-t-lg"
                    >
                      <FaTachometerAlt className="text-primary" />
                      <span>Mon Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition text-red-600 rounded-b-lg"
                    >
                      <FaSignOutAlt />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}

              <Link to="/contact" className="btn btn-primary">
                Prendre RDV
              </Link>
            </div>

            {/* Bouton Menu Mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-gray-700 hover:text-primary transition"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Menu Mobile */}
          {isOpen && (
            <div className="lg:hidden pb-4">
              {/*  BOUTON ESPACE PRO */}
              {!isAuthenticated ? (
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 mb-3 px-4 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition"
                >
                  <FaLock size={16} />
                  <span>Espace Professionnel</span>
                </button>
              ) : (
                <div className="mb-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <FaUser className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {user?.fullname}
                      </p>
                      <p className="text-xs text-gray-600 capitalize">
                        {currentRole}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 bg-primary text-white rounded-lg text-center mb-2 hover:bg-primary-600 transition"
                  >
                    Mon Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg text-center hover:bg-red-200 transition"
                  >
                    Déconnexion
                  </button>
                </div>
              )}

              {/* Séparateur */}
              <div className="border-t border-gray-200 mb-3"></div>

              {/* Liens de navigation */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive(link.path)
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-primary-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-4 px-4">
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-primary w-full justify-center"
                >
                  Prendre RDV
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* MODAL DE CONNEXION */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
