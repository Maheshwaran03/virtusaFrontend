import { useState, useRef, useEffect } from 'react';

export default function QRScanner({ onClose, onScan }) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        setError('');
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScan = () => {
    // Mock QR scan - in real implementation, you'd use a QR library
    const mockQRData = `DELIVERY_${Math.random().toString(36).substr(2, 9)}`;
    onScan(mockQRData);
  };

  const handleManualInput = () => {
    const qrCode = prompt('Enter QR code or delivery ID:');
    if (qrCode) {
      onScan(qrCode);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              QR Code Scanner
            </h2>
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Camera View */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              {!isScanning ? (
                <div className="aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-gray-600">Camera not started</p>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full aspect-video object-cover"
                />
              )}
              
              {/* Scanning Overlay */}
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-blue-500 w-48 h-48 rounded-lg relative">
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-2">
              {!isScanning ? (
                <button
                  onClick={startCamera}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Start Camera
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Stop Camera
                </button>
              )}
            </div>

            {/* Mock Scan Button */}
            <button
              onClick={handleScan}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              📱 Mock Scan QR Code
            </button>

            {/* Manual Input */}
            <button
              onClick={handleManualInput}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              📝 Manual Input
            </button>

            {/* Instructions */}
            <div className="text-xs text-gray-500 text-center">
              <p>Point camera at QR code or use manual input</p>
              <p>For demo: Click "Mock Scan QR Code"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 