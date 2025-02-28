
import React, { useRef, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Camera, X } from "lucide-react";
import { BrowserMultiFormatReader, Result, BarcodeFormat } from '@zxing/library';

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
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize the barcode reader with specific hints
    if (!readerRef.current) {
      const hints = new Map();
      hints.set(2, true); // Try harder mode
      const formats = [
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.CODE_39,
        BarcodeFormat.CODE_128
      ];
      
      readerRef.current = new BrowserMultiFormatReader(hints);
      readerRef.current.setFormats(formats);
    }

    let stream: MediaStream | null = null;

    const startCamera = async () => {
      if (!open) return;
      
      try {
        setIsScanning(true);
        
        if (readerRef.current) {
          // Stop any previous scanning
          readerRef.current.reset();
          
          // Get video element
          if (videoRef.current) {
            // Start continuous scanning
            readerRef.current.decodeFromConstraints(
              {
                video: { 
                  facingMode: "environment",
                  width: { ideal: 1280 },
                  height: { ideal: 720 }
                }
              },
              videoRef.current,
              (result: Result | null, error: Error | undefined) => {
                if (result) {
                  console.log("Barcode found:", result.getText());
                  handleBarcodeResult(result.getText());
                }
                
                if (error && !(error instanceof TypeError)) {
                  // TypeError occurs between scans, so we ignore those
                  console.log("Scan error:", error);
                }
              }
            ).then(() => {
              setHasPermission(true);
              
              // Get the stream to be able to close it later
              if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
                stream = videoRef.current.srcObject;
              }
            }).catch((err) => {
              console.error("Error starting scan:", err);
              handleCameraError(err);
            });
          }
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        handleCameraError(error);
      }
    };

    const handleCameraError = (error: any) => {
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

    const handleBarcodeResult = async (barcodeData: string) => {
      // Show flash effect
      createFlashEffect();
      
      // Stop scanning
      if (readerRef.current) {
        readerRef.current.reset();
      }
      
      setIsScanning(false);
      
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
          if (videoRef.current && canvasRef.current && flashContext) {
            flashContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        }, 300);
      }
    };

    if (open) {
      // Reset states when opening
      setHasPermission(null);
      startCamera();
    } else {
      // Clean up when closing
      setIsScanning(false);
      if (readerRef.current) {
        readerRef.current.reset();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }

    return () => {
      setIsScanning(false);
      if (readerRef.current) {
        readerRef.current.reset();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [open, onScan, toast]);

  // Function to manually retry camera access
  const retryAccess = () => {
    setHasPermission(null);
    setIsScanning(true);
    
    if (readerRef.current) {
      readerRef.current.reset();
    }
    
    // The main useEffect will handle restarting the camera
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
