import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../utils/axios";
import {
  FaSave,
  FaTimes,
  FaSpinner,
  FaSearch,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function NewVisit() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedPatientId = searchParams.get("patient");

  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [formData, setFormData] = useState({
    patient: preSelectedPatientId || "",
    speciality: "",
    doctor: "",
    visitReason: "",
    visitType: "consultation",
    priority: "normal",
    totalAmount: 7500,
    discountPercentage: 0,
    paidAmount: 0,
    paymentMethod: "especes",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (formData.speciality) {
      filterDoctorsBySpeciality(formData.speciality);
    } else {
      setFilteredDoctors(doctors);
    }
  }, [formData.speciality, doctors]);

  useEffect(() => {
    calculateFinalAmount();
  }, [formData.totalAmount, formData.discountPercentage]);

  useEffect(() => {
    if (preSelectedPatientId && patients.length > 0) {
      const patient = patients.find((p) => p._id === preSelectedPatientId);
      if (patient) {
        console.log("Patient pré-sélectionné:", patient.fullname);
      }
    }
  }, [preSelectedPatientId, patients]);

  const fetchInitialData = async () => {
    try {
      const [patientsRes, specialitiesRes, doctorsRes] = await Promise.all([
        api.get("/patients"),
        api.get("/specialities"),
        api.get("/doctors"),
      ]);

      console.log("Données reçues:", {
        patients: patientsRes.data.data?.length,
        specialities: specialitiesRes.data.data?.length,
        doctors: doctorsRes.data.data?.length,
      });

      setPatients(patientsRes.data.data || []);
      setSpecialities(
        specialitiesRes.data.data?.filter((s) => s.isActive) || [],
      );
      setDoctors(doctorsRes.data.data || []);
      setFilteredDoctors(doctorsRes.data.data || []);
    } catch (error) {
      console.error("Erreur complète:", error);
      alert("Erreur chargement données");
    }
  };
  const filterDoctorsBySpeciality = (specialityId) => {
    const filtered = doctors.filter((doctor) =>
      doctor.speciality?.some((spec) => spec._id === specialityId),
    );
    setFilteredDoctors(filtered);
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
      const response = await api.post("/visit", formData);
      alert("Visite créée avec succès !");
      navigate(`/dashboard/visites`);
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
        <h2 className="text-2xl font-bold text-gray-900">Nouvelle Visite</h2>
        <p className="text-gray-600 mt-1">
          Enregistrer une nouvelle visite avec paiement
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="space-y-6">
          {/* Informations patient */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Patient
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner le patient *
              </label>
              <select
                value={formData.patient}
                onChange={(e) =>
                  setFormData({ ...formData, patient: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="">-- Choisir un patient --</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.patientNumber} - {patient.fullname}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Informations visite */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Détails de la Visite
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spécialité *
                </label>
                <select
                  value={formData.speciality}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      speciality: e.target.value,
                      doctor: "",
                    })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent capitalize"
                >
                  <option value="">-- Choisir une spécialité --</option>
                  {specialities.map((spec) => (
                    <option key={spec._id} value={spec._id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Médecin *
                </label>
                <select
                  value={formData.doctor}
                  onChange={(e) =>
                    setFormData({ ...formData, doctor: e.target.value })
                  }
                  required
                  disabled={!formData.speciality}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">-- Choisir un médecin --</option>
                  {filteredDoctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.fullname}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motif de la visite *
                </label>
                <textarea
                  value={formData.visitReason}
                  onChange={(e) =>
                    setFormData({ ...formData, visitReason: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Ex: Consultation pour douleurs abdominales"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de visite *
                </label>
                <select
                  value={formData.visitType}
                  onChange={(e) =>
                    setFormData({ ...formData, visitType: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="consultation">Consultation</option>
                  <option value="urgence">Urgence</option>
                  <option value="suivi">Suivi</option>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="normal">Normale</option>
                  <option value="urgent">Urgent</option>
                  <option value="critique">Critique</option>
                </select>
              </div>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
              onClick={() => navigate("/dashboard/visites")}
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
                  <span>Créer la Visite</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
