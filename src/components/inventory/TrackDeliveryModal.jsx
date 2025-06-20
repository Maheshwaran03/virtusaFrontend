import { useState } from "react";

export default function TrackDeliveryModal({ onClose }) {
  const [sku, setSku] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Connect to backend
    setResult({
      sku,
      status: "Delivered",
      deliveredDate: "2024-06-15",
      deliveryAgent: "Agent 007",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Track Delivery by SKU</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Enter SKU"
            value={sku}
            onChange={e => setSku(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Track</button>
        </form>
        {result && (
          <div className="mt-4 bg-gray-50 p-4 rounded">
            <div><span className="font-semibold">SKU:</span> {result.sku}</div>
            <div><span className="font-semibold">Status:</span> {result.status}</div>
            <div><span className="font-semibold">Delivered Date:</span> {result.deliveredDate}</div>
            <div><span className="font-semibold">Delivery Agent:</span> {result.deliveryAgent}</div>
          </div>
        )}
      </div>
    </div>
  );
} 