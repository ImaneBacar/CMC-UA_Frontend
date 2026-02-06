import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/axios";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaEye,
  FaSpinner,
  FaFilter,
} from "react-icons/fa";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchTerm, filterStatus, patients]);

  const fetchPatients = async () => {
    try {
      const response = await api.get("/patients");
      console.log("Patients reçus:", response.data); // Debug
      setPatients(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement patients:", error);
      alert("Erreur lors du chargement des patients");
      setLoading(false);
    }
  };

  const filterPatients = () => {
    let filtered = [...patients];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.patientNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.phone?.includes(searchTerm),
      );
    }

    // Filtre par statut
    if (filterStatus !== "all") {
      filtered = filtered.filter((p) => p.status === filterStatus);
    }

    setFilteredPatients(filtered);
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
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

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gestion des Patients
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredPatients.length} patient(s)
          </p>
        </div>
        <Link
          to="/dashboard/patients/new"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus />
          Nouveau Patient
        </Link>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recherche */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, numéro ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Filtre statut */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="décédé">Décédé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  N° Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Âge / Genre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Téléphone
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
              {filteredPatients.map((patient) => (
                <tr key={patient._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">
                    {patient.patientNumber}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {patient.fullname}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {calculateAge(patient.dateOfBirth)} ans • {patient.gender}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {patient.phone}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        patient.status === "actif"
                          ? "bg-green-100 text-green-700"
                          : patient.status === "inactif"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Link
                        to={`/dashboard/patients/${patient._id}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="Voir détails"
                      >
                        <FaEye size={18} />
                      </Link>
                      <Link
                        to={`/dashboard/patients/${patient._id}/edit`}
                        className="text-green-600 hover:text-green-800"
                        title="Modifier"
                      >
                        <FaEdit size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun patient trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
