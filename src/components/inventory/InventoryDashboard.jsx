import { useState, useEffect } from "react";
import axios from "axios";
import InventoryTable from "./InventoryTable";
import AddItemModal from "./AddItemModal";
import BulkUploadModal from "./BulkUploadModal";
import TrackDeliveryModal from "./TrackDeliveryModal";
import Reports from "./Reports";

export default function InventoryDashboard() {
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [showTrack, setShowTrack] = useState(false);
  const [showAgentAssign, setShowAgentAssign] = useState(false); // new state for Agent Assigning

  // Load data from backend
  useEffect(() => {
    axios.get("http://localhost:8080/api/inventory")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Failed to fetch inventory", err));
  }, []);

  const handleAddItem = (newItem) => {
    axios.post("http://localhost:8080/api/inventory", newItem)
      .then((res) => {
        setItems((prev) => [...prev, res.data]);
        setShowAdd(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          alert("SKU ID already exists. Please try another.");
        } else {
          console.error("Add item error", err);
          alert("Failed to add item.");
        }
      });
  };

  const handleBulkUpload = (uploadedItems) => {
    axios.post("http://localhost:8080/api/inventory/bulk", uploadedItems)
      .then((res) => {
        setItems((prev) => [...prev, ...res.data]);
        setShowBulk(false);
      })
      .catch((err) => console.error("Bulk upload failed", err));
  };

  const handleExportReport = (headers, rows, type) => {
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `report_${type}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Top Header */}
      <header className="bg-white shadow px-8 py-4 border-b border-blue-100">
        <h1 className="text-2xl font-bold text-blue-700">DLVery Inventory Management</h1>
      </header>

      {/* Modern Styled Top Navigation Bar */}
      <div className="bg-white px-8 py-3 shadow-sm border-b border-blue-100">
        <div className="flex gap-4">
          <button
            onClick={() => setShowAdd(true)}
            className="px-5 py-2 bg-blue-100 text-blue-700 font-medium rounded-full shadow-sm hover:bg-blue-200 transition-all duration-200"
          >
            + Add Item
          </button>
          <button
            onClick={() => setShowBulk(true)}
            className="px-5 py-2 bg-blue-100 text-blue-700 font-medium rounded-full shadow-sm hover:bg-blue-200 transition-all duration-200"
          >
            Bulk Upload
          </button>
          <button
            onClick={() => setShowTrack(true)}
            className="px-5 py-2 bg-blue-100 text-blue-700 font-medium rounded-full shadow-sm hover:bg-blue-200 transition-all duration-200"
          >
            Track Delivery
          </button>
          <button
            onClick={() => setShowAgentAssign(true)}
            className="px-5 py-2 bg-blue-100 text-blue-700 font-medium rounded-full shadow-sm hover:bg-blue-200 transition-all duration-200"
          >
            Agent Assigning
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        <InventoryTable items={items} setItems={setItems} />
        <div className="mt-12">
          <Reports onExport={handleExportReport} />
        </div>
      </main>

      {/* Modals */}
      {showAdd && <AddItemModal onClose={() => setShowAdd(false)} onAdd={handleAddItem} />}
      {showBulk && <BulkUploadModal onClose={() => setShowBulk(false)} onUpload={handleBulkUpload} />}
      {showTrack && <TrackDeliveryModal onClose={() => setShowTrack(false)} />}
      {/* Placeholder: AgentAssignModal can be created later */}
      {showAgentAssign && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4 text-blue-700">Agent Assigning (Coming Soon)</h2>
            <p className="text-gray-600 mb-4">This feature is under development.</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setShowAgentAssign(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
