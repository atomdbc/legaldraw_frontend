'use client';

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  Sparkles,
  Lock,
  Presentation,
  FileEdit,
  CheckCircle2,
  Clock,
  FilePlus2,
  GraduationCap,
  HandshakeIcon,
  Building2,
  FileCheck,
  Scale,
  Store
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const documentTypes = [
  // Available Documents
  {
    id: 'nda',
    title: 'Non-Disclosure Agreement',
    description: 'Protect your confidential information with a legally-binding NDA',
    icon: ShieldCheck,
    category: 'Essential Documents',
    popular: true,
    ai: true,
    estimatedTime: '1-2 min',
    status: 'available'
  },
  {
    id: 'service',
    title: 'Service Agreement',
    description: 'Professional contract for service providers and clients',
    icon: Briefcase,
    category: 'Essential Documents',
    ai: true,
    estimatedTime: '2-3 min',
    status: 'available'
  },
  {
    id: 'employment',
    title: 'Employment Contract',
    description: 'Comprehensive employment terms and conditions',
    icon: Users,
    category: 'Essential Documents',
    ai: true,
    estimatedTime: '2-3 min',
    status: 'available'
  },

  // Business Documents (Coming Soon)
  {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    description: 'GDPR-compliant privacy policy for your business',
    icon: Lock,
    category: 'Business Documents',
    ai: true,
    estimatedTime: '3-4 min',
    status: 'coming-soon',
    releaseDate: 'Soon'
  },
  {
    id: 'terms-service',
    title: 'Terms of Service',
    description: 'Website or application terms of service agreement',
    icon: FileCheck,
    category: 'Business Documents',
    ai: true,
    estimatedTime: '3-4 min',
    status: 'coming-soon',
    releaseDate: 'Soon'
  },
  {
    id: 'pitch-deck',
    title: 'Pitch Deck Template',
    description: 'Professional startup presentation template',
    icon: Presentation,
    category: 'Business Documents',
    ai: true,
    estimatedTime: '5-10 min',
    status: 'coming-soon',
    releaseDate: 'Soon'
  },

  // Partnership & Agreements
  {
    id: 'partnership',
    title: 'Partnership Agreement',
    description: 'Define partnership terms and responsibilities',
    icon: HandshakeIcon,
    category: 'Partnership & Agreements',
    ai: true,
    estimatedTime: '4-5 min',
    status: 'coming-soon',
    releaseDate: 'Soon'
  },
  {
    id: 'contractor',
    title: 'Contractor Agreement',
    description: 'Independent contractor terms and conditions',
    icon: Building2,
    category: 'Partnership & Agreements',
    ai: true,
    estimatedTime: '3-4 min',
    status: 'coming-soon',
    releaseDate: 'Soon'
  },

  // Special Templates
  {
    id: 'custom',
    title: 'Custom Document',
    description: 'Create a custom document with AI assistance',
    icon: FilePlus2,
    category: 'Special Templates',
    ai: true,
    estimatedTime: 'varies',
    status: 'coming-soon',
    releaseDate: 'Soon'
  }
];

export default function DocumentTypeSelector({ onSelect, selectedType }: { 
  onSelect: (id: string) => void;
  selectedType: string | null;
}) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header Section */}
      <div className="px-6 py-4 border-b">
        <h1 className="text-xl font-semibold mb-1">Select Document Type</h1>
        <p className="text-sm text-muted-foreground">Choose a document type to get started</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Available Now', value: '3 Types', icon: CheckCircle2 },
              { label: 'Coming Soon', value: '6+ Types', icon: Clock },
              { label: 'AI Assisted', value: '100%', icon: Sparkles },
              { label: 'Avg. Time', value: '2-3 min', icon: Clock }
            ].map((stat, i) => (
              <div key={i} className="bg-zinc-50 rounded-lg p-3 flex flex-col">
                <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <stat.icon className="h-4 w-4" />
                  {stat.label}
                </div>
                <div className="font-semibold mt-1">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Document Types Grid */}
          {Object.entries(groupByCategory(documentTypes)).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{category}</h2>
                <Separator className="flex-1" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {items.map((type) => {
                  const Icon = type.icon;
                  const isAvailable = type.status === 'available';
                  
                  return (
                    <div
                      key={type.id}
                      onClick={() => isAvailable && onSelect(type.id)}
                      className={`
                        group relative flex flex-col rounded-lg border-2 transition-all duration-200
                        ${isAvailable 
                          ? 'hover:border-primary cursor-pointer' 
                          : 'border-dashed opacity-75 cursor-not-allowed'
                        }
                        ${selectedType === type.id ? 'border-primary ring-1 ring-primary/10' : 'border-transparent'}
                        ${isAvailable ? 'bg-card hover:shadow-md' : 'bg-muted/20'}
                        p-4
                      `}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`
                          rounded-lg p-2.5 transition-colors
                          ${selectedType === type.id 
                            ? 'bg-primary/10 text-primary' 
                            : isAvailable 
                              ? 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary' 
                              : 'bg-muted text-muted-foreground'
                          }
                        `}>
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{type.title}</span>
                            <div className="flex flex-wrap gap-1.5">
                              {isAvailable ? (
                                <Badge variant="secondary" className="bg-green-500/10 text-green-700">
                                  Available Now
                                </Badge>
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge variant="outline">
                                      Coming {type.releaseDate}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">This document type will be available in {type.releaseDate}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {type.popular && (
                                <Badge variant="secondary">Popular</Badge>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground">{type.description}</p>

                          <div className="flex items-center gap-2 mt-2">
                            {type.ai && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="secondary" className="h-5">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    AI Enhanced
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Uses AI for smarter document generation</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            <Badge variant="outline" className="h-5">
                              <Clock className="h-3 w-3 mr-1" />
                              {type.estimatedTime}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer Section */}
      <div className="p-4 border-t bg-muted/10">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Documents are encrypted and secure</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>AI-assisted document generation</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function groupByCategory(types: typeof documentTypes) {
  return types.reduce((acc, type) => {
    const category = type.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(type);
    return acc;
  }, {} as Record<string, typeof documentTypes>);
}