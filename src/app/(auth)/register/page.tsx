"use client";

import { RegisterForm } from '@/components/auth/RegisterForm';
import Image from 'next/image';
import { Star, Clock, Sparkles } from 'lucide-react';

const StoryCard = ({ quote, author, role, image }) => (
  <div className="flex gap-4 p-4 rounded-xl bg-white/5">
    <div className="relative w-12 h-12 flex-shrink-0">
      <Image
        src={image}
        alt={author}
        fill
        className="rounded-full object-cover border-2 border-white/10"
      />
    </div>
    <div>
      <p className="text-gray-300 italic mb-2">"{quote}"</p>
      <h3 className="font-medium text-white">{author}</h3>
      <p className="text-sm text-gray-400">{role}</p>
    </div>
  </div>
);

const ImpactMetric = ({ number, label, icon }) => (
  <div className="flex gap-4 p-4 rounded-xl bg-white/5">
    <div className="w-10 h-10 rounded-full bg-[#4361EE]/10 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div>
      <div className="text-xl font-bold text-white mb-1">{number}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  </div>
);

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Emotional storytelling */}
      <div className="hidden lg:flex flex-col bg-gradient-to-br from-gray-900 to-black text-white p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4361EE0A_1px,transparent_1px),linear-gradient(to_bottom,#4361EE0A_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />

        <div className="relative">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <Image
              src="/logos/sonetz-logo-white.svg"
              alt="Docwelo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-xl font-semibold">Docwelo</span>
          </div>
          
          <div className="flex-grow flex flex-col justify-center max-w-[520px]">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4361EE]/10 rounded-full text-[#4361EE] text-sm font-medium mb-6 w-fit">
              <Sparkles className="w-4 h-4" />
              Join Our Community
            </div>

            {/* Main Message */}
            <h1 className="text-4xl md:text-5xl font-semibold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Transform Your Work Life Today
            </h1>
            <p className="text-gray-400 text-lg mb-12 leading-relaxed">
              Join thousands of professionals who've rediscovered their passion for work 
              by eliminating the stress of document creation.
            </p>

            {/* Impact Metrics */}
            <div className="space-y-4 mb-12">
              <ImpactMetric 
                number="6 Hours Saved Weekly"
                label="More time for what truly matters"
                icon={<Clock className="w-5 h-5 text-[#4361EE]" />}
              />
              <ImpactMetric 
                number="92% Less Stress"
                label="Peace of mind with perfect documents"
                icon={<Sparkles className="w-5 h-5 text-[#4361EE]" />}
              />
              <ImpactMetric 
                number="4.9/5 User Rating"
                label="Loved by professionals worldwide"
                icon={<Star className="w-5 h-5 text-[#4361EE]" />}
              />
            </div>

            {/* Success Stories */}
            <div className="space-y-4 mb-12">
              <StoryCard
                quote="I used to spend weekends catching up on paperwork. Now I have time for what truly matters - my family."
                author="Sarah Mitchell"
                role="Legal Consultant"
                image="/cta/man2.jpg"
              />
              <StoryCard
                quote="The peace of mind knowing my documents are perfect lets me focus on growing my practice."
                author="James Chen"
                role="Business Owner"
                image="/cta/man1.jpg"
              />
            </div>

            {/* Social Proof */}
            <div className="mt-auto pt-8 border-t border-gray-800">
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {["/cta/man1.jpg", "/cta/man2.jpg", "/cta/man3.jpg", "/cta/arab.jpg"].map((src, i) => (
                    <div key={i} className="relative w-10 h-10">
                      <Image
                        src={src}
                        alt={`Community member ${i + 1}`}
                        fill
                        className="rounded-full object-cover border-2 border-white/10"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-[#4361EE] text-[#4361EE]" />
                      ))}
                    </div>
                    <span className="text-sm text-white font-medium">4.9/5</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Join 10,000+ satisfied professionals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Registration form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[440px]">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-3">
              <Image
                src="/logos/sonetz-logo.svg"
                alt="Docwelo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-xl font-semibold">Docwelo</span>
            </div>
          </div>

          <RegisterForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By joining, you agree to our{' '}
              <a href="#" className="text-[#4361EE] hover:text-[#3651D4]">Terms</a>
              {' '}and{' '}
              <a href="#" className="text-[#4361EE] hover:text-[#3651D4]">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}