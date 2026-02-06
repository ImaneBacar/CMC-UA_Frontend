import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../utils/axios";
import { FaSave, FaTimes, FaSpinner, FaMoneyBillWave } from "react-icons/fa";

export default function NewOperation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedPatientId = searchParams.get("patient");

  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    patient: preSelectedPatientId || "",
    surgeon: "",
    operationType: "",
    scheduledDate: "",
    scheduledTime: "",
    estimatedDuration: 60,
    equipment: "",
    preOpNotes: "",
    totalAmount: 50000,
    discountPercentage: 0,
    paidAmount: 0,
    paymentMethod: "especes",
  });

  // Types d'opérations urologiques
  const operationTypes = [
    "Résection bipolaire (TURP)",
    "Lithotripsie urétérale",
    "Urétéro-résectoscopie",
    "Urétéroscopie (R. WOLF)",
    "Urétéroscopie (KARL STORZ)",
    "Urétro-cystoscopie rigide",
    "Urétro-cystoscopie flexible",
    "Urétrotomie interne",
    "Hystéroscopie",
    "Urétéroscopie pédiatrique",
    "Urétro-cystoscopie pédiatrique",
    "Urétrotomie interne pédiatrique",
  ];

  const equipments = [
    "R. WOLF",
    "KARL STORZ",
    "Résectoscope bipolaire",
    "Lithotripteur",
    "Cystoscope flexible",
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    calculateFinalAmount();
  }, [formData.totalAmount, formData.discountPercentage]);

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
      alert("Erreur chargement données");
    }
  };

  const calculateFinalAmount = () => {
    const discount = (formData.totalAmount * formData.discountPercentage) / 100;
    const finalAmount = formData.totalAmount - discount;
    setFormData((prev) => ({ ...prev, paidAmount: finalAmount }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Vérifier que le paiement est complet
    const finalAmount =
      formData.totalAmount -
      (formData.totalAmount * formData.discountPercentage) / 100;
    if (formData.paidAmount < finalAmount) {
      alert(`Le paiement doit être complet. Montant dû: ${finalAmount} FC`);
      setLoading(false);
      return;
    }

    try {
      // Combiner date et heure
      const scheduledDateTime = new Date(
        `${formData.scheduledDate}T${formData.scheduledTime}`,
      );

      const payload = {
        ...formData,
        scheduledDate: scheduledDateTime,
      };

      await api.post("/operations", payload);
      alert("Opération programmée avec succès !");
      navigate("/dashboard/operations");
    } catch (error) {
      console.error("Erreur:", error);
      alert(error.response?.data?.message || "Erreur lors de la création");
      setLoading(false);
    }
  };

  const finalAmount =
    formData.totalAmount -
    (formData.totalAmount * formData.discountPercentage) / 100;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Programmer une Opération
        </h2>
        <p className="text-gray-600 mt-1">
          Planifier une intervention chirurgicale avec paiement
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="space-y-6">
          {/* Patient & Chirurgien */}
          <div>
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
                  Chirurgien *
                </label>
                <select
                  value={formData.surgeon}
                  onChange={(e) =>
                    setFormData({ ...formData, surgeon: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">-- Choisir un chirurgien --</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.fullname}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Détails opération */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Détails de l'Opération
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'opération *
                </label>
                <select
                  value={formData.operationType}
                  onChange={(e) =>
                    setFormData({ ...formData, operationType: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">-- Choisir le type --</option>
                  {operationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Équipement
                </label>
                <select
                  value={formData.equipment}
                  onChange={(e) =>
                    setFormData({ ...formData, equipment: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">-- Choisir l'équipement --</option>
                  {equipments.map((equip) => (
                    <option key={equip} value={equip}>
                      {equip}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date prévue *
                </label>
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledDate: e.target.value })
                  }
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure prévue *
                </label>
                <input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledTime: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée estimée (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.estimatedDuration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedDuration: parseInt(e.target.value),
                    })
                  }
                  required
                  min="15"
                  step="15"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes pré-opératoires
              </label>
              <textarea
                value={formData.preOpNotes}
                onChange={(e) =>
                  setFormData({ ...formData, preOpNotes: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                placeholder="Instructions spéciales, précautions..."
              />
            </div>
          </div>

          {/* Paiement */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaMoneyBillWave className="text-green-600" />
              Paiement (Obligatoire)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant total (FC) *
                </label>
                <input
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

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

            {/* Résumé paiement */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Montant total:</span>
                  <span className="font-medium">{formData.totalAmount} FC</span>
                </div>
                {formData.discountPercentage > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction ({formData.discountPercentage}%):</span>
                    <span className="font-medium">
                      -
                      {(
                        (formData.totalAmount * formData.discountPercentage) /
                        100
                      ).toFixed(0)}{" "}
                      FC
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
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/dashboard/operations")}
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
                  <span>Programmation...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Programmer l'Opération</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
