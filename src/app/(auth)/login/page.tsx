// src/app/(auth)/login/page.tsx
"use client";

import Image from "next/image";
import { LoginForm } from '@/components/auth/LoginForm';
import { Testimonials } from '@/components/auth/Testimonials';

const TrustedUsers = () => (
  <div className="flex -space-x-2">
    {[
      "/cta/man1.jpg",
      "/cta/man2.jpg",
      "/cta/man3.jpg",
      "/cta/arab.jpg"
    ].map((src, i) => (
      <div key={i} className="relative w-8 h-8">
        <Image
          src={src}
          alt={`Trusted user ${i + 1}`}
          fill
          className="rounded-full object-cover border-2 border-zinc-900"
        />
      </div>
    ))}
  </div>
);

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Product showcase */}
      <div className="hidden lg:flex flex-col bg-zinc-900 text-white p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/90 to-zinc-900" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-12">
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
            <span className="text-xl font-semibold">LegalDraw AI</span>
          </div>
          
          <div className="flex-grow flex flex-col justify-center max-w-[480px]">
            <h1 className="text-4xl font-semibold mb-4">
              Transform your legal workflow
            </h1>
            <p className="text-zinc-400 text-lg mb-8">
              Join thousands of legal professionals using AI to draft, review, 
              and manage legal documents with confidence.
            </p>
            
            <div className="space-y-8">
              <Testimonials />
            </div>
            
            <div className="mt-auto pt-12 border-t border-zinc-800">
              <div className="flex items-center gap-6">
                <TrustedUsers />
                <p className="text-sm text-zinc-400">
                  Trusted by 10,000+ legal professionals <br/>
                  across 30+ countries
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-[440px] space-y-6">
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-2 mb-8">
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
              <span className="text-xl font-semibold">LegalDraw AI</span>
            </div>
          </div>

          <div className="space-y-2">
  <h2 className="text-2xl font-semibold">Log in to LegalDraw AI</h2>
  <p className="text-zinc-500">Sign in to access your legal workspace and continue drafting documents</p>
</div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}