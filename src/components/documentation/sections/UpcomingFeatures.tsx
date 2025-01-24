// src/components/documentation/sections/UpcomingFeatures.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  Terminal,
  MessageSquare,
  Stethoscope,
  Rocket,
  ArrowRight,
  Star,
  Mail,
  Crown,
  Sparkles,
  User
} from 'lucide-react';
import { useState } from 'react';
import { DocContent } from '../DocContent';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useWaitlist } from '@/hooks/use-waitlist';
import { useToast } from "@/hooks/use-toast";

const UPCOMING_FEATURES = [
  {
    icon: Users,
    title: "Team Workspace",
    problem: "Is your team scattered across emails, shared drives, and chat apps?",
    solution: "A unified workspace where your entire team can collaborate seamlessly on documents.",
    impact: "Imagine every team member always on the same page",
    preview: "Join Waitlist",
    highlight: "Coming to transform team collaboration"
  },
  {
    icon: Terminal,
    title: "Developer Tools",
    problem: "Need to integrate document generation into your workflow?",
    solution: "Streamline your processes with our powerful API and developer tools.",
    impact: "automation that works for you",
    preview: "Coming Soon",
    highlight: "Build your perfect workflow"
  },
  {
    icon: MessageSquare,
    title: "AI Assistant",
    problem: "Getting stuck on complex legal document questions?",
    solution: "Get instant, intelligent guidance when you need it most.",
    impact: "Like having a legal expert on standby",
    preview: "Join Waitlist",
    highlight: "Your personal document guide"
  },
  {
    icon: Stethoscope,
    title: "Smart Review",
    problem: "Worried about missing crucial details in your documents?",
    solution: "Advanced AI that helps catch issues before they become problems.",
    impact: "Peace of mind with every document",
    preview: "Coming Soon",
    highlight: "Never miss important details"
  }
];

export function UpcomingFeaturesSection() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { joinWaitlist } = useWaitlist();
  const { toast } = useToast();

  const openWaitlist = (feature: string) => {
    setSelectedFeature(feature);
    setWaitlistOpen(true);
    setFormData({ name: '', email: '' }); // Reset form
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in both name and email fields."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await joinWaitlist({
        name: formData.name,
        email: formData.email
      });
      setWaitlistOpen(false);
      setFormData({ name: '', email: '' }); // Reset form
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DocContent>
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              The Future Is Coming
            </Badge>
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Transforming How Teams Work with Documents
            </h1>
            <p className="text-xl text-muted-foreground">
              We're developing solutions to make your document workflow smoother, smarter, and more efficient.
            </p>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {UPCOMING_FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="pt-6 h-full flex flex-col relative">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="font-medium">
                      Premium
                    </Badge>
                  </div>

                  <h2 className="text-xl font-semibold mb-4">{feature.title}</h2>

                  <div className="space-y-4 flex-grow">
                    <p className="text-muted-foreground">
                      {feature.problem}
                    </p>

                    <div className="flex items-center gap-2 text-sm">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="font-medium">{feature.impact}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t flex justify-between items-center">
                    <Button 
                      variant="ghost" 
                      className="hover:bg-transparent hover:text-primary p-0 h-auto font-normal"
                      onClick={() => openWaitlist(feature.title)}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      {feature.preview}
                    </Button>
                    <Badge variant="outline" className="font-normal">
                      2025
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Early Access Section */}
        <Card className="relative overflow-hidden border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
          <CardContent className="relative p-8 text-center">
            <Crown className="h-8 w-8 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Be Among the First</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join our exclusive early access program and help shape the future of document management. 
              Get priority access to new features and provide direct feedback to our team.
            </p>
            <Button
              size="lg"
              onClick={() => openWaitlist('Early Access')}
              className="gap-2"
            >
              <Rocket className="h-4 w-4" />
              Get Early Access
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Waitlist Modal */}
        <Dialog open={waitlistOpen} onOpenChange={setWaitlistOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Join the Waitlist
              </DialogTitle>
              <DialogDescription>
                Be the first to experience {selectedFeature} and help shape its development.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 bg-primary/5 p-2 rounded">
                  <User className="h-4 w-4 text-primary" />
                  <Input 
                    placeholder="Your name" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="border-0 bg-transparent focus-visible:ring-0 px-0"
                  />
                </div>
                <div className="flex items-center gap-2 bg-primary/5 p-2 rounded">
                  <Mail className="h-4 w-4 text-primary" />
                  <Input 
                    placeholder="Work email" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="border-0 bg-transparent focus-visible:ring-0 px-0"
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Joining..."
                  ) : (
                    <>
                      <Rocket className="mr-2 h-4 w-4" />
                      Request Early Access
                    </>
                  )}
                </Button>
              </div>
              <div className="space-y-2 text-center">
                <p className="text-xs text-muted-foreground">
                  Limited spots available for early access program.
                </p>
                <p className="text-xs text-muted-foreground">
                  Priority access for teams and enterprises.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DocContent>
  );
}