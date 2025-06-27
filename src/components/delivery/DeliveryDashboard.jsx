import { useState, useEffect } from 'react';
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
      setTimeout(() => {
        const mockDeliveries = [
          {
            id: 1,
            customerName: "John Smith",
            address: "123 Main St, City, State 12345",
            priority: "perishable",
            status: "pending",
            deliveryDate: "2024-06-17",
            items: ["Milk", "Bread", "Eggs"],
            phone: "+1-555-0123",
            notes: "Leave at front door if not home"
          },
          {
            id: 2,
            customerName: "Sarah Johnson",
            address: "456 Oak Ave, City, State 12345",
            priority: "normal",
            status: "in_progress",
            deliveryDate: "2024-06-17",
            items: ["Canned Goods", "Pasta"],
            phone: "+1-555-0124",
            notes: "Ring doorbell twice"
          },
          {
            id: 3,
            customerName: "Mike Wilson",
            address: "789 Pine Rd, City, State 12345",
            priority: "emergency",
            status: "pending",
            deliveryDate: "2024-06-17",
            items: ["Medicine", "First Aid Kit"],
            phone: "+1-555-0125",
            notes: "URGENT - Medical supplies"
          },
          {
            id: 4,
            customerName: "Lisa Brown",
            address: "321 Elm St, City, State 12345",
            priority: "normal",
            status: "delivered",
            deliveryDate: "2024-06-16",
            items: ["Groceries"],
            phone: "+1-555-0126",
            notes: "Delivered successfully"
          }
        ];
        setDeliveries(mockDeliveries);
        setLoading(false);
      }, 1000);
    };

    fetchDeliveries();
  }, []);

  const todayDeliveries = deliveries.filter(d => d.deliveryDate === "2024-06-17");
  const pastDeliveries = deliveries.filter(d => d.deliveryDate !== "2024-06-17");

  const handleStatusUpdate = async (deliveryId, newStatus, notes = '') => {
    try {
      setDeliveries(prev =>
        prev.map(d =>
          d.id === deliveryId
            ? { ...d, status: newStatus, notes: notes || d.notes }
            : d
        )
      );
      setShowStatusModal(false);
      setSelectedDelivery(null);
    } catch (error) {
      console.error('Status update error:', error);
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              {/* Highlighted Profile Icon Button */}
              <button
                onClick={() => setShowProfile(true)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white shadow-md flex items-center justify-center hover:bg-blue-700 transition"
                title="View Profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M5.121 17.804A4 4 0 015 16V8a4 4 0 014-4h6a4 4 0 014 4v8a4 4 0 01-.121.804M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-blue-700">Delivery Dashboard</h1>
                <p className="text-sm text-blue-600">Agent: D. Aravind</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="border-b border-blue-100">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('today')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'today'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-blue-400 hover:text-blue-700 hover:border-blue-200'
              }`}
            >
              Today's Deliveries ({todayDeliveries.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'past'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-blue-400 hover:text-blue-700 hover:border-blue-200'
              }`}
            >
              Past Deliveries ({pastDeliveries.length})
            </button>
          </nav>
        </div>

        {/* Delivery Cards */}
        <div className="mt-6 space-y-4">
          {(activeTab === 'today' ? todayDeliveries : pastDeliveries).map((delivery) => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onStatusUpdate={(delivery) => {
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

      {/* Modals */}
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
