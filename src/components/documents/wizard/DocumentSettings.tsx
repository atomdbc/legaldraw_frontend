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
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    
    setLocalSettings(newSettings);
    onChange(newSettings);
  };

  // Reusable card section component for better organization
  const SettingsCard = ({ 
    icon: Icon, 
    title, 
    description, 
    children 
  }: { 
    icon: any, 
    title: string, 
    description: string, 
    children: React.ReactNode 
  }) => (
    <Card className="w-full">
      <CardHeader className="space-y-1 sm:space-y-2">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {children}
      </CardContent>
    </Card>
  );

  // Reusable form group component
  const FormGroup = ({ 
    label, 
    htmlFor, 
    children 
  }: { 
    label: string, 
    htmlFor: string, 
    children: React.ReactNode 
  }) => (
    <div className="space-y-2">
      <Label 
        htmlFor={htmlFor}
        className="text-sm sm:text-base"
      >
        {label}
      </Label>
      {children}
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="grid gap-4 sm:gap-6">
        {/* Cover Page Settings */}
        <SettingsCard
          icon={FileText}
          title="Cover Page Settings"
          description="Configure the appearance of your document's cover page"
        >
          <div className="flex items-center justify-between">
            <Label 
              htmlFor="cover-enabled"
              className="text-sm sm:text-base"
            >
              Enable Cover Page
            </Label>
            <Switch 
              id="cover-enabled"
              checked={localSettings.cover_page.enabled}
              onCheckedChange={(checked) => 
                handleChange(['cover_page', 'enabled'], checked)
              }
            />
          </div>

          {localSettings.cover_page.enabled && (
            <FormGroup label="Watermark Text" htmlFor="watermark">
              <Input 
                id="watermark"
                value={localSettings.cover_page.watermark}
                onChange={(e) => 
                  handleChange(['cover_page', 'watermark'], e.target.value)
                }
                placeholder="e.g., CONFIDENTIAL"
                className="w-full"
              />
            </FormGroup>
          )}
        </SettingsCard>

        {/* Header & Footer Settings */}
        <SettingsCard
          icon={Layout}
          title="Header & Footer"
          description="Configure document headers and footers"
        >
          <div className="flex items-center justify-between">
            <Label 
              htmlFor="header-enabled"
              className="text-sm sm:text-base"
            >
              Enable Header/Footer
            </Label>
            <Switch 
              id="header-enabled"
              checked={localSettings.header_footer.enabled}
              onCheckedChange={(checked) => 
                handleChange(['header_footer', 'enabled'], checked)
              }
            />
          </div>

          {localSettings.header_footer.enabled && (
            <div className="space-y-4">
              <FormGroup label="Header Text" htmlFor="header-text">
                <Input 
                  id="header-text"
                  value={localSettings.header_footer.header_text}
                  onChange={(e) => 
                    handleChange(['header_footer', 'header_text'], e.target.value)
                  }
                  placeholder="e.g., CONFIDENTIAL & PROPRIETARY"
                  className="w-full"
                />
              </FormGroup>

              <FormGroup label="Footer Text" htmlFor="footer-text">
                <Input 
                  id="footer-text"
                  value={localSettings.header_footer.footer_text}
                  onChange={(e) => 
                    handleChange(['header_footer', 'footer_text'], e.target.value)
                  }
                  placeholder="e.g., Page {page_number} of {total_pages}"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use {'{page_number}'} and {'{total_pages}'} as placeholders
                </p>
              </FormGroup>
            </div>
          )}
        </SettingsCard>

        {/* Styling Settings */}
        <SettingsCard
          icon={Palette}
          title="Document Styling"
          description="Customize the visual appearance of your document"
        >
          <FormGroup label="Font Family" htmlFor="font-family">
            <Select 
              value={localSettings.styling.font_family}
              onValueChange={(value) => 
                handleChange(['styling', 'font_family'], value)
              }
            >
              <SelectTrigger id="font-family" className="w-full">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILIES.map((font) => (
                  <SelectItem 
                    key={font.value} 
                    value={font.value}
                    className="text-sm sm:text-base"
                  >
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormGroup>

          <Separator className="my-4 sm:my-6" />
        </SettingsCard>
      </div>
    </div>
  );
}