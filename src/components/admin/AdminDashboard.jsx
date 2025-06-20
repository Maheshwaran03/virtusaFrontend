import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [inventoryUser, setInventoryUser] = useState({ username: '', password: '' });
  const [success, setSuccess] = useState('');
  const [inventoryUsers, setInventoryUsers] = useState([
    { username: 'inventory1' },
    { username: 'inventory2' },
  ]);
  const navigate = useNavigate();

  const handleCreate = (e) => {
    e.preventDefault();
    setInventoryUsers(users => [...users, { username: inventoryUser.username }]);
    setSuccess(`Inventory user '${inventoryUser.username}' created!`);
    setInventoryUser({ username: '', password: '' });
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = (username) => {
    setInventoryUsers(users => users.filter(u => u.username !== username));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg border border-blue-100">
        <div className="flex justify-center mb-4">
          <button
            onClick={() => navigate('/')}
            className="border border-blue-500 text-blue-700 px-4 py-1 rounded hover:bg-blue-50 font-semibold transition-colors"
          >
            ⬅ Back to Main Login
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Admin Dashboard</h2>
        {success && <div className="mb-4 text-green-600 text-center font-semibold">{success}</div>}
        <div className="grid grid-cols-1 gap-8">
          {/* Inventory User Form */}
          <div>
            <form onSubmit={handleCreate} className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Create Inventory User</h3>
              <input
                type="text"
                placeholder="Inventory Username"
                className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={inventoryUser.username}
                onChange={e => setInventoryUser(u => ({ ...u, username: e.target.value }))}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={inventoryUser.password}
                onChange={e => setInventoryUser(u => ({ ...u, password: e.target.value }))}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition-colors"
              >
                Create Inventory User
              </button>
            </form>
            {/* Inventory Users List */}
            <div className="mt-6">
              <h4 className="text-md font-semibold text-blue-500 mb-2">Inventory Users</h4>
              <ul className="space-y-2">
                {inventoryUsers.length === 0 && <li className="text-blue-300">No inventory users.</li>}
                {inventoryUsers.map(user => (
                  <li key={user.username} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
                    <span className="text-blue-700">{user.username}</span>
                    <button
                      onClick={() => handleDelete(user.username)}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 