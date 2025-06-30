import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeliveryCard from './DeliveryCard';
import StatusUpdateModal from './StatusUpdateModal';
import AgentProfileModal from './AgentProfileModal';
import { Menu } from "lucide-react";

export default function DeliveryDashboard() {
  const [activeTab, setActiveTab] = useState('today');
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [agentProfile, setAgentProfile] = useState(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [clock, setClock] = useState(new Date().toLocaleTimeString());
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setClock(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAgentProfile = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const res = await axios.get(`http://localhost:8080/api/delivery/profile?email=${email}`);
        setAgentProfile(res.data);
      } catch (err) {
        console.error("Failed to load agent profile", err);
      }
    };
    fetchAgentProfile();
  }, []);

  useEffect(() => {
    const fetchAgentDeliveries = async () => {
      setLoading(true);
      try {
        const email = localStorage.getItem('userEmail');
        const res = await axios.get(`http://localhost:8080/api/delivery/by-agent?agent=${email}`);
        setDeliveries(res.data);
      } catch (err) {
        console.error("Failed to load agent deliveries", err);
      }
      setLoading(false);
    };
    fetchAgentDeliveries();
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayDeliveries = deliveries.filter(d => d.date === today);
  const pastDeliveries = deliveries.filter(d => d.date !== today);

  const filteredToday = todayDeliveries
    .filter(d =>
      d.customerName.toLowerCase().includes(search.toLowerCase()) ||
      d.customerAddress.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortKey === 'name') return a.customerName.localeCompare(b.customerName);
      if (sortKey === 'priority') return (b.priority === 'emergency') - (a.priority === 'emergency');
      return 0;
    });

  const deliveredCount = todayDeliveries.filter(d => d.status === 'delivered').length;
  const pendingCount = todayDeliveries.filter(d => d.status === 'pending').length;
  const emergencyCount = todayDeliveries.filter(d => d.priority === 'emergency').length;
  const progress = todayDeliveries.length ? (deliveredCount / todayDeliveries.length) * 100 : 0;

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
      setDeliveries(prev =>
        prev.map(d => d.id === updatedDelivery.id ? { ...d, ...updatedDelivery } : d)
      );
      setShowStatusModal(false);
      setSelectedDelivery(null);
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  if (loading || !agentProfile) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      <header className="sticky top-0 z-10 bg-white shadow px-4 sm:px-8 py-4 border-b border-blue-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-blue-700">Delivery Dashboard</h1>
              <p className="text-sm text-blue-500">Agent: {agentProfile?.name}</p>
            </div>
          </div>

          <div className="flex justify-between sm:justify-end items-center gap-4 text-blue-600 w-full sm:w-auto">
            <span className="text-sm sm:text-base font-medium">⏰ {clock}</span>
            <div className="relative">
              <button
                onClick={() => setShowMenu(prev => !prev)}
                className="w-10 h-10 flex items-center justify-center bg-blue-100 hover:bg-blue-200 rounded-full transition"
                title="Menu"
              >
                <Menu className="w-5 h-5 text-blue-700" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-blue-200 rounded shadow-md z-50">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowProfile(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50"
                  >👤 Profile</button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      localStorage.clear();
                      navigate("/adminLogin");
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600"
                  >🚪 Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-white">
          <div className="bg-indigo-600 rounded p-4 shadow-sm">
            <h4 className="text-sm">Total</h4>
            <p className="text-xl font-bold">{todayDeliveries.length}</p>
          </div>
          <div className="bg-emerald-600 rounded p-4 shadow-sm">
            <h4 className="text-sm">Delivered</h4>
            <p className="text-xl font-bold">{deliveredCount}</p>
          </div>
          <div className="bg-amber-500 rounded p-4 shadow-sm">
            <h4 className="text-sm">Pending</h4>
            <p className="text-xl font-bold">{pendingCount}</p>
          </div>
          <div className="bg-rose-500 rounded p-4 shadow-sm">
            <h4 className="text-sm">Emergency</h4>
            <p className="text-xl font-bold">{emergencyCount}</p>
          </div>
        </div>

        <div className="bg-white rounded p-4 shadow-sm">
          <h3 className="text-blue-700 font-semibold mb-2">Today's Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-blue-600 h-3 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-blue-500 mt-1">{progress.toFixed(1)}% completed</p>
        </div>

        <div className="border-b border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex space-x-4">
            <button onClick={() => setActiveTab('today')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'today' ? 'border-blue-500 text-blue-600' : 'border-transparent text-blue-400 hover:text-blue-700 hover:border-blue-200'}`}>Today's Deliveries ({todayDeliveries.length})</button>
            <button onClick={() => setActiveTab('past')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'past' ? 'border-blue-500 text-blue-600' : 'border-transparent text-blue-400 hover:text-blue-700 hover:border-blue-200'}`}>Past Deliveries ({pastDeliveries.length})</button>
          </div>

          {activeTab === 'today' && (
            <div className="flex flex-wrap gap-2">
              <input type="text" placeholder="Search customer/location" className="border px-3 py-1 rounded shadow-sm text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
              <select className="text-sm border px-3 py-1 rounded shadow-sm" onChange={(e) => setSortKey(e.target.value)}>
                <option value="">Sort</option>
                <option value="name">Name</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          )}
        </div>

        <div className="space-y-4 animate-fade-in">
          {(activeTab === 'today' ? filteredToday : pastDeliveries).map((delivery) => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onStatusUpdate={() => {
                setSelectedDelivery(delivery);
                setShowStatusModal(true);
              }}
            />
          ))}

          {(activeTab === 'today' ? filteredToday : pastDeliveries).length === 0 && (
            <div className="text-center py-12">
              <div className="text-blue-200 text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-blue-700 mb-2">No {activeTab === 'today' ? "today's" : 'past'} deliveries</h3>
              <p className="text-blue-400">{activeTab === 'today' ? "You're all caught up for today!" : "No past deliveries to show."}</p>
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