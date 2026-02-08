import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../utils/axios";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
  FaFileAlt,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";

export default function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPatientDetails = useCallback(async () => {
    try {
      const response = await api.get(`/patients/${id}`);
      setPatient(response.data.patient);
      setMedicalRecord(response.data.medicalRecord);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement patient:", error);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPatientDetails();
  }, [fetchPatientDetails]);

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Patient non trouvé</p>
        <Link
          to="/dashboard/patients"
          className="text-blue-600 hover:underline mt-4 inline-block"
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
          <Link
            to="/dashboard/patients"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FaArrowLeft className="text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {patient.fullname}
            </h2>
            <p className="text-gray-600">N° {patient.patientNumber}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/dashboard/visites/new?patient=${patient._id}`}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaCalendarAlt />
            Nouvelle Visite
          </Link>
          <Link
            to={`/dashboard/patients/${patient._id}/edit`}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            <FaEdit />
            Modifier
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche - Infos patient */}
        <div className="lg:col-span-1 space-y-6">
          {/* Carte principale */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUser className="text-4xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {patient.fullname}
              </h3>
              <p className="text-gray-600">
                {calculateAge(patient.dateOfBirth)} ans •{" "}
                {patient.gender === "M" ? "Masculin" : "Féminin"}
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <FaPhone className="text-blue-600" />
                <span>{patient.phone}</span>
              </div>
              {patient.email && (
                <div className="flex items-center gap-3 text-gray-600">
                  <FaEnvelope className="text-blue-600" />
                  <span>{patient.email}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-gray-600">
                <FaMapMarkerAlt className="text-blue-600" />
                <span>{patient.address || "Adresse non renseignée"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <FaCalendarAlt className="text-blue-600" />
                <span>
                  Né(e) le{" "}
                  {new Date(patient.dateOfBirth).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
          </div>

          {/* Infos médicales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Informations Médicales
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Groupe sanguin</p>
                <p className="font-medium text-gray-900">
                  {patient.bloodGroup || "Inconnu"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Allergies</p>
                {patient.allergies && patient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {patient.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Aucune</p>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-xs">Maladies chroniques</p>
                {patient.chronicDiseases &&
                patient.chronicDiseases.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {patient.chronicDiseases.map((disease, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs"
                      >
                        {disease}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Aucune</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact d'urgence */}
          {patient.emergencyContact && patient.emergencyContact.phone && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Contact d'Urgence
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-gray-900">
                  {patient.emergencyContact.fullname}
                </p>
                <p className="text-gray-600">
                  {patient.emergencyContact.phone}
                </p>
                <p className="text-gray-500 text-xs">
                  {patient.emergencyContact.relationship}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Colonne droite - Historique */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dossier médical */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaFileAlt className="text-blue-600" />
              Dossier Médical
            </h3>
            {medicalRecord ? (
              <div className="space-y-4">
                {medicalRecord.medicalHistory && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Antécédents médicaux
                    </p>
                    <p className="text-sm text-gray-600">
                      {medicalRecord.medicalHistory}
                    </p>
                  </div>
                )}
                {medicalRecord.surgicalHistory && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Antécédents chirurgicaux
                    </p>
                    <p className="text-sm text-gray-600">
                      {medicalRecord.surgicalHistory}
                    </p>
                  </div>
                )}
                {!medicalRecord.medicalHistory &&
                  !medicalRecord.surgicalHistory && (
                    <p className="text-sm text-gray-400">
                      Aucun antécédent enregistré
                    </p>
                  )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                Dossier médical non disponible
              </p>
            )}
          </div>

          {/* Historique visites */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Historique des Visites
            </h3>
            {medicalRecord?.visits && medicalRecord.visits.length > 0 ? (
              <div className="space-y-3">
                {medicalRecord.visits.slice(0, 5).map((visit) => (
                  <div key={visit._id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {visit.visitReason}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(visit.visitDate).toLocaleDateString(
                            "fr-FR",
                          )}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          visit.status === "terminé"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {visit.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Aucune visite enregistrée</p>
            )}
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Actions Rapides
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to={`/dashboard/visites/new?patient=${patient._id}`}
                className="p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-center"
              >
                <FaCalendarAlt className="mx-auto mb-2" size={20} />
                <p className="text-sm font-medium">Nouvelle Visite</p>
              </Link>
              <Link
                to={`/dashboard/analyses/new?patient=${patient._id}`}
                className="p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-center"
              >
                <FaFileAlt className="mx-auto mb-2" size={20} />
                <p className="text-sm font-medium">Nouvelle Analyse</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
