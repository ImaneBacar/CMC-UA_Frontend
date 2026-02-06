import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../../utils/axios";
import {
  FaArrowLeft,
  FaUser,
  FaUserMd,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaSpinner,
  FaEdit,
  FaCheckCircle,
} from "react-icons/fa";

export default function VisitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitDetails();
  }, [id]);

  const fetchVisitDetails = async () => {
    try {
      const response = await api.get(`/visits/${id}`);
      console.log("Visite détail:", response.data);
      setVisit(response.data.visit || response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du chargement de la visite");
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "en attente de consultation":
      case "en attente":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "en consultation":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "terminé":
        return "bg-green-100 text-green-700 border-green-300";
      case "annulé":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Visite non trouvée</p>
        <Link to="/dashboard/visites" className="text-blue-600 hover:underline">
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/visites")}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Détail de la Visite
            </h2>
            <p className="text-gray-600">N° {visit.visitNumber}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <span
            className={`px-4 py-2 rounded-lg border ${getStatusColor(visit.status)}`}
          >
            {visit.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations générales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informations de la Visite
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Date et heure</label>
                <p className="font-medium text-gray-900">
                  {new Date(visit.visitDate).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(visit.visitDate).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Type de visite</label>
                <p className="font-medium text-gray-900 capitalize">
                  {visit.visitType}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Priorité</label>
                <p className="font-medium text-gray-900 capitalize">
                  {visit.priority}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Spécialité</label>
                <p className="font-medium text-gray-900 capitalize">
                  {visit.speciality?.name || "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-500">
                Motif de la visite
              </label>
              <p className="mt-1 text-gray-900">{visit.visitReason}</p>
            </div>
          </div>

          {/* Prescriptions */}
          {visit.prescriptions && visit.prescriptions.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Prescriptions
              </h3>
              <div className="space-y-2">
                {visit.prescriptions.map((prescription, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Prescription #{index + 1}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analyses */}
          {visit.analyses && visit.analyses.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Analyses Demandées
              </h3>
              <div className="space-y-2">
                {visit.analyses.map((analysis, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Analyse #{index + 1}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Patient */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaUser className="text-blue-600" />
              Patient
            </h3>

            {visit.patient ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium text-gray-900">
                    {visit.patient.fullname}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">N° Patient</p>
                  <p className="font-medium text-gray-900">
                    {visit.patient.patientNumber || "N/A"}
                  </p>
                </div>
                {visit.patient.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium text-gray-900">
                      {visit.patient.phone}
                    </p>
                  </div>
                )}
                <Link
                  to={`/dashboard/patients/${visit.patient._id || visit.patient.id}`}
                  className="block mt-4 text-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                >
                  Voir le dossier
                </Link>
              </div>
            ) : (
              <p className="text-red-500 text-sm">⚠️ Patient non disponible</p>
            )}
          </div>

          {/* Médecin */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaUserMd className="text-green-600" />
              Médecin
            </h3>

            <div>
              <p className="text-sm text-gray-500">Praticien</p>
              <p className="font-medium text-gray-900">
                Dr. {visit.doctor?.fullname || "N/A"}
              </p>
            </div>
          </div>

          {/* Paiement */}
          {visit.payment && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaMoneyBillWave className="text-yellow-600" />
                Paiement
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">N° Paiement</span>
                  <span className="font-medium text-gray-900">
                    {visit.payment.paymentNumber}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Montant total</span>
                  <span className="font-medium text-gray-900">
                    {visit.payment.totalAmount} FC
                  </span>
                </div>

                {visit.payment.hasDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm">
                      Réduction ({visit.payment.discountPercentage}%)
                    </span>
                    <span className="font-medium">
                      -{visit.payment.discountAmount} FC
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-sm font-semibold text-gray-900">
                    Montant payé
                  </span>
                  <span className="font-bold text-blue-600">
                    {visit.payment.finalAmount} FC
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Méthode</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {visit.payment.paymentMethod === "especes"
                      ? "Espèces"
                      : visit.payment.paymentMethod}
                  </span>
                </div>

                <div className="mt-3">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                      visit.payment.status === "paye"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {visit.payment.status === "paye" && <FaCheckCircle />}
                    {visit.payment.status === "paye"
                      ? "Payé"
                      : visit.payment.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
