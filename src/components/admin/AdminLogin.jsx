import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const text = await response.text();

      if (response.ok && text === 'Login successful') {
        localStorage.setItem('userType', 'Admin');
        navigate('/admin-dashboard');
      } else {
        setError(text || 'Invalid credentials');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Login request failed. Check your backend server.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-login-light.png')" }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md border border-blue-100 backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Admin Login</h2>

        <div className="flex justify-between mb-6 gap-2">
          <button
            onClick={() => navigate('/login?view=delivery')}
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Delivery Login
          </button>
          <button
            onClick={() => navigate('/login?view=inventory')}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Inventory Login
          </button>
        </div>

        {error && (
          <div className="mb-4 text-red-500 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Admin Username"
            className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
}
