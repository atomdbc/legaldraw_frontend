'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface DocumentSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  hasCoverPage: boolean;
  onCoverPageChange: (enabled: boolean) => void;
  coverPageText: string;
  onCoverPageTextChange: (text: string) => void;
  onLogoUpload: (file: File) => void;
  hasWatermark: boolean;
  watermarkText: string;
  onWatermarkChange: (enabled: boolean) => void;
  onWatermarkTextChange: (text: string) => void;
}

export function DocumentSettingsModal({
  isOpen,
  onClose,
  hasCoverPage,
  onCoverPageChange,
  coverPageText,
  onCoverPageTextChange,
  onLogoUpload,
  hasWatermark,
  watermarkText,
  onWatermarkChange,
  onWatermarkTextChange,
}: DocumentSettingsProps) {
  const handleSaveClick = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Document Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Cover Page</Label>
              <p className="text-sm text-muted-foreground">Add a cover page to your document</p>
            </div>
            <Switch checked={hasCoverPage} onCheckedChange={onCoverPageChange} />
          </div>

          {hasCoverPage && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Cover Page Text</Label>
                <Input
                  placeholder="Enter cover page text..."
                  value={coverPageText}
                  onChange={(e) => onCoverPageTextChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Logo Upload</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="logo-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) { // 5MB limit
                          alert('File size should not exceed 5MB');
                          return;
                        }
                        onLogoUpload(file);
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: Square image, max 5MB
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Watermark</Label>
              <p className="text-sm text-muted-foreground">
                Add a diagonal watermark across all pages
              </p>
            </div>
            <Switch 
              checked={hasWatermark} 
              onCheckedChange={onWatermarkChange} 
            />
          </div>

          {hasWatermark && (
            <div className="mt-4 space-y-2">
              <Label>Watermark Text</Label>
              <Input
                placeholder="Enter watermark text (max 5 words)..."
                value={watermarkText}
                onChange={(e) => {
                  const words = e.target.value.split(' ');
                  if (words.length <= 5) {
                    onWatermarkTextChange(e.target.value);
                  }
                }}
                maxLength={30}
              />
              <p className="text-xs text-muted-foreground">
                Short text recommended for better visibility
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveClick}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}