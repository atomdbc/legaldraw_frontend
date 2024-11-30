'use client';

import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Product showcase */}
      <div className="hidden lg:flex flex-col bg-zinc-900 text-white p-12">
        <div className="flex items-center gap-2 mb-12">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xl font-semibold">LegalDraw AI</span>
        </div>
        
        <div className="flex-grow flex flex-col justify-center max-w-[480px]">
          <h1 className="text-4xl font-semibold mb-4">Start generating legal documents in minutes</h1>
          <p className="text-zinc-400 text-lg mb-8">
            Join thousands of law firms using AI to streamline their document workflows and reduce costs by up to 60%.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            {[
              { title: '10,000+', subtitle: 'Legal professionals' },
              { title: '500K+', subtitle: 'Documents generated' },
              { title: '99.9%', subtitle: 'Accuracy rate' },
              { title: '60%', subtitle: 'Time saved' },
            ].map((stat, i) => (
              <div key={i} className="border border-zinc-800 rounded-lg p-4">
                <div className="text-2xl font-semibold mb-1">{stat.title}</div>
                <div className="text-sm text-zinc-400">{stat.subtitle}</div>
              </div>
            ))}
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
        </div>
      </div>
    </div>
  );
}