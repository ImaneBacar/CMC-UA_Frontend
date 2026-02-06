import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Contenu principal */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Colonne 1 : À propos */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">AK</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">
                  Clinique CMC-UA
                </h3>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Excellence en urologie et analyses médicales. Soins de qualité
              avec équipements modernes.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://wa.me/269XXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition"
              >
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>

          {/* Colonne 2 : Liens rapides */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">
              Liens Rapides
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-primary transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/urologie"
                  className="text-sm hover:text-primary transition"
                >
                  Urologie
                </Link>
              </li>
              <li>
                <Link
                  to="/laboratoire"
                  className="text-sm hover:text-primary transition"
                >
                  Laboratoire
                </Link>
              </li>
              <li>
                <Link
                  to="/a-propos"
                  className="text-sm hover:text-primary transition"
                >
                  À Propos
                </Link>
              </li>
              <li>
                <Link
                  to="/equipe"
                  className="text-sm hover:text-primary transition"
                >
                  Notre Équipe
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm hover:text-primary transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Services */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">
              Nos Services
            </h4>
            <ul className="space-y-2 text-sm">
              <li>• Résection Bipolaire</li>
              <li>• Lithotripsie</li>
              <li>• Urétéroscopie</li>
              <li>• Cystoscopie</li>
              <li>• Analyses Laboratoire</li>
              <li>• Consultations</li>
            </ul>
          </div>

          {/* Colonne 4 : Contact */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                <span>
                  Route de l'Aéroport
                  <br />
                  Moroni, Grande Comore
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <FaPhone className="text-primary" />
                <a
                  href="tel:+269333XXXX"
                  className="hover:text-primary transition"
                >
                  +269 333 XX XX
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <FaPhone className="text-accent" />
                <a
                  href="tel:+269777XXXX"
                  className="hover:text-accent transition"
                >
                  Urgences: +269 777 XX XX
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <FaEnvelope className="text-primary" />
                <a
                  href="mailto:contact@clinique-alkamar.com"
                  className="hover:text-primary transition"
                >
                  contact@clinique-alkamar.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <FaClock className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <p>Lun-Sam: 8h-13h</p>
                  <p>Dim: 8h-13h</p>
                  <p className="text-accent">Urgences 24/7</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barre du bas */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© {currentYear} Clinique CMC-UA. Tous droits réservés.</p>
            <div className="flex gap-6">
              <Link
                to="/mentions-legales"
                className="hover:text-primary transition"
              >
                Mentions Légales
              </Link>
              <Link
                to="/politique-confidentialite"
                className="hover:text-primary transition"
              >
                Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
