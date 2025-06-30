// src/components/inventory/InventoryTable.jsx

import { useState } from "react";
import axios from "axios";
import { differenceInDays, parseISO } from "date-fns";

export default function InventoryTable({ items, setItems, categories = [] }) {
  const [filters, setFilters] = useState({ category: "", damaged: "", isPerishable: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleEditClick = (item) => {
    setEditingItem({
      ...item,
      damaged: item.damaged ?? 0,
      isPerishable: !!item.isPerishable,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingItem((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "damaged"
          ? parseInt(value) || 0
          : name === "isPerishable"
          ? value === "true"
          : value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:8080/api/inventory/${editingItem.id}`, editingItem);
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === editingItem.id ? editingItem : item))
      );
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/inventory/${id}`);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      if (editingItem?.id === id) setEditingItem(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item.");
    }
  };

  const getAlert = (item) => {
    let alerts = [];
    const today = new Date();

    if (item.expiryDate) {
      const expiry = parseISO(item.expiryDate);
      const daysUntilExpiry = differenceInDays(expiry, today);
      if (daysUntilExpiry <= 60) alerts.push(`Expires in ${daysUntilExpiry} day(s)`);
    }

    if (item.quantity < 20) alerts.push("Low stock");
    return alerts.join(", ");
  };

  const handleAlertReport = () => {
    const today = new Date();
    const alertItems = filteredItems.filter((item) => {
      const expiry = item.expiryDate ? parseISO(item.expiryDate) : null;
      const daysUntilExpiry = expiry ? differenceInDays(expiry, today) : Infinity;
      return item.quantity < 20 || daysUntilExpiry <= 60;
    });

    const headers = ["Item Name", "SKU", "Category", "Batch", "Quantity", "Expiry Date", "Perishable", "Damaged", "Alert"];
    const rows = alertItems.map((item) => [
      item.itemName,
      item.sku,
      item.category,
      item.batch,
      item.quantity,
      item.expiryDate,
      item.isPerishable ? "Yes" : "No",
      item.damaged,
      getAlert(item),
    ]);

    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "alert_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      item.itemName?.toLowerCase().includes(query) ||
      item.sku?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query) ||
      item.batch?.toLowerCase().includes(query);

    return (
      (!filters.category || item.category === filters.category) &&
      (!filters.damaged || (filters.damaged === "0" ? item.damaged === 0 : item.damaged > 0)) &&
      (!filters.isPerishable || (filters.isPerishable === "true" ? item.isPerishable : !item.isPerishable)) &&
      matchesSearch
    );
  });

  const indexOfLastItem = currentPage * recordsPerPage;
  const indexOfFirstItem = indexOfLastItem - recordsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (direction) => {
    const maxPage = Math.ceil(filteredItems.length / recordsPerPage);
    setCurrentPage((prev) => (direction === "prev" ? Math.max(prev - 1, 1) : Math.min(prev + 1, maxPage)));
  };

  return (
    <div className="bg-white rounded shadow p-4 sm:p-6">
      <h2 className="text-xl font-semibold mb-4">Inventory</h2>

      <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-4 items-center">
        <select className="border rounded px-2 py-1" value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}>
          <option value="">All Categories</option>
          {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
        </select>

        <select className="border rounded px-2 py-1" value={filters.damaged} onChange={(e) => setFilters((f) => ({ ...f, damaged: e.target.value }))}>
          <option value="">All</option>
          <option value="1">Damaged</option>
          <option value="0">Not Damaged</option>
        </select>

        <select className="border rounded px-2 py-1" value={filters.isPerishable} onChange={(e) => setFilters((f) => ({ ...f, isPerishable: e.target.value }))}>
          <option value="">All</option>
          <option value="true">Perishable</option>
          <option value="false">Non-Perishable</option>
        </select>

        <input type="text" placeholder="Search" className="border rounded px-2 py-1 w-full sm:w-48" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />

        <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onClick={handleAlertReport}>Stock Report</button>

        <div className="flex items-center gap-2 ml-0 md:ml-auto">
          <label className="text-sm text-gray-600">Records/Page:</label>
          <input type="number" className="border px-2 py-1 w-16 rounded" min="1" value={recordsPerPage} onChange={(e) => { setRecordsPerPage(Number(e.target.value)); setCurrentPage(1); }} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto mb-6 border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-2 py-1">Item Name</th>
              <th className="px-2 py-1">SKU</th>
              <th className="px-2 py-1">Category</th>
              <th className="px-2 py-1">Batch</th>
              <th className="px-2 py-1">Quantity</th>
              <th className="px-2 py-1">Expiry</th>
              <th className="px-2 py-1">Perishable</th>
              <th className="px-2 py-1">Damaged</th>
              <th className="px-2 py-1 text-red-600">Alerts</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? currentItems.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-2 py-1">{item.itemName}</td>
                <td className="px-2 py-1">{item.sku}</td>
                <td className="px-2 py-1">{item.category}</td>
                <td className="px-2 py-1">{item.batch}</td>
                <td className="px-2 py-1">{item.quantity}</td>
                <td className="px-2 py-1">{item.expiryDate}</td>
                <td className="px-2 py-1">{item.isPerishable ? "Yes" : "No"}</td>
                <td className="px-2 py-1">{item.damaged}</td>
                <td className="px-2 py-1 text-red-600">{getAlert(item)}</td>
                <td className="px-2 py-1">
                  <button className="text-blue-600 hover:underline mr-2" onClick={() => handleEditClick(item)}>Edit</button>
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="10" className="text-center py-2 text-gray-500">No items found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-4 mb-4">
        <button className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50" onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>Previous</button>
        <button className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50" onClick={() => handlePageChange("next")} disabled={indexOfLastItem >= filteredItems.length}>Next</button>
      </div>

      {editingItem && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Edit Item</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input className="border px-2 py-1" name="itemName" value={editingItem.itemName} onChange={handleInputChange} placeholder="Item Name" />
            <input className="border px-2 py-1" name="sku" value={editingItem.sku} onChange={handleInputChange} placeholder="SKU" />
            <input className="border px-2 py-1" name="category" value={editingItem.category} onChange={handleInputChange} placeholder="Category" />
            <input className="border px-2 py-1" name="batch" value={editingItem.batch} onChange={handleInputChange} placeholder="Batch" />
            <input className="border px-2 py-1" name="quantity" type="number" min="0" value={editingItem.quantity} onChange={handleInputChange} placeholder="Quantity" />
            <input className="border px-2 py-1" name="expiryDate" type="date" value={editingItem.expiryDate} onChange={handleInputChange} />
            <select className="border px-2 py-1" name="isPerishable" value={String(editingItem.isPerishable)} onChange={handleInputChange}>
              <option value="true">Perishable</option>
              <option value="false">Non-Perishable</option>
            </select>
            <input className="border px-2 py-1" name="damaged" type="number" min="0" value={editingItem.damaged} onChange={handleInputChange} placeholder="Damaged Count" />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleSaveChanges}>Save Changes</button>
          <button className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={() => setEditingItem(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
