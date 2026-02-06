import { useEffect, useState } from "react";
import api from "../../../utils/axios";
import {
  FaUsers,
  FaUserMd,
  FaStethoscope,
  FaFlask,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaChartLine,
  FaSpinner,
} from "react-icons/fa";

export default function Stats() {
  const [stats, setStats] = useState({
    users: { total: 0, byRole: {} },
    patients: { total: 0, active: 0 },
    visits: { total: 0, today: 0, thisMonth: 0 },
    operations: { total: 0, completed: 0, pending: 0 },
    analyses: { total: 0, pending: 0, completed: 0 },
    payments: { total: 0, revenue: 0, debts: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      const [usersRes, patientsRes, visitsRes] = await Promise.all([
        api.get("/users"),
        api.get("/patients"),
        api.get("/visits"),
      ]);

      // Compter utilisateurs par rôle
      const usersByRole = {};
      usersRes.data.data.forEach((user) => {
        user.role.forEach((role) => {
          usersByRole[role] = (usersByRole[role] || 0) + 1;
        });
      });

      setStats({
        users: {
          total: usersRes.data.data.length,
          byRole: usersByRole,
        },
        patients: {
          total: patientsRes.data.data.length,
          active: patientsRes.data.data.filter((p) => p.status === "actif")
            .length,
        },
        visits: {
          total: visitsRes.data.data?.length || 0,
          today: 0, // À calculer
          thisMonth: 0, // À calculer
        },
        operations: { total: 0, completed: 0, pending: 0 },
        analyses: { total: 0, pending: 0, completed: 0 },
        payments: { total: 0, revenue: 0, debts: 0 },
      });

      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement stats:", error);
      setLoading(false);
    }
  };

  const roleLabels = {
    admin: "Administrateurs",
    medecin: "Médecins",
    secretaire: "Secrétaires",
    laborantin: "Laborantins",
    comptable: "Comptables",
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Statistiques Détaillées
        </h2>
        <p className="text-gray-600">
          Vue complète de l'activité de la clinique
        </p>
      </div>

      {/* Statistiques Utilisateurs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaUsers className="text-blue-600" />
          Utilisateurs & Personnel
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">
              {stats.users.total}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total</p>
          </div>
          {Object.entries(stats.users.byRole).map(([role, count]) => (
            <div key={role} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-600 mt-1">{roleLabels[role]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiques Patients */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaStethoscope className="text-green-600" />
          Patients
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {stats.patients.total}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Patients</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {stats.patients.active}
            </p>
            <p className="text-sm text-gray-600 mt-1">Patients Actifs</p>
          </div>
        </div>
      </div>

      {/* Statistiques Visites */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaCalendarAlt className="text-purple-600" />
          Visites & Consultations
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">
              {stats.visits.total}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Visites</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">
              {stats.visits.today}
            </p>
            <p className="text-sm text-gray-600 mt-1">Aujourd'hui</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">
              {stats.visits.thisMonth}
            </p>
            <p className="text-sm text-gray-600 mt-1">Ce Mois</p>
          </div>
        </div>
      </div>

      {/* Statistiques Finances */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaMoneyBillWave className="text-yellow-600" />
          Finances
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-3xl font-bold text-yellow-600">
              {stats.payments.revenue} FC
            </p>
            <p className="text-sm text-gray-600 mt-1">Recettes Totales</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-3xl font-bold text-red-600">
              {stats.payments.debts} FC
            </p>
            <p className="text-sm text-gray-600 mt-1">Dettes Actives</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {stats.payments.revenue - stats.payments.debts} FC
            </p>
            <p className="text-sm text-gray-600 mt-1">Recettes Nettes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
