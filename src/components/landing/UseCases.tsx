"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  UserCircle, 
  Briefcase,
  Clock,
  Zap,
  ArrowRight,
  FileText,
  Search,
  BarChart,
  Settings,
  MessageSquare,
  Bell,
  ChevronDown,
  CheckCircle2,
  Calendar,
  Sparkles,
  Star
} from "lucide-react";
import Image from "next/image";

// Mockup Components
const BusinessMockup = () => (
  <div className="bg-white rounded-lg shadow-xl p-6 w-full">
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {[
            { initials: "JD", bg: "bg-[#4361EE]" },
            { initials: "SK", bg: "bg-green-500" },
            { initials: "MT", bg: "bg-purple-500" }
          ].map((user, i) => (
            <div key={i} className={`w-8 h-8 rounded-full ${user.bg} flex items-center justify-center border-2 border-white`}>
              <span className="text-xs text-white font-medium">
                {user.initials}
              </span>
            </div>
          ))}
        </div>
        <span className="text-sm text-gray-600">Team Documents</span>
      </div>
      <Bell className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
    </div>

    <div className="grid grid-cols-2 gap-4 mb-8">
      {[
        { label: "Active Documents", value: "12" },
        { label: "Ready for Review", value: "5" },
        { label: "Completed", value: "28" },
        { label: "Team Members", value: "8" }
      ].map((stat, i) => (
        <div key={i} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="text-2xl font-bold mb-1">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>

    <div className="space-y-4">
      {[
        { title: "Client Agreement", status: "bg-[#4361EE]" },
        { title: "Employee Contract", status: "bg-yellow-400" },
        { title: "Project Proposal", status: "bg-green-500" }
      ].map((doc, i) => (
        <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:border-[#4361EE] transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-400 group-hover:text-[#4361EE] transition-colors" />
            <span className="font-medium group-hover:text-[#4361EE] transition-colors">{doc.title}</span>
          </div>
          <div className={`w-2 h-2 rounded-full ${doc.status}`} />
        </div>
      ))}
    </div>
  </div>
);

const FreelancerMockup = () => (
  <div className="bg-white rounded-lg shadow-xl p-6 w-full">
    <div className="flex items-center justify-between mb-8">
      <div className="space-y-1">
        <h3 className="font-semibold">Smart Assistant</h3>
        <p className="text-sm text-gray-600">AI-powered suggestions</p>
      </div>
      <Settings className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
    </div>

    <div className="space-y-4 mb-8">
      <div className="bg-[#4361EE]/10 border border-[#4361EE]/20 rounded-lg p-4">
        <div className="flex items-start gap-3 mb-2">
          <div className="p-2 bg-[#4361EE]/20 rounded">
            <Sparkles className="w-4 h-4 text-[#4361EE]" />
          </div>
          <div>
            <div className="font-medium text-[#4361EE] mb-1">Smart Suggestion</div>
            <p className="text-sm text-gray-600">Adding payment terms based on industry standards.</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" className="bg-[#4361EE] hover:bg-[#3651D4]">Accept</Button>
          <Button size="sm" variant="outline" className="border-[#4361EE] text-[#4361EE] hover:bg-[#4361EE]/10">Review</Button>
        </div>
      </div>

      <div className="border rounded-lg p-4 hover:border-[#4361EE] transition-colors cursor-pointer">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Similar documents found: 3</span>
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-2 bg-gray-100 rounded-full w-full" />
          ))}
        </div>
      </div>
    </div>

    <div className="border-t pt-4">
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <span>Recent Documents</span>
        <button className="text-[#4361EE] hover:underline">View All</button>
      </div>
      <div className="space-y-3">
        {[
          "Service Agreement.pdf",
          "Client Proposal.pdf",
          "Invoice Template.pdf"
        ].map((doc, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#4361EE] cursor-pointer">
            <FileText className="w-4 h-4" />
            <span>{doc}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TeamMockup = () => (
  <div className="bg-white rounded-lg shadow-xl p-6 w-full">
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <BarChart className="w-6 h-6 text-[#4361EE]" />
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
            <div key={i} className="w-4 bg-[#4361EE]/20 rounded-t" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {[
          { label: "Total Documents", value: "847" },
          { label: "Active Users", value: "24" }
        ].map((stat, i) => (
          <div key={i} className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="text-lg font-semibold">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-3">
      {[
        { dept: "Marketing", count: 156, color: "bg-[#4361EE]" },
        { dept: "Sales", count: 98, color: "bg-green-500" },
        { dept: "Operations", count: 64, color: "bg-purple-500" }
      ].map((dept, i) => (
        <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:border-[#4361EE] transition-colors cursor-pointer">
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
    icon: UserCircle,
    title: "Entrepreneurs & Freelancers",
    pain: "Tired of expensive legal fees?",
    solution: "Create professional documents in minutes without the lawyer costs.",
    benefits: [
      {
        icon: Zap,
        title: "Save Thousands",
        description: "Create legally-sound documents at a fraction of traditional costs."
      },
      {
        icon: Clock,
        title: "Time is Money",
        description: "Get your documents done in minutes, not days or weeks."
      },
      {
        icon: CheckCircle2,
        title: "Peace of Mind",
        description: "Know your documents are legally compliant and protect your interests."
      }
    ],
    cta: "Start Creating Free"
  },
  {
    icon: Building2,
    title: "Small Businesses",
    pain: "Drowning in paperwork?",
    solution: "Let AI handle your document needs while you focus on growth.",
    benefits: [
      {
        icon: Clock,
        title: "Hours Saved Weekly",
        description: "Automate routine paperwork and focus on running your business."
      },
      {
        icon: Zap,
        title: "Error-Free Documents",
        description: "Perfect formatting and compliance, every single time."
      },
      {
        icon: CheckCircle2,
        title: "Stay Protected",
        description: "All the legal protection you need, without the complexity."
      }
    ],
    cta: "Streamline Your Business"
  },
  {
    icon: Briefcase,
    title: "Business Teams",
    pain: "Need better document workflow?",
    solution: "Create, collaborate, and manage all your documents in one place.",
    benefits: [
      {
        icon: Clock,
        title: "10x Faster Creation",
        description: "Turn hours of document work into minutes with AI assistance."
      },
      {
        icon: Zap,
        title: "Team Efficiency",
        description: "Everyone on the same page with shared templates and standards."
      },
      {
        icon: CheckCircle2,
        title: "Scale With Ease",
        description: "Handle more documents without adding headcount or stress."
      }
    ],
    cta: "Empower Your Team"
  }
];

export const UseCases = () => {
  const [activeCase, setActiveCase] = useState(0);

  const getMockup = () => {
    switch (activeCase) {
      case 0:
        return <FreelancerMockup />;
      case 1:
        return <BusinessMockup />;
      case 2:
        return <TeamMockup />;
      default:
        return null;
    }
  };

  return (
    <section id="use-cases" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4361EE]/10 rounded-full text-[#4361EE] text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Perfect for every need
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Professional Documents For Everyone
            <span className="block text-2xl md:text-3xl text-gray-500 mt-2">
              No Legal Expertise Required
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Whether you're a solo entrepreneur or managing a team,
            create perfect documents without the complexity or cost
          </p>
        </div>

        {/* Use Case Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {useCases.map((useCase, index) => (
            <Button
              key={index}
              variant={activeCase === index ? "default" : "outline"}
              className={`h-14 px-8 rounded-full transition-all duration-300 ${
                activeCase === index 
                  ? "bg-[#4361EE] text-white shadow-lg shadow-blue-500/20" 
                  : "border-gray-200 text-gray-600 hover:border-[#4361EE] hover:text-[#4361EE]"
              }`}
              onClick={() => setActiveCase(index)}
            >
              <useCase.icon className="w-5 h-5 mr-2" />
              {useCase.title}
            </Button>
          ))}
        </div>

        {/* Active Use Case Content */}
        <div className="max-w-6xl mx-auto">
          <Card className="border border-gray-100 shadow-2xl overflow-hidden rounded-2xl">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                {/* Content */}
                <div className="p-8 md:p-12">
                  <h3 className="text-2xl font-bold mb-2">
                    {useCases[activeCase].pain}
                  </h3>
                  <p className="text-xl text-gray-600 mb-12">
                    {useCases[activeCase].solution}
                  </p>

                  <div className="space-y-8">
                    {useCases[activeCase].benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-6">
                        <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-full bg-[#4361EE]/10 flex items-center justify-center">
                            <benefit.icon className="w-7 h-7 text-[#4361EE]" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold mb-2">
                            {benefit.title}
                          </h4>
                          <p className="text-gray-600 leading-relaxed">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button 
                    size="lg"
                    className="w-full bg-[#4361EE] text-white hover:bg-[#3651D4] h-14 rounded-full shadow-lg shadow-blue-500/20 mt-12"
                  >
                    <a href="/register">{useCases[activeCase].cta}</a>
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                {/* Visual */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 md:p-12 flex items-center justify-center">
                  {getMockup()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
<div className="mt-24 text-center">
  <p className="text-lg text-gray-600 mb-6">
    Join thousands of satisfied professionals
  </p>
  <div className="flex flex-col items-center gap-4">
    <div className="flex -space-x-4">
      {[
        '/cta/man1.jpg',
        '/cta/man2.jpg',
        '/cta/man3.jpg',
        '/cta/arab.jpg'
      ].map((src, index) => (
        <div key={index} className="relative w-16 h-16">
          <Image
            src={src}
            alt={`Satisfied Professional ${index + 1}`}
            fill
            className="rounded-full border-4 border-white shadow-lg object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
    <div className="flex items-center gap-2 text-[#4361EE]">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="w-5 h-5 fill-current" />
        ))}
      </div>
      <span className="font-medium">4.9/5 from verified users</span>
    </div>
  </div>
</div>
      </div>
    </section>
  );
};