// src/components/landing/TechStack.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Zap,
  Brain,
  Lock,
  Network,
  Cloud,
  Code,
  CheckCircle
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Advanced AI",
    description: "State-of-the-art language models understand legal context and nuance",
    benefits: ["Context-aware document generation", "Smart clause suggestions", "Automated compliance checks"]
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Bank-level security protects your sensitive documents",
    benefits: ["End-to-end encryption", "SOC 2 Type II compliant", "Regular security audits"]
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Documents generated in seconds, not hours",
    benefits: ["Real-time collaboration", "Instant previews", "Quick exports"]
  },
  {
    icon: Network,
    title: "Seamless Integration",
    description: "Works with your existing tools and workflows",
    benefits: ["API access", "Popular platform integrations", "Custom workflow automation"]
  }
];

export const TechStack = () => {
  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge 
            variant="outline" 
            className="border-white/20 text-white mb-4"
          >
            Powered by Innovation
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Enterprise-Grade Technology
          </h2>
          <p className="text-xl text-gray-400">
            Built with cutting-edge technology to deliver unmatched performance and reliability
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/5 border-white/10">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="p-3 bg-white/10 rounded-lg">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-gray-200">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 bg-white/5 rounded-lg">
            <div className="text-4xl font-bold mb-2">99.99%</div>
            <div className="text-gray-400">Uptime</div>
          </div>
          <div className="text-center p-8 bg-white/5 rounded-lg">
            <div className="text-4xl font-bold mb-2">&lt;500ms</div>
            <div className="text-gray-400">Response Time</div>
          </div>
          <div className="text-center p-8 bg-white/5 rounded-lg">
            <div className="text-4xl font-bold mb-2">256-bit</div>
            <div className="text-gray-400">Encryption</div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-8">
            Built with Modern Technology
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "AI/ML", "Cloud Native", "REST APIs", 
              "GraphQL", "React", "Node.js", 
              "PostgreSQL", "Redis", "Docker"
            ].map((tech, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="border-white/20 text-white"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Security Certifications */}
        <div className="mt-16 flex justify-center gap-8">
          <div className="w-20 h-20 bg-white/5 rounded-lg flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="w-20 h-20 bg-white/5 rounded-lg flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <div className="w-20 h-20 bg-white/5 rounded-lg flex items-center justify-center">
            <Cloud className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </section>
  );
};