import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUser, FaSignOutAlt, FaBell, FaChevronDown } from "react-icons/fa";

export default function Topbar() {
  const { user, logout, currentRole, switchRole } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSwitchRole = (newRole) => {
    switchRole(newRole);
    setShowRoleMenu(false);
    navigate("/dashboard");
  };

  const roleLabels = {
    admin: "Administration",
    medecin: "Médecin",
    secretaire: "Secrétaire",
    laborantin: "Laborantin",
    comptable: "Comptable",
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Titre de la page */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard {roleLabels[currentRole]}
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Changement de rôle (si plusieurs rôles) */}
          {user?.role?.length > 1 && (
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {currentRole}
                </span>
                <FaChevronDown size={12} className="text-gray-500" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                  {user.role.map((role) => (
                    <button
                      key={role}
                      onClick={() => handleSwitchRole(role)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition ${
                        role === currentRole
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      {role === currentRole && "✓ "}
                      {roleLabels[role]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
            <FaBell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Menu utilisateur */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <FaUser className="text-white" size={16} />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.fullname}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <FaChevronDown size={12} className="text-gray-500" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullname}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition"
                >
                  <FaSignOutAlt />
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
