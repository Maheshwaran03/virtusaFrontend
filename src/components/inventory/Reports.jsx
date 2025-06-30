import { useEffect, useState } from "react";
import axios from "axios";

const tabs = [
  { label: "Delivered Goods", key: "delivered" },
  { label: "Damaged Goods", key: "damaged" },
  { label: "Pending Deliveries", key: "pending" },
];

export default function Reports({ onExport }) {
  const [activeTab, setActiveTab] = useState("delivered");
  const [deliveredData, setDeliveredData] = useState([]);
  const [damagedData, setDamagedData] = useState([]);
  const [pendingData, setPendingData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "delivered") {
          const res = await axios.get("http://localhost:8080/api/delivery/status/delivered");
          setDeliveredData(res.data);
        } else if (activeTab === "damaged") {
          const res = await axios.get("http://localhost:8080/api/delivery/status/damaged");
          setDamagedData(res.data);
        } else if (activeTab === "pending") {
          const res = await axios.get("http://localhost:8080/api/delivery/status/pending/count");
          setPendingData(res.data);
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab} data`, err);
      }
    };

    fetchData();
  }, [activeTab]);

  const exportData = () => {
    let headers = [], rows = [];

    if (activeTab === "delivered") {
      headers = ["SKU", "Customer", "Delivered Date", "Agent"];
      rows = deliveredData.map(d => [d.sku, d.customerName, d.date, d.agent]);
    } else if (activeTab === "damaged") {
      headers = ["SKU", "Customer", "Damaged Date", "Agent"];
      rows = damagedData.map(d => [d.sku, d.customerName, d.date, d.agent]);
    } else if (activeTab === "pending") {
      headers = ["Agent", "Pending Deliveries"];
      rows = pendingData.map(d => [d.agent, d.pending]);
    }

    onExport(headers, rows, activeTab);
  };

  return (
    <div className="bg-white rounded shadow p-4 sm:p-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Reports</h2>
        <button
          onClick={exportData}
          className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
        >
          Export Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 px-4 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-blue-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {activeTab === "delivered" && (
          <Table
            headers={["SKU", "Customer", "Delivered Date", "Agent"]}
            rows={deliveredData.map(d => [d.sku, d.customerName, d.date, d.agent])}
          />
        )}
        {activeTab === "damaged" && (
          <Table
            headers={["SKU", "Customer", "Damaged Date", "Agent"]}
            rows={damagedData.map(d => [d.sku, d.customerName, d.date, d.agent])}
          />
        )}
        {activeTab === "pending" && (
          <Table
            headers={["Agent", "Pending Deliveries"]}
            rows={pendingData.map(d => [d.agent, d.pending])}
          />
        )}
      </div>
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <table className="w-full table-auto border border-gray-200 rounded text-sm">
      <thead>
        <tr className="bg-gray-100 text-gray-700">
          {headers.map((header, index) => (
            <th key={index} className="px-3 py-2 border-b text-left">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody className="text-gray-800">
        {rows.length > 0 ? (
          rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 border-b">
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="px-3 py-2">{cell}</td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length} className="px-3 py-4 text-center text-gray-500">
              No data available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
