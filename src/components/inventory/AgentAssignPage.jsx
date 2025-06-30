import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AgentAssign() {
  const [assignments, setAssignments] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [agent, setAgent] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [priority, setPriority] = useState("normal");
  const [statusFilter, setStatusFilter] = useState("");
  const [agentFilter, setAgentFilter] = useState("");
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/api/delivery")
      .then((res) => setAssignments(res.data))
      .catch((err) => console.error("Delivery list load failed", err));

    axios.get("http://localhost:8080/api/inventory")
      .then((res) => setInventoryItems(res.data))
      .catch((err) => console.error("Inventory fetch failed", err));
  }, []);

  const resetForm = () => {
    setSku("");
    setQuantity(1);
    setAgent("");
    setCustomerName("");
    setCustomerMobile("");
    setCustomerAddress("");
    setDate(new Date().toISOString().slice(0, 10));
    setPriority("normal");
    setEditingId(null);
  };

  const getProductName = (skuCode) => {
    const match = inventoryItems.find(item => item.sku === skuCode);
    return match ? match.itemName : "N/A";
  };

  const handleAssign = () => {
    if (!sku.trim() || quantity <= 0 || !agent.trim() || !customerName.trim() || !customerMobile.trim() || !customerAddress.trim() || !date) {
      alert("All fields are required.");
      return;
    }

    const payload = {
      sku,
      productName: getProductName(sku), // ✅ Added product name
      quantity,
      agent,
      customerName,
      customerMobile,
      customerAddress,
      date,
      priority,
      status: "pending",
    };

    if (editingId !== null) {
      axios.put(`http://localhost:8080/api/delivery/${editingId}`, payload)
        .then((res) => {
          const updated = assignments.map((item) => item.id === editingId ? res.data : item);
          setAssignments(updated);
          resetForm();
        })
        .catch((err) => console.error("Update failed", err));
    } else {
      axios.post("http://localhost:8080/api/delivery", payload)
        .then((res) => {
          setAssignments((prev) => [...prev, res.data]);
          resetForm();
        })
        .catch((err) => console.error("Assignment failed", err));
    }
  };

  const handleEdit = (item) => {
    setSku(item.sku);
    setQuantity(item.quantity);
    setAgent(item.agent);
    setCustomerName(item.customerName);
    setCustomerMobile(item.customerMobile || "");
    setCustomerAddress(item.customerAddress);
    setDate(item.date);
    setPriority(item.priority || "normal");
    setEditingId(item.id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "text-green-700 font-medium";
      case "pending": return "text-yellow-700 font-medium";
      case "in_progress": return "text-blue-700 font-medium";
      case "door_locked": return "text-yellow-800 font-medium";
      case "damaged": return "text-red-700 font-medium";
      default: return "text-gray-600";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'perishable': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAssignments = assignments.filter((a) =>
    (agentFilter ? a.agent.toLowerCase().includes(agentFilter.toLowerCase()) : true) &&
    (statusFilter ? a.status === statusFilter : true)
  );

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Assign Delivery to Agent</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/inventory-dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* SKU Input */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">SKU</label>
            <input
              list="sku-options"
              type="text"
              placeholder="SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="border px-4 py-2 rounded w-full"
            />
            <datalist id="sku-options">
              {inventoryItems.map((item, idx) => (
                <option key={idx} value={item.sku}>
                  {item.itemName}
                </option>
              ))}
            </datalist>
            {sku && (
              <span className="text-xs italic text-gray-600 mt-1 block">
                Product: {getProductName(sku)}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Quantity</label>
            <input
              type="number"
              placeholder="Qty"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border px-4 py-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Agent Name</label>
            <input
              type="text"
              placeholder="Agent"
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              className="border px-4 py-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Customer Name</label>
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border px-4 py-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Mobile No</label>
            <input
              type="text"
              placeholder="Mobile"
              value={customerMobile}
              onChange={(e) => setCustomerMobile(e.target.value)}
              className="border px-4 py-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Address</label>
            <input
              type="text"
              placeholder="Address"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="border px-4 py-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Delivery Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border px-4 py-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border px-4 py-2 rounded w-full"
            >
              <option value="normal">Normal</option>
              <option value="perishable">Perishable</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button onClick={resetForm} className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button onClick={handleAssign} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            {editingId !== null ? "Update" : "Assign"}
          </button>
        </div>
      </div>

      {/* Delivery Table */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Assigned Deliveries</h3>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by agent"
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="in_progress">In Progress</option>
            <option value="door_locked">Door Locked</option>
            <option value="damaged">Damaged</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-collapse text-sm text-center">
            <thead>
              <tr className="bg-blue-100">
                <th className="border px-4 py-2">No.</th>
                <th className="border px-4 py-2">SKU</th>
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">Qty</th>
                <th className="border px-4 py-2">Agent</th>
                <th className="border px-4 py-2">Customer</th>
                <th className="border px-4 py-2">Mobile</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Priority</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((a, idx) => (
                <tr key={a.id || idx}>
                  <td className="border px-2 py-1">{idx + 1}</td>
                  <td className="border px-2 py-1">{a.sku}</td>
                  <td className="border px-2 py-1">{a.productName || getProductName(a.sku)}</td>
                  <td className="border px-2 py-1">{a.quantity}</td>
                  <td className="border px-2 py-1">{a.agent}</td>
                  <td className="border px-2 py-1">{a.customerName}</td>
                  <td className="border px-2 py-1">{a.customerMobile}</td>
                  <td className="border px-2 py-1 whitespace-pre-wrap break-words max-w-xs">{a.customerAddress}</td>
                  <td className="border px-2 py-1">{a.date}</td>
                  <td className="border px-2 py-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(a.priority)}`}>
                      {a.priority || "normal"}
                    </span>
                  </td>
                  <td className={`border px-2 py-1 ${getStatusColor(a.status)}`}>{a.status}</td>
                  <td className="border px-2 py-1">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      onClick={() => handleEdit(a)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAssignments.length === 0 && (
                <tr>
                  <td colSpan="12" className="text-center text-gray-500 py-4">
                    No assignments found.
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
