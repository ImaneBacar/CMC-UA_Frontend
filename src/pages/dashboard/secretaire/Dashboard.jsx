import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/axios";
import {
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserPlus,
  FaClipboardList,
  FaSpinner,
  FaClock,
} from "react-icons/fa";

export default function SecretaireDashboard() {
  const [stats, setStats] = useState({
    patientsToday: 0,
    visitsToday: 0,
    pendingPayments: 0,
    totalPatients: 0,
  });
  const [recentVisits, setRecentVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [patientsRes, visitsRes] = await Promise.all([
        api.get("/patients"),
        api.get("/visits/today/all"),
      ]);

      setStats({
        totalPatients: patientsRes.data.data?.length || 0,
        visitsToday: visitsRes.data.data?.length || 0,
        patientsToday: visitsRes.data.data?.length || 0,
        pendingPayments: 0,
      });

      setRecentVisits(visitsRes.data.data?.slice(0, 5) || []);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement dashboard:", error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Patients Aujourd'hui",
      value: stats.patientsToday,
      icon: FaUsers,
      color: "bg-blue-500",
      bgLight: "bg-blue-50",
      link: "/dashboard/visites",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: FaClipboardList,
      color: "bg-green-500",
      bgLight: "bg-green-50",
      link: "/dashboard/patients",
    },
    {
      title: "Visites du Jour",
      value: stats.visitsToday,
      icon: FaCalendarAlt,
      color: "bg-purple-500",
      bgLight: "bg-purple-50",
      link: "/dashboard/visites",
    },
    {
      title: "Paiements en Attente",
      value: stats.pendingPayments,
      icon: FaMoneyBillWave,
      color: "bg-yellow-500",
      bgLight: "bg-yellow-50",
      link: "/dashboard/paiements",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Accueil - Secrétariat
        </h2>
        <p className="text-gray-600">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgLight} p-3 rounded-lg`}>
                  <Icon
                    className={`text-2xl ${stat.color.replace("bg-", "text-")}`}
                  />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions rapides */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actions Rapides
          </h3>
          <div className="space-y-3">
            <Link
              to="/dashboard/patients/new"
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
            >
              <FaUserPlus size={20} />
              <span className="font-medium">Nouveau Patient</span>
            </Link>
            <Link
              to="/dashboard/visites/new"
              className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
            >
              <FaCalendarAlt size={20} />
              <span className="font-medium">Nouvelle Visite</span>
            </Link>
            <Link
              to="/dashboard/patients"
              className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
            >
              <FaUsers size={20} />
              <span className="font-medium">Liste des Patients</span>
            </Link>
          </div>
        </div>

        {/* Visites récentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Visites du Jour
          </h3>
          {recentVisits.length > 0 ? (
            <div className="space-y-3">
              {recentVisits.map((visit) => (
                <div
                  key={visit._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {visit.patient?.fullname || "Patient inconnu"}
                    </p>
                    <p className="text-sm text-gray-600">{visit.visitReason}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-400" size={14} />
                    <span className="text-sm text-gray-600">
                      {new Date(visit.visitDate).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Aucune visite aujourd'hui</p>
          )}
        </div>
      </div>
    </div>
  );
}
