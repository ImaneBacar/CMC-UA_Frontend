import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaTachometerAlt,
  FaUsers,
  FaStethoscope,
  FaCog,
  FaChartBar,
  FaUserMd,
  FaFlask,
  FaMoneyBillWave,
  FaCalendarAlt,
} from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const { currentRole } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Menus selon le rôle
  const menusByRole = {
    admin: [
      { path: "/dashboard", icon: FaTachometerAlt, label: "Tableau de bord" },
      { path: "/dashboard/users", icon: FaUsers, label: "Utilisateurs" },
      {
        path: "/dashboard/specialities",
        icon: FaStethoscope,
        label: "Spécialités",
      },
      { path: "/dashboard/stats", icon: FaChartBar, label: "Statistiques" },

      { path: "/dashboard/settings", icon: FaCog, label: "Paramètres" },
    ],
    medecin: [
      { path: "/dashboard", icon: FaTachometerAlt, label: "Tableau de bord" },
      { path: "/dashboard/patients", icon: FaUsers, label: "Patients" },
      {
        path: "/dashboard/consultations",
        icon: FaUserMd,
        label: "Consultations",
      },
      { path: "/dashboard/analyses", icon: FaFlask, label: "Analyses" },

      {
        path: "/dashboard/operations",
        icon: FaStethoscope,
        label: "Opérations",
      },
      { path: "/dashboard/settings", icon: FaCog, label: "Paramètres" },
    ],
    secretaire: [
      { path: "/dashboard", icon: FaTachometerAlt, label: "Tableau de bord" },
      { path: "/dashboard/patients", icon: FaUsers, label: "Patients" },
      { path: "/dashboard/visites", icon: FaCalendarAlt, label: "Visites" },
      { path: "/dashboard/analyses", icon: FaFlask, label: "Analyses" }, // ← AJOUTER

      {
        path: "/dashboard/operations",
        icon: FaStethoscope,
        label: "Opérations",
      },

      {
        path: "/dashboard/paiements",
        icon: FaMoneyBillWave,
        label: "Paiements",
      },
      { path: "/dashboard/settings", icon: FaCog, label: "Paramètres" },
    ],
    laborantin: [
      { path: "/dashboard", icon: FaTachometerAlt, label: "Tableau de bord" },
      { path: "/dashboard/analyses", icon: FaFlask, label: "Analyses" },

      { path: "/dashboard/settings", icon: FaCog, label: "Paramètres" },
    ],
    comptable: [
      { path: "/dashboard", icon: FaTachometerAlt, label: "Tableau de bord" },
      { path: "/dashboard/recettes", icon: FaMoneyBillWave, label: "Recettes" },
      { path: "/dashboard/dettes", icon: FaChartBar, label: "Dettes" },
      { path: "/dashboard/settings", icon: FaCog, label: "Paramètres" },
    ],
  };

  const menuItems = menusByRole[currentRole] || menusByRole.admin;

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">CMC</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">CMC-UA</h2>
            <p className="text-xs text-gray-400 capitalize">{currentRole}</p>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Retour au site */}
      <div className="p-4 border-t border-gray-700">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition"
        >
          ← Retour au site
        </Link>
      </div>
    </div>
  );
}
