// src/components/landing/Hero.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800A_1px,transparent_1px),linear-gradient(to_bottom,#8080800A_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/60 to-white" />
      <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-40 -right-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute top-60 left-32 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
    </div>
  );
};

export const Hero = () => {
  const router = useRouter();

  return (
    <div className="relative pt-20 lg:pt-24 overflow-hidden">
      <HeroBackground />
      
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* AI Badge */}
          <div className="flex justify-center mb-6">
            <Badge variant="outline" className="px-4 py-1 border-black/20 gap-2 text-black">
              <Sparkles className="w-4 h-4" />
              AI-Powered Legal Document Platform
            </Badge>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-black">
              Create Legal Documents<br />
              <span className="text-gray-500">in Minutes, Not Hours</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your legal workflow with AI-powered document generation. 
              From contracts to agreements, all in one unified platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-black text-white hover:bg-black/90 h-12 px-8"
                onClick={() => router.push('/login')}
              >
                <a href="/login"> Start Creating </a>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-black text-black hover:bg-gray-50 h-12 px-8"
              >
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17" />
                  <path d="M2 12L12 17L22 12" />
                </svg>
                Trusted by 10,000+ legal professionals worldwide
              </div>

              {/* Trust Logos */}
              <div className="flex flex-wrap justify-center gap-8 py-8">
                {[
                  { name: "Thompson & Partners", src: "/logos/thompson.svg" },
                  { name: "Legal Core", src: "/logos/legalcore.svg" },
                  { name: "Global Law Group", src: "/logos/glg.svg" },
                  { name: "Tech Law Firms", src: "/logos/techlawfirms.svg" }
                ].map((logo, index) => (
                  <div 
                    key={index} 
                    className="relative h-8 w-24 grayscale opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <Image
                      src={logo.src}
                      alt={`${logo.name} Logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Preview Frame */}
          <div 
            className="mt-16 rounded-xl border shadow-2xl bg-white overflow-hidden cursor-pointer group"
            onClick={() => router.push('/login')}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-4 py-2 rounded-full">
                  Click to try it out
                </span>
              </div>
              <ScrollArea className="h-[400px]">
                <Image
                  src="/mockup.png"
                  alt="LegalDraw Dashboard Interface"
                  width={1200}
                  height={675}
                  className="w-full h-auto object-cover rounded-lg"
                  priority
                />
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};