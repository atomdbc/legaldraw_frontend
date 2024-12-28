import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Shield, Clock } from "lucide-react";

const testimonialImages = [
  { src: '/cta/man1.jpg', alt: 'Legal Professional 1' },
  { src: '/cta/man2.jpg', alt: 'Legal Professional 2' },
  { src: '/cta/man3.jpg', alt: 'Legal Professional 3' },
  { src: '/cta/arab.jpg', alt: 'Legal Professional 4' },
  { src: '/cta/man1.jpg', alt: 'Legal Professional 5' }, // Reusing first image for 5th slot
];

export const CTA = () => {
  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-4">
        {/* Main CTA */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Transform Your
            <br />
            Legal Document Workflow?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of legal professionals who are saving time and delivering better results with LegalDraw.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 h-12 px-8"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 h-12 px-8 bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 border-white/10">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">AI-Powered</h3>
              <p className="text-gray-400">
                Smart document generation that understands legal context
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/10">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Time-Saving</h3>
              <p className="text-gray-400">
                Create documents in minutes, not hours
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/10">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Secure</h3>
              <p className="text-gray-400">
                Enterprise-grade security for your documents
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Testimonial */}
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="flex justify-center mb-6">
                <Image
                  src="/cta/arab.jpg"
                  alt="Sarah Chen"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              </div>
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-6 h-6 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-xl italic mb-4 text-white">
                "LegalDraw has revolutionized how we handle legal documents. It's not just a tool, it's a game-changer for our entire practice."
              </blockquote>
              <div className="font-semibold text-white">Sarah Chen</div>
              <div className="text-gray-400">Senior Partner, Chen & Associates</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Final Push */}
      <div className="text-center mt-16">
        <p className="text-gray-400 mb-8">
          Start your 14-day free trial. No credit card required.
        </p>
        <div className="flex justify-center gap-4 items-center">
          <div className="flex -space-x-2">
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
          <span className="text-gray-400">
            Join 10,000+ legal professionals
          </span>
        </div>
      </div>
      </div>
    </section>
  );
};