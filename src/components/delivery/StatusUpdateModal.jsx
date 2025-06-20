import { useState, useRef } from 'react';

export default function StatusUpdateModal({ delivery, onClose, onUpdate }) {
  const [status, setStatus] = useState(delivery.status);
  const [notes, setNotes] = useState('');
  const [signature, setSignature] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const statusOptions = [
    { value: 'delivered', label: 'Delivered', color: 'bg-green-600' },
    { value: 'door_locked', label: 'Door Locked', color: 'bg-yellow-600' },
    { value: 'damaged', label: 'Damaged/Return', color: 'bg-red-600' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-blue-600' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(delivery.id, status, signature, notes);
  };

  const handleSignatureStart = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.strokeStyle = '#000';
    context.lineWidth = 2;
    context.lineCap = 'round';
    contextRef.current = context;
    setIsDrawing(true);
  };

  const handleSignatureMove = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const context = contextRef.current;
    context.lineTo(x, y);
    context.stroke();
  };

  const handleSignatureEnd = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    setSignature(canvas.toDataURL());
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    setSignature('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Update Delivery Status
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">
              {delivery.customerName}
            </h3>
            <p className="text-sm text-gray-600">{delivery.address}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStatus(option.value)}
                    className={`p-3 rounded-lg text-sm font-medium text-white transition-colors ${
                      status === option.value
                        ? option.color
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Signature Capture */}
            {status === 'delivered' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Signature
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <canvas
                    ref={canvasRef}
                    width={300}
                    height={150}
                    className="border border-gray-300 rounded bg-white cursor-crosshair"
                    onMouseDown={handleSignatureStart}
                    onMouseMove={handleSignatureMove}
                    onMouseUp={handleSignatureEnd}
                    onMouseLeave={handleSignatureEnd}
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Clear Signature
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any additional notes about the delivery..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Update Status
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 