
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages publiques
import Home from './pages/public/Home';
import Urologie from './pages/public/Urologie';
import Laboratoire from './pages/public/Laboratoire';
import About from './pages/public/About';
import Team from './pages/public/Team';
import Contact from './pages/public/Contact';

import DashboardHome from './pages/dashboard/DashboardHome';

// Pages  admin
import Users from './pages/dashboard/admin/Users';
import Specialities from './pages/dashboard/admin/Specialities';
import Stats from './pages/dashboard/admin/Stats';
import Settings from './pages/dashboard/admin/Settings';

import PatientDetail from './pages/dashboard/secretaire/PatientDetail';
import NewVisit from './pages/dashboard/secretaire/NewVisit';
import Patients from './pages/dashboard/secretaire/Patients';
import NewPatient from './pages/dashboard/secretaire/NewPatient';
import EditPatient from './pages/dashboard/secretaire/EditPatient';
import Visits from './pages/dashboard/secretaire/Visits';
import VisitDetail from './pages/dashboard/secretaire/VisitDetail';
import Operations from './pages/dashboard/secretaire/Operations';
import NewOperation from './pages/dashboard/secretaire/NewOperation';


function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="urologie" element={<Urologie />} />
          <Route path="laboratoire" element={<Laboratoire />} />
          <Route path="a-propos" element={<About />} />
          <Route path="equipe" element={<Team />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Routes dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<Users />} />
          <Route path="specialities" element={<Specialities />} />
          <Route path="stats" element={<Stats />} />
          <Route path="settings" element={<Settings />} />


           {/* Secrétaire */}
          <Route path="patients" element={<Patients />} />
          <Route path="patients/new" element={<NewPatient />} />
          <Route path="patients/:id" element={<PatientDetail />} /> 
          <Route path="patients/:id/edit" element={<EditPatient />} /> 
          <Route path="visites" element={<Visits />} />
          <Route path="visites/new" element={<NewVisit />} />
          <Route path="visites/:id" element={<VisitDetail />} />
<Route path="operations" element={<Operations />} />
  <Route path="operations/new" element={<NewOperation />} />

        </Route>

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Page non trouvée</p>
              <a href="/" className="btn btn-primary">
                Retour à l'accueil
              </a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;