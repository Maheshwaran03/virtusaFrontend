import { useState } from "react";
import axios from "axios";

export default function InventoryTable({ items, setItems }) {
  const [filters, setFilters] = useState({
    category: "",
    isDamaged: "",
    isPerishable: "",
  });

  const [editingItem, setEditingItem] = useState(null);

  const handleEditClick = (item) => {
    setEditingItem({ ...item });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingItem((prev) => ({
      ...prev,
      [name]:
        name === "quantity"
          ? parseInt(value)
          : name === "isDamaged" || name === "isPerishable"
          ? value === "true"
          : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8080/api/inventory/${editingItem.id}`, editingItem);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editingItem.id ? editingItem : item
        )
      );
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/api/inventory/${id}`);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      if (editingItem && editingItem.id === id) {
        setEditingItem(null);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item.");
    }
  };

  const filteredItems = items.filter((item) => {
    return (
      (!filters.category || item.category === filters.category) &&
      (!filters.isDamaged || String(item.isDamaged) === filters.isDamaged) &&
      (!filters.isPerishable || String(item.isPerishable) === filters.isPerishable)
    );
  });

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Inventory</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          className="border rounded px-2 py-1"
          value={filters.category}
          onChange={(e) =>
            setFilters((f) => ({ ...f, category: e.target.value }))
          }
        >
          <option value="">All Categories</option>
          <option value="Dairy">Dairy</option>
          <option value="Produce">Produce</option>
          <option value="Canned Goods">Canned Goods</option>
        </select>
        <select
          className="border rounded px-2 py-1"
          value={filters.isDamaged}
          onChange={(e) =>
            setFilters((f) => ({ ...f, isDamaged: e.target.value }))
          }
        >
          <option value="">All</option>
          <option value="true">Damaged</option>
          <option value="false">Not Damaged</option>
        </select>
        <select
          className="border rounded px-2 py-1"
          value={filters.isPerishable}
          onChange={(e) =>
            setFilters((f) => ({ ...f, isPerishable: e.target.value }))
          }
        >
          <option value="">All</option>
          <option value="true">Perishable</option>
          <option value="false">Non-Perishable</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full table-auto mb-6 border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-2 py-1">Item Name</th>
            <th className="px-2 py-1">SKU</th>
            <th className="px-2 py-1">Category</th>
            <th className="px-2 py-1">Quantity</th>
            <th className="px-2 py-1">Expiry</th>
            <th className="px-2 py-1">Perishable</th>
            <th className="px-2 py-1">Damaged</th>
            <th className="px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="px-2 py-1">{item.itemName}</td>
              <td className="px-2 py-1">{item.sku}</td>
              <td className="px-2 py-1">{item.category}</td>
              <td className="px-2 py-1">{item.quantity}</td>
              <td className="px-2 py-1">{item.expiryDate}</td>
              <td className="px-2 py-1">{item.isPerishable ? "Yes" : "No"}</td>
              <td className="px-2 py-1">{item.isDamaged ? "Yes" : "No"}</td>
              <td className="px-2 py-1">
                <button
                  className="text-blue-600 hover:underline mr-2"
                  onClick={() => handleEditClick(item)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Form */}
      {editingItem && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Edit Item</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              className="border px-2 py-1"
              name="itemName"
              value={editingItem.itemName}
              onChange={handleInputChange}
              placeholder="Item Name"
            />
            <input
              className="border px-2 py-1"
              name="sku"
              value={editingItem.sku}
              onChange={handleInputChange}
              placeholder="SKU"
            />
            <input
              className="border px-2 py-1"
              name="category"
              value={editingItem.category}
              onChange={handleInputChange}
              placeholder="Category"
            />
            <input
              className="border px-2 py-1"
              name="quantity"
              type="number"
              value={editingItem.quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
            />
            <input
              className="border px-2 py-1"
              name="expiryDate"
              type="date"
              value={editingItem.expiryDate}
              onChange={handleInputChange}
            />
            <select
              className="border px-2 py-1"
              name="isPerishable"
              value={String(editingItem.isPerishable)}
              onChange={handleInputChange}
            >
              <option value="true">Perishable</option>
              <option value="false">Non-Perishable</option>
            </select>
            <select
              className="border px-2 py-1"
              name="isDamaged"
              value={String(editingItem.isDamaged)}
              onChange={handleInputChange}
            >
              <option value="true">Damaged</option>
              <option value="false">Not Damaged</option>
            </select>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleUpdate}
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
