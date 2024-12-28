"use client";

import { RegisterForm } from '@/components/auth/RegisterForm';
import Image from 'next/image';

const stats = [
  { title: '10,000+', subtitle: 'Legal professionals', color: 'bg-blue-500/10 border-blue-500/20' },
  { title: '500K+', subtitle: 'Documents generated', color: 'bg-green-500/10 border-green-500/20' },
  { title: '99.9%', subtitle: 'Accuracy rate', color: 'bg-purple-500/10 border-purple-500/20' },
  { title: '60%', subtitle: 'Time saved', color: 'bg-orange-500/10 border-orange-500/20' }
];

const features = [
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "AI-Powered",
    description: "Smart document generation with context understanding"
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Enterprise Security",
    description: "Bank-grade encryption and compliance"
  }
];

export default function RegisterPage() {
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
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xl font-semibold">LegalDraw AI</span>
          </div>
          
          <div className="flex-grow flex flex-col justify-center max-w-[480px]">
            <h1 className="text-4xl font-semibold mb-4">
              Start generating legal documents in minutes
            </h1>
            <p className="text-zinc-400 text-lg mb-8">
              Join thousands of law firms using AI to streamline their document workflows 
              and reduce costs by up to 60%.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-white/5">
                  <div className="p-2 rounded-md bg-white/10">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{feature.title}</h3>
                    <p className="text-sm text-zinc-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div 
                  key={i} 
                  className={`border rounded-lg p-4 transition-colors ${stat.color}`}
                >
                  <div className="text-2xl font-semibold mb-1">{stat.title}</div>
                  <div className="text-sm text-zinc-400">{stat.subtitle}</div>
                </div>
              ))}
            </div>

            {/* Current Users */}
            <div className="mt-12 pt-8 border-t border-zinc-800">
              <div className="flex items-center gap-4">
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
                        alt={`User ${i + 1}`}
                        fill
                        className="rounded-full object-cover border-2 border-zinc-900"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="text-zinc-300">Trusted worldwide</div>
                  <div className="text-zinc-500">30+ countries, 500+ law firms</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Registration form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-[440px] space-y-6">
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xl font-semibold">LegalDraw AI</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Create your account</h2>
            <p className="text-zinc-500">Get started with LegalDraw AI today</p>
          </div>

          <RegisterForm />

          <div className="pt-6 mt-6 border-t border-zinc-200">
            <div className="flex items-start gap-3 text-sm text-zinc-500">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>
                By creating an account, you agree to our{" "}
                <a href="#" className="text-black hover:underline">Terms of Service</a> and{" "}
                <a href="#" className="text-black hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}