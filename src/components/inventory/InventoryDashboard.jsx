import { useState, useEffect } from "react";
import axios from "axios";
import InventoryTable from "./InventoryTable";
import Reports from "./Reports";
import { useNavigate } from "react-router-dom";

export default function InventoryDashboard() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchInventory = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage.");
      navigate("/adminLogin");
      return;
    }

    setLoading(true);
    axios
      .get("http://localhost:8080/api/inventory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setItems(res.data);
        const uniqueCategories = [
          ...new Set(res.data.map((item) => item.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
        console.log("Inventory refreshed successfully");
      })
      .catch((err) => {
        console.error("Error fetching inventory:", err);
        if (err.response?.status === 401) {
          console.warn("🔐 Unauthorized. Redirecting to login.");
          navigate("/adminLogin");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    console.log("InventoryDashboard mounted");

    const token = localStorage.getItem("token");

    if (!token || !token.includes(".")) {
      console.error("❌ Invalid or missing JWT token. Redirecting to login.");
      navigate("/adminLogin");
      return;
    }

    fetchInventory();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleExportReport = (headers, rows, type) => {
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `report_${type}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/adminLogin");
  };

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow px-4 sm:px-8 py-4 border-b border-blue-100">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            <h1 className="text-xl sm:text-2xl font-bold text-blue-700">
              Inventory Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4 text-blue-600">
            <span className="text-sm sm:text-base font-medium">
              ⏰ {time}
            </span>

            <button
              onClick={fetchInventory}
              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded shadow-sm transition"
              title="Refresh Inventory"
            >
              🔄 Refresh
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded shadow-sm transition"
              title="Logout"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Buttons */}
      <div className="bg-white px-4 sm:px-8 py-3 shadow-sm border-b border-blue-100">
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <button
            onClick={() => navigate("/inventory/add-item")}
            className="w-full sm:w-auto px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-full shadow-sm hover:bg-blue-200 transition-all"
          >
            + Add Item
          </button>
          <button
            onClick={() => navigate("/inventory/bulk-upload")}
            className="w-full sm:w-auto px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-full shadow-sm hover:bg-blue-200 transition-all"
          >
            Bulk Upload
          </button>
          <button
            onClick={() => navigate("/inventory/agent-assign")}
            className="w-full sm:w-auto px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-full shadow-sm hover:bg-blue-200 transition-all"
          >
            Delivery Assigning
          </button>
          <button
            onClick={() => navigate("/inventory/track-delivery")}
            className="w-full sm:w-auto px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-full shadow-sm hover:bg-blue-200 transition-all"
          >
            Track Delivery
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center text-blue-600 font-medium animate-pulse py-10">
            Loading inventory...
          </div>
        ) : (
          <>
            <InventoryTable items={items} setItems={setItems} categories={categories} />
            <div className="mt-12">
              <Reports onExport={handleExportReport} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
