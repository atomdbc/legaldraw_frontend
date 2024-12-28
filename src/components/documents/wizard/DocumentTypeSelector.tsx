'use client';

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  Sparkles,
  Lock,
  Presentation,
  FileEdit,
  CheckCircle2
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const documentTypes = [
  {
    id: 'nda',
    title: 'Non-Disclosure Agreement',
    description: 'Protect confidential information shared between parties',
    icon: ShieldCheck,
    category: 'Privacy & Protection',
    popular: true,
    ai: true,
    estimatedTime: '1 min'
  },
  {
    id: 'service',
    title: 'Service Agreement',
    description: 'Define terms for professional service delivery',
    icon: Briefcase,
    category: 'Business Contracts',
    ai: true,
    estimatedTime: '1-2 min'
  },
  {
    id: 'employment',
    title: 'Employment Agreement',
    description: 'Establish employment terms and conditions',
    icon: Users,
    category: 'Employment',
    comingSoon: true,
    estimatedTime: '15-20 min'
  },
  {
    id: 'pitch-deck',
    title: 'Pitch Deck Template',
    description: 'Professional template for startup presentations',
    icon: Presentation,
    category: 'Business Documents',
    comingSoon: true,
    ai: true,
    estimatedTime: '5-10 min'
  },
  {
    id: 'custom',
    title: 'Custom Document',
    description: 'Create a custom legal document with AI assistance',
    icon: FileEdit,
    category: 'Custom',
    comingSoon: true,
    ai: true,
    estimatedTime: 'varies'
  }
];

export default function DocumentTypeSelector({ onSelect, selectedType }: { 
  onSelect: (id: string) => void;
  selectedType: string | null;
}) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <ScrollArea className="flex-1 px-6">
        <div className="grid gap-6 py-6">
          {Object.entries(groupByCategory(documentTypes)).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-base font-semibold text-foreground mb-2">{category}</h2>
              <div className="grid gap-4">
                {items.map((type) => {
                  const Icon = type.icon;
                  const isAvailable = !type.comingSoon;
                  
                  return (
                    <div
                      key={type.id}
                      onClick={() => isAvailable && onSelect(type.id)}
                      role={isAvailable ? "button" : undefined}
                      tabIndex={isAvailable ? 0 : undefined}
                      onKeyDown={(e) => {
                        if (isAvailable && (e.key === 'Enter' || e.key === ' ')) {
                          onSelect(type.id);
                        }
                      }}
                      className={`
                        relative flex flex-col w-full p-4 text-left rounded-lg
                        transition-all duration-200
                        ${isAvailable 
                          ? 'border-2 hover:border-primary/50 cursor-pointer shadow-sm hover:shadow-md ring-1 ring-green-500/10' 
                          : 'border-2 border-dashed border-gray-200 opacity-50 cursor-not-allowed'
                        }
                        ${selectedType === type.id ? 'border-primary bg-primary/5' : 'border-transparent bg-card hover:bg-accent'}
                      `}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`rounded-lg p-2.5 ${selectedType === type.id ? 'bg-primary/10' : 'bg-muted'}`}>
                          <Icon className={`h-5 w-5 ${selectedType === type.id ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{type.title}</span>
                            <div className="flex flex-wrap gap-1.5">
                              {isAvailable && (
                                <Badge variant="secondary" className="h-5 bg-green-500/10 text-green-600 flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Available
                                </Badge>
                              )}
                              {type.popular && (
                                <Badge variant="secondary" className="h-5">Popular</Badge>
                              )}
                              {type.ai && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div>
                                      <Badge variant="secondary" className="h-5">
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        AI Assisted
                                      </Badge>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">AI-powered suggestions and validation</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {type.comingSoon && (
                                <Badge variant="outline" className="h-5">
                                  Coming Soon
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="h-5 flex items-center gap-1">
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

      <div className="p-6 border-t bg-muted/20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span>Your documents are encrypted and secure</span>
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