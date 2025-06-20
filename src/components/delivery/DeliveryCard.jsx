import { useState } from 'react';

export default function DeliveryCard({ delivery, onStatusUpdate }) {
  const [expanded, setExpanded] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'perishable':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'damaged':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      case 'damaged':
        return 'Damaged/Return';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {delivery.customerName}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(delivery.priority)}`}>
                {delivery.priority.charAt(0).toUpperCase() + delivery.priority.slice(1)}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              📍 {delivery.address}
            </p>
            
            <p className="text-sm text-gray-600 mb-2">
              📞 {delivery.phone}
            </p>

            <div className="flex items-center space-x-2 mb-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                {getStatusText(delivery.status)}
              </span>
              <span className="text-xs text-gray-500">
                {delivery.deliveryDate}
              </span>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            {expanded ? '▼' : '▶'}
          </button>
        </div>

        {/* Action Buttons */}
        {delivery.status !== 'delivered' && (
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => onStatusUpdate(delivery)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Update Status
            </button>
            <button
              onClick={() => onStatusUpdate(delivery, 'delivered')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Mark Delivered
            </button>
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-6">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Items to Deliver:</h4>
              <div className="flex flex-wrap gap-1">
                {delivery.items.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {delivery.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Notes:</h4>
                <p className="text-sm text-gray-600">{delivery.notes}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => onStatusUpdate(delivery, 'delivered')}
                className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-green-700 transition-colors"
              >
                ✅ Delivered
              </button>
              <button
                onClick={() => onStatusUpdate(delivery, 'door_locked')}
                className="bg-yellow-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-yellow-700 transition-colors"
              >
                🔒 Door Locked
              </button>
              <button
                onClick={() => onStatusUpdate(delivery, 'damaged')}
                className="bg-red-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-700 transition-colors"
              >
                ❌ Damaged/Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 