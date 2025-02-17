"use client";

import Image from "next/image";
import { LoginForm } from '@/components/auth/LoginForm';
import { Sparkles, Star } from "lucide-react";

const TrustedUsers = () => (
  <div className="flex -space-x-3">
    {[
      "/cta/man1.jpg",
      "/cta/man2.jpg",
      "/cta/man3.jpg",
      "/cta/arab.jpg"
    ].map((src, i) => (
      <div key={i} className="relative w-10 h-10">
        <Image
          src={src}
          alt={`Trusted user ${i + 1}`}
          fill
          className="rounded-full object-cover border-2 border-white/10"
        />
      </div>
    ))}
  </div>
);

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="flex gap-4 p-4 rounded-xl bg-white/5">
    <div className="w-10 h-10 rounded-full bg-[#4361EE]/10 flex items-center justify-center flex-shrink-0">
      <Star className="w-5 h-5 text-[#4361EE]" />
    </div>
    <div>
      <h3 className="font-medium text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </div>
);

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Product showcase */}
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
              AI-Powered Document Platform
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Create Perfect Documents
            </h1>
            <p className="text-gray-400 text-lg mb-12 leading-relaxed">
              Join thousands of professionals who create flawless 
              documents in minutes, not hours.
            </p>
            
            <div className="space-y-4 mb-12">
              <FeatureCard 
                title="Smart Creation" 
                description="AI understands your needs and creates perfect documents"
              />
              <FeatureCard 
                title="Time Saving" 
                description="What used to take hours now takes just minutes"
              />
              <FeatureCard 
                title="Always Protected" 
                description="Bank-level security for all your documents"
              />
            </div>
            
            <div className="mt-auto pt-8 border-t border-gray-800">
              <div className="flex items-center gap-6">
                <TrustedUsers />
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
                    Trusted by 10,000+ professionals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
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

          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By continuing, you agree to our{' '}
              <a href="https://j4opv4xvh6.execute-api.us-east-1.amazonaws.com/dev/terms" className="text-[#4361EE] hover:text-[#3651D4]">Terms</a>
              {' '}and{' '}
              <a href="https://j4opv4xvh6.execute-api.us-east-1.amazonaws.com/dev/policy" className="text-[#4361EE] hover:text-[#3651D4]">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}