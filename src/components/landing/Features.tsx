// src/components/landing/Features.tsx
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  Clock, 
  Shield, 
  Users, 
  FileText, 
  Repeat
} from "lucide-react";
import { FeatureShowcase } from "./FeatureShowcase";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Create professional legal documents in minutes using our advanced AI technology that understands legal context and requirements."
  },
  {
    icon: Clock,
    title: "Save Countless Hours",
    description: "Automate repetitive document creation tasks and focus on what matters most - serving your clients better."
  },
  {
    icon: Shield,
    title: "Legal Compliance",
    description: "Stay compliant with up-to-date templates and automated compliance checks for different jurisdictions."
  },
  {
    icon: Users,
    title: "Seamless Collaboration",
    description: "Work together with your team in real-time, track changes, and manage document versions effortlessly."
  },
  {
    icon: FileText,
    title: "Smart Templates",
    description: "Access a growing library of pre-built templates or create your own custom templates with dynamic fields."
  },
  {
    icon: Repeat,
    title: "Easy Integration",
    description: "Integrate with your existing tools and workflows through our API or direct integrations."
  }
];


export const Features = () => {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Every Feature You Need for Modern Legal Work
          </h2>
          <p className="text-xl text-gray-600">
            Streamline your document workflow with powerful features designed specifically for legal professionals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <feature.icon className="w-12 h-12 text-black mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Highlight with Interactive Showcase */}
        <div className="mt-24 bg-white rounded-lg shadow-xl p-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Experience the Future of Legal Document Creation
              </h3>
              <p className="text-gray-600 mb-6">
                Our AI-powered platform understands legal context, automatically suggests relevant clauses, and ensures compliance while maintaining the highest standards of document quality.
              </p>
              <ul className="space-y-4">
                {[
                  "Intelligent document assembly",
                  "Automatic clause suggestions",
                  "Real-time collaboration",
                  "Version control and tracking",
                  "Secure document storage"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <svg 
                      className="w-5 h-5 text-green-500" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <FeatureShowcase />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};