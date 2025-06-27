// src/components/inventory/AddItemPage.jsx

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function AddItemPage() {
  const [form, setForm] = useState({
    itemName: "",
    sku: "",
    category: "",
    batch: "",
    quantity: 0,
    expiryDate: "",
    isPerishable: false,
    damaged: 0,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["quantity", "damaged"].includes(name)
        ? parseInt(value) || 0
        : value,
    }));
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async () => {
    if (!form.itemName || !form.sku) {
      return alert("Item Name and SKU are required.");
    }

    try {
      await axios.post("http://localhost:8080/api/inventory", form);
      alert("Item added successfully!");
      navigate("/inventory-dashboard");
    } catch (error) {
      console.error("Error adding item:", error.response?.data || error.message);
      alert("Failed to add item.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Add New Item</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/inventory-dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Item Name", name: "itemName" },
            { label: "SKU", name: "sku" },
            { label: "Category", name: "category" },
            { label: "Batch", name: "batch" },
            { label: "Quantity", name: "quantity", type: "number" },
            { label: "Expiry Date", name: "expiryDate", type: "date" },
            { label: "Damaged", name: "damaged", type: "number" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <label className="block mb-1 text-sm font-medium">{label}</label>
              <input
                className="border px-4 py-2 rounded w-full"
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={label}
              />
            </div>
          ))}

          <div className="flex items-center mt-2 sm:col-span-1">
            <input
              type="checkbox"
              name="isPerishable"
              checked={form.isPerishable}
              onChange={handleCheckbox}
              className="mr-2"
            />
            <label className="text-sm font-medium">Perishable</label>
          </div>
        </form>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
