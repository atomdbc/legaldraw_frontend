"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const styles = `
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-150px * 3));
  }
}

.infinite-scroll-wrapper {
  position: relative;
  width: 100%;
  height: 40px;
  overflow: hidden;
  background: white;
  -webkit-mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
  mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
}

.infinite-scroll {
  display: flex;
  gap: 0.5rem;
  width: calc(150px * 6);
  animation: scroll 15s linear infinite;
}

.infinite-scroll:hover {
  animation-play-state: paused;
}

.logo-slide {
  width: 150px;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.aws-logo {
  width: 70px !important;
  height: auto !important;
}

@media (max-width: 640px) {
  .infinite-scroll-wrapper {
    height: 30px;
  }
  .logo-slide {
    width: 120px;
  }
  .aws-logo {
    width: 55px !important;
  }
}
`;

const LogoScroll = () => {
  const logos = [
    {
      name: "AWS",
      src: "/logos/aws.png",
      alt: "AWS Logo",
      className: "aws-logo"
    },
    {
      name: "NVIDIA",
      src: "/logos/nvidia.png",
      alt: "NVIDIA Logo"
    },
    {
      name: "Microsoft",
      src: "/logos/mirosoft_startup.png",
      alt: "Microsoft Logo"
    }
  ];

  const doubledLogos = [...logos, ...logos];

  return (
    <div className="infinite-scroll-wrapper">
      <div className="infinite-scroll">
        {doubledLogos.map((logo, index) => (
          <div key={`${logo.name}-${index}`} className="logo-slide">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={100}
              height={35}
              className={`object-contain transition-all duration-300 filter grayscale hover:grayscale-0 opacity-60 hover:opacity-100 ${logo.className || ''}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800A_1px,transparent_1px),linear-gradient(to_bottom,#8080800A_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/90 to-white" />
      <div className="absolute top-20 -left-20 w-96 h-96 bg-[#4361EE]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-40 -right-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000" />
    </div>
  );
};

export const Hero = () => {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <style jsx global>
        {styles}
      </style>
      
      <HeroBackground />
      
      <div className="container mx-auto px-4 py-20 lg:py-24">
        <div className="relative">
          {/* AI Badge */}
          <div className="flex justify-center mb-8">
            <Badge variant="outline" className="px-6 py-2 border-[#4361EE]/20 bg-white/80 backdrop-blur-sm gap-2 text-[#4361EE]">
              <Sparkles className="w-4 h-4" />
              Say Goodbye to Document Stress
            </Badge>
          </div>

          {/* Main Content */}
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8 text-gray-900">
              Stop Wasting Time on Documents
              <span className="block mt-2 bg-gradient-to-r from-[#4361EE] to-blue-500 bg-clip-text text-transparent">
                Focus on What Matters
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
              No more late nights fighting with templates or missing deadlines. 
              Create perfect documents in minutes, every time. Let AI handle the paperwork 
              while you build your dreams.
            </p>

            {/* Trust Message */}
            <div className="mb-6 sm:mb-8 flex justify-center">
              <div className="flex items-center gap-3 px-4 sm:px-5 py-2 bg-green-50 rounded-full">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="w-6 h-6 rounded-full bg-green-100 border-2 border-white flex items-center justify-center">
                      <span className="text-green-700 text-xs">✓</span>
                    </div>
                  ))}
                </div>
                <span className="text-sm text-green-700 font-medium">
                  Join 10,000+ professionals who saved countless hours
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-12 sm:mb-16">
              <Button 
                size="lg" 
                className="bg-[#4361EE] text-white hover:bg-[#3651D4] h-12 sm:h-14 px-6 sm:px-8 rounded-full shadow-lg shadow-blue-500/20"
                onClick={() => router.push('/register')}
              >
                Create Your First Document Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50 h-12 sm:h-14 px-6 sm:px-8 rounded-full"
              >
                <Play className="mr-2 w-4 h-4" /> See How It Works
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col items-center space-y-6">
              <div className="text-sm text-gray-500 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="font-medium">4.9/5 from happy users</span>
              </div>

              {/* Logo Scroll */}
              <LogoScroll />
            </div>
          </div>

          {/* Interactive Preview */}
          <div className="mt-16 sm:mt-20 w-full max-w-7xl mx-auto">
            <div 
              className="rounded-2xl border border-gray-200 shadow-2xl bg-white overflow-hidden cursor-pointer group relative"
              onClick={() => router.push('/register')}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#4361EE] text-white px-6 py-3 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Start Creating — It's Free
                </span>
              </div>
              <ScrollArea className="h-[500px]">
                <Image
                  src="/mockup.png"
                  alt="Docwelo - Create Perfect Documents in Minutes"
                  width={1920}
                  height={1080}
                  className="w-full h-auto object-cover"
                  priority
                />
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};