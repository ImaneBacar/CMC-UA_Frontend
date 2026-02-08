import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/axios";
import {
  FaSearch,
  FaEye,
  FaSpinner,
  FaFilter,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get("/payments");
      console.log("Paiements reçus:", response.data);
      setPayments(response.data.data || response.data.payments || []);
      setLoading(false);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur chargement paiements");
      setLoading(false);
    }
  };

  const filterPayments = useCallback(() => {
    let filtered = [...payments];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.patient?.fullname
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          p.paymentNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filtre par statut
    if (filterStatus !== "all") {
      filtered = filtered.filter((p) => p.status === filterStatus);
    }

    // Filtre par date
    if (filterDate === "today") {
      const today = new Date().setHours(0, 0, 0, 0);
      filtered = filtered.filter((p) => {
        const paymentDate = new Date(p.createdAt).setHours(0, 0, 0, 0);
        return paymentDate === today;
      });
    } else if (filterDate === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter((p) => new Date(p.createdAt) >= weekAgo);
    } else if (filterDate === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter((p) => new Date(p.createdAt) >= monthAgo);
    }

    setFilteredPayments(filtered);
  }, [payments, searchTerm, filterStatus, filterDate]);

  useEffect(() => {
    filterPayments();
  }, [filterPayments]);

  const getStatusColor = (status) => {
    switch (status) {
      case "paye":
        return "bg-green-100 text-green-700";
      case "partiel":
        return "bg-orange-100 text-orange-700";
      case "impaye":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDebtStatusColor = (debtStatus) => {
    switch (debtStatus) {
      case "active":
        return "text-red-600";
      case "soldee":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  // Statistiques
  const stats = {
    total: filteredPayments.reduce((sum, p) => sum + (p.finalAmount || 0), 0),
    paid: filteredPayments.reduce((sum, p) => sum + (p.paidAmount || 0), 0),
    remaining: filteredPayments.reduce(
      (sum, p) => sum + (p.remainingAmount || 0),
      0,
    ),
    count: filteredPayments.length,
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Gestion des Paiements
        </h2>
        <p className="text-gray-600 mt-1">
          {filteredPayments.length} paiement(s)
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Facturé</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.total.toLocaleString()} FC
              </p>
            </div>
            <FaMoneyBillWave className="text-3xl text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Payé</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.paid.toLocaleString()} FC
              </p>
            </div>
            <FaMoneyBillWave className="text-3xl text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Dettes Restantes</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.remaining.toLocaleString()} FC
              </p>
            </div>
            <FaExclamationTriangle className="text-3xl text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Nombre de Paiements</p>
              <p className="text-2xl font-bold text-gray-900">{stats.count}</p>
            </div>
            <FaMoneyBillWave className="text-3xl text-gray-600" />
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher patient ou n° paiement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>

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

          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 appearance-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="paye">Payé</option>
              <option value="partiel">Partiel</option>
              <option value="impaye">Impayé</option>
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
                  N° Paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Visite
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Reste
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
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">
                    {payment.paymentNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(payment.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {payment.patient?.fullname || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {payment.visit?.visitNumber || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {(
                      payment.finalAmount ||
                      payment.totalAmount ||
                      0
                    ).toLocaleString()}{" "}
                    FC
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">
                    {(payment.paidAmount || 0).toLocaleString()} FC
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <span className={getDebtStatusColor(payment.debtStatus)}>
                      {(payment.remainingAmount || 0).toLocaleString()} FC
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}
                    >
                      {payment.status === "paye"
                        ? "Payé"
                        : payment.status === "partiel"
                          ? "Partiel"
                          : "Impayé"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link
                      to={`/dashboard/paiements/${payment._id}`}
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

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun paiement trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
