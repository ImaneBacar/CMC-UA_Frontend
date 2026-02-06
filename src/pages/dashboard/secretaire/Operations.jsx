import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/axios";
import {
  FaPlus,
  FaSearch,
  FaEye,
  FaSpinner,
  FaFilter,
  FaCalendarAlt,
} from "react-icons/fa";

export default function Operations() {
  const [operations, setOperations] = useState([]);
  const [filteredOperations, setFilteredOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchOperations();
  }, []);

  useEffect(() => {
    filterOperations();
  }, [searchTerm, filterStatus, operations]);

  const fetchOperations = async () => {
    try {
      const response = await api.get("/operations/all");
      console.log("Opérations reçues:", response.data);
      setOperations(response.data.data || response.data.operations || []);
      setLoading(false);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur chargement opérations");
      setLoading(false);
    }
  };

  const filterOperations = () => {
    let filtered = [...operations];

    if (searchTerm) {
      filtered = filtered.filter(
        (op) =>
          op.patient?.fullname
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          op.operationNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((op) => op.status === filterStatus);
    }

    setFilteredOperations(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "programmée":
        return "bg-blue-100 text-blue-700";
      case "en cours":
        return "bg-yellow-100 text-yellow-700";
      case "terminée":
        return "bg-green-100 text-green-700";
      case "annulée":
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
            Gestion des Opérations
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredOperations.length} opération(s)
          </p>
        </div>
        <Link
          to="/dashboard/operations/new"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus />
          Programmer une Opération
        </Link>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher patient ou n° opération..."
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
              <option value="programmée">Programmée</option>
              <option value="en cours">En cours</option>
              <option value="terminée">Terminée</option>
              <option value="annulée">Annulée</option>
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
                  N° Opération
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date prévue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Chirurgien
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
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
              {filteredOperations.map((operation) => (
                <tr key={operation._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">
                    {operation.operationNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(operation.scheduledDate).toLocaleDateString(
                      "fr-FR",
                    )}
                    <br />
                    <span className="text-xs text-gray-500">
                      {new Date(operation.scheduledDate).toLocaleTimeString(
                        "fr-FR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {operation.patient?.fullname || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Dr. {operation.surgeon?.fullname || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {operation.operationType}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {operation.totalAmount} FC
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(operation.status)}`}
                    >
                      {operation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link
                      to={`/dashboard/operations/${operation._id}`}
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

        {filteredOperations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune opération trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}
