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
      .catch((err) => console.error("Add item error", err));
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
      {/* Header */}
      <header className="bg-white shadow px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-blue-100">
        <h1 className="text-2xl font-bold text-blue-700">DLVery Inventory Management</h1>
        <div className="flex flex-wrap items-center justify-end gap-4 w-full md:w-auto md:ml-auto">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => setShowAdd(true)}>+ Add Item</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setShowBulk(true)}>Bulk Upload</button>
          <button className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500" onClick={() => setShowTrack(true)}>Track Delivery</button>
         <button
  className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 flex items-center gap-2"
  onClick={() => {
    localStorage.removeItem("userType");
    // eslint-disable-next-line no-undef
    navigate("/login");
  }}
>
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
  </svg>
  Logout
</button>

        </div>
      </header>

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
    </div>
  );
}