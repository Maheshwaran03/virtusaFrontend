import { useState } from "react";

const tabs = [
  { label: "Delivered Goods", key: "delivered" },
  { label: "Damaged Goods", key: "damaged" },
  { label: "Pending Deliveries", key: "pending" },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState("delivered");

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Reports</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b">
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

      {/* Tab Content */}
      <div className="overflow-x-auto">
        {activeTab === "delivered" && <DeliveredGoods />}
        {activeTab === "damaged" && <DamagedGoods />}
        {activeTab === "pending" && <PendingDeliveries />}
      </div>
    </div>
  );
}

function DeliveredGoods() {
  const data = [
    { sku: "SKU001", itemName: "Milk", date: "2024-06-15", agent: "Agent 007" },
    { sku: "SKU003", itemName: "Canned Beans", date: "2024-06-14", agent: "Agent 008" },
  ];

  return (
    <Table
      headers={["SKU", "Item Name", "Delivered Date", "Agent"]}
      rows={data.map((d) => [d.sku, d.itemName, d.date, d.agent])}
    />
  );
}

function DamagedGoods() {
  const data = [
    { sku: "SKU002", itemName: "Tomatoes", date: "2024-06-13", agent: "Agent 009" },
  ];

  return (
    <Table
      headers={["SKU", "Item Name", "Damaged Date", "Agent"]}
      rows={data.map((d) => [d.sku, d.itemName, d.date, d.agent])}
    />
  );
}

function PendingDeliveries() {
  const data = [
    { agent: "Agent 010", pending: 5 },
    { agent: "Agent 011", pending: 2 },
  ];

  return (
    <Table
      headers={["Agent", "Pending Deliveries"]}
      rows={data.map((d) => [d.agent, d.pending])}
    />
  );
}

function Table({ headers, rows }) {
  return (
    <table className="w-full table-auto border border-gray-200 rounded">
      <thead>
        <tr className="bg-gray-100 text-left text-sm text-gray-700">
          {headers.map((h, idx) => (
            <th key={idx} className="px-2 py-2 border-b">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="text-sm text-gray-800">
        {rows.map((row, i) => (
          <tr key={i} className="hover:bg-gray-50 border-b">
            {row.map((cell, j) => (
              <td key={j} className="px-2 py-2">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
