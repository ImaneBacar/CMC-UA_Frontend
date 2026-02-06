import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/axios";
import {
  FaPlus,
  FaSearch,
  FaCalendarAlt,
  FaSpinner,
  FaEye,
  FaFilter,
} from "react-icons/fa";

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchVisits();
  }, []);

  useEffect(() => {
    filterVisits();
  }, [searchTerm, filterDate, filterStatus, visits]);

  const fetchVisits = async () => {
    try {
      const response = await api.get("/visits");
      console.log("Visites reçues:", response.data);
      console.log("Visites reçues:", response.data);
      setVisits(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur chargement visites");
      setLoading(false);
    }
  };

  const filterVisits = () => {
    let filtered = [...visits];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.patient?.fullname
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          v.patient?.patientNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          v.numeroVisite?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filtre par date
    if (filterDate === "today") {
      const today = new Date().setHours(0, 0, 0, 0);
      filtered = filtered.filter((v) => {
        const visitDate = new Date(v.visitDate).setHours(0, 0, 0, 0);
        return visitDate === today;
      });
    } else if (filterDate === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter((v) => new Date(v.visitDate) >= weekAgo);
    } else if (filterDate === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter((v) => new Date(v.visitDate) >= monthAgo);
    }

    // Filtre par statut
    if (filterStatus !== "all") {
      filtered = filtered.filter((v) => v.status === filterStatus);
    }

    setFilteredVisits(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "en attente":
        return "bg-yellow-100 text-yellow-700";
      case "en consultation":
        return "bg-blue-100 text-blue-700";
      case "terminé":
        return "bg-green-100 text-green-700";
      case "annulé":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
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
            Gestion des Visites
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredVisits.length} visite(s)
          </p>
        </div>
        <Link
          to="/dashboard/visites/new"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus />
          Nouvelle Visite
        </Link>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher patient ou n° visite..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Filtre période */}
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 appearance-none"
            >
              <option value="all">Toutes les périodes</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>

          {/* Filtre statut */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 appearance-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="en attente">En attente</option>
              <option value="en consultation">En consultation</option>
              <option value="terminé">Terminé</option>
              <option value="annulé">Annulé</option>
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
                  N° Visite
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Médecin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Motif
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
              {filteredVisits.map((visit) => (
                <tr key={visit._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">
                    {visit.visitNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(visit.visitDate).toLocaleDateString("fr-FR")}
                    <br />
                    <span className="text-xs text-gray-500">
                      {new Date(visit.visitDate).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {visit.patient?.fullname || "N/A"}
                    <br />
                    <span className="text-xs text-gray-500">
                      {visit.patient?.patientNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Dr. {visit.doctor?.fullname || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {visit.visitReason}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(visit.status)}`}
                    >
                      {visit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link
                      to={`/dashboard/visites/${visit._id}`}
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

        {filteredVisits.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune visite trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}
