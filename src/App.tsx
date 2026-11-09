import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './layouts/AppShell/AppShell';
import DashboardPage from './features/dashboard/DashboardPage';

const App = () => (
  <Routes>
    <Route path="/" element={<AppShell />}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
