'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { DocumentSettings } from "@/types/document";

interface DocumentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DocumentSettings;
  onSettingsChange: (settings: DocumentSettings) => void;
}

export function DocumentSettingsModal({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}: DocumentSettingsModalProps) {
  const handleCoverPageChange = (enabled: boolean) => {
    onSettingsChange({
      ...settings,
      cover_page: {
        ...settings.cover_page,
        enabled
      }
    });
  };

  const handleCoverPageTextChange = (title: string) => {
    onSettingsChange({
      ...settings,
      cover_page: {
        ...settings.cover_page,
        title
      }
    });
  };

  const handleCoverPageSubtitleChange = (subtitle: string) => {
    onSettingsChange({
      ...settings,
      cover_page: {
        ...settings.cover_page,
        subtitle
      }
    });
  };

  const handleWatermarkChange = (enabled: boolean) => {
    onSettingsChange({
      ...settings,
      watermark: {
        ...settings.watermark,
        enabled
      }
    });
  };

  const handleWatermarkTextChange = (text: string) => {
    onSettingsChange({
      ...settings,
      watermark: {
        ...settings.watermark,
        text
      }
    });
  };

  const handleLogoUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size should not exceed 5MB');
      return;
    }

    // TODO: Handle logo upload
    // This would typically involve uploading to your backend
    // and getting back a URL to store in settings
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
            <Switch 
              checked={settings.cover_page.enabled} 
              onCheckedChange={handleCoverPageChange} 
            />
          </div>

          {settings.cover_page.enabled && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Enter cover page title..."
                  value={settings.cover_page.title || ''}
                  onChange={(e) => handleCoverPageTextChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  placeholder="Enter cover page subtitle..."
                  value={settings.cover_page.subtitle || ''}
                  onChange={(e) => handleCoverPageSubtitleChange(e.target.value)}
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
                      if (file) handleLogoUpload(file);
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
              checked={settings.watermark.enabled} 
              onCheckedChange={handleWatermarkChange} 
            />
          </div>

          {settings.watermark.enabled && (
            <div className="mt-4 space-y-2">
              <Label>Watermark Text</Label>
              <Input
                placeholder="Enter watermark text (max 5 words)..."
                value={settings.watermark.text}
                onChange={(e) => {
                  const words = e.target.value.split(' ');
                  if (words.length <= 5) {
                    handleWatermarkTextChange(e.target.value);
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
          <Button onClick={onClose}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}