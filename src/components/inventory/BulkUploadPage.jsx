// src/components/inventory/BulkUploadPage.jsx

import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import axios from "axios";

export default function BulkUploadPage() {
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const items = rows.map((row) => {
        const expiryRaw = row["Expiry"];
        const expiryDate =
          typeof expiryRaw === "number"
            ? XLSX.SSF.format("yyyy-mm-dd", expiryRaw)
            : new Date(expiryRaw).toISOString().split("T")[0];

        return {
          itemName: row["Item Name"]?.toString().trim() || "",
          sku: row["SKU"]?.toString().trim() || "",
          category: row["Category"]?.toString().trim() || "",
          batch: row["Batch"]?.toString().trim() || "",
          quantity: parseInt(row["Quantity"], 10) || 0,
          expiryDate,
          isPerishable: ["yes", "Yes", true].includes(row["Perishable"]),
          damaged: parseInt(row["Damaged"], 10) || 0,
        };
      });

      try {
        await axios.post("http://localhost:8080/api/inventory/bulk", items);
        alert("Bulk upload successful!");
        navigate("/inventory-dashboard");
      } catch (error) {
        console.error("Bulk upload failed:", error.response?.data || error.message);
        alert("Bulk upload failed.");
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="min-h-screen bg-blue-50 px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Bulk Upload Inventory</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/inventory-dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
        <div className="mb-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="w-full p-2 border border-blue-300 rounded bg-white"
          />
        </div>
        <div className="text-sm text-blue-700 bg-blue-100 p-4 rounded">
          <p><strong>Upload Excel with columns:</strong></p>
          <p className="mt-1 font-semibold">
            Item Name, SKU, Category, Batch, Quantity, Expiry, Perishable, Damaged
          </p>
        </div>
      </div>
    </div>
  );
}
