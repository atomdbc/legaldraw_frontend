// src/components/landing/UseCases.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  UserCircle, 
  Users, 
  Briefcase,
  Clock,
  Target,
  ArrowRight,
  FileText,
  Search,
  BarChart,
  Settings,
  MessageSquare,
  Bell,
  ChevronDown,
  MoreVertical,
  Calendar,
  Sparkles
} from "lucide-react";
import Image from "next/image";

// Mockup Components
const LawFirmMockup = () => (
  <div className="bg-white rounded-lg shadow-xl p-6 w-full">
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {["bg-blue-400", "bg-green-400", "bg-purple-400"].map((bg, i) => (
            <div key={i} className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center border-2 border-white`}>
              <span className="text-xs text-white font-medium">
                {["JD", "SK", "MT"][i]}
              </span>
            </div>
          ))}
        </div>
        <span className="text-sm text-gray-600">Team Workspace</span>
      </div>
      <Bell className="w-5 h-5 text-gray-400" />
    </div>

    <div className="grid grid-cols-2 gap-4 mb-8">
      {[
        { label: "Active Documents", value: "12" },
        { label: "Pending Review", value: "5" },
        { label: "Completed", value: "28" },
        { label: "Team Members", value: "8" }
      ].map((stat, i) => (
        <div key={i} className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold mb-1">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>

    <div className="space-y-4">
      {[
        { title: "Service Agreement - Tech Co", status: "bg-green-400" },
        { title: "Employment Contract - HR", status: "bg-yellow-400" },
        { title: "NDA - Client Project", status: "bg-blue-400" }
      ].map((doc, i) => (
        <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <span className="font-medium">{doc.title}</span>
          </div>
          <div className={`w-2 h-2 rounded-full ${doc.status}`} />
        </div>
      ))}
    </div>
  </div>
);

const SoloPractitionerMockup = () => (
  <div className="bg-white rounded-lg shadow-xl p-6 w-full">
    <div className="flex items-center justify-between mb-8">
      <div className="space-y-1">
        <h3 className="font-semibold">Document Assistant</h3>
        <p className="text-sm text-gray-600">AI-powered suggestions</p>
      </div>
      <Settings className="w-5 h-5 text-gray-400" />
    </div>

    <div className="space-y-4 mb-8">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-start gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded">
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-blue-700 mb-1">Smart Suggestion</div>
            <p className="text-sm text-blue-600">Adding force majeure clause based on recent precedents.</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" className="bg-blue-600">Accept</Button>
          <Button size="sm" variant="outline">Review</Button>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Similar documents found: 3</span>
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-2 bg-gray-100 rounded w-full" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const InHouseTeamMockup = () => (
  <div className="bg-white rounded-lg shadow-xl p-6 w-full">
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <BarChart className="w-6 h-6 text-gray-600" />
        <div>
          <h3 className="font-semibold">Document Analytics</h3>
          <p className="text-sm text-gray-600">Last 30 days</p>
        </div>
      </div>
      <Button variant="outline" size="sm" className="gap-2">
        <Calendar className="w-4 h-4" />
        <span>Filter</span>
        <ChevronDown className="w-4 h-4" />
      </Button>
    </div>

    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="col-span-2 h-32 bg-gray-50 rounded-lg p-4">
        <div className="flex items-end justify-between h-full px-4">
          {[40, 65, 35, 85, 45, 70].map((height, i) => (
            <div key={i} className="w-4 bg-black/10 rounded-t" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {[
          { label: "Contracts", value: "847" },
          { label: "Templates", value: "24" }
        ].map((stat, i) => (
          <div key={i} className="bg-gray-50 p-3 rounded-lg">
            <div className="text-lg font-semibold">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-3">
      {[
        { dept: "Legal", count: 156, color: "bg-blue-400" },
        { dept: "HR", count: 98, color: "bg-green-400" },
        { dept: "Sales", count: 64, color: "bg-purple-400" }
      ].map((dept, i) => (
        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${dept.color}`} />
            <span className="font-medium">{dept.dept}</span>
          </div>
          <span className="text-gray-600">{dept.count} docs</span>
        </div>
      ))}
    </div>
  </div>
);


