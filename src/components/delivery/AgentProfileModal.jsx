// AgentProfileModal.jsx
import { useState } from 'react';

export default function AgentProfileModal({ profile, onClose }) {
  const [formData, setFormData] = useState({ ...profile });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Here you can send formData to backend API using axios
    console.log("Updated Profile:", formData);
    onClose(); // Close modal after save
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Edit Agent Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-blue-600">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-blue-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-blue-600">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-blue-600">Region</label>
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-blue-600">Deliveries Made</label>
            <input
              type="number"
              name="deliveriesMade"
              value={formData.deliveriesMade}
              onChange={handleChange}
              className="w-full border border-blue-200 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-blue-600">Joined On</label>
            <input
              type="text"
              value={formData.joined}
              disabled
              className="w-full border border-gray-200 bg-gray-100 text-gray-600 rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
