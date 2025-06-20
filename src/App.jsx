import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import InventoryDashboard from './components/inventory/InventoryDashboard';
import DeliveryDashboard from './components/delivery/DeliveryDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

function LogoutButton() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('userType');
    navigate('/adminLogin');
  };
  return (
    <button onClick={handleLogout} className="absolute top-4 right-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Logout</button>
  );
}

function InventoryDashboardWithLogout() {
  return (
    <div className="relative">
      <LogoutButton />
      <InventoryDashboard />
    </div>
  );
}

function DeliveryDashboardWithLogout() {
  return (
    <div className="relative">
      <LogoutButton />
      <DeliveryDashboard />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/inventory-dashboard"
          element={
            <ProtectedRoute allowed={['InvTeam']}>
              <InventoryDashboardWithLogout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery-dashboard"
          element={
            <ProtectedRoute allowed={['DLTeam']}>
              <DeliveryDashboardWithLogout />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
