import * as XLSX from "xlsx";

export default function BulkUploadModal({ onClose, onUpload }) {
  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    const data = evt.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const parsedItems = rows.map((row) => {
      const expiryValue = row["Expiry"];

      // Convert Excel date serial number to ISO string if needed
      const parsedExpiryDate = typeof expiryValue === "number"
        ? XLSX.SSF.format("yyyy-mm-dd", expiryValue)
        : new Date(expiryValue).toISOString().split("T")[0];

      return {
        itemName: String(row["Item Name"]).trim(),
        sku: String(row["SKU"]).trim(),
        category: String(row["Category"]).trim(),
        quantity: parseInt(row["Quantity"], 10) || 0,
        expiryDate: parsedExpiryDate,
        isPerishable:
          row["Perishable"] === "Yes" ||
          row["Perishable"] === "yes" ||
          row["Perishable"] === true,
        isDamaged:
          row["Damaged"] === "Yes" ||
          row["Damaged"] === "yes" ||
          row["Damaged"] === true,
      };
    });

    onUpload(parsedItems);
    onClose();
  };
  reader.readAsBinaryString(file);
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-blue-50 border border-blue-300 rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-blue-700 text-xl font-bold hover:text-blue-900"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Bulk Upload Inventory</h2>
        
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="w-full mb-6 p-2 border border-blue-300 rounded bg-white"
        />

        <div className="text-sm text-blue-700 bg-blue-100 p-3 rounded">
          <p><strong>Upload Excel with columns:</strong></p>
          <p className="mt-1 font-semibold">
            Item Name, SKU, Category, Quantity, Expiry, Perishable, Damaged
          </p>
        </div>
      </div>
    </div>
  );
}
