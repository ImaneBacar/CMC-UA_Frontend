import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/axios";
import {
  FaPlus,
  FaSearch,
  FaEye,
  FaSpinner,
  FaFilter,
  FaFlask,
} from "react-icons/fa";

export default function Analyses() {
  const [analyses, setAnalyses] = useState([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    fetchAnalyses();
  }, []);

  useEffect(() => {
    filterAnalyses();
  }, [searchTerm, filterStatus, filterCategory, analyses]);

  const fetchAnalyses = async () => {
    try {
      const response = await api.get("/analyses");
      console.log("Analyses reçues:", response.data);
      setAnalyses(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur chargement analyses");
      setLoading(false);
    }
  };

  const filterAnalyses = () => {
    let filtered = [...analyses];

    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          a.patient?.fullname
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          a.analysisNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((a) => a.status === filterStatus);
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((a) => a.category === filterCategory);
    }

    setFilteredAnalyses(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "en attente":
        return "bg-yellow-100 text-yellow-700";
      case "en cours":
        return "bg-blue-100 text-blue-700";
      case "terminé":
        return "bg-purple-100 text-purple-700";
      case "validé":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "text-red-600 font-semibold";
      default:
        return "text-gray-600";
    }
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
            Gestion des Analyses
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredAnalyses.length} analyse(s)
          </p>
        </div>
        <Link
          to="/dashboard/analyses/new"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus />
          Prescrire une Analyse
        </Link>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher patient ou n° analyse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 appearance-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="en attente">En attente</option>
              <option value="en cours">En cours</option>
              <option value="terminé">Terminé</option>
              <option value="validé">Validé</option>
            </select>
          </div>

          <div className="relative">
            <FaFlask className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 appearance-none"
            >
              <option value="all">Toutes les catégories</option>
              <option value="Laboratoire">Laboratoire</option>
              <option value="Imagerie">Imagerie</option>
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
                  N° Analyse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre d'analyses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Priorité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Montant
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
              {filteredAnalyses.map((analysis) => (
                <tr key={analysis._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">
                    {analysis.analysisNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(analysis.prescriptionDate).toLocaleDateString(
                      "fr-FR",
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {analysis.patient?.fullname || "N/A"}
                    <br />
                    <span className="text-xs text-gray-500">
                      {analysis.patient?.patientNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {analysis.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {analysis.items?.length || 0}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={getPriorityColor(analysis.priority)}>
                      {analysis.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {analysis.totalPrice} FC
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(analysis.status)}`}
                    >
                      {analysis.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link
                      to={`/dashboard/analyses/${analysis._id}`}
                      className="text-blue-600 hover:text-blue-800"
                      title="Voir détails"
                    >
                      <FaEye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAnalyses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune analyse trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}
