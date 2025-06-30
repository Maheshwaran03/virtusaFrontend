import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [view, setView] = useState('main'); // 'main', 'inventory', or 'delivery'
  const [invUsername, setInvUsername] = useState('');
  const [invPassword, setInvPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false); // toggle for delivery register/login
  const [agentName, setAgentName] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [agentPassword, setAgentPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const viewParam = params.get('view');
    if (viewParam === 'inventory' || viewParam === 'delivery') {
      setView(viewParam);
    }
  }, [location.search]);

  const handleInvLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/api/inventory/login',
        { username: invUsername, password: invPassword }
      );
      if (response.status === 200) {
        localStorage.setItem('userType', 'InvTeam');
        navigate('/inventory-dashboard');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError('Invalid username or password.');
    }
  };

 const handleAgentRegister = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/delivery/register', {
      name: agentName,
      email: agentEmail,
      password: agentPassword,
    });

    if (response.status === 200) {
      alert('Registration successful! Please log in.');
      setIsRegister(false);
      setAgentName('');
      setAgentEmail('');
      setAgentPassword('');
      setError('');
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Registration failed.');
  }
};


  const handleAgentLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/delivery/login', {
        email: agentEmail,
        password: agentPassword,
      });
      const { email, name } = response.data;
      localStorage.setItem('userType', 'DLTeam');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', name);
      navigate('/delivery-dashboard');
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.post('http://localhost:8080/api/oauth/google', {
          access_token: tokenResponse.access_token,
        });

        const { email, name } = response.data;
        localStorage.setItem('userType', 'DLTeam');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);
        navigate('/delivery-dashboard');
      } catch (err) {
        console.error('Google OAuth failed', err);
        setError('Google sign-in failed');
      }
    },
    onError: () => setError('Google login cancelled or failed'),
    scope: 'email profile',
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-login-light.png')" }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-md w-full max-w-md border border-blue-100 backdrop-blur-md">
        {view === 'inventory' && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Inventory Login</h2>
            {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
            <form onSubmit={handleInvLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full px-3 py-2 border border-blue-200 rounded"
                value={invUsername}
                onChange={(e) => setInvUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border border-blue-200 rounded"
                value={invPassword}
                onChange={(e) => setInvPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  navigate('/');
                }}
                className="w-full mt-2 text-blue-600 underline"
              >
                ⬅ Back to Main Login
              </button>
            </form>
          </>
        )}

        {view === 'delivery' && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
              {isRegister ? 'Agent Register' : 'Delivery Login'}
            </h2>
            {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

            <div className="space-y-4">
              {isRegister && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border border-blue-200 rounded"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border border-blue-200 rounded"
                value={agentEmail}
                onChange={(e) => setAgentEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border border-blue-200 rounded"
                value={agentPassword}
                onChange={(e) => setAgentPassword(e.target.value)}
              />

              <button
                onClick={isRegister ? handleAgentRegister : handleAgentLogin}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {isRegister ? 'Register' : 'Login'}
              </button>

              <button
                onClick={() => setIsRegister((prev) => !prev)}
                className="w-full text-blue-500 underline"
              >
                {isRegister ? 'Already registered? Login' : 'New agent? Register here'}
              </button>

              <div className="text-center text-gray-500">or</div>

              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-10.3 7-6.1 0-11-4.9-11-11s4.9-11 11-11c2.6 0 5 .9 6.9 2.4l6.6-6.6C34.5 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8.9 20-20 0-1.3-.1-2.7-.4-3.5z" />
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 13 24 13c2.6 0 5 .9 6.9 2.4l6.6-6.6C34.5 6.5 29.6 4 24 4c-7.1 0-13.1 3.7-16.7 9.3z" />
                  <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.8 14.3-4.9l-6.6-5.4C29.5 36.9 26.9 38 24 38c-4.6 0-8.7-2.7-10.3-7H6.3C9.9 40.3 16.9 44 24 44z" />
                  <path fill="#1976D2" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.1 2.9-3.2 5.2-6.1 6.6l6.6 5.4C40.2 38.2 44 31.9 44 24c0-1.3-.1-2.7-.4-3.5z" />
                </svg>
                Sign in with Google
              </button>

              <button
                type="button"
                onClick={() => {
                  setError('');
                  navigate('/');
                }}
                className="w-full mt-4 text-blue-600 underline"
              >
                ⬅ Back to Main Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}