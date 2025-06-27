// src/components/inventory/InventoryDashboard.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import InventoryTable from "./InventoryTable";
import Reports from "./Reports";
import { useNavigate } from "react-router-dom";

export default function InventoryDashboard() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("InventoryDashboard mounted");
    axios
      .get("http://localhost:8080/api/inventory")
      .then((res) => {
        console.log("Fetched inventory items:", res.data.length);
        setItems(res.data);

        // ✅ Extract unique categories
        const uniqueCategories = [
          ...new Set(res.data.map((item) => item.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((err) => console.error("Error fetching inventory:", err));
  }, []);

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

      {/* Navigation Buttons */}
      <div className="bg-white px-8 py-3 shadow-sm border-b border-blue-100">
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/inventory/add-item")}
            className="px-5 py-2 bg-blue-100 text-blue-700 font-medium rounded-full shadow-sm hover:bg-blue-200 transition-all duration-200"
          >
            + Add Item
          </button>
          <button
            onClick={() => navigate("/inventory/bulk-upload")}
            className="px-5 py-2 bg-blue-100 text-blue-700 font-medium rounded-full shadow-sm hover:bg-blue-200 transition-all duration-200"
          >
            Bulk Upload
          </button>
          <button
            onClick={() => navigate("/inventory/agent-assign")}
            className="px-5 py-2 bg-blue-100 text-blue-700 font-medium rounded-full shadow-sm hover:bg-blue-200 transition-all duration-200"
          >
            Delivery Assigning
          </button>
          <button
            onClick={() => navigate("/inventory/track-delivery")}
            className="px-5 py-2 bg-blue-100 text-blue-700 font-medium rounded-full shadow-sm hover:bg-blue-200 transition-all duration-200"
          >
            Track Delivery
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        {/* ✅ Pass categories here */}
        <InventoryTable items={items} setItems={setItems} categories={categories} />
        <div className="mt-12">
          <Reports onExport={handleExportReport} />
        </div>
      </main>
    </div>
  );
}
