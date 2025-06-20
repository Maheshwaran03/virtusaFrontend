import { useState } from "react";

export default function BulkUploadModal({ onClose }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = e => {
    setFile(e.target.files[0]);
    setStatus("");
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!file) {
      setStatus("Please select a CSV file.");
      return;
    }
    // TODO: Connect to backend
    setStatus("Upload successful! (mock)");
    setTimeout(onClose, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Bulk Upload Inventory (CSV)</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full"
          />
          {status && <div className="text-green-600">{status}</div>}
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Upload</button>
        </form>
        <div className="mt-4 text-sm text-gray-500">
          <p>CSV columns: Item Name, SKU, Category, Quantity, Expiry Date, Is Perishable, Is Damaged</p>
        </div>
      </div>
    </div>
  );
} 