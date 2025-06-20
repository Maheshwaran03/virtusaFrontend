import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowed }) {
  const userType = localStorage.getItem('userType');
  if (!userType || (allowed && !allowed.includes(userType))) {
    return <Navigate to="/login" replace />;
  }
  return children;
} 