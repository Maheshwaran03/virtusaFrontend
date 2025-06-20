import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // Replace with real authentication logic
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('userType', 'Admin');
      navigate('/admin-dashboard'); // You can create this route later
    } else {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative border border-blue-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Admin Login</h2>
        <div className="flex justify-between mb-6 gap-2">
          <button
            onClick={() => navigate('/login?view=delivery')}
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Delivery Login
          </button>
          <button
            onClick={() => navigate('/login?view=inventory')}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Inventory Login
          </button>
        </div>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Admin Username"
            className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition-colors"
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
} 