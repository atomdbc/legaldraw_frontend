import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Shield, Clock } from "lucide-react";

const testimonialImages = [
  { src: '/cta/man1.jpg', alt: 'Professional 1' },
  { src: '/cta/man2.jpg', alt: 'Professional 2' },
  { src: '/cta/man3.jpg', alt: 'Professional 3' },
  { src: '/cta/arab.jpg', alt: 'Professional 4' }
];

export const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4361EE0A_1px,transparent_1px),linear-gradient(to_bottom,#4361EE0A_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <div className="container mx-auto px-4 relative">
        {/* Main CTA */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4361EE]/10 rounded-full text-[#4361EE] text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Create documents in minutes
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Perfect Documents,
            <br />
            Every Time
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who create flawless documents 
            in minutes instead of hours.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button 
                size="lg" 
                className="bg-[#4361EE] text-white hover:bg-[#3651D4] h-14 px-8 rounded-full shadow-lg shadow-blue-500/20"
              >
                Start Creating Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 text-black hover:bg-white/5 h-14 px-8 rounded-full"
              >
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-[#4361EE]/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-7 h-7 text-[#4361EE]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Smart Creation</h3>
              <p className="text-gray-400">
                Perfect documents written in your style
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-[#4361EE]/10 flex items-center justify-center mx-auto mb-6">
                <Clock className="w-7 h-7 text-[#4361EE]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Save Time</h3>
              <p className="text-gray-400">
                From hours to just a few minutes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-[#4361EE]/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-7 h-7 text-[#4361EE]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Always Protected</h3>
              <p className="text-gray-400">
                Bank-level security for your work
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Testimonial */}
        <div className="max-w-3xl mx-auto mb-20">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <div className="w-20 h-20 relative mx-auto mb-6">
                  <Image
                    src="/cta/arab.jpg"
                    alt="Sarah Chen"
                    fill
                    className="rounded-full object-cover border-4 border-white/10"
                  />
                </div>
                <div className="flex justify-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-6 h-6 text-[#4361EE]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-2xl mb-6 text-white leading-relaxed">
                  "What used to take me hours now takes minutes. 
                  The documents are perfect every time. Highly recommended."
                </blockquote>
                <div className="font-semibold text-white text-lg mb-1">Sarah Chen</div>
                <div className="text-gray-400">Business Owner, Tech Solutions Inc</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Final Push */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/5 rounded-full mb-8">
            <div className="flex -space-x-3">
              {testimonialImages.map((image, i) => (
                <div key={i} className="relative w-8 h-8">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="rounded-full border-2 border-black object-cover"
                  />
                </div>
              ))}
            </div>
            <span className="text-gray-300 font-medium">
              Join 10,000+ professionals
            </span>
          </div>
          
          <p className="text-gray-400 mb-8">
            Start creating perfect documents today. No credit card needed.
          </p>
          
          <Link href="/register">
            <Button 
              size="lg" 
              className="bg-[#4361EE] text-white hover:bg-[#3651D4] h-14 px-8 rounded-full shadow-lg shadow-blue-500/20"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};