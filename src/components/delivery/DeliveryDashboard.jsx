import { useEffect, useState } from 'react';
import axios from 'axios';
import DeliveryCard from './DeliveryCard';
import StatusUpdateModal from './StatusUpdateModal';
import AgentProfileModal from './AgentProfileModal';

export default function DeliveryDashboard() {
  const [activeTab, setActiveTab] = useState('today');
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  const agentProfile = {
    name: "D. Aravind",
    email: "aravind.dlteam@example.com",
    phone: "+91-9876543210",
    deliveriesMade: 128,
    region: "Chennai Zone 2",
    joined: "2023-08-01",
  };

  useEffect(() => {
    const fetchDeliveries = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/api/delivery");
        setDeliveries(res.data);
      } catch (err) {
        console.error("Failed to load deliveries", err);
      }
      setLoading(false);
    };

    fetchDeliveries();
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayDeliveries = deliveries.filter((d) => d.date === today);
  const pastDeliveries = deliveries.filter((d) => d.date !== today);

  // ✅ Updated to accept full delivery object with status, notes, signature
  const handleStatusUpdate = async (updatedDelivery) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/delivery/${updatedDelivery.id}/status`,
        {
          status: updatedDelivery.status,
          notes: updatedDelivery.notes,
          signature: updatedDelivery.signature || ''
        }
      );

      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === updatedDelivery.id ? { ...d, ...updatedDelivery } : d
        )
      );
      setShowStatusModal(false);
      setSelectedDelivery(null);
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-600">Loading deliveries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowProfile(true)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white shadow-md flex items-center justify-center hover:bg-blue-700 transition"
                title="View Profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A4 4 0 015 16V8a4 4 0 014-4h6a4 4 0 014 4v8a4 4 0 01-.121.804M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-blue-700">Delivery Dashboard</h1>
                <p className="text-sm text-blue-600">Agent: {agentProfile.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="border-b border-blue-100">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('today')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'today'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-blue-400 hover:text-blue-700 hover:border-blue-200'
                }`}
            >
              Today's Deliveries ({todayDeliveries.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'past'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-blue-400 hover:text-blue-700 hover:border-blue-200'
                }`}
            >
              Past Deliveries ({pastDeliveries.length})
            </button>
          </nav>
        </div>

        <div className="mt-6 space-y-4">
          {(activeTab === 'today' ? todayDeliveries : pastDeliveries).map((delivery) => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onStatusUpdate={() => {
                setSelectedDelivery(delivery);
                setShowStatusModal(true);
              }}
            />
          ))}

          {(activeTab === 'today' ? todayDeliveries : pastDeliveries).length === 0 && (
            <div className="text-center py-12">
              <div className="text-blue-200 text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-blue-700 mb-2">
                No {activeTab === 'today' ? "today's" : 'past'} deliveries
              </h3>
              <p className="text-blue-400">
                {activeTab === 'today'
                  ? "You're all caught up for today!"
                  : "No past deliveries to show."}
              </p>
            </div>
          )}
        </div>
      </div>

      {showStatusModal && selectedDelivery && (
        <StatusUpdateModal
          delivery={selectedDelivery}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedDelivery(null);
          }}
          onUpdate={handleStatusUpdate}
        />
      )}

      {showProfile && (
        <AgentProfileModal
          profile={agentProfile}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}
