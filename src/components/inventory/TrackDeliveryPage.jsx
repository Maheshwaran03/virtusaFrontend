import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function TrackDelivery() {
  const [sku, setSku] = useState("");
  const [agent, setAgent] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/delivery")
      .then((res) => {
        setDeliveries(res.data);
        setFilteredDeliveries(res.data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleSearch = () => {
    const filtered = deliveries.filter((d) =>
      (sku ? d.sku.toLowerCase().includes(sku.toLowerCase()) : true) &&
      (agent ? d.agent.toLowerCase().includes(agent.toLowerCase()) : true)
    );
    setFilteredDeliveries(filtered);
  };

  return (
    <div className="min-h-screen bg-blue-50 px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Track Delivery</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/inventory-dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Search Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="border px-4 py-2 rounded w-52"
        />
        <input
          type="text"
          placeholder="Agent"
          value={agent}
          onChange={(e) => setAgent(e.target.value)}
          className="border px-4 py-2 rounded w-52"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Delivery Records
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border border-collapse text-sm">
            <thead>
              <tr className="bg-blue-100 text-center">
                <th className="border px-4 py-2">SKU</th>
                <th className="border px-4 py-2">Agent</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Customer</th>
                <th className="border px-4 py-2">Mobile</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Damaged</th>
                <th className="border px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.length > 0 ? (
                filteredDeliveries.map((item, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="border px-2 py-1">{item.sku}</td>
                    <td className="border px-2 py-1">{item.agent}</td>
                    <td className="border px-2 py-1">{item.quantity}</td>
                    <td className="border px-2 py-1">{item.customerName}</td>
                    <td className="border px-2 py-1">{item.customerMobile || "-"}</td>
                    <td className="border px-2 py-1">{item.customerAddress}</td>
                    <td className="border px-2 py-1">{item.status}</td>
                    <td className="border px-2 py-1">{item.damaged || 0}</td>
                    <td className="border px-2 py-1">{item.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500 border">
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
