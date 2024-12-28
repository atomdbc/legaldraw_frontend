import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Upload, Layout, Stamp, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface EditorSettingsProps {
  hasCoverPage: boolean;
  onCoverPageChange: (enabled: boolean) => void;
  coverPageText: string;
  onCoverPageTextChange: (text: string) => void;
  onLogoUpload: (file: File) => void;
  hasWatermark: boolean;
  watermarkText: string;
  onWatermarkChange: (enabled: boolean) => void;
  onWatermarkTextChange: (text: string) => void;
  coverPageLogo?: File | null;
  onLogoRemove?: () => void;
  isDirty?: boolean;
  onSave?: () => void;
  onReset?: () => void;
}

export function EditorSettings({
  hasCoverPage,
  onCoverPageChange,
  coverPageText,
  onCoverPageTextChange,
  onLogoUpload,
  hasWatermark,
  watermarkText,
  onWatermarkChange,
  onWatermarkTextChange,
  coverPageLogo,
  onLogoRemove,
  isDirty,
  onSave,
  onReset
}: EditorSettingsProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Logo file size should not exceed 5MB"
        });
        return;
      }
      onLogoUpload(file);
    }
  };

  return (
    <Card className="shadow-none border-0 h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-base">Document Settings</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <Tabs defaultValue="cover" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none p-2">
            <TabsTrigger value="cover" className="gap-2">
              <Layout className="h-4 w-4" />
              Cover Page
            </TabsTrigger>
            <TabsTrigger value="watermark" className="gap-2">
              <Stamp className="h-4 w-4" />
              Watermark
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cover" className="p-4 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="cover-page">Cover Page</Label>
                  <p className="text-sm text-muted-foreground">
                    Add a cover page to your document
                  </p>
                </div>
                <Switch
                  id="cover-page"
                  checked={hasCoverPage}
                  onCheckedChange={onCoverPageChange}
                />
              </div>

              {hasCoverPage && (
                <>
                  <div className="space-y-2 pt-4">
                    <Label htmlFor="cover-text">Cover Title</Label>
                    <Input
                      id="cover-text"
                      value={coverPageText}
                      onChange={(e) => onCoverPageTextChange(e.target.value)}
                      placeholder="Enter document title..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Cover Logo</Label>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="logo-upload"
                        onChange={handleFileUpload}
                      />
                      {coverPageLogo ? (
                        <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                          <div className="flex-1 text-sm truncate">
                            {coverPageLogo.name}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={onLogoRemove}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('logo-upload')?.click()}
                          className="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Logo
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recommended: Square image, max 5MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="watermark" className="p-4 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="watermark">Document Watermark</Label>
                  <p className="text-sm text-muted-foreground">
                    Add a diagonal watermark across all pages
                  </p>
                </div>
                <Switch
                  id="watermark"
                  checked={hasWatermark}
                  onCheckedChange={onWatermarkChange}
                />
              </div>

              {hasWatermark && (
                <div className="space-y-2 pt-4">
                  <Label htmlFor="watermark-text">Watermark Text</Label>
                  <Input
                    id="watermark-text"
                    value={watermarkText}
                    onChange={(e) => onWatermarkTextChange(e.target.value)}
                    placeholder="Enter watermark text..."
                    maxLength={30}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum 5 words for better visibility
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t p-4 mt-auto">
        <div className="flex justify-end gap-2 w-full">
          <Button
            variant="outline"
            onClick={onReset}
            disabled={!isDirty}
          >
            Reset
          </Button>
          <Button
            onClick={onSave}
            disabled={!isDirty}
          >
            Save Changes
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}