import { useAuth } from "../../context/AuthContext";
import AdminDashboard from "./admin/Dashboard";
import SecretaireDashboard from "./secretaire/Dashboard";

export default function DashboardHome() {
  const { currentRole } = useAuth();

  // Afficher le dashboard selon le rôle actuel
  switch (currentRole) {
    case "admin":
      return <AdminDashboard />;
    case "secretaire":
      return <SecretaireDashboard />;
    case "medecin":
      // return <MedecinDashboard />; // À créer plus tard
      return <div className="p-6">Dashboard Médecin - En construction</div>;
    case "laborantin":
      // return <LaborantinDashboard />; // À créer plus tard
      return <div className="p-6">Dashboard Laborantin - En construction</div>;
    case "comptable":
      // return <ComptableDashboard />; // À créer plus tard
      return <div className="p-6">Dashboard Comptable - En construction</div>;
    default:
      return <AdminDashboard />;
  }
}
