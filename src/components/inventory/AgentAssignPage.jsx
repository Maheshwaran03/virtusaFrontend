import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AgentAssign() {
  const [assignments, setAssignments] = useState([]);
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [agent, setAgent] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [date, setDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [agentFilter, setAgentFilter] = useState("");
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/delivery")
      .then((res) => setAssignments(res.data))
      .catch((err) => console.error("Delivery list load failed", err));
  }, []);

  const resetForm = () => {
    setSku("");
    setQuantity(1);
    setAgent("");
    setCustomerName("");
    setCustomerMobile("");
    setCustomerAddress("");
    setDate("");
    setEditingId(null);
  };

  const handleAssign = () => {
    if (
      !sku.trim() ||
      quantity <= 0 ||
      !agent.trim() ||
      !customerName.trim() ||
      !customerMobile.trim() ||
      !customerAddress.trim() ||
      !date
    ) {
      alert("All fields are required.");
      return;
    }

    const payload = {
      sku,
      quantity,
      agent,
      customerName,
      customerMobile,
      customerAddress,
      date,
    };

    if (editingId !== null) {
      axios
        .put(`http://localhost:8080/api/delivery/${editingId}`, payload)
        .then((res) => {
          const updated = assignments.map((item) =>
            item.id === editingId ? res.data : item
          );
          setAssignments(updated);
          resetForm();
        })
        .catch((err) => console.error("Update failed", err));
    } else {
      axios
        .post("http://localhost:8080/api/delivery", payload)
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
    setEditingId(item.id);
  };

  const filteredAssignments = assignments.filter((a) =>
    (agentFilter ? a.agent.toLowerCase().includes(agentFilter.toLowerCase()) : true) &&
    (statusFilter ? a.status === statusFilter : true)
  );

  return (
    <div className="min-h-screen bg-blue-50 px-8 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-800">Update Inventory for Delivery</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/inventory-dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Form Section */}
      <div className="flex flex-col gap-4 bg-white p-6 rounded shadow mb-6">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Enter SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="border px-4 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border px-4 py-2 rounded w-24"
          />
          <input
            type="text"
            placeholder="Delivery Agent"
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
            className="border px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="border px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Customer Mobile"
            value={customerMobile}
            onChange={(e) => setCustomerMobile(e.target.value)}
            className="border px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Customer Address"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            className="border px-4 py-2 rounded w-64"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-4 py-2 rounded"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={resetForm}
            className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {editingId !== null ? "Update" : "Assign"}
          </button>
        </div>
      </div>

      {/* Assigned Deliveries */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Assigned Deliveries</h3>

        {/* Filters */}
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            placeholder="Filter by agent"
            className="border px-3 py-2 rounded"
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
          />
          <select
            className="border px-3 py-2 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="delivered">Delivered</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-collapse text-sm">
            <thead>
              <tr className="bg-blue-100 text-center">
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">SKU</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Agent</th>
                <th className="border px-4 py-2">Customer</th>
                <th className="border px-4 py-2">Mobile</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((a, idx) => (
                <tr key={a.id || idx} className="text-center">
                  <td className="border px-2 py-1">{idx + 1}</td>
                  <td className="border px-2 py-1">{a.sku}</td>
                  <td className="border px-2 py-1">{a.quantity}</td>
                  <td className="border px-2 py-1">{a.agent}</td>
                  <td className="border px-2 py-1">{a.customerName}</td>
                  <td className="border px-2 py-1">{a.customerMobile}</td>
                  <td className="border px-2 py-1">{a.customerAddress}</td>
                  <td className="border px-2 py-1">{a.date}</td>
                  <td className="border px-2 py-1">{a.status}</td>
                  <td className="border px-2 py-1">
                    <button
                      className="bg-yellow-400 px-3 py-1 rounded text-white hover:bg-yellow-500"
                      onClick={() => handleEdit(a)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
