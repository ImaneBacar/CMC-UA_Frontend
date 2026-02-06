import { useEffect, useState } from "react";
import api from "../../../utils/axios"; // ← Import de l'instance configurée
import {
  FaUsers,
  FaStethoscope,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalVisits: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, patientsRes] = await Promise.all([
        api.get("/users"), // ← Utilise 'api'
        api.get("/patients"), // ← Utilise 'api'
      ]);

      setStats({
        totalUsers: usersRes.data.data?.length || 0,
        totalPatients: patientsRes.data.data?.length || 0,
        totalVisits: 0,
        totalRevenue: 0,
      });
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement stats:", error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Utilisateurs",
      value: stats.totalUsers,
      icon: FaUsers,
      color: "bg-blue-500",
      bgLight: "bg-blue-50",
    },
    {
      title: "Patients",
      value: stats.totalPatients,
      icon: FaStethoscope,
      color: "bg-green-500",
      bgLight: "bg-green-50",
    },
    {
      title: "Visites",
      value: stats.totalVisits,
      icon: FaCalendarAlt,
      color: "bg-purple-500",
      bgLight: "bg-purple-50",
    },
    {
      title: "Recettes",
      value: `${stats.totalRevenue} FC`,
      icon: FaMoneyBillWave,
      color: "bg-yellow-500",
      bgLight: "bg-yellow-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Vue d'ensemble
        </h2>
        <p className="text-gray-600">Statistiques globales de la clinique</p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
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
            </div>
          );
        })}
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actions rapides
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
              + Ajouter un utilisateur
            </button>
            <button className="w-full text-left px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition">
              + Ajouter une spécialité
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activité récente
          </h3>
          <p className="text-gray-500 text-sm">Aucune activité récente</p>
        </div>
      </div>
    </div>
  );
}
