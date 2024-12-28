// src/components/landing/Navbar.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
              <path 
                d="M12 2L2 7L12 12L22 7L12 2Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M2 17L12 22L22 17" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M2 12L12 17L22 12" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xl font-semibold">LegalDraw</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-gray-600 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Pricing
            </a>
            <Button variant="outline" className="border-black text-black hover:bg-gray-50">
              
              <a href="/login"> Sign In</a>
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800">
              
              <a href="/register"> Get Started</a>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  <a href="#features" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                    Features
                  </a>
                  <a href="#how-it-works" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                    How It Works
                  </a>
                  <a href="#pricing" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                    Pricing
                  </a>
                  <div className="flex flex-col space-y-2 pt-4">
                    <Button variant="outline" className="border-black text-black w-full">
                    <a href="/login"> Sign In</a>
                    </Button>
                    <Button className="bg-black text-white w-full">
                    <a href="/register"> Get Started</a>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};