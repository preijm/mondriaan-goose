
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { validateFile } from "@/lib/fileValidation";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

interface PictureCaptureProps {
  picture: File | null;
  picturePreview: string | null;
  setPicture: (file: File | null) => void;
  setPicturePreview: (url: string | null) => void;
}

export const PictureCapture: React.FC<PictureCaptureProps> = ({
  picture,
  picturePreview,
  setPicture,
  setPicturePreview,
}) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [hasCameraSupport, setHasCameraSupport] = useState(false);
  const [isNativeApp, setIsNativeApp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Check for camera support and native app detection
  useEffect(() => {
    const checkCameraSupport = async () => {
      // Check if running in a native app
      const isNative = Capacitor.isNativePlatform();
      setIsNativeApp(isNative);
      
      if (isNative) {
        // Native app always has camera support
        setHasCameraSupport(true);
      } else if (isMobile && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          // Just check if we can enumerate devices, don't actually request access
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasCamera = devices.some(device => device.kind === 'videoinput');
          setHasCameraSupport(hasCamera);
        } catch (error) {
          console.log('Camera support check failed:', error);
          setHasCameraSupport(false);
        }
      } else {
        setHasCameraSupport(false);
      }
    };

    checkCameraSupport();
  }, [isMobile]);

  const takePictureWithNativeCamera = async () => {
    try {
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image.dataUrl) {
        // Convert data URL to blob
        const response = await fetch(image.dataUrl);
        const blob = await response.blob();
        
        // Create a file from the blob
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        
        // Validate the file
        const validationResult = await validateFile(file);
        
        if (!validationResult.isValid) {
          toast({
            title: "Invalid File",
            description: validationResult.error,
            variant: "destructive",
          });
          return;
        }

        // Set the picture
        setPicture(file);
        setPicturePreview(image.dataUrl);
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: "Camera Error",
        description: "Failed to capture photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCameraClick = () => {
    // Use native camera API if available (mobile app)
    if (isNativeApp && hasCameraSupport) {
      takePictureWithNativeCamera();
    } else {
      // Fallback to file input (desktop or web)
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Validate the file
      const validationResult = await validateFile(file);
      
      if (!validationResult.isValid) {
        toast({
          title: "Invalid File",
          description: validationResult.error,
          variant: "destructive",
        });
        e.target.value = ''; // Reset input
        return;
      }

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setPicture(file);
      setPicturePreview(previewUrl);
      
      // Reset the input so the same file can be selected again if needed
      e.target.value = '';
    } catch (err) {
      console.error("Error handling selected picture:", err);
      toast({
        title: "File Error",
        description: "Failed to process the selected file",
        variant: "destructive",
      });
    }
  };

  const removePicture = () => {
    setPicture(null);
    if (picturePreview) {
      URL.revokeObjectURL(picturePreview);
      setPicturePreview(null);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      {/* Hidden file input that accepts camera capture on mobile and file selection on desktop */}
      <input
        type="file"
        accept="image/*"
        {...(isMobile && hasCameraSupport 
          ? { capture: "environment" } 
          : {}
        )}
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {picturePreview ? (
        <div className="relative h-full w-full">
          <div className="h-full w-full rounded-md overflow-hidden">
            <img 
              src={picturePreview} 
              alt="Milk product" 
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setIsImageDialogOpen(true)}
            />
          </div>
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={removePicture}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-none">
              <DialogClose className="absolute right-4 top-4 rounded-sm bg-white/10 opacity-70 ring-offset-background z-10 hover:opacity-100" />
              <div className="relative w-full">
                <img 
                  src={picturePreview} 
                  alt="Milk product full view" 
                  className="w-full h-full object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <Button 
            type="button" 
            variant="outline"
            className="w-full h-full min-h-[120px] flex flex-col items-center justify-center gap-2 border-dashed"
            onClick={handleCameraClick}
          >
            {isMobile && hasCameraSupport ? (
              <>
                <Camera className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">Take Photo</span>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">Upload Photo</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
