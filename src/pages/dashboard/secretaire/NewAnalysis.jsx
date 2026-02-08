import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../utils/axios";
import {
  FaSave,
  FaTimes,
  FaSpinner,
  FaMoneyBillWave,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

export default function NewAnalysis() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedPatientId = searchParams.get("patient");
  const preSelectedVisitId = searchParams.get("visit");

  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    patient: preSelectedPatientId || "",
    visit: preSelectedVisitId || "",
    doctor: "",
    category: "Laboratoire",
    items: [],
    priority: "Normal",
    discountPercentage: 0,
    paidAmount: 0,
    paymentMethod: "especes",
  });

  // Formulaire pour ajouter une analyse manuelle
  const [newItem, setNewItem] = useState({
    name: "",
    price: 0,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [patientsRes, doctorsRes] = await Promise.all([
        api.get("/patients"),
        api.get("/doctors"),
      ]);

      setPatients(patientsRes.data.data || []);
      setDoctors(doctorsRes.data.data || []);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const addAnalysisItem = () => {
    if (!newItem.name.trim()) {
      alert("Nom de l'analyse requis");
      return;
    }

    if (newItem.price <= 0) {
      alert("Prix invalide");
      return;
    }

    const exists = formData.items.find(
      (i) => i.name.toLowerCase() === newItem.name.toLowerCase(),
    );
    if (exists) {
      alert("Cette analyse est déjà ajoutée");
      return;
    }

    setFormData({
      ...formData,
      items: [...formData.items, { ...newItem }],
    });

    // Réinitialiser le formulaire
    setNewItem({ name: "", price: 0 });
  };

  const removeAnalysisItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const totalPrice = formData.items.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = (totalPrice * formData.discountPercentage) / 100;
  const finalAmount = totalPrice - discountAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.items.length === 0) {
      alert("Ajoutez au moins une analyse");
      setLoading(false);
      return;
    }

    if (formData.paidAmount < finalAmount) {
      alert(`Le paiement doit être complet. Montant dû: ${finalAmount} FC`);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        paidAmount: finalAmount,
      };

      await api.post("/analysis", payload);
      alert("Analyse prescrite avec succès !");

      if (preSelectedVisitId) {
        navigate(`/dashboard/visites/${preSelectedVisitId}`);
      } else {
        navigate("/dashboard/analyses");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert(error.response?.data?.message || "Erreur lors de la création");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Prescrire une Analyse
        </h2>
        <p className="text-gray-600 mt-1">
          Créer une prescription d'analyses avec paiement
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations générales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informations Générales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient *
              </label>
              <select
                value={formData.patient}
                onChange={(e) =>
                  setFormData({ ...formData, patient: e.target.value })
                }
                required
                disabled={!!preSelectedPatientId}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              >
                <option value="">-- Choisir un patient --</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.patientNumber} - {patient.fullname}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Médecin prescripteur
              </label>
              <select
                value={formData.doctor}
                onChange={(e) =>
                  setFormData({ ...formData, doctor: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              >
                <option value="">-- Optionnel --</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.fullname}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              >
                <option value="Laboratoire">Laboratoire</option>
                <option value="Imagerie">Imagerie</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorité
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ajouter une Analyse
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'analyse
              </label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                placeholder="Ex: NFS, Glycémie, Échographie..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAnalysisItem();
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (FC)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={addAnalysisItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Analyses ajoutées */}
        {formData.items.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Analyses Prescrites ({formData.items.length})
            </h3>
            <div className="space-y-2">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-900">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">
                      {item.price} FC
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAnalysisItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paiement */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaMoneyBillWave className="text-green-600" />
            Paiement (Obligatoire)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Réduction (%)
              </label>
              <input
                type="number"
                value={formData.discountPercentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountPercentage: parseFloat(e.target.value) || 0,
                  })
                }
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Méthode de paiement *
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData({ ...formData, paymentMethod: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              >
                <option value="especes">Espèces</option>
                <option value="mobile_money">Mobile Money</option>
              </select>
            </div>
          </div>

          {/* Résumé */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Total analyses:</span>
                <span className="font-medium">{totalPrice} FC</span>
              </div>
              {formData.discountPercentage > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Réduction ({formData.discountPercentage}%):</span>
                  <span className="font-medium">
                    -{discountAmount.toFixed(0)} FC
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-blue-300">
                <span className="font-semibold text-gray-900">
                  Montant à payer:
                </span>
                <span className="font-bold text-blue-600 text-lg">
                  {finalAmount.toFixed(0)} FC
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            disabled={loading}
          >
            <FaTimes />
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || formData.items.length === 0}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Prescription...</span>
              </>
            ) : (
              <>
                <FaSave />
                <span>Prescrire l'Analyse</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
