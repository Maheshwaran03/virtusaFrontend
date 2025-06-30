import { useState } from 'react';

export default function DeliveryCard({ delivery, onStatusUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [showSignature, setShowSignature] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'perishable': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'damaged': return 'bg-red-100 text-red-800';
      case 'door_locked': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'in_progress': return 'In Progress';
      case 'pending': return 'Pending';
      case 'damaged': return 'Damaged/Return';
      case 'door_locked': return 'Door Locked';
      default: return status || 'Unknown';
    }
  };

  const priorityLabel = delivery.priority
    ? delivery.priority.charAt(0).toUpperCase() + delivery.priority.slice(1)
    : 'Normal';

  const encodedAddress = encodeURIComponent(delivery.customerAddress || '');

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {delivery.customerName || 'Unnamed Customer'}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(delivery.priority)}`}>
                  {priorityLabel}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2 whitespace-pre-line break-words">
                📍 {delivery.customerAddress || 'No address'}
                {delivery.customerAddress && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-800 text-ms ml-2 hover:underline"
                  >
                    🗺️ Route
                  </a>
                )}
              </p>

              <p className="text-sm text-gray-600 mb-2">📞 {delivery.customerMobile || 'No phone'}</p>

              {delivery.expiryDate && (
                <p className="text-xs text-red-500 mb-1">⏳ Expiry: {delivery.expiryDate}</p>
              )}

              <div className="flex items-center space-x-2 mb-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                  {getStatusText(delivery.status)}
                </span>
                <span className="text-xs text-gray-500">{delivery.date || 'No date'}</span>
              </div>

              {/* 🗑️ Removed "Last updated" timestamp */}

              {delivery.status === 'delivered' && delivery.signatureBase64 && (
                <button
                  onClick={() => setShowSignature(true)}
                  className="mt-1 text-blue-600 text-sm hover:underline"
                >
                  🖊️ View Signature
                </button>
              )}
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              {expanded ? '▼' : '▶'}
            </button>
          </div>

          {delivery.status !== 'delivered' && (
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => onStatusUpdate(delivery)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Update Status
              </button>
            </div>
          )}
        </div>

        {expanded && (
          <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-6">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Items to Deliver:</h4>
                <div className="flex flex-wrap gap-1">
                  {delivery.productName && delivery.quantity ? (
  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
    {delivery.productName} × {delivery.quantity}
  </span>
) : (
  <span className="text-xs text-gray-500 italic">No item info</span>
)}


                </div>
              </div>

              {delivery.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Notes:</h4>
                  <p className="text-sm text-gray-600">{delivery.notes}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                {delivery.status !== 'delivered' && (
                  <>
                    <button
                      onClick={() => onStatusUpdate(delivery)}
                      className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-green-700"
                    >
                      ✅ Delivered
                    </button>
                    <button
                      onClick={() => onStatusUpdate(delivery)}
                      className="bg-yellow-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-yellow-700"
                    >
                      🔒 Door Locked
                    </button>
                    <button
                      onClick={() => onStatusUpdate(delivery)}
                      className="bg-red-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-700"
                    >
                      ❌ Damaged/Return
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Signature Modal */}
      {showSignature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-3 text-center">Customer Signature</h2>
            <img src={delivery.signatureBase64} alt="Signature" className="w-full border border-gray-300" />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowSignature(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
