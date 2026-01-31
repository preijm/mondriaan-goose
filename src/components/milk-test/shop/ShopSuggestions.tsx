import React, { useState, useRef, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteShopDialog } from "./DeleteShopDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ShopSuggestionsProps {
  suggestions: { name: string; country_code: string | null }[];
  showAddNew: boolean;
  inputValue: string;
  onSelect: (shop: { name: string; country_code: string | null }) => void;
  onAddNew: () => void;
  isVisible: boolean;
}

export const ShopSuggestions = ({
  suggestions,
  showAddNew,
  inputValue,
  onSelect,
  onAddNew,
  isVisible,
}: ShopSuggestionsProps) => {
  const { data: isAdmin } = useAdminCheck();
  const [editingShopName, setEditingShopName] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingShopName, setDeletingShopName] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (editingShopName && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingShopName]);

  // Always render the delete dialog, even when dropdown is hidden
  // This prevents the dialog from being unmounted by the blur timeout
  const deleteDialog = (
    <DeleteShopDialog
      open={!!deletingShopName}
      onOpenChange={(open) => !open && setDeletingShopName(null)}
      shopName={deletingShopName}
      onSuccess={() => setDeletingShopName(null)}
    />
  );

  if (!isVisible || (suggestions.length === 0 && !showAddNew)) {
    return deleteDialog;
  }

  const handleEditClick = (
    e: React.MouseEvent,
    shop: { name: string; country_code: string | null }
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingShopName(shop.name);
    setEditValue(shop.name);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingShopName(null);
    setEditValue("");
  };

  const handleSaveEdit = async (e: React.MouseEvent, originalName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!editValue.trim() || editValue.trim() === originalName) {
      setEditingShopName(null);
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("shops")
        .update({ name: editValue.trim() })
        .eq("name", originalName);

      if (error) throw error;

      toast({
        title: "Shop updated",
        description: "The shop has been renamed successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["shops"] });
      setEditingShopName(null);
      setEditValue("");
    } catch (error) {
      console.error("Error updating shop:", error);
      toast({
        title: "Error",
        description: "Failed to update shop. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, shopName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingShopName(shopName);
  };

  const handleKeyDown = (e: React.KeyboardEvent, originalName: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveEdit(e as unknown as React.MouseEvent, originalName);
    } else if (e.key === "Escape") {
      setEditingShopName(null);
      setEditValue("");
    }
  };

  return (
    <>
      <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="px-4 py-2 cursor-pointer hover:bg-muted flex items-center justify-between group"
            onMouseDown={(e) => {
              if (editingShopName !== suggestion.name) {
                e.preventDefault();
                onSelect(suggestion);
              }
            }}
          >
            {editingShopName === suggestion.name ? (
              <div className="flex items-center gap-2 w-full" onMouseDown={(e) => e.stopPropagation()}>
                <Input
                  ref={editInputRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, suggestion.name)}
                  className="h-7 text-sm"
                  disabled={isUpdating}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onMouseDown={(e) => handleCancelEdit(e)}
                  disabled={isUpdating}
                  title="Cancel"
                >
                  <X className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 text-primary hover:text-primary"
                  onMouseDown={(e) => handleSaveEdit(e, suggestion.name)}
                  disabled={isUpdating || !editValue.trim()}
                  title="Save"
                >
                  <Check className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <>
                <span>{suggestion.name}</span>
                {isAdmin && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onMouseDown={(e) => handleEditClick(e, suggestion)}
                      title="Edit shop"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onMouseDown={(e) => handleDeleteClick(e, suggestion.name)}
                      title="Delete shop"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        {showAddNew && (
          <div
            className="px-4 py-2 cursor-pointer hover:bg-muted flex items-center text-muted-foreground"
            onMouseDown={(e) => {
              e.preventDefault();
              onAddNew();
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add "{inputValue.trim()}"
          </div>
        )}
      </div>

      {deleteDialog}
    </>
  );
};
