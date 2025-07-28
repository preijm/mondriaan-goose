
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface AddShopFormProps {
  newShopName: string;
  setNewShopName: (name: string) => void;
  onAdd: () => void;
}

export const AddShopForm = ({
  newShopName,
  setNewShopName,
  onAdd,
}: AddShopFormProps) => {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Shop name"
        value={newShopName}
        onChange={(e) => setNewShopName(e.target.value)}
        className="w-full"
      />
      <Button
        onClick={onAdd}
        className="w-full"
        variant="brand"
        disabled={!newShopName.trim()}
      >
        Add Shop
      </Button>
    </div>
  );
};
