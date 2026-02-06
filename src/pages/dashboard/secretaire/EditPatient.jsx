import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../utils/axios";
import { FaSave, FaTimes, FaSpinner } from "react-icons/fa";

export default function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    fullname: "",
    dateOfBirth: "",
    gender: "M",
    nationality: "Comorien",
    phone: "",
    email: "",
    address: "",
    city: "",
    bloodGroup: "inconnu",
    allergies: [],
    chronicDiseases: [],
    emergencyContact: {
      fullname: "",
      phone: "",
      relationship: "",
    },
    origin: "local",
    status: "actif",
  });

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await api.get(`/patients/${id}`);
      const patient = response.data.patient;

      setFormData({
        fullname: patient.fullname || "",
        dateOfBirth: patient.dateOfBirth?.split("T")[0] || "",
        gender: patient.gender || "M",
        nationality: patient.nationality || "Comorien",
        phone: patient.phone || "",
        email: patient.email || "",
        address: patient.address || "",
        city: patient.city || "",
        bloodGroup: patient.bloodGroup || "inconnu",
        allergies: patient.allergies || [],
        chronicDiseases: patient.chronicDiseases || [],
        emergencyContact: patient.emergencyContact || {
          fullname: "",
          phone: "",
          relationship: "",
        },
        origin: patient.origin || "local",
        status: patient.status || "actif",
      });

      setFetching(false);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du chargement du patient");
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/patients/${id}`, formData);
      alert("Patient modifié avec succès !");
      navigate(`/dashboard/patients/${id}`);
    } catch (error) {
      console.error("Erreur:", error);
      alert(error.response?.data?.message || "Erreur lors de la modification");
      setLoading(false);
    }
  };

  const handleArrayInput = (field, value) => {
    const array = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    setFormData({ ...formData, [field]: array });
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Modifier Patient</h2>
        <p className="text-gray-600 mt-1">
          Mettre à jour les informations du patient
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="space-y-6">
          {/* Informations personnelles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informations Personnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de naissance *
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="décédé">Décédé</option>
                </select>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/patients/${id}`)}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              disabled={loading}
            >
              <FaTimes />
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Enregistrer les modifications</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
