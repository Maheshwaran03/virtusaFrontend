import { useState } from "react";

export default function AddItemModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    itemName: "",
    sku: "",
    category: "",
    quantity: 0,
    expiryDate: "",
    isPerishable: false,
    isDamaged: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : value,
    }));
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = () => {
    if (form.itemName && form.sku) {
      onAdd(form);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white rounded p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Add New Item</h2>

        <input
          className="border px-2 py-1 mb-2 w-full"
          name="itemName"
          value={form.itemName}
          onChange={handleChange}
          placeholder="Item Name"
        />
        <input
          className="border px-2 py-1 mb-2 w-full"
          name="sku"
          value={form.sku}
          onChange={handleChange}
          placeholder="SKU"
        />
        <input
          className="border px-2 py-1 mb-2 w-full"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
        />
        <input
          className="border px-2 py-1 mb-2 w-full"
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity"
        />
        <input
          className="border px-2 py-1 mb-2 w-full"
          type="date"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
        />
        <label className="block mb-1">
          <input
            type="checkbox"
            name="isPerishable"
            checked={form.isPerishable}
            onChange={handleCheckbox}
            className="mr-1"
          />
          Perishable
        </label>
        <label className="block mb-4">
          <input
            type="checkbox"
            name="isDamaged"
            checked={form.isDamaged}
            onChange={handleCheckbox}
            className="mr-1"
          />
          Damaged
        </label>

        <div className="flex justify-end">
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
            Add
          </button>
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
