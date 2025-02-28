
import React, { useRef, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Camera, X } from "lucide-react";

interface BarcodeScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (barcodeData: string) => void;
}

export const BarcodeScanner = ({ open, onClose, onScan }: BarcodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const scanIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const startCamera = async () => {
      if (!open) return;
      
      try {
        setIsScanning(true);
        
        if (videoRef.current) {
          console.log("Starting camera...");
          
          // Optimized constraints for mobile devices
          const constraints = {
            video: { 
              facingMode: "environment",
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 15 }
            }
          };
          
          // Get user media
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          
          // Set the stream to the video element
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            console.log("Camera started successfully");
            setHasPermission(true);
            
            // Start scanning for barcodes
            startBarcodeDetection();
          };
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        handleCameraError(error);
      }
    };

    const startBarcodeDetection = () => {
      // Clear any existing interval
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
      
      // Set up an interval to periodically check for barcodes
      scanIntervalRef.current = window.setInterval(scanForBarcode, 500);
    };

    const scanForBarcode = () => {
      if (!videoRef.current || !canvasRef.current || !isScanning) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      
      if (!context) return;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      try {
        // Get image data for barcode detection
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // If using a Web API barcode detection or sending to a server
        // This is where you would process the image data
        // For demo purposes, we'll simulate barcode detection with a timeout
        // In a real app, you would use a barcode detection library or service here
        
        // Simulate detection with BarcodeDetector API if available
        if ('BarcodeDetector' in window) {
          detectBarcodeWithAPI(canvas);
        } else {
          // Fallback: In a real implementation, you'd use a JS library here
          console.log("BarcodeDetector API not available");
        }
      } catch (error) {
        console.error("Error scanning barcode:", error);
      }
    };

    const detectBarcodeWithAPI = async (canvas: HTMLCanvasElement) => {
      try {
        // @ts-ignore - BarcodeDetector may not be in TypeScript definitions
        const barcodeDetector = new BarcodeDetector({
          formats: [
            'ean_13', 'ean_8', 'upc_a', 'upc_e', 
            'code_39', 'code_128', 'qr_code', 'data_matrix'
          ]
        });
        
        const barcodes = await barcodeDetector.detect(canvas);
        
        if (barcodes.length > 0) {
          console.log("Barcode detected:", barcodes[0].rawValue);
          handleBarcodeResult(barcodes[0].rawValue);
        }
      } catch (error) {
        console.error("Barcode detection error:", error);
      }
    };

    const handleCameraError = (error: any) => {
      console.error("Camera error details:", error);
      setHasPermission(false);
      setIsScanning(false);
      
      // Determine the specific error
      let errorMessage = "Failed to access the camera. Please check permissions.";
      
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        errorMessage = "Camera access was denied. Please allow camera access in your browser settings.";
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        errorMessage = "No camera found. Please ensure your device has a camera.";
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        errorMessage = "Camera is already in use by another application.";
      } else if (error.name === "OverconstrainedError") {
        errorMessage = "Camera constraints are not satisfied. Try a different camera.";
      }
      
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      });
    };

    const handleBarcodeResult = (barcodeData: string) => {
      // Show flash effect
      createFlashEffect();
      
      // Stop scanning
      cleanupStreams();
      
      // Pass the barcode data back to parent
      onScan(barcodeData);
    };

    const createFlashEffect = () => {
      if (!canvasRef.current || !videoRef.current) return;
      
      const flashContext = canvasRef.current.getContext('2d');
      if (flashContext) {
        // Set canvas dimensions
        canvasRef.current.width = videoRef.current.videoWidth || 640;
        canvasRef.current.height = videoRef.current.videoHeight || 480;
        
        // Create a flash effect
        flashContext.fillStyle = "rgba(255, 255, 255, 0.8)";
        flashContext.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Revert to normal after flash
        setTimeout(() => {
          if (flashContext) {
            flashContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        }, 300);
      }
    };

    // Clean up function for streams
    const cleanupStreams = () => {
      // Clear the scanning interval
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      
      // Stop all video streams
      if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach(track => {
          track.stop();
          console.log("Camera track stopped");
        });
        videoRef.current.srcObject = null;
      }
      
      setIsScanning(false);
    };

    if (open) {
      // Reset states when opening
      setHasPermission(null);
      startCamera();
    } else {
      // Clean up when closing
      cleanupStreams();
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      cleanupStreams();
    };
  }, [open, onScan, toast]);

  // Function to manually retry camera access
  const retryAccess = () => {
    console.log("Retrying camera access...");
    setHasPermission(null);
    
    // Ensure any existing streams are stopped
    if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    // The useEffect will handle restarting the camera since we changed hasPermission
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" closeButton={false}>
        <DialogHeader>
          <DialogTitle>Scan Product Barcode</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-full aspect-square bg-black rounded-md overflow-hidden">
            {hasPermission === false ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4 text-white">
                <p className="text-center">Camera access denied or unavailable</p>
                <Button onClick={retryAccess} variant="secondary" size="sm">
                  Retry
                </Button>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  playsInline
                  muted
                  autoPlay
                />
                <canvas 
                  ref={canvasRef} 
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                />
                {isScanning && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                    <Camera className="h-8 w-8 animate-pulse" />
                  </div>
                )}
              </>
            )}
          </div>
          <p className="text-sm text-center text-muted-foreground">
            {hasPermission === false 
              ? "Please allow camera access in your browser settings" 
              : "Position the barcode within the camera view to scan automatically"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
