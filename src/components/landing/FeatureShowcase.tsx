// src/components/landing/FeatureShowcase.tsx
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ArrowRight, 
  Bot, 
  Users, 
  History, 
  FileText 
} from "lucide-react";

const showcaseItems = [
  {
    id: 1,
    title: "AI Suggestions",
    icon: Bot,
    content: (
      <div className="w-full h-full bg-white rounded-lg p-6 shadow-inner">
        <div className="flex items-start gap-4 mb-4">
          <Bot className="w-6 h-6 text-blue-500" />
          <div className="flex-1">
            <div className="h-4 w-3/4 bg-blue-100 rounded mb-2 animate-pulse" />
            <div className="h-4 w-1/2 bg-blue-100 rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-100 rounded p-3">
            <div className="h-full w-3/4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-12 bg-blue-50 rounded border-2 border-blue-200 p-3">
            <div className="h-full w-5/6 bg-blue-100 rounded animate-pulse" />
          </div>
          <div className="h-12 bg-gray-100 rounded p-3">
            <div className="h-full w-2/3 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Real-time Collaboration",
    icon: Users,
    content: (
      <div className="w-full h-full bg-white rounded-lg p-6 shadow-inner">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex -space-x-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${
                ['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400'][i]
              }`}>
                <span className="text-white text-xs font-semibold">
                  {['JD', 'SK', 'AL', 'MR'][i]}
                </span>
              </div>
            ))}
          </div>
          <span className="text-sm text-gray-600">4 people editing</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center">
              <span className="text-white text-xs">JD</span>
            </div>
            <div className="flex-1">
              <div className="h-4 bg-blue-100 rounded w-full animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
              <span className="text-white text-xs">SK</span>
            </div>
            <div className="flex-1">
              <div className="h-4 bg-green-100 rounded w-3/4 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Version Control",
    icon: History,
    content: (
      <div className="w-full h-full bg-white rounded-lg p-6 shadow-inner">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-1 h-full bg-gray-200 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1">
                <div className="h-4 w-1/3 bg-gray-200 rounded mb-1 animate-pulse" />
                <div className="h-3 w-1/4 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="h-6 w-16 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Smart Templates",
    icon: FileText,
    content: (
      <div className="w-full h-full bg-white rounded-lg p-6 shadow-inner">
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
              <FileText className="w-6 h-6 mb-2 text-gray-400" />
              <div className="h-3 w-3/4 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-2 w-1/2 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }
];

export const FeatureShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => 
        current === showcaseItems.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setActiveIndex((current) => 
      current === showcaseItems.length - 1 ? 0 : current + 1
    );
  };

  const prevSlide = () => {
    setActiveIndex((current) => 
      current === 0 ? showcaseItems.length - 1 : current - 1
    );
  };

  const CurrentIcon = showcaseItems[activeIndex].icon;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-black/5"
          onClick={prevSlide}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-black/5"
          onClick={nextSlide}
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="p-6 h-[400px]">
        <div className="flex items-center gap-3 mb-6">
          <CurrentIcon className="w-6 h-6" />
          <h4 className="text-lg font-semibold">
            {showcaseItems[activeIndex].title}
          </h4>
        </div>
        {showcaseItems[activeIndex].content}
      </div>

      <div className="flex justify-center gap-2 pb-4">
        {showcaseItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex 
                ? "w-6 bg-black" 
                : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </Card>
  );
};