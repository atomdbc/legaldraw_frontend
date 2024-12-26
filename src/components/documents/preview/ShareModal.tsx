import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Mail, AlertCircle, HardDrive } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ShareModalProps {
  documentId: string;
}

export function ShareModal({ documentId }: ShareModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailShare = async () => {
    setIsLoading(true);
    // TODO: Implement email sharing
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="email">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="drive">
              <HardDrive className="h-4 w-4 mr-2" />
              Drive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Enter recipient's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button 
                className="w-full" 
                onClick={handleEmailShare}
                disabled={!email || isLoading}
              >
                {isLoading ? "Sending..." : "Send Document"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="drive">
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Google Drive integration coming soon!
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}