// src/components/documentation/sections/DocumentCreation.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  FileText, 
  Sparkles, 
  Users, 
  Eye, 
  Save,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { DocContent, DocHeading, DocNote, DocCode } from '../DocContent';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Example document types data
const documentTypes = [
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement',
    description: 'Protect confidential information shared between parties',
    icon: FileText,
    common_uses: [
      'Business negotiations',
      'Employee agreements',
      'Contractor relationships'
    ]
  },
  {
    id: 'service',
    name: 'Service Agreement',
    description: 'Define terms for service provision between parties',
    icon: Users,
    common_uses: [
      'Consulting services',
      'Professional services',
      'Maintenance contracts'
    ]
  }
];

export function DocumentCreationSection() {
  return (
    <DocContent>
      <div className="space-y-8">
        {/* Introduction */}
        <div>
          <h1 className="text-4xl font-bold mb-4">Document Creation Process</h1>
          <p className="text-xl text-muted-foreground">
            Learn how to create, manage, and finalize documents using LegalDraw's AI-powered platform.
          </p>
        </div>

        {/* Document Creation Flow */}
        <DocHeading>Creation Flow</DocHeading>
        <div className="relative">
          {/* Timeline connector */}
          <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-border" />
          
          {/* Steps */}
          <div className="space-y-8 relative">
            {[
              {
                icon: FileText,
                title: "Select Document Type",
                description: "Choose from our library of AI-optimized document templates."
              },
              {
                icon: Users,
                title: "Add Parties",
                description: "Input details for all involved parties with smart field suggestions."
              },
              {
                icon: Sparkles,
                title: "AI Generation",
                description: "Our AI generates the initial document based on your inputs."
              },
              {
                icon: Eye,
                title: "Review & Edit",
                description: "Review the generated content and make any necessary adjustments."
              },
              {
                icon: Save,
                title: "Save & Manage",
                description: "Save as draft or finalize the document for sharing."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 relative"
              >
                <div className="w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center shrink-0 z-10">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 pt-4">
                  <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Document Types */}
        <DocHeading>Available Document Types</DocHeading>
        <div className="grid md:grid-cols-2 gap-6">
          {documentTypes.map((type) => (
            <Card key={type.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <type.icon className="h-5 w-5" />
                      {type.name}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{type.description}</p>
                <div className="space-y-2">
                  <h4 className="font-medium">Common Uses:</h4>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {type.common_uses.map((use, index) => (
                      <li key={index}>{use}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Document Lifecycle */}
        <DocHeading>Document Lifecycle</DocHeading>
        <div className="space-y-4">
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertTitle>Document States</AlertTitle>
            <AlertDescription>
              Documents move through different states during their lifecycle. Understanding these
              states is crucial for effective document management.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: Clock,
                status: "Draft",
                description: "Initial state where document can be edited freely",
                note: "Drafts expire based on your plan limits"
              },
              {
                icon: Eye,
                status: "Under Review",
                description: "Document is being reviewed by parties",
                note: "Parties can suggest changes"
              },
              {
                icon: CheckCircle,
                status: "Completed",
                description: "Document has been finalized",
                note: "No further edits allowed"
              },
              {
                icon: AlertCircle,
                status: "Expired",
                description: "Document has passed its validity period",
                note: "Can be renewed if needed"
              }
            ].map((state, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <state.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{state.status}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {state.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Note: {state.note}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Document Storage */}
        <DocHeading>Storage & Expiration</DocHeading>
        <div className="space-y-4">
          <p>
            Documents are stored securely and have different retention periods based on their
            status and your plan:
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Basic Plan",
                draft: "7 days",
                completed: "30 days"
              },
              {
                title: "Professional Plan",
                draft: "30 days",
                completed: "90 days"
              },
              {
                title: "Per Document",
                draft: "48 hours",
                completed: "30 days"
              }
            ].map((plan, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{plan.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Draft Storage:</span>
                      <span className="ml-2 text-muted-foreground">{plan.draft}</span>
                    </div>
                    <div>
                      <span className="font-medium">Completed Storage:</span>
                      <span className="ml-2 text-muted-foreground">{plan.completed}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips & Best Practices */}
        <DocHeading>Tips & Best Practices</DocHeading>
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Use AI Suggestions</h4>
                    <p className="text-sm text-muted-foreground">
                      Take advantage of AI-powered suggestions for fields and clauses to ensure
                      comprehensive document coverage.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Review All Sections</h4>
                    <p className="text-sm text-muted-foreground">
                      Always review all sections thoroughly, even when using AI generation.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Save Drafts Regularly</h4>
                    <p className="text-sm text-muted-foreground">
                      Save your work regularly to prevent loss of progress.
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <div className="mt-8">
          <Button className="w-full sm:w-auto">
            Start Creating Documents
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </DocContent>
  );
}