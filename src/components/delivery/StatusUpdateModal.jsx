import { useState, useRef, useEffect } from 'react';

export default function StatusUpdateModal({ delivery, onClose, onUpdate }) {
  const [status, setStatus] = useState(delivery.status || 'pending');
  const [notes, setNotes] = useState(delivery.notes || '');
  const [signature, setSignature] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  // Load signature on mount
  useEffect(() => {
    if (delivery.signatureBase64) {
      setSignature(delivery.signatureBase64); // Set the state
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const image = new Image();
      image.onload = () => ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      image.src = delivery.signatureBase64;
    }
  }, [delivery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === 'delivered' && !signature) {
      alert("Please provide a signature for delivered status.");
      return;
    }

    const payload = {
      status,
      notes,
      signature,
    };
console.log(payload)
    fetch(`http://localhost:8080/api/delivery/${delivery.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        onUpdate(data);
        onClose();
      })
      .catch(err => console.error("Status update failed", err));
  };

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleStart = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasCoordinates(e);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    contextRef.current = ctx;
    setIsDrawing(true);
  };

  const handleMove = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoordinates(e);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const handleEnd = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL("image/png");
    setSignature(imageData); // Save signature as base64
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature('');
  };

  const statusOptions = [
    { value: 'delivered', label: 'Delivered', color: 'bg-green-600' },
    { value: 'door_locked', label: 'Door Locked', color: 'bg-yellow-600' },
    { value: 'damaged', label: 'Damaged/Return', color: 'bg-red-600' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-blue-600' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update Delivery Status</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Select Status</label>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {statusOptions.map(opt => (
              <button
                type="button"
                key={opt.value}
                className={`px-4 py-2 rounded text-white ${status === opt.value ? opt.color : 'bg-gray-400'}`}
                onClick={() => setStatus(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {status === 'delivered' && (
            <div className="mb-4">
              <label className="block mb-1 font-medium">Signature</label>
              <canvas
                ref={canvasRef}
                width={300}
                height={150}
                className="border border-gray-400 cursor-crosshair touch-none"
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
              />
              <button
                type="button"
                onClick={clearSignature}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Clear Signature
              </button>
              {signature && (
                <p className="text-xs text-gray-500 mt-1">Signature will be saved with delivery.</p>
              )}
            </div>
          )}

          <label className="block mb-1 font-medium">Notes</label>
          <textarea
            className="w-full border px-3 py-2 rounded mb-4"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes if any..."
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