const useCases = [
  {
    icon: Building2,
    title: "Law Firms",
    pain: "Drowning in repetitive document work?",
    solution: "Free your team to focus on what matters most - your clients.",
    benefits: [
      {
        icon: Clock,
        title: "Save 15+ Hours Weekly",
        description: "Automate routine document creation and spend more time on strategic work."
      },
      {
        icon: Users,
        title: "Seamless Collaboration",
        description: "Enable your entire team to work together effortlessly on documents."
      },
      {
        icon: Target,
        title: "Consistency Guaranteed",
        description: "Maintain firm-wide document standards with smart templates."
      }
    ],
    cta: "Empower Your Firm"
  },
  {
    icon: UserCircle,
    title: "Solo Practitioners",
    pain: "Feeling overwhelmed managing everything alone?",
    solution: "Your personal AI assistant for document creation and management.",
    benefits: [
      {
        icon: Clock,
        title: "Work Smarter",
        description: "Handle more clients without sacrificing quality or working longer hours."
      },
      {
        icon: Target,
        title: "Professional Excellence",
        description: "Create flawless documents that reflect your expertise."
      },
      {
        icon: Users,
        title: "Scale Your Practice",
        description: "Grow your practice without growing your overhead."
      }
    ],
    cta: "Grow Your Practice"
  },
  {
    icon: Briefcase,
    title: "In-House Teams",
    pain: "Struggling to keep up with document demands?",
    solution: "Streamline your legal operations with intelligent automation.",
    benefits: [
      {
        icon: Clock,
        title: "Rapid Turnaround",
        description: "Respond to business needs faster with automated document generation."
      },
      {
        icon: Target,
        title: "Risk Mitigation",
        description: "Ensure compliance and reduce errors with AI-powered checks."
      },
      {
        icon: Users,
        title: "Cross-Department Efficiency",
        description: "Simplify collaboration between legal and business teams."
      }
    ],
    cta: "Transform Your Operations"
  }
];

export const UseCases = () => {
  const [activeCase, setActiveCase] = useState(0);

  const getMockup = () => {
    switch (activeCase) {
      case 0:
        return <LawFirmMockup />;
      case 1:
        return <SoloPractitionerMockup />;
      case 2:
        return <InHouseTeamMockup />;
      default:
        return null;
    }
  };

  return (
    <section id="use-cases" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Every Legal Professional's Dream Come True
          </h2>
          <p className="text-xl text-gray-600">
            Experience the freedom of intelligent document automation
          </p>
        </div>

        {/* Use Case Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {useCases.map((useCase, index) => (
            <Button
              key={index}
              variant={activeCase === index ? "default" : "outline"}
              className={`px-6 py-3 ${
                activeCase === index 
                  ? "bg-black text-white" 
                  : "border-black text-black hover:bg-gray-50"
              }`}
              onClick={() => setActiveCase(index)}
            >
              <useCase.icon className="w-5 h-5 mr-2" />
              {useCase.title}
            </Button>
          ))}
        </div>

        {/* Active Use Case Content */}
        <div className="max-w-5xl mx-auto">
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                {/* Content */}
                <div className="p-8 md:p-12">
                  <h3 className="text-2xl font-bold mb-2">
                    {useCases[activeCase].pain}
                  </h3>
                  <p className="text-xl text-gray-600 mb-8">
                    {useCases[activeCase].solution}
                  </p>

                  <div className="space-y-6">
                    {useCases[activeCase].benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                            <benefit.icon className="w-6 h-6" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">
                            {benefit.title}
                          </h4>
                          <p className="text-gray-600">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button 
                    size="lg"
                    className="w-full bg-black text-white hover:bg-black/90 mt-8"
                  >
                    <a href="/login" >{useCases[activeCase].cta}</a>
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                {/* Visual */}
                <div className="bg-gray-50 p-8 md:p-12 flex items-center justify-center">
                  {getMockup()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Stories Teaser */}
        <div className="mt-24 text-center">
          <p className="text-gray-600 mb-4">
            Join thousands of satisfied legal professionals
          </p>
          <div className="flex justify-center gap-8">
            <div className="flex -space-x-4">
              {[
                "/cta/man1.jpg",
                "/cta/man2.jpg",
                "/cta/man3.jpg",
                "/cta/arab.jpg"
              ].map((src, index) => (
                <div key={index} className="relative w-12 h-12">
                  <Image
                    src={src}
                    alt={`Legal Professional ${index + 1}`}
                    fill
                    className="rounded-full border-2 border-white object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};