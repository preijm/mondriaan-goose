
import React, { useRef, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Camera, X } from "lucide-react";
import Quagga from "quagga";

interface BarcodeScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (barcodeData: string) => void;
}

export const BarcodeScanner = ({ open, onClose, onScan }: BarcodeScannerProps) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize and start Quagga when dialog opens
    const initQuagga = () => {
      if (!open || !scannerRef.current) return;

      console.log("Initializing QuaggaJS scanner...");
      
      setIsScanning(true);
      
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            facingMode: "environment",
            width: { min: 640 },
            height: { min: 480 },
            aspectRatio: { min: 1, max: 2 }
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        decoder: {
          readers: [
            "ean_reader",
            "ean_8_reader",
            "upc_reader",
            "code_128_reader",
            "code_39_reader"
          ]
        },
        locate: true
      }, function(err) {
        if (err) {
          console.error("QuaggaJS initialization error:", err);
          setHasPermission(false);
          setIsScanning(false);
          
          toast({
            title: "Camera Error",
            description: "Could not access camera: " + err.message,
            variant: "destructive",
          });
          return;
        }
        
        console.log("QuaggaJS initialized successfully");
        setHasPermission(true);
        
        // Start detection once initialized
        Quagga.start();
        
        // Add a class to properly style the video element
        if (scannerRef.current) {
          const videoEl = scannerRef.current.querySelector("video");
          if (videoEl) {
            videoEl.classList.add("absolute", "top-0", "left-0", "w-full", "h-full", "object-cover");
          }
        }
      });

      // Set up barcode detection handlers
      Quagga.onDetected((result) => {
        if (result && result.codeResult && result.codeResult.code) {
          console.log("Barcode detected:", result.codeResult.code);
          handleBarcodeResult(result.codeResult.code);
        }
      });

      // Register debug handlers if needed
      Quagga.onProcessed((result) => {
        if (!result) return;
        
        const drawingCanvas = document.querySelector('canvas.drawingBuffer') as HTMLCanvasElement;
        if (drawingCanvas) {
          // Make this canvas fill its container
          drawingCanvas.style.position = 'absolute';
          drawingCanvas.style.top = '0';
          drawingCanvas.style.left = '0';
          drawingCanvas.style.width = '100%';
          drawingCanvas.style.height = '100%';
        }
      });
    };

    const handleBarcodeResult = (barcodeData: string) => {
      // Play a beep sound or create a flash effect
      createFlashEffect();
      
      // Clean up Quagga
      Quagga.stop();
      setIsScanning(false);
      
      // Send barcode data to parent
      console.log("Sending barcode data to parent:", barcodeData);
      onScan(barcodeData);
    };

    const createFlashEffect = () => {
      if (!scannerRef.current) return;
      
      // Create a flash effect div
      const flashDiv = document.createElement('div');
      flashDiv.className = 'absolute inset-0 bg-white opacity-80 z-10';
      scannerRef.current.appendChild(flashDiv);
      
      // Remove the flash effect after a short delay
      setTimeout(() => {
        if (flashDiv.parentNode) {
          flashDiv.parentNode.removeChild(flashDiv);
        }
      }, 300);
    };

    // Clean up Quagga when component unmounts or dialog closes
    const cleanupQuagga = () => {
      console.log("Cleaning up QuaggaJS...");
      
      if (isScanning) {
        Quagga.stop();
        setIsScanning(false);
      }
    };

    // Initialize or cleanup based on dialog state
    if (open) {
      console.log("Dialog opened, initializing scanner");
      setHasPermission(null); // Reset permission state
      initQuagga();
    } else {
      console.log("Dialog closed, cleaning up");
      cleanupQuagga();
    }

    // Cleanup on unmount
    return () => {
      console.log("Component unmounting, cleaning up");
      cleanupQuagga();
    };
  }, [open, onScan, toast]);

  // Function to manually retry camera access
  const retryAccess = () => {
    console.log("Retrying camera access...");
    setHasPermission(null);
    
    // Ensure Quagga is stopped before retrying
    Quagga.stop();
    
    // Allow a small delay before re-initializing
    setTimeout(() => {
      if (scannerRef.current && open) {
        Quagga.init({
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              facingMode: "environment"
            },
          },
          decoder: {
            readers: ["ean_reader", "ean_8_reader", "upc_reader"]
          }
        }, function(err) {
          if (err) {
            console.error("Retry failed:", err);
            setHasPermission(false);
            toast({
              title: "Camera Error",
              description: "Still unable to access camera after retry.",
              variant: "destructive",
            });
            return;
          }
          
          setHasPermission(true);
          Quagga.start();
        });
      }
    }, 500);
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
              <div 
                ref={scannerRef} 
                className="absolute inset-0 overflow-hidden"
              >
                {isScanning && hasPermission !== false && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-white">
                    <Camera className="h-8 w-8 animate-pulse" />
                  </div>
                )}
              </div>
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
