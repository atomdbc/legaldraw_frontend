'use client';

import { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ColorPicker } from "@/components/ui/color-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  FileText, 
  Type, 
  Palette, 
  Layout 
} from "lucide-react";

interface DocumentSettings {
  cover_page: {
    enabled: boolean;
    watermark: string;
    logo_enabled: boolean;
  };
  header_footer: {
    enabled: boolean;
    header_text: string;
    footer_text: string;
  };
  styling: {
    font_family: string;
    primary_color: string;
    secondary_color: string;
  };
}

interface DocumentSettingsProps {
  documentType: string;
  settings: DocumentSettings;
  onChange: (settings: DocumentSettings) => void;
}

const FONT_FAMILIES = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, serif', label: 'Georgia' }
];

export function DocumentSettings({ 
  documentType, 
  settings, 
  onChange 
}: DocumentSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleChange = (path: string[], value: any) => {
    const newSettings = { ...localSettings };
    let current: any = newSettings;
    
    // Navigate to the nested property
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    // Set the value
    current[path[path.length - 1]] = value;
    
    setLocalSettings(newSettings);
    onChange(newSettings);
  };

  return (
    <div className="space-y-6 px-6 pb-6">
      {/* Cover Page Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Cover Page Settings
          </CardTitle>
          <CardDescription>
            Configure the appearance of your document's cover page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="cover-enabled">Enable Cover Page</Label>
            <Switch 
              id="cover-enabled"
              checked={localSettings.cover_page.enabled}
              onCheckedChange={(checked) => 
                handleChange(['cover_page', 'enabled'], checked)
              }
            />
          </div>

          {localSettings.cover_page.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="watermark">Watermark Text</Label>
                <Input 
                  id="watermark"
                  value={localSettings.cover_page.watermark}
                  onChange={(e) => 
                    handleChange(['cover_page', 'watermark'], e.target.value)
                  }
                  placeholder="e.g., CONFIDENTIAL"
                />
              </div>

              <div className="flex items-center justify-between">
                {/* <Label htmlFor="logo-enabled">Include Logo</Label> */}
                {/* <Switch 
                  id="logo-enabled"
                  checked={localSettings.cover_page.logo_enabled}
                  onCheckedChange={(checked) => 
                    handleChange(['cover_page', 'logo_enabled'], checked)
                  }
                /> */}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Header & Footer Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Header & Footer
          </CardTitle>
          <CardDescription>
            Configure document headers and footers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="header-enabled">Enable Header/Footer</Label>
            <Switch 
              id="header-enabled"
              checked={localSettings.header_footer.enabled}
              onCheckedChange={(checked) => 
                handleChange(['header_footer', 'enabled'], checked)
              }
            />
          </div>

          {localSettings.header_footer.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="header-text">Header Text</Label>
                <Input 
                  id="header-text"
                  value={localSettings.header_footer.header_text}
                  onChange={(e) => 
                    handleChange(['header_footer', 'header_text'], e.target.value)
                  }
                  placeholder="e.g., CONFIDENTIAL & PROPRIETARY"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer-text">Footer Text</Label>
                <Input 
                  id="footer-text"
                  value={localSettings.header_footer.footer_text}
                  onChange={(e) => 
                    handleChange(['header_footer', 'footer_text'], e.target.value)
                  }
                  placeholder="e.g., Page {page_number} of {total_pages}"
                />
                <p className="text-xs text-muted-foreground">
                  Use {'{page_number}'} and {'{total_pages}'} as placeholders
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Styling Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Document Styling
          </CardTitle>
          <CardDescription>
            Customize the visual appearance of your document
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="font-family">Font Family</Label>
            <Select 
              value={localSettings.styling.font_family}
              onValueChange={(value) => 
                handleChange(['styling', 'font_family'], value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILIES.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <ColorPicker 
                value={localSettings.styling.primary_color}
                onChange={(color) => 
                  handleChange(['styling', 'primary_color'], color)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <ColorPicker 
                value={localSettings.styling.secondary_color}
                onChange={(color) => 
                  handleChange(['styling', 'secondary_color'], color)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}