import { useState } from "react";
import InventoryTable from "./InventoryTable";
import AddItemModal from "./AddItemModal";
import BulkUploadModal from "./BulkUploadModal";
import TrackDeliveryModal from "./TrackDeliveryModal";
import Reports from "./Reports";

export default function InventoryDashboard() {
  const [showAdd, setShowAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [showTrack, setShowTrack] = useState(false);

  const [items, setItems] = useState([
    {
      id: 1,
      itemName: "Milk",
      sku: "SKU001",
      category: "Dairy",
      quantity: 20,
      expiryDate: "2024-07-01",
      isPerishable: true,
      isDamaged: false,
    },
    {
      id: 2,
      itemName: "Tomatoes",
      sku: "SKU002",
      category: "Produce",
      quantity: 50,
      expiryDate: "2024-06-25",
      isPerishable: true,
      isDamaged: true,
    },
    {
      id: 3,
      itemName: "Canned Beans",
      sku: "SKU003",
      category: "Canned Goods",
      quantity: 100,
      expiryDate: "2025-01-01",
      isPerishable: false,
      isDamaged: false,
    },
  ]);

  const handleAddItem = (newItem) => {
    setItems((prev) => [...prev, { ...newItem, id: Date.now() }]);
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-blue-100">
        <h1 className="text-2xl font-bold text-blue-700">
          DLVery Inventory Management
        </h1>

        <div className="flex flex-wrap items-center justify-end gap-4 w-full md:w-auto md:ml-auto">
          <div className="flex flex-wrap gap-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setShowAdd(true)}
            >
              + Add Item
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setShowBulk(true)}
            >
              Bulk Upload
            </button>
            <button
              className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
              onClick={() => setShowTrack(true)}
            >
              Track Delivery
            </button>
          </div>
          <div>
          <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 flex items-center gap-2">
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
  </svg>
  Logout
</button>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
<InventoryTable items={items} setItems={setItems} />
        <div className="mt-12">
          <Reports />
        </div>
      </main>

      {/* Modals */}
      {showAdd && (
        <AddItemModal onClose={() => setShowAdd(false)} onAdd={handleAddItem} />
      )}
      {showBulk && <BulkUploadModal onClose={() => setShowBulk(false)} />}
      {showTrack && <TrackDeliveryModal onClose={() => setShowTrack(false)} />}
    </div>
  );
}
