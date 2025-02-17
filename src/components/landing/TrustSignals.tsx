"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Clock, 
  CheckCircle,
  Users,
  Star,
  ArrowRight,
  ArrowLeft,
  Quote
} from "lucide-react";

const statistics = [
  {
    icon: Clock,
    value: "2.5M+",
    label: "Hours Saved",
    sublabel: "Time given back to professionals"
  },
  {
    icon: CheckCircle,
    value: "1M+",
    label: "Documents Created",
    sublabel: "From contracts to proposals"
  },
  {
    icon: Users,
    value: "10,000+",
    label: "Happy Users",
    sublabel: "Across 30+ countries"
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "User Rating",
    sublabel: "Based on 2,000+ reviews"
  }
];

const testimonials = [
  {
    content: "Docwelo has transformed my workday. What used to take me hours now takes minutes. I can finally focus on growing my business instead of drowning in paperwork.",
    author: "Sarah Chen",
    role: "Business Owner",
    company: "Tech Solutions Inc.",
    image: "/cta/arab.jpg"
  },
  {
    content: "The accuracy and speed are incredible. No more late nights fixing document formatting or worrying about missing important details. It just works.",
    author: "Michael Rodriguez",
    role: "Startup Founder",
    company: "InnovatePro",
    image: "/cta/man1.jpg"
  },
  {
    content: "As a freelancer, time is money. Docwelo helps me look professional with perfect documents every time, without the stress of creating them from scratch.",
    author: "Emily Thompson",
    role: "Independent Consultant",
    company: "Thompson Consulting",
    image: "/cta/man2.jpg"
  }
];

export const TrustSignals = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const previousTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {statistics.map((stat, index) => (
            <Card key={index} className="border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-[#4361EE]/10 flex items-center justify-center mb-6 mx-auto">
                  <stat.icon className="w-7 h-7 text-[#4361EE]" />
                </div>
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#4361EE] to-blue-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-900 font-medium mb-2">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.sublabel}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real People, Real Results
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of professionals who transformed their document workflow
            </p>
          </div>

          <div className="relative">
            <Card className="border border-gray-100 shadow-2xl">
              <CardContent className="p-12">
                <div className="flex justify-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-[#4361EE]/10 flex items-center justify-center">
                    <Quote className="w-8 h-8 text-[#4361EE]" />
                  </div>
                </div>
                <blockquote className="text-2xl text-center mb-10 text-gray-800 leading-relaxed">
                  {testimonials[currentTestimonial].content}
                </blockquote>
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20 mb-4">
                    <Image
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].author}
                      fill
                      className="rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {testimonials[currentTestimonial].author}
                    </div>
                    <div className="text-[#4361EE] font-medium">
                      {testimonials[currentTestimonial].role}
                    </div>
                    <div className="text-gray-500">
                      {testimonials[currentTestimonial].company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <button
              onClick={previousTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300"
            >
              <ArrowRight className="w-6 h-6 text-gray-700" />
            </button>

            {/* Testimonial Indicators */}
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentTestimonial === index
                      ? "w-8 bg-[#4361EE]"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Trust Banner */}
        <div className="mt-24 text-center">
          <div className="text-sm text-gray-500 font-medium mb-6">
            TRUSTED BY PROFESSIONALS FROM
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {['Fortune 500', 'StartupPro', 'Global Enterprises', 'Business Leaders'].map((company, index) => (
              <div
                key={index}
                className="text-xl font-semibold text-gray-400 hover:text-[#4361EE] transition-colors duration-300"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};