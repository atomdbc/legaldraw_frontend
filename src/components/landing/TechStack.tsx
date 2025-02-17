import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Zap,
  Sparkles,
  Lock,
  Clock,
  Settings,
  Lightbulb,
  CheckCircle2
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Smart Technology",
    description: "Your documents practically write themselves",
    benefits: [
      "Understands what you need",
      "Suggests the right content",
      "Learns your preferences"
    ]
  },
  {
    icon: ShieldCheck,
    title: "Bank-Grade Security",
    description: "Your documents are safer than money in the bank",
    benefits: [
      "Maximum privacy protection",
      "Industry-leading security",
      "Regular safety checks"
    ]
  },
  {
    icon: Clock,
    title: "Lightning Speed",
    description: "Get more done in less time than ever before",
    benefits: [
      "Documents in seconds",
      "Real-time collaboration",
      "Instant updates"
    ]
  },
  {
    icon: Lightbulb,
    title: "Works Your Way",
    description: "Adapts to how you like to work",
    benefits: [
      "Works with your tools",
      "Customizable workflows",
      "Easy team sharing"
    ]
  }
];

export const TechStack = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge 
            variant="outline" 
            className="px-6 py-2 border-[#4361EE]/20 bg-[#4361EE]/10 backdrop-blur-sm text-[#4361EE] mb-6"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            The Future of Documents
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Professional Power
            <span className="block text-2xl md:text-3xl mt-2 text-gray-400 font-normal">
              Without the Complexity
            </span>
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed">
            Enterprise-grade technology that's so easy to use, 
            you'll wonder why document creation was ever hard
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors duration-300">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-gradient-to-br from-[#4361EE]/20 to-purple-500/20 rounded-xl">
                    <feature.icon className="w-8 h-8 text-[#4361EE]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 mb-6 text-lg">
                      {feature.description}
                    </p>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-[#4361EE]/20 flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-[#4361EE]" />
                          </div>
                          <span className="text-gray-300">{benefit}</span>
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
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            { value: "99.99%", label: "Reliability", description: "Always there when you need it" },
            { value: "Instant", label: "Creation", description: "No more waiting around" },
            { value: "256-bit", label: "Security", description: "Bank-grade protection" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-8 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#4361EE] to-blue-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-200 font-medium mb-1">{stat.label}</div>
              <div className="text-gray-400 text-sm">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-8 text-gray-300">
            Enterprise-Ready Security
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: ShieldCheck, label: "SOC 2 Type II" },
              { icon: Lock, label: "256-bit Encryption" },
              { icon: Settings, label: "99.99% Uptime" }
            ].map((badge, index) => (
              <div key={index} className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-[#4361EE]/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <badge.icon className="w-8 h-8 text-[#4361EE]" />
                </div>
                <span className="text-gray-400 text-sm">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};