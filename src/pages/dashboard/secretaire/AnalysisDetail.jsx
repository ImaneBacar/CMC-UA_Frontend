import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../../utils/axios";
import {
  FaArrowLeft,
  FaUser,
  FaUserMd,
  FaFlask,
  FaMoneyBillWave,
  FaSpinner,
  FaFileDownload,
  FaCheckCircle,
} from "react-icons/fa";

export default function AnalysisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalysisDetails = useCallback(async () => {
    try {
      const response = await api.get(`/analyses/${id}`);
      console.log("Analyse détail:", response.data);
      setAnalysis(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du chargement de l'analyse");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAnalysisDetails();
  }, [fetchAnalysisDetails]);

  const getStatusColor = (status) => {
    switch (status) {
      case "en attente":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "en cours":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "terminé":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "validé":
        return "bg-green-100 text-green-700 border-green-300";
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

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Analyse non trouvée</p>
        <Link
          to="/dashboard/analyses"
          className="text-blue-600 hover:underline"
        >
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
            onClick={() => navigate("/dashboard/analyses")}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Détail de l'Analyse
            </h2>
            <p className="text-gray-600">N° {analysis.analysisNumber}</p>
          </div>
        </div>

        <span
          className={`px-4 py-2 rounded-lg border ${getStatusColor(analysis.status)}`}
        >
          {analysis.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations générales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informations Générales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">
                  Date de prescription
                </label>
                <p className="font-medium text-gray-900">
                  {new Date(analysis.prescriptionDate).toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Catégorie</label>
                <p className="font-medium text-gray-900">{analysis.category}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Priorité</label>
                <p
                  className={`font-medium ${
                    analysis.priority === "Urgent"
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  {analysis.priority}
                </p>
              </div>

              {analysis.processingDate && (
                <div>
                  <label className="text-sm text-gray-500">
                    Date de traitement
                  </label>
                  <p className="font-medium text-gray-900">
                    {new Date(analysis.processingDate).toLocaleDateString(
                      "fr-FR",
                    )}
                  </p>
                </div>
              )}

              {analysis.resultDate && (
                <div>
                  <label className="text-sm text-gray-500">
                    Date des résultats
                  </label>
                  <p className="font-medium text-gray-900">
                    {new Date(analysis.resultDate).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              )}

              {analysis.validationDate && (
                <div>
                  <label className="text-sm text-gray-500">
                    Date de validation
                  </label>
                  <p className="font-medium text-gray-900">
                    {new Date(analysis.validationDate).toLocaleDateString(
                      "fr-FR",
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Analyses demandées */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Analyses Demandées ({analysis.items?.length || 0})
            </h3>
            <div className="space-y-3">
              {analysis.items && analysis.items.length > 0 ? (
                analysis.items.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.value && (
                          <p className="text-sm text-gray-600 mt-1">
                            Résultat:{" "}
                            <span className="font-medium">{item.value}</span>
                          </p>
                        )}
                        {item.interpretation && (
                          <p className="text-sm text-gray-600 mt-1">
                            Interprétation: {item.interpretation}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-gray-500 mt-1">
                            Notes: {item.notes}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-medium text-blue-600 ml-4">
                        {item.price} FC
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Aucune analyse</p>
              )}
            </div>
          </div>

          {/* Commentaires */}
          {(analysis.technicianComment || analysis.doctorComment) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Commentaires
              </h3>
              {analysis.technicianComment && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Commentaire du laborantin:
                  </p>
                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    {analysis.technicianComment}
                  </p>
                </div>
              )}
              {analysis.doctorComment && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Commentaire du médecin:
                  </p>
                  <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                    {analysis.doctorComment}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Fichier PDF/Word */}
          {analysis.pdfResult && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Résultats (Fichier)
              </h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {analysis.pdfResult.originalName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Téléchargé le{" "}
                    {new Date(analysis.pdfResult.uploadedAt).toLocaleDateString(
                      "fr-FR",
                    )}
                  </p>
                </div>
                <a
                  href={`http://localhost:5014/api/analyses/${analysis._id}/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <FaFileDownload />
                  Télécharger
                </a>
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

            {analysis.patient ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium text-gray-900">
                    {analysis.patient.fullname}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">N° Patient</p>
                  <p className="font-medium text-gray-900">
                    {analysis.patient.patientNumber || "N/A"}
                  </p>
                </div>
                <Link
                  to={`/dashboard/patients/${analysis.patient._id}`}
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
          {analysis.doctor && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaUserMd className="text-green-600" />
                Médecin Prescripteur
              </h3>

              <div>
                <p className="text-sm text-gray-500">Praticien</p>
                <p className="font-medium text-gray-900">
                  Dr. {analysis.doctor.fullname}
                </p>
              </div>
            </div>
          )}

          {/* Laborantin */}
          {analysis.technician && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaFlask className="text-purple-600" />
                Laborantin
              </h3>

              <div>
                <p className="text-sm text-gray-500">Technicien</p>
                <p className="font-medium text-gray-900">
                  {analysis.technician.fullname}
                </p>
              </div>
            </div>
          )}

          {/* Paiement */}
          {analysis.payment && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaMoneyBillWave className="text-yellow-600" />
                Paiement
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Montant total</span>
                  <span className="font-medium text-gray-900">
                    {analysis.payment.totalAmount} FC
                  </span>
                </div>

                {analysis.payment.hasDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm">
                      Réduction ({analysis.payment.discountPercentage}%)
                    </span>
                    <span className="font-medium">
                      -{analysis.payment.discountAmount} FC
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-sm font-semibold text-gray-900">
                    Montant payé
                  </span>
                  <span className="font-bold text-blue-600">
                    {analysis.payment.finalAmount} FC
                  </span>
                </div>

                <div className="mt-3">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                      analysis.payment.status === "paye"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {analysis.payment.status === "paye" && <FaCheckCircle />}
                    {analysis.payment.status === "paye"
                      ? "Payé"
                      : analysis.payment.status}
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
