// src/components/documentation/sections/QuickStart.tsx
'use client';

import { 
  FileText, 
  Users, 
  Eye, 
  Download, 
  ArrowRight, 
  CheckCircle, 
  PlayCircle,
  BookOpen,
  Clock,
  FileQuestion,
  Settings
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DocContent, DocHeading, DocNote } from '../DocContent';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    icon: FileText,
    title: "Select Document Type",
    description: "Choose from our library of document types including NDAs, Service Agreements, and more.",
    detail: "Our AI system will guide you through selecting the most appropriate template based on your needs.",
    tips: [
      "Consider your document's primary purpose",
      "Review available templates",
      "Check jurisdiction requirements"
    ]
  },
  {
    icon: Users,
    title: "Add Party Information",
    description: "Input details about all parties involved in the document.",
    detail: "The system supports various party types including corporations, individuals, and LLCs.",
    tips: [
      "Prepare party details in advance",
      "Verify contact information",
      "Confirm authorization status"
    ]
  },
  {
    icon: Settings,
    title: "Customize Content",
    description: "Tailor the document to your specific needs with AI assistance.",
    detail: "Our AI will help you customize clauses and terms while maintaining legal compliance.",
    tips: [
      "Use AI suggestions for clarity",
      "Add specific requirements",
      "Review automated suggestions"
    ]
  },
  {
    icon: Eye,
    title: "Review and Verify",
    description: "Review the generated document and make any necessary customizations.",
    detail: "Our AI assistant will help ensure all required information is included and legally sound.",
    tips: [
      "Check all sections thoroughly",
      "Verify party information",
      "Review special clauses"
    ]
  },
  {
    icon: Download,
    title: "Finalize and Share",
    description: "Export your document in various formats and share with relevant parties.",
    detail: "Documents can be downloaded as PDF, shared via secure link, or stored for future reference.",
    tips: [
      "Choose appropriate format",
      "Set sharing permissions",
      "Keep track of versions"
    ]
  }
];

const resources = [
  {
    icon: BookOpen,
    title: "Document Types Guide",
    description: "Comprehensive guide to all available document types and their use cases",
    href: "document-creation",
    badge: "Essential"
  },
  {
    icon: PlayCircle,
    title: "Video Tutorials",
    description: "Step-by-step video guides for document creation and management",
    href: "#",
    badge: "Watch Now"
  },
  {
    icon: FileQuestion,
    title: "Templates Guide",
    description: "Learn how to use and customize document templates effectively",
    href: "document-creation",
    badge: "New"
  },
  {
    icon: Clock,
    title: "Quick Tips",
    description: "Time-saving tips and best practices for document creation",
    href: "ai-features",
    badge: "Popular"
  }
];

export function QuickStartSection() {
  const router = useRouter();

  return (
    <DocContent>
      <div className="space-y-8">
        {/* Introduction */}
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Quick Start Guide
          </Badge>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Create Your First Document
          </h1>
          <p className="text-xl text-muted-foreground">
            Get started with LegalDraw in minutes. Follow our step-by-step guide to create
            your first professional document.
          </p>
          
          <Button 
            size="lg" 
            className="mt-8 gap-2"
            onClick={() => router.push('/documents/create')}
          >
            Start Creating
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Prerequisites Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Before You Begin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-2 gap-4">
              {[
                "A LegalDraw account",
                "Basic party information",
                "Document requirements",
                "Necessary references"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Step by Step Guide */}
        <DocHeading>Document Creation Steps</DocHeading>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50" />
                <CardContent className="pt-6">
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <step.icon className="w-5 h-5" />
                      </div>
                      <div className="h-full w-px bg-border" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">
                          {index + 1}. {step.title}
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          {step.description}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {step.detail}
                        </p>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-2">Pro Tips:</h4>
                        <ul className="space-y-2">
                          {step.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="h-3 w-3 text-primary shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Resources Grid */}
        <DocHeading>Additional Resources</DocHeading>
        <div className="grid md:grid-cols-2 gap-4">
          {resources.map((resource, index) => (
            <Card 
              key={index}
              className="relative cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => resource.href !== '#' && router.push(`/documentation?section=${resource.href}`)}
            >
              <CardContent className="pt-6">
                <div className="absolute top-4 right-4">
                  <Badge variant={
                    resource.badge === 'New' ? 'default' :
                    resource.badge === 'Coming Soon' ? 'secondary' :
                    resource.badge === 'Popular' ? 'destructive' :
                    'outline'
                  }>
                    {resource.badge}
                  </Badge>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <resource.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <DocHeading>Frequently Asked Questions</DocHeading>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              question: "How long does it take to create a document?",
              answer: "Most documents can be generated in 1-2 minutes, depending on complexity and information availability."
            },
            {
              question: "Can I edit the document after generation?",
              answer: "Yes, documents remain editable for a period based on your plan. You can modify content, add parties, or update terms as needed."
            },
            {
              question: "What formats are supported?",
              answer: "Documents can be exported as PDF, with additional formats coming soon including Word and HTML."
            },
            {
              question: "Is my document data secure?",
              answer: "Yes, we use enterprise-grade encryption and security measures to protect all your document data."
            }
          ].map((faq, index) => (
            <Card key={index} className="p-6">
              <h3 className="font-medium mb-2">{faq.question}</h3>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </Card>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center pt-8">
          <Button 
            size="lg" 
            className="gap-2"
            onClick={() => router.push('/documents/create')}
          >
            Create Your First Document
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </DocContent>
  );
}