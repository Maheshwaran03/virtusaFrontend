import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function TrackDelivery() {
  const [sku, setSku] = useState("");
  const [agent, setAgent] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [agents, setAgents] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [selectedSignature, setSelectedSignature] = useState(null);
  const [selectedSignatureName, setSelectedSignatureName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/api/delivery")
      .then((res) => {
        setDeliveries(res.data);
        setFilteredDeliveries(res.data);
      })
      .catch((err) => console.error("Delivery fetch failed", err));

    axios.get("http://localhost:8080/api/inventory")
      .then((res) => setInventoryItems(res.data))
      .catch((err) => console.error("Inventory fetch failed", err));

    axios.get("http://localhost:8080/api/delivery/agents")
      .then((res) => setAgents(res.data))
      .catch((err) => console.error("Agent list fetch failed", err));
  }, []);

  const handleSearch = () => {
    const filtered = deliveries.filter((d) =>
      (sku ? d.sku.toLowerCase().includes(sku.toLowerCase()) : true) &&
      (agent ? d.agent.toLowerCase().includes(agent.toLowerCase()) : true)
    );
    setFilteredDeliveries(filtered);
  };

  const handleClear = () => {
    setSku("");
    setAgent("");
    setFilteredDeliveries(deliveries);
  };

  const handleDownloadCSV = () => {
    const headers = [
      "No", "SKU", "Product", "Agent", "Quantity", "Customer",
      "Mobile", "Address", "Priority", "Status", "Date", "Notes", "Signature"
    ];
    const rows = filteredDeliveries.map((item, idx) => [
      idx + 1,
      item.sku,
      getProductName(item.sku),
      getAgentName(item.agent),
      item.quantity,
      item.customerName,
      item.customerMobile || "-",
      item.customerAddress,
      item.priority,
      item.status,
      item.date,
      item.notes || "-",
      item.signatureBase64 ? "Available" : "Not Available"
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((f) => `"${f}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "delivery_records.csv";
    link.click();
  };

  const handleDownloadSignature = () => {
    const base64Data = selectedSignature.startsWith("data:image")
      ? selectedSignature
      : `data:image/png;base64,${selectedSignature}`;

    const a = document.createElement("a");
    a.href = base64Data;
    a.download = `${selectedSignatureName || "signature"}.png`;
    a.click();
  };

  const getProductName = (skuCode) => {
    const item = inventoryItems.find((i) => i.sku === skuCode);
    return item ? item.itemName : "N/A";
  };

  const getAgentName = (email) => {
    const agentObj = agents.find((a) => a.email === email);
    return agentObj ? agentObj.name : email;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "text-green-700 font-semibold";
      case "pending": return "text-yellow-700 font-semibold";
      case "in_progress": return "text-blue-700 font-semibold";
      case "damaged": return "text-red-700 font-semibold";
      case "door_locked": return "text-orange-700 font-semibold";
      default: return "text-gray-700";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "emergency":
        return "bg-red-100 text-red-800 border border-red-300 rounded px-2";
      case "perishable":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300 rounded px-2";
      case "normal":
        return "bg-green-100 text-green-800 border border-green-300 rounded px-2";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300 rounded px-2";
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Track Delivery</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/inventory-dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Search Inputs */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative">
          <input
            list="sku-options"
            type="text"
            placeholder="Search by SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="border rounded px-3 h-10 w-52"
          />
          <datalist id="sku-options">
            {inventoryItems.map((item, idx) => (
              <option key={idx} value={item.sku}>
                {item.itemName}
              </option>
            ))}
          </datalist>
          {sku && (
            <div className="absolute top-full mt-1 text-xs italic text-gray-600 whitespace-nowrap">
              Product: {getProductName(sku)}
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Search by Agent"
          value={agent}
          onChange={(e) => setAgent(e.target.value)}
          className="border rounded px-3 h-10 w-52"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 h-10 rounded hover:bg-blue-700"
        >
          Search
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-300 text-black px-4 h-10 rounded hover:bg-gray-400"
        >
          Clear
        </button>
        <button
          onClick={handleDownloadCSV}
          className="bg-red-600 text-white px-4 h-10 rounded hover:bg-red-700"
        >
          Download Records
        </button>
      </div>

      {/* Delivery Table */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4 text-center text-blue-700">Delivery Records</h3>

        <div className="overflow-x-auto">
          <table className="w-full border border-collapse text-sm text-center">
            <thead>
              <tr className="bg-blue-100">
                <th className="border px-2 py-2">No.</th>
                <th className="border px-2 py-2">SKU</th>
                <th className="border px-2 py-2">Product</th>
                <th className="border px-2 py-2">Agent</th>
                <th className="border px-2 py-2">Qty</th>
                <th className="border px-2 py-2">Customer</th>
                <th className="border px-2 py-2">Mobile</th>
                <th className="border px-2 py-2">Address</th>
                <th className="border px-2 py-2">Priority</th>
                <th className="border px-2 py-2">Status</th>
                <th className="border px-2 py-2">Date</th>
                <th className="border px-2 py-2">Notes</th>
                <th className="border px-2 py-2">Signature</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.length > 0 ? (
                filteredDeliveries.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{idx + 1}</td>
                    <td className="border px-2 py-1">{item.sku}</td>
                    <td className="border px-2 py-1">{getProductName(item.sku)}</td>
                    <td className="border px-2 py-1">{getAgentName(item.agent)}</td>
                    <td className="border px-2 py-1">{item.quantity}</td>
                    <td className="border px-2 py-1">{item.customerName}</td>
                    <td className="border px-2 py-1">{item.customerMobile || "-"}</td>
                    <td className="border px-2 py-1 whitespace-pre-wrap break-words max-w-xs">{item.customerAddress}</td>
                    <td className="border px-2 py-1">
                      <span className={getPriorityColor(item.priority)}>{item.priority || "normal"}</span>
                    </td>
                    <td className={`border px-2 py-1 ${getStatusColor(item.status)}`}>{item.status}</td>
                    <td className="border px-2 py-1">{item.date}</td>
                    <td className="border px-2 py-1">{item.notes || "-"}</td>
                    <td className="border px-2 py-1">
                      {item.signatureBase64 ? (
                        <button
                          onClick={() => {
                            setSelectedSignature(item.signatureBase64);
                            setSelectedSignatureName(item.sku || `signature_${idx + 1}`);
                          }}
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          View
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" className="text-center text-gray-500 py-4 border">
                    No deliveries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signature Modal */}
      {selectedSignature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg relative max-w-md w-full">
            <button
              onClick={() => setSelectedSignature(null)}
              className="absolute top-1 right-2 text-gray-600 text-xl hover:text-red-500"
            >
              &times;
            </button>
            <h4 className="text-lg font-semibold mb-4">Signature Preview</h4>
            <img
              src={
                selectedSignature.startsWith("data:image")
                  ? selectedSignature
                  : `data:image/png;base64,${selectedSignature}`
              }
              alt="Signature"
              className="max-w-full max-h-[400px] border"
            />
            <button
              onClick={handleDownloadSignature}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Download Signature
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
