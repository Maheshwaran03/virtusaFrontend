import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import InventoryDashboard from './components/inventory/InventoryDashboard';
import DeliveryDashboard from './components/delivery/DeliveryDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AgentAssign from './components/inventory/AgentAssignPage';
import AddItemPage from './components/inventory/AddItemPage';
import BulkUploadPage from './components/inventory/BulkUploadPage';
import TrackDeliveryPage from './components/inventory/TrackDeliveryPage';

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
              <InventoryDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/agent-assign"
          element={
            <ProtectedRoute allowed={['InvTeam']}>
              <AgentAssign />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/track-delivery"
          element={
            <ProtectedRoute allowed={['InvTeam']}>
              <TrackDeliveryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/add-item"
          element={
            <ProtectedRoute allowed={['InvTeam']}>
              <AddItemPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/bulk-upload"
          element={
            <ProtectedRoute allowed={['InvTeam']}>
              <BulkUploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery-dashboard"
          element={
            <ProtectedRoute allowed={['DLTeam']}>
              <DeliveryDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
