import React, { useState } from 'react';
import { 
  ShieldCheck, Users, Briefcase, Sparkles, Lock,
  Presentation, Clock, Building2, FileCheck, Scale,
  HandshakeIcon, GraduationCap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const documentTypes = [
  {
    id: 'nda',
    title: 'Non-Disclosure Agreement',
    description: 'Protect your confidential information',
    icon: ShieldCheck,
    category: 'Essential',
    popular: true,
    estimatedTime: '1-2 min',
    status: 'available'
  },
  {
    id: 'service',
    title: 'Service Agreement',
    description: 'Contract for service providers',
    icon: Briefcase,
    category: 'Essential',
    estimatedTime: '2-3 min',
    status: 'available'
  },
  {
    id: 'employment',
    title: 'Employment Contract',
    description: 'Employment terms and conditions',
    icon: Users,
    category: 'Essential',
    estimatedTime: '2-3 min',
    status: 'available'
  },
  {
    id: 'partnership',
    title: 'Partnership Agreement',
    description: 'Partnership terms and conditions',
    icon: HandshakeIcon,
    category: 'Business',
    estimatedTime: '4-5 min',
    status: 'coming-soon'
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    description: 'GDPR-compliant privacy policy',
    icon: Lock,
    category: 'Business',
    estimatedTime: '3-4 min',
    status: 'coming-soon'
  }
];

const categories = ['All', 'Essential', 'Business'];

export default function DocumentTypeSelector({ onSelect, selectedType }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  

  const filteredDocs = documentTypes.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const availableDocs = filteredDocs.filter(doc => doc.status === 'available');
  const comingSoonDocs = filteredDocs.filter(doc => doc.status === 'coming-soon');

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header with Search */}
      <div className="p-6 border-b space-y-4">
        <h1 className="text-2xl font-semibold">Select Document Type</h1>
        <Input
          type="search"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="w-full border-2 p-1">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Available Documents */}
        {availableDocs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Available Documents</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {availableDocs.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  selected={selectedType === doc.id}
                  onClick={() => onSelect(doc.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon Documents */}
        {comingSoonDocs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-muted-foreground">Coming Soon</h2>
            <div className="grid md:grid-cols-2 gap-4 opacity-70">
              {comingSoonDocs.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  disabled
                />
              ))}
            </div>
          </div>
        )}

        {filteredDocs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No documents found matching your search.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-muted/10">
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>AI-Enhanced Generation</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>End-to-End Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentCard({ document, selected, disabled, onClick }) {
  const Icon = document.icon;
  
  return (
    <Card
      className={`
        relative p-4 transition-all duration-200 border-2
        ${disabled ? 'opacity-70 cursor-not-allowed border-gray-200' : 'cursor-pointer hover:shadow-md hover:border-primary/60 border-gray-200'}
        ${selected ? 'border-primary bg-primary/5' : ''}
      `}
      onClick={() => !disabled && onClick?.()}
    >
      <div className="flex gap-4">
        <div className={`
          rounded-lg p-2
          ${selected ? 'bg-primary/10 text-primary' : 'bg-muted'}
        `}>
          <Icon className="h-5 w-5" />
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium">{document.title}</h3>
            {document.popular && (
              <Badge variant="secondary" className="shrink-0">Popular</Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">{document.description}</p>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="h-5">
              <Clock className="h-3 w-3 mr-1" />
              {document.estimatedTime}
            </Badge>
            {document.status === 'coming-soon' && (
              <Badge variant="outline">Coming Soon</Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}