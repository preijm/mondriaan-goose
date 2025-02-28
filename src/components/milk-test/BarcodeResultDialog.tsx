
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BarcodeResultDialogProps {
  open: boolean;
  onClose: () => void;
  brandName: string;
  productName: string;
  onConfirm: (brandName: string, productName: string) => void;
}

export const BarcodeResultDialog = ({ 
  open, 
  onClose, 
  brandName,
  productName,
  onConfirm 
}: BarcodeResultDialogProps) => {
  const [editedBrandName, setEditedBrandName] = useState(brandName);
  const [editedProductName, setEditedProductName] = useState(productName);

  const handleConfirm = () => {
    onConfirm(editedBrandName, editedProductName);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Product Information</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="brand-name" className="text-right">
              Brand
            </Label>
            <Input
              id="brand-name"
              value={editedBrandName}
              onChange={(e) => setEditedBrandName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product-name" className="text-right">
              Product
            </Label>
            <Input
              id="product-name"
              value={editedProductName}
              onChange={(e) => setEditedProductName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
