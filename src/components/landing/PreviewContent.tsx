// src/components/landing/PreviewContent.tsx
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Sparkles, 
  CheckCircle, 
  Download,
  Users,
  MessageSquare,
  Check
} from "lucide-react";

const TemplatePreview = () => (
  <div className="grid grid-cols-2 gap-4">
    {[
      { title: "Service Agreement", type: "Contract" },
      { title: "NDA Template", type: "Confidentiality" },
      { title: "Employment Contract", type: "HR" },
      { title: "Terms of Service", type: "Legal" }
    ].map((template, i) => (
      <Card key={i} className="border border-black/10 hover:border-blue-500 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <FileText className="w-8 h-8 text-gray-400 mb-3" />
          <h4 className="font-medium text-sm mb-1">{template.title}</h4>
          <p className="text-xs text-gray-500">{template.type}</p>
        </CardContent>
      </Card>
    ))}
  </div>
);

const CustomizationPreview = () => (
  <div className="space-y-4">
    <div className="flex items-start gap-4 bg-blue-50 p-4 rounded-lg">
      <Sparkles className="w-5 h-5 text-blue-500 mt-1" />
      <div className="flex-1">
        <div className="font-medium text-sm mb-1 text-blue-700">AI Suggestion</div>
        <p className="text-sm text-blue-600">Consider adding a confidentiality clause to protect sensitive information.</p>
      </div>
    </div>
    <div className="border rounded-lg p-4">
      <div className="h-4 w-3/4 bg-gray-100 rounded mb-3" />
      <div className="h-4 w-full bg-gray-100 rounded mb-3" />
      <div className="h-4 w-2/3 bg-gray-100 rounded mb-3" />
      <div className="h-4 w-5/6 bg-blue-100 rounded" />
    </div>
    <div className="flex gap-2">
      <Button variant="outline" size="sm">Accept</Button>
      <Button variant="outline" size="sm">Modify</Button>
    </div>
  </div>
);

const ReviewPreview = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 mb-4">
      <div className="flex -space-x-2">
        {[
          { bg: "bg-blue-400", initial: "JD" },
          { bg: "bg-green-400", initial: "SK" },
          { bg: "bg-purple-400", initial: "MT" }
        ].map((user, i) => (
          <div key={i} className={`w-8 h-8 rounded-full ${user.bg} flex items-center justify-center border-2 border-white`}>
            <span className="text-xs text-white font-medium">{user.initial}</span>
          </div>
        ))}
      </div>
      <span className="text-sm text-gray-600">3 people reviewing</span>
    </div>
    <div className="border rounded-lg p-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
          <span className="text-xs text-white">SK</span>
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-800 bg-green-50 rounded p-2">
            Suggested changing the notice period to 30 days.
          </p>
        </div>
      </div>
      <div className="h-4 w-full bg-gray-100 rounded mb-2" />
      <div className="h-4 w-3/4 bg-gray-100 rounded" />
    </div>
  </div>
);

const ExportPreview = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between mb-6">
      <h4 className="font-medium">Export Options</h4>
      <Download className="w-5 h-5 text-gray-600" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[
        { icon: FileText, format: "PDF", info: "For signing" },
        { icon: FileText, format: "DOCX", info: "Editable" },
      ].map((option, i) => (
        <Card key={i} className="border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <option.icon className="w-6 h-6 text-gray-400 mb-2" />
            <div className="text-sm font-medium">{option.format}</div>
            <div className="text-xs text-gray-500">{option.info}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

interface PreviewContentProps {
  step: string;
}

export const PreviewContent = ({ step }: PreviewContentProps) => {
  switch (step) {
    case "selection":
      return <TemplatePreview />;
    case "customization":
      return <CustomizationPreview />;
    case "review":
      return <ReviewPreview />;
    case "export":
      return <ExportPreview />;
    default:
      return null;
  }
};