
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, X, Upload, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  setPicturePreview
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 } 
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions or try uploading a photo instead.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to the canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to file
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `milk-picture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setPicture(file);
            setPicturePreview(URL.createObjectURL(blob));
            stopCamera();
            setIsDialogOpen(false);
            
            toast({
              title: "Picture Captured",
              description: "Your milk picture has been added to the form.",
            });
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }
      
      setPicture(file);
      setPicturePreview(URL.createObjectURL(file));
      setIsDialogOpen(false);
      
      toast({
        title: "Picture Added",
        description: "Your milk picture has been added to the form.",
      });
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDialogClose = () => {
    stopCamera();
    setIsDialogOpen(false);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    startCamera();
  };

  const removePicture = () => {
    setPicture(null);
    setPicturePreview(null);
    
    toast({
      title: "Picture Removed",
      description: "The milk picture has been removed from the form.",
    });
  };

  return (
    <>
      <div className="relative">
        {picturePreview ? (
          <div className="relative h-32 w-32 rounded-md overflow-hidden">
            <img 
              src={picturePreview} 
              alt="Milk product" 
              className="h-full w-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-90"
              onClick={removePicture}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={handleOpenDialog}
            className="h-32 w-32 flex flex-col items-center justify-center gap-1 border-dashed"
          >
            <Camera className="h-8 w-8" />
            <span className="text-xs">Take photo</span>
          </Button>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Take a Picture</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {isCameraActive ? (
              <div className="relative">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full rounded-md overflow-hidden aspect-video"
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  <Button 
                    type="button" 
                    onClick={takePicture}
                    variant="default"
                  >
                    <Camera className="h-5 w-5 mr-1" />
                    Capture
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={openFileDialog}
                  >
                    <Upload className="h-5 w-5 mr-1" />
                    Upload
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 p-6">
                <p className="text-center text-muted-foreground">Camera is not active</p>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    onClick={startCamera}
                  >
                    <RefreshCw className="h-5 w-5 mr-1" />
                    Start Camera
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={openFileDialog}
                  >
                    <Upload className="h-5 w-5 mr-1" />
                    Upload Photo
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Hidden elements */}
          <canvas ref={canvasRef} className="hidden" />
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
