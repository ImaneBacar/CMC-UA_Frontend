import { useEffect, useState } from "react";
import api from "../../../utils/axios";
import {
  FaPlus,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaSpinner,
} from "react-icons/fa";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: [],
    phone: "",
    speciality: [],
  });

  useEffect(() => {
    fetchUsers();
    fetchSpecialities();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users"); // ← Utilise 'api'
      setUsers(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error);
      setLoading(false);
    }
  };

  const fetchSpecialities = async () => {
    try {
      const response = await api.get("/specialities"); // ← Utilise 'api'
      setSpecialities(response.data.data || []);
    } catch (error) {
      console.error("Erreur chargement spécialités:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Mise à jour
        await api.patch(`/users/${editingUser._id}/role`, formData);
        alert("Utilisateur modifié avec succès !");
      } else {
        // Création
        await api.post("/register", formData); // ← Utilise 'api'
        alert("Utilisateur créé avec succès !");
      }
      fetchUsers();
      closeModal();
    } catch (error) {
      console.error("Erreur:", error);
      alert(error.response?.data?.message || "Erreur lors de l'opération");
    }
  };

  const toggleStatus = async (userId) => {
    try {
      await api.put(`/users/${userId}/status`); // ← Utilise 'api'
      alert("Statut modifié !");
      fetchUsers();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la modification du statut");
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        fullname: user.fullname,
        email: user.email,
        password: "",
        role: user.role,
        phone: user.phone || "",
        speciality: user.speciality?.map((s) => s._id) || [],
      });
    } else {
      setEditingUser(null);
      setFormData({
        fullname: "",
        email: "",
        password: "",
        role: [],
        phone: "",
        speciality: [],
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleRoleChange = (role) => {
    const newRoles = formData.role.includes(role)
      ? formData.role.filter((r) => r !== role)
      : [...formData.role, role];
    setFormData({ ...formData, role: newRoles });
  };

  const handleSpecialityChange = (specialityId) => {
    const newSpecialities = formData.speciality.includes(specialityId)
      ? formData.speciality.filter((s) => s !== specialityId)
      : [...formData.speciality, specialityId];
    setFormData({ ...formData, speciality: newSpecialities });
  };

  const roleLabels = {
    admin: "Administrateur",
    medecin: "Médecin",
    secretaire: "Secrétaire",
    laborantin: "Laborantin",
    comptable: "Comptable",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gestion des Utilisateurs
          </h2>
          <p className="text-gray-600 mt-1">
            {users.length} utilisateur(s) total
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus />
          Nouvel Utilisateur
        </button>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Rôle(s)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Spécialité(s)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {user.fullname}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-wrap gap-1">
                    {user.role.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                      >
                        {roleLabels[role]}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.speciality && user.speciality.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {user.speciality.map((spec) => (
                        <span
                          key={spec._id}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs capitalize"
                        >
                          {spec.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isActive ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(user)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Modifier"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => toggleStatus(user._id)}
                      className={
                        user.isActive ? "text-green-600" : "text-gray-400"
                      }
                      title="Activer/Désactiver"
                    >
                      {user.isActive ? (
                        <FaToggleOn size={18} />
                      ) : (
                        <FaToggleOff size={18} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingUser ? "Modifier" : "Nouvel"} Utilisateur
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nom complet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={formData.fullname}
                  onChange={(e) =>
                    setFormData({ ...formData, fullname: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              {/* Mot de passe */}
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              )}

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              {/* Rôles */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle(s) *
                </label>
                <div className="space-y-2">
                  {Object.entries(roleLabels).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.role.includes(key)}
                        onChange={() => handleRoleChange(key)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Spécialités (si médecin) */}
              {formData.role.includes("medecin") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spécialité(s) * (obligatoire pour médecin)
                  </label>
                  <div className="space-y-2">
                    {specialities
                      .filter((s) => s.isActive)
                      .map((spec) => (
                        <label
                          key={spec._id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.speciality.includes(spec._id)}
                            onChange={() => handleSpecialityChange(spec._id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                          />
                          <span className="text-sm text-gray-700 capitalize">
                            {spec.name}
                          </span>
                        </label>
                      ))}
                  </div>
                </div>
              )}

              {/* Boutons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingUser ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
