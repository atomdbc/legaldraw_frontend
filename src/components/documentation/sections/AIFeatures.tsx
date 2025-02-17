// src/components/documentation/sections/AIFeatures.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Wand2, 
  Brain, 
  Bot, 
  FileText,
  Shield,
  Zap,
  ArrowRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { DocContent, DocHeading, DocNote } from '../DocContent';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const aiFeatures = [
  {
    icon: Wand2,
    title: "Smart Document Generation",
    description: "AI-powered generation of legally sound documents",
    capabilities: [
      "Context-aware document creation",
      "Jurisdiction-specific content",
      "Industry-tailored clauses",
      "Automatic formatting"
    ]
  },
  {
    icon: Brain,
    title: "Intelligent Variables",
    description: "Dynamic field suggestions and validations",
    capabilities: [
      "Smart field completion",
      "Context-based suggestions",
      "Automatic data validation",
      "Cross-reference checking"
    ]
  },
  {
    icon: Shield,
    title: "Compliance Assistance",
    description: "Ensures documents meet legal requirements",
    capabilities: [
      "Regulatory compliance checks",
      "Required clause verification",
      "Jurisdiction validation",
      "Update recommendations"
    ]
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description: "Interactive guidance throughout the process",
    capabilities: [
      "Step-by-step guidance",
      "Real-time suggestions",
      "Context-aware help",
      "Best practice recommendations"
    ]
  }
];

const upcomingFeatures = [
  {
    title: "Document Analysis",
    description: "AI-powered analysis of existing legal documents",
    status: "Coming Soon",
    features: [
      "Content extraction",
      "Risk assessment",
      "Clause comparison",
      "Improvement suggestions"
    ]
  },
  {
    title: "Smart Templates",
    description: "Self-improving document templates",
    status: "Beta",
    features: [
      "Learning from usage patterns",
      "Industry-specific adaptations",
      "Automatic updates",
      "Custom clause suggestions"
    ]
  }
];

export function AIFeaturesSection() {
  return (
    <DocContent>
      <div className="space-y-8">
        {/* Introduction */}
        <div>
          <h1 className="text-4xl font-bold mb-4">AI Features</h1>
          <p className="text-xl text-muted-foreground">
            Discover how Docwelo's AI enhances document creation and management.
          </p>
        </div>

        {/* AI Overview */}
        <DocNote>
        Docwelo leverages advanced AI models to simplify document creation while ensuring
          legal accuracy and compliance. Our AI systems are continuously trained on vast legal
          datasets while maintaining strict privacy and security standards.
        </DocNote>

        {/* Core AI Features */}
        <DocHeading>Core AI Capabilities</DocHeading>
        <div className="grid md:grid-cols-2 gap-6">
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Capabilities:</h4>
                    <ul className="grid gap-2">
                      {feature.capabilities.map((capability, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <Zap className="h-4 w-4 text-primary" />
                          {capability}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI in Document Creation */}
        <DocHeading>AI-Powered Document Creation</DocHeading>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Our AI system guides you through the document creation process:
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                step: 1,
                title: "Initial Analysis",
                description: "AI analyzes your requirements and suggests the best document type"
              },
              {
                step: 2,
                title: "Smart Generation",
                description: "Creates document content based on provided information and context"
              },
              {
                step: 3,
                title: "Intelligent Review",
                description: "Provides suggestions and validates content during review"
              }
            ].map((step, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4">
                      {step.step}
                    </div>
                    <h3 className="font-medium mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Smart Template System */}
        <DocHeading>Smart Template System</DocHeading>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Dynamic Adaptation</h3>
                <p className="text-sm text-muted-foreground">
                  Templates automatically adapt based on:
                </p>
                <ul className="grid md:grid-cols-2 gap-2 mt-2">
                  {[
                    "Jurisdiction requirements",
                    "Industry standards",
                    "Party types involved",
                    "Document purpose",
                    "Business context",
                    "Regulatory requirements"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  While our AI provides intelligent suggestions, we recommend reviewing all
                  generated content with appropriate legal counsel when necessary.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming AI Features */}
        <DocHeading>Upcoming AI Features</DocHeading>
        <div className="grid md:grid-cols-2 gap-6">
          {upcomingFeatures.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>{feature.title}</CardTitle>
                  <Badge variant="secondary">{feature.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <div className="space-y-2">
                  <h4 className="font-medium">Planned Capabilities:</h4>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Sparkles className="h-4 w-4 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Limitations & Best Practices */}
        <DocHeading>Best Practices & Limitations</DocHeading>
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              While our AI is highly advanced, it's designed to assist, not replace, legal
              expertise. Always review generated documents thoroughly and seek legal counsel
              for complex or high-stakes situations.
            </AlertDescription>
          </Alert>

          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Recommended Practices</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Review all AI-generated content</li>
                    <li>• Provide accurate input information</li>
                    <li>• Use AI suggestions as guidance</li>
                    <li>• Keep document context clear</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Current Limitations</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Complex legal interpretations</li>
                    <li>• Jurisdiction-specific nuances</li>
                    <li>• Highly specialized documents</li>
                    <li>• Novel legal situations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DocContent>
  );
}