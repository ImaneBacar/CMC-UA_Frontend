import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar fixe en haut */}
      <Navbar />

      {/* Contenu principal */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer en bas */}
      <Footer />
    </div>
  );
}
