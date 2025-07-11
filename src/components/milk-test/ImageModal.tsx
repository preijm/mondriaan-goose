
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ImageModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageModal = ({ imageUrl, isOpen, onClose }: ImageModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-4xl p-0 overflow-hidden bg-transparent border-0 shadow-none" 
        closeButton={false}
      >
        <div className="relative w-full h-full">
          <AspectRatio ratio={1}>
            <img
              src={imageUrl}
              alt="Product"
              className="object-contain w-full h-full border-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const container = target.parentElement;
                if (container) {
                  const fallback = document.createElement('div');
                  fallback.className = "absolute inset-0 flex items-center justify-center bg-transparent rounded-lg";
                  
                  // Create SVG element safely without innerHTML
                  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                  svg.setAttribute('width', '24');
                  svg.setAttribute('height', '24');
                  svg.setAttribute('viewBox', '0 0 24 24');
                  svg.setAttribute('fill', 'none');
                  svg.setAttribute('stroke', 'currentColor');
                  svg.setAttribute('stroke-width', '2');
                  svg.setAttribute('stroke-linecap', 'round');
                  svg.setAttribute('stroke-linejoin', 'round');
                  svg.className = 'w-10 h-10 text-gray-400';
                  
                  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                  rect.setAttribute('width', '18');
                  rect.setAttribute('height', '18');
                  rect.setAttribute('x', '3');
                  rect.setAttribute('y', '3');
                  rect.setAttribute('rx', '2');
                  rect.setAttribute('ry', '2');
                  
                  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                  circle.setAttribute('cx', '9');
                  circle.setAttribute('cy', '9');
                  circle.setAttribute('r', '2');
                  
                  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                  path.setAttribute('d', 'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21');
                  
                  svg.appendChild(rect);
                  svg.appendChild(circle);
                  svg.appendChild(path);
                  fallback.appendChild(svg);
                  container.appendChild(fallback);
                }
              }}
            />
          </AspectRatio>
        </div>
      </DialogContent>
    </Dialog>
  );
};
