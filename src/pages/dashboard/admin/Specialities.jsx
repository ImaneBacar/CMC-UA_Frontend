import { useEffect, useState } from "react";
import api from "../../../utils/axios"; // ← Import de l'instance configurée
import {
  FaPlus,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaSpinner,
} from "react-icons/fa";

export default function Specialities() {
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSpeciality, setEditingSpeciality] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchSpecialities();
  }, []);

  const fetchSpecialities = async () => {
    try {
      const response = await api.get("/specialities"); // ← Utilise 'api'
      setSpecialities(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement spécialités:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSpeciality) {
        await api.patch(`/specialities/${editingSpeciality._id}`, formData);
        alert("Spécialité modifiée avec succès !");
      } else {
        await api.post("/speciality", formData); // ← Token envoyé automatiquement
        alert("Spécialité créée avec succès !");
      }
      fetchSpecialities();
      closeModal();
    } catch (error) {
      console.error("Erreur:", error);
      alert(error.response?.data?.message || "Erreur lors de l'opération");
    }
  };

  const toggleStatus = async (specialityId) => {
    try {
      await api.put(`/speciality/${specialityId}/status`);
      alert("Statut modifié !");
      fetchSpecialities();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la modification du statut");
    }
  };

  const openModal = (speciality = null) => {
    if (speciality) {
      setEditingSpeciality(speciality);
      setFormData({
        name: speciality.name,
        description: speciality.description || "",
      });
    } else {
      setEditingSpeciality(null);
      setFormData({
        name: "",
        description: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSpeciality(null);
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
            Gestion des Spécialités
          </h2>
          <p className="text-gray-600 mt-1">
            {specialities.length} spécialité(s) total
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus />
          Nouvelle Spécialité
        </button>
      </div>

      {/* Cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialities.map((speciality) => (
          <div
            key={speciality._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {speciality.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {speciality.description || "Aucune description"}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  speciality.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {speciality.isActive ? "Actif" : "Inactif"}
              </span>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => openModal(speciality)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm"
              >
                <FaEdit />
                Modifier
              </button>
              <button
                onClick={() => toggleStatus(speciality._id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition text-sm ${
                  speciality.isActive
                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {speciality.isActive ? <FaToggleOn /> : <FaToggleOff />}
                {speciality.isActive ? "Désactiver" : "Activer"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingSpeciality ? "Modifier" : "Nouvelle"} Spécialité
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la spécialité *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent capitalize"
                  placeholder="Ex: cardiologie"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Description de la spécialité..."
                />
              </div>

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
                  {editingSpeciality ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
