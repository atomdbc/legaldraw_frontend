// src/components/documentation/sections/PartyManagement.tsx
'use client';

import { 
  Building2, 
  User, 
  Shield, 
  Users, 
  FileCheck,
  Info,
  AlertTriangle,
  CheckCircle,
  Zap,
  Globe,
  Clock,
  Lock
} from 'lucide-react';
import { DocContent, DocHeading, DocNote } from '../DocContent';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// Party types remain the same
const PARTY_TYPES = [
  {
    id: 'corporation',
    label: 'Corporation',
    icon: Building2,
    description: 'A registered company or corporation',
    requirements: [
      'Company registration number',
      'Registered business address',
      'Authorized representative details'
    ]
  },
  {
    id: 'individual',
    label: 'Individual',
    icon: User,
    description: 'A single person',
    requirements: [
      'Full legal name',
      'Residential address',
      'Contact information'
    ]
  },
  {
    id: 'llc',
    label: 'Limited Liability Company',
    icon: Shield,
    description: 'A limited liability company',
    requirements: [
      'LLC registration details',
      'Operating address',
      'Member/manager information'
    ]
  },
  {
    id: 'partnership',
    label: 'Partnership',
    icon: Users,
    description: 'A business partnership',
    requirements: [
      'Partnership registration',
      'Partner details',
      'Business address'
    ]
  },
  {
    id: 'trust',
    label: 'Trust',
    icon: FileCheck,
    description: 'A legal trust entity',
    requirements: [
      'Trust documentation',
      'Trustee information',
      'Trust address'
    ]
  }
];

// New section to replace code section
const SMART_FEATURES = [
  {
    icon: Zap,
    title: "AI-Powered Validation",
    description: "Smart validation checks ensure all party information is accurate and complete",
    badge: "Premium"
  },
  {
    icon: Globe,
    title: "International Support",
    description: "Support for multiple jurisdictions and international address formats",
    badge: "Available"
  },
  {
    icon: Clock,
    title: "Auto-Save & History",
    description: "Automatic saving and detailed change history for all party information",
    badge: "Included"
  },
  {
    icon: Lock,
    title: "Secure Storage",
    description: "Enterprise-grade encryption for all party data and documents",
    badge: "Standard"
  }
];

export function PartyManagementSection() {
  return (
    <DocContent>
      <div className="space-y-8">
        {/* Introduction remains the same */}
        <div>
          <h1 className="text-4xl font-bold mb-4">Party Management</h1>
          <p className="text-xl text-muted-foreground">
            Learn about different party types and how to manage them in your documents.
          </p>
        </div>

        {/* Overview remains the same */}
        <DocNote>
          Party management is a crucial aspect of document creation. Each party type has specific
          requirements and validation rules to ensure accurate and legally sound documents.
        </DocNote>

        {/* Party Types Grid remains the same */}
        <DocHeading>Supported Party Types</DocHeading>
        <div className="grid md:grid-cols-2 gap-6">
          {PARTY_TYPES.map((type) => (
            <Card key={type.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <type.icon className="h-5 w-5" />
                  {type.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{type.description}</p>
                <div className="space-y-2">
                  <h4 className="font-medium">Required Information:</h4>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {type.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Address Management remains the same */}
        <DocHeading>Address Information</DocHeading>
        <div className="space-y-4">
          <p>
            Each party requires address information. The system supports both domestic and
            international addresses with proper formatting and validation.
          </p>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              For international addresses, ensure country codes and postal formats match the selected jurisdiction.
            </AlertDescription>
          </Alert>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-medium">Address Components</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Required Fields</h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• Street address</li>
                      <li>• City</li>
                      <li>• State/Province/Region</li>
                      <li>• Postal/ZIP code</li>
                      <li>• Country</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Validation Rules</h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• Format validation by country</li>
                      <li>• Postal code verification</li>
                      <li>• State/Province matching</li>
                      <li>• City verification</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Smart Features Section (Replacing Code Section) */}
        <DocHeading>Smart Features</DocHeading>
        <div className="grid md:grid-cols-2 gap-6">
          {SMART_FEATURES.map((feature, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{feature.title}</h3>
                      <Badge variant="secondary">{feature.badge}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Party Management Features remain the same */}
        <DocHeading>Management Features</DocHeading>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5" />
                Validation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Automatic data validation</li>
                <li>• Format checking</li>
                <li>• Required field verification</li>
                <li>• Cross-reference checks</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Multi-Party Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Add multiple parties</li>
                <li>• Different party types</li>
                <li>• Role assignment</li>
                <li>• Party relationships</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileCheck className="h-5 w-5" />
                Document Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Auto-fill in documents</li>
                <li>• Smart formatting</li>
                <li>• Template integration</li>
                <li>• Party history tracking</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Best Practices remains the same */}
        <DocHeading>Best Practices</DocHeading>
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Data Accuracy</h3>
                  <p className="text-sm text-muted-foreground">
                    Always verify party information before finalizing documents. Use official 
                    sources for business entities and request verification documentation when needed.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Authorization Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Ensure that individuals have proper authorization to represent their respective 
                    entities. This is especially important for corporations and LLCs.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Contact Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Maintain up-to-date contact information for all parties. This is crucial for 
                    document delivery and future communications.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Common Issues remains the same */}
        <DocHeading>Common Issues & Solutions</DocHeading>
        <div className="space-y-4">
          {[
            {
              issue: "Invalid Address Format",
              solution: "Use the address validation tool and ensure all components match the jurisdiction's format."
            },
            {
              issue: "Missing Authorization",
              solution: "Request and verify authorization documentation before proceeding with document generation."
            },
            {
              issue: "Incorrect Party Type",
              solution: "Review entity documentation and select the appropriate party type based on legal status."
            }
          ].map((item, index) => (
            <Alert key={index} className="flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">{item.issue}</h4>
                <AlertDescription>
                  {item.solution}
                </AlertDescription>
              </div>
            </Alert>
          ))}
        </div>
      </div>
    </DocContent>
  );
}