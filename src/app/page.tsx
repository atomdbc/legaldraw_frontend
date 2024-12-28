// src/app/page.tsx
import Image from "next/image";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { TrustSignals } from "@/components/landing/TrustSignals";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { UseCases } from "@/components/landing/UseCases";
import { TechStack } from "@/components/landing/TechStack";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Light sections (default text-black) */}
      <div className="text-black bg-white">
        <Navbar />
        <Hero />
        <Features />
      </div>

      {/* Dark sections (explicitly text-white) */}
      <div className="text-white bg-black">
        <TechStack />
        <CTA />
      </div>

      {/* Light sections again */}
      <div className="text-black bg-white">
        <TrustSignals />
        <HowItWorks />
        <UseCases />
        <Pricing />
        <Footer />
      </div>
    </main>
  );
}