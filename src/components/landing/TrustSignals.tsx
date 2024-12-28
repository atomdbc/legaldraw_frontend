// src/components/landing/TrustSignals.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Star, 
  Building2, 
  Users,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Quote
} from "lucide-react";

const statistics = [
  {
    icon: Users,
    value: "10,000+",
    label: "Legal Professionals"
  },
  {
    icon: FileCheck,
    value: "1M+",
    label: "Documents Generated"
  },
  {
    icon: Building2,
    value: "500+",
    label: "Law Firms"
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Customer Rating"
  }
];

const testimonials = [
  {
    content: "LegalDraw has transformed how we handle document creation. The AI-powered features save us hours of work every day.",
    author: "Sarah Chen",
    role: "Senior Partner",
    company: "Chen & Associates",
    image: "/cta/arab.jpg"
  },
  {
    content: "The ease of use and accuracy of the documents generated is impressive. It's become an indispensable tool for our firm.",
    author: "Michael Rodriguez",
    role: "Legal Director",
    company: "Rodriguez Legal Group",
    image: "/cta/man1.jpg"
  },
  {
    content: "Outstanding platform that streamlines our document workflow. The AI suggestions are incredibly accurate and helpful.",
    author: "Emily Thompson",
    role: "Managing Partner",
    company: "Thompson Law LLC",
    image: "/cta/man2.jpg"
  }
];

const trustLogos = [
  {
    name: "Thompson & Partners",
    logo: (
      <svg className="w-full h-full" viewBox="0 0 160 48" fill="currentColor">
        <text x="50%" y="55%" textAnchor="middle" fontFamily="system-ui" fontWeight="600" fontSize="18">T&amp;P</text>
        <text x="50%" y="85%" textAnchor="middle" fontFamily="system-ui" fontSize="10">LEGAL</text>
      </svg>
    )
  },
  {
    name: "Legal Core",
    logo: (
      <svg className="w-full h-full" viewBox="0 0 160 48" fill="currentColor">
        <path d="M20,24 L40,24 M30,14 L30,34" stroke="currentColor" strokeWidth="2"/>
        <text x="60%" y="65%" textAnchor="middle" fontFamily="system-ui" fontWeight="600" fontSize="16">LegalCore</text>
      </svg>
    )
  },
  {
    name: "Global Law Group",
    logo: (
      <svg className="w-full h-full" viewBox="0 0 160 48" fill="currentColor">
        <circle cx="30" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
        <text x="65%" y="65%" textAnchor="middle" fontFamily="system-ui" fontWeight="600" fontSize="20">GLG</text>
      </svg>
    )
  },
  {
    name: "TechLaw Firms",
    logo: (
      <svg className="w-full h-full" viewBox="0 0 160 48" fill="currentColor">
        <path d="M20,34 L40,14 M20,14 L40,34" stroke="currentColor" strokeWidth="2"/>
        <text x="65%" y="65%" textAnchor="middle" fontFamily="system-ui" fontWeight="600" fontSize="16">TechLaw</text>
      </svg>
    )
  },
  {
    name: "Nexus Legal",
    logo: (
      <svg className="w-full h-full" viewBox="0 0 160 48" fill="currentColor">
        <path d="M20,14 L30,34 L40,14" stroke="currentColor" strokeWidth="2" fill="none"/>
        <text x="65%" y="65%" textAnchor="middle" fontFamily="system-ui" fontWeight="600" fontSize="16">Nexus</text>
      </svg>
    )
  },
  {
    name: "Future Law",
    logo: (
      <svg className="w-full h-full" viewBox="0 0 160 48" fill="currentColor">
        <rect x="20" y="14" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"/>
        <text x="65%" y="65%" textAnchor="middle" fontFamily="system-ui" fontWeight="600" fontSize="16">Future Law</text>
      </svg>
    )
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
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {statistics.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Legal Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers say about their experience with LegalDraw
            </p>
          </div>

          <div className="relative">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="flex justify-center mb-6">
                  <Quote className="w-12 h-12 text-gray-200" />
                </div>
                <blockquote className="text-xl text-center mb-8">
                  {testimonials[currentTestimonial].content}
                </blockquote>
                <div className="flex flex-col items-center">
                  <div className="relative w-16 h-16 mb-4">
                    <Image
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].author}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">
                      {testimonials[currentTestimonial].author}
                    </div>
                    <div className="text-gray-600">
                      {testimonials[currentTestimonial].role}
                    </div>
                    <div className="text-gray-600">
                      {testimonials[currentTestimonial].company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <button
              onClick={previousTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
            >
              <ArrowRight className="w-6 h-6" />
            </button>

            {/* Testimonial Indicators */}
            <div className="flex justify-center mt-6 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentTestimonial === index
                      ? "bg-black w-6"
                      : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Trust Logos */}
        <div className="mt-24">
          <div className="text-center text-gray-600 mb-8">
            Trusted by leading organizations worldwide
          </div>
          <div className="flex flex-wrap justify-center gap-12">
            {trustLogos.map((logo, index) => (
              <div
                key={index}
                className="w-32 h-12 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
              >
                {logo.logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};