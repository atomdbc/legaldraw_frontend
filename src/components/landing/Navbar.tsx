"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image
              src="/logos/sonetz-logo.svg"
              alt="Docwelo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-semibold text-xl text-gray-900">
              Docwelo
            </span>
            <div className="ml-6 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-gray-600">AI-Powered Document Platform</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              How It Works
            </a>
            <a 
              href="#use-cases" 
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              Use Cases
            </a>
            <a 
              href="#pricing" 
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              Pricing
            </a>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <a href="/login">Sign In</a>
              </Button>
              <Button 
                className="bg-[#4361EE] text-white hover:bg-[#3651D4] transition-colors duration-200 font-medium px-6"
              >
                <a href="/register">Get Started Free</a>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gray-50">
                  <Menu className="h-6 w-6 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6">
                <div className="flex items-center space-x-2 mb-8">
                  <Image
                    src="/logos/sonetz-logo.svg"
                    alt="Docwelo"
                    width={24}
                    height={24}
                  />
                  <span className="font-semibold text-lg text-gray-900">
                    Docwelo
                  </span>
                </div>
                <nav className="flex flex-col space-y-6">
                  <a 
                    href="#features" 
                    className="text-base font-medium text-gray-800 hover:text-[#4361EE] transition-colors duration-200" 
                    onClick={() => setIsOpen(false)}
                  >
                    Features
                  </a>
                  <a 
                    href="#how-it-works" 
                    className="text-base font-medium text-gray-800 hover:text-[#4361EE] transition-colors duration-200" 
                    onClick={() => setIsOpen(false)}
                  >
                    How It Works
                  </a>
                  <a 
                    href="#use-cases" 
                    className="text-base font-medium text-gray-800 hover:text-[#4361EE] transition-colors duration-200" 
                    onClick={() => setIsOpen(false)}
                  >
                    Use Cases
                  </a>
                  <a 
                    href="#pricing" 
                    className="text-base font-medium text-gray-800 hover:text-[#4361EE] transition-colors duration-200" 
                    onClick={() => setIsOpen(false)}
                  >
                    Pricing
                  </a>
                  <div className="flex flex-col space-y-4 pt-6">
                    <Button 
                      variant="outline" 
                      className="w-full text-gray-800 border-gray-200 hover:bg-gray-50 font-medium"
                    >
                      <a href="/login">Sign In</a>
                    </Button>
                    <Button 
                      className="w-full bg-[#4361EE] text-white hover:bg-[#3651D4] font-medium"
                    >
                      <a href="/register">Get Started Free</a>
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