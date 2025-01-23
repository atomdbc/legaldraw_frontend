// src/components/documentation/sections/UpcomingFeatures.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  Code, 
  FileSearch, 
  MessageSquare, 
  Plug, 
  Rocket,
  Brain,
  Bot,
  Lock,
  Globe,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Calendar,
  Crown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DocContent, DocHeading, DocNote } from '../DocContent';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ROADMAP_FEATURES = [
  {
    icon: Users,
    title: "Team Collaboration Suite",
    description: "Enterprise-grade collaboration tools for teams of all sizes",
    status: "Q2 2025",
    priority: "High",
    progress: 75,
    features: [
      "Real-time document collaboration with live editing",
      "Advanced team roles and permission management",
      "Document sharing with granular access controls",
      "Team activity analytics and insights",
      "Smart comments and review workflows"
    ],
    preview: "Beta access available",
    badgeColor: "bg-blue-500"
  },
  {
    icon: Code,
    title: "Developer Platform & API",
    description: "Powerful API suite for custom integrations and automation",
    status: "Q2 2025",
    priority: "High",
    progress: 80,
    features: [
      "Comprehensive REST API coverage",
      "Real-time webhooks for document events",
      "Language-specific SDKs and tools",
      "Interactive API documentation",
      "Advanced rate limiting and monitoring"
    ],
    preview: "Developer beta starting soon",
    badgeColor: "bg-purple-500"
  },
  {
    icon: Brain,
    title: "Advanced AI Analysis",
    description: "Next-generation AI for document analysis and optimization",
    status: "Q3 2025",
    priority: "Medium",
    progress: 60,
    features: [
      "Intelligent document comparison and analysis",
      "Automated legal compliance checking",
      "Smart clause suggestions and optimization",
      "Risk analysis and recommendations",
      "Multi-language support with AI translation"
    ],
    preview: "Technology preview available",
    badgeColor: "bg-emerald-500"
  },
  {
    icon: MessageSquare,
    title: "AI Document Assistant",
    description: "Contextual AI chat interface for document interaction",
    status: "Q3 2025",
    priority: "High",
    progress: 70,
    features: [
      "Natural language document querying",
      "Context-aware suggestions and edits",
      "Legal requirement verification",
      "Clause explanation and simplification",
      "Document summarization and analysis"
    ],
    preview: "Early access program open",
    badgeColor: "bg-amber-500"
  },
  {
    icon: Plug,
    title: "Enterprise Integrations",
    description: "Seamless connectivity with enterprise software ecosystems",
    status: "Q4 2025",
    priority: "Medium",
    progress: 40,
    features: [
      "Major cloud storage platform integration",
      "E-signature service connectivity",
      "CRM and ERP system integration",
      "Legal practice management software",
      "Enterprise SSO and security"
    ],
    preview: "Partnership program launching",
    badgeColor: "bg-red-500"
  }
];

const INTEGRATION_ECOSYSTEM = [
  {
    category: "Cloud Storage",
    description: "Seamlessly store and manage documents",
    partners: [
      { name: "Google Drive", status: "In Development", launch: "Q2 2025" },
      { name: "Dropbox", status: "Planning", launch: "Q3 2025" },
      { name: "OneDrive", status: "Planning", launch: "Q3 2025" }
    ],
    icon: Globe
  },
  {
    category: "E-Signature",
    description: "Secure document signing workflows",
    partners: [
      { name: "DocuSign", status: "In Development", launch: "Q2 2025" },
      { name: "Adobe Sign", status: "Planning", launch: "Q3 2025" },
      { name: "HelloSign", status: "Research", launch: "Q4 2025" }
    ],
    icon: Lock
  },
  {
    category: "Enterprise",
    description: "Integration with business systems",
    partners: [
      { name: "Salesforce", status: "Planning", launch: "Q3 2025" },
      { name: "HubSpot", status: "Research", launch: "Q4 2025" },
      { name: "Microsoft Teams", status: "Planning", launch: "Q3 2025" }
    ],
    icon: Crown
  }
];

export function UpcomingFeaturesSection() {
  const router = useRouter();

  const renderProgressBar = (progress: number) => (
    <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
      <div 
        className="bg-primary h-full rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );

  return (
    <DocContent>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-4">
            Product Roadmap
          </Badge>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            The Future of LegalDraw
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore our upcoming features and see how we're evolving the platform
          </p>
          
          <Button 
            size="lg" 
            className="mt-8"
            onClick={() => router.push('/early-access')}
          >
            Join Early Access
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <DocNote>
          <div className="flex items-start gap-2">
            <Calendar className="h-5 w-5 mt-0.5" />
            <div>
              <span className="font-medium">Current Development Timeline</span>
              <p className="text-sm mt-1">
                Our roadmap is continuously refined based on user feedback and industry needs.
                Dates and features may be adjusted to ensure optimal implementation.
              </p>
            </div>
          </div>
        </DocNote>

        {/* Feature Timeline */}
        <DocHeading>Development Timeline</DocHeading>
        <div className="space-y-6">
          {ROADMAP_FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                {/* Progress indicator */}
                <div 
                  className={`absolute top-0 left-0 w-1 h-full ${feature.badgeColor}`} 
                />
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-medium">
                        {feature.status}
                      </Badge>
                      <Badge variant="secondary">
                        {feature.priority} Priority
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Planned Features</h4>
                        <ul className="space-y-2">
                          {feature.features.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Star className="h-4 w-4 text-primary shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Development Status</h4>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span className="font-medium">{feature.progress}%</span>
                          </div>
                          {renderProgressBar(feature.progress)}
                        </div>
                        
                        <div className="pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Rocket className="h-4 w-4" />
                              {feature.preview}
                            </p>
                            <Button variant="outline" size="sm">
                              Learn More
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Integration Ecosystem */}
        <DocHeading>Integration Ecosystem</DocHeading>
        <div className="grid md:grid-cols-3 gap-6">
          {INTEGRATION_ECOSYSTEM.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>{category.category}</CardTitle>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.partners.map((partner, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{partner.name}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{partner.status}</Badge>
                        <Badge>{partner.launch}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Early Access Program */}
        <DocHeading>Join Early Access</DocHeading>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                How to Participate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Register for early feature access",
                  "Join beta testing programs",
                  "Provide feedback and suggestions",
                  "Get priority feature access",
                  "Help shape product development"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Early Access Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Preview features before release",
                  "Influence feature development",
                  "Special early adopter pricing",
                  "Direct access to dev team",
                  "Priority support channels"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DocContent>
  );
}