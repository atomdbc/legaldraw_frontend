// src/components/documentation/sections/Introduction.tsx
'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, FileText, Shield, Bot, Rocket } from 'lucide-react';
import { DocContent, DocHeading, DocNote } from '../DocContent';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Sparkles,
    title: "AI Document Generation",
    description: "Create legally-sound documents in minutes with our advanced AI technology"
  },
  {
    icon: FileText,
    title: "Smart Templates",
    description: "Dynamic templates that adapt to your specific needs and requirements"
  },
  {
    icon: Shield,
    title: "Document Security",
    description: "Enterprise-grade security with advanced encryption and access controls"
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description: "Get intelligent suggestions and guidance throughout the process"
  },
  {
    icon: Check,
    title: "Compliance",
    description: "Stay compliant with automatic updates and jurisdiction-specific content"
  },
  {
    icon: Rocket,
    title: "Future-Ready",
    description: "Continuous updates with new AI features and improvements"
  }
];

const quickNavLinks = [
  {
    icon: FileText,
    title: "Getting Started",
    description: "Learn the basics and create your first document",
    href: "quick-start"
  },
  {
    icon: Sparkles,
    title: "AI Features",
    description: "Explore our AI-powered features",
    href: "ai-features"
  },
  {
    icon: FileText,
    title: "Document Types",
    description: "Browse available document templates",
    href: "document-creation"
  },
  {
    icon: Bot,
    title: "Smart Features",
    description: "Discover smart document generation",
    href: "ai-features"
  }
];

export function IntroductionSection() {
  // Function to handle navigation
  const handleNavigation = (href: string) => {
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('section', href);
    window.history.pushState({}, '', url);
    // Trigger navigation through URL change
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <DocContent>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Docwelo
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The next generation of AI-powered legal document generation and management
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-full" // Make container full height
            >
              <Card className="h-full"> {/* Make card full height */}
                <CardContent className="pt-6 h-full"> {/* Make content full height */}
                  <div className="flex items-start space-x-4 h-full">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1 min-h-[80px]"> {/* Set minimum height */}
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mission Statement */}
        <DocHeading>Our Mission</DocHeading>
        <p>
        Docwelo AI is revolutionizing the way legal documents are created and managed. 
          Our mission is to make professional legal document generation accessible, efficient, 
          and intelligent through the power of artificial intelligence.
        </p>

        <DocNote>
        Docwelo is not a law firm and does not provide legal advice. While our AI helps generate 
          legally-sound documents, we recommend reviewing important documents with legal professionals.
        </DocNote>

        {/* Quick Links Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickNavLinks.map((link, index) => (
                <Card
                  key={index}
                  className="p-4 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleNavigation(link.href)}
                >
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <link.icon className="h-4 w-4" />
                    {link.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {link.description}
                  </p>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Core Features Section */}
        <DocHeading>Core Features</DocHeading>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">AI-Powered Document Generation</h3>
          <p>
            Our advanced AI engine understands context, legal requirements, and best practices 
            to help generate accurate documents tailored to your needs. The system constantly 
            learns and improves from usage patterns while maintaining strict privacy standards.
          </p>

          <h3 className="text-xl font-semibold mt-6">Smart Templates</h3>
          <p>
            Templates automatically adapt based on your jurisdiction, industry, and specific 
            requirements. Our AI ensures all necessary clauses and terms are included while 
            maintaining compliance with relevant laws and regulations.
          </p>

          <h3 className="text-xl font-semibold mt-6">Document Management</h3>
          <p>
            Comprehensive tools for managing document lifecycles, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Draft management with automatic saving</li>
            <li>Version control and history tracking</li>
            <li>Document expiration management</li>
            <li>Secure sharing and collaboration</li>
          </ul>
        </div>

        {/* Coming Soon Features */}
        <DocHeading>Coming Soon</DocHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <div className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                Coming Soon
              </div>
            </div>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Team Collaboration</h3>
              <p className="text-sm text-muted-foreground">
                Work together with your team on documents with real-time collaboration features.
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <div className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                Coming Soon
              </div>
            </div>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">API Access</h3>
              <p className="text-sm text-muted-foreground">
                Integrate Docwelo's document generation capabilities into your own applications.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DocContent>
  );
}