import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Marks from './pages/Marks';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';

export default function App() {
  const location = useLocation();
  const isApp = location.pathname !== '/';

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {isApp && <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/marks" element={<Marks />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/analytics" element={<Analytics />} />
      </Route> }
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}