import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { 
  Twitter, 
  Linkedin, 
  Youtube,
  Mail,
  ArrowRight,
  ExternalLink
} from "lucide-react";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
      <div className="container mx-auto px-4 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12 mb-16">
          {/* Brand Section - 2 columns */}
          <div className="md:col-span-2">
            {/* Logo and Company Info */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
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
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Create perfect documents in minutes, not hours. Powered by AI.
                </p>
                <Link 
                  href="https://sonetz.com" 
                  className="inline-flex items-center text-sm text-[#4361EE] font-medium hover:text-[#3651D4] group"
                >
                  A product of Sonetz Inc.
                  <ExternalLink className="ml-1 w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">
                Stay Updated
              </h3>
              <div className="flex gap-3">
                <div className="flex-grow relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4361EE] focus:border-transparent"
                  />
                </div>
                <Button 
                  size="sm"
                  className="bg-[#4361EE] text-white hover:bg-[#3651D4] rounded-lg px-4"
                >
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Get product updates and company news.
              </p>
            </div>
          </div>

          {/* Quick Links - 4 columns */}
          <div className="md:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              {
                title: "Product",
                links: [
                  { label: "Features", href: "#features" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "Templates", href: "#templates" },
                  { label: "API", href: "#api" },
                  { label: "Documentation", href: "#docs" }
                ]
              },
              {
                title: "Company",
                links: [
                  { label: "About", href: "#about" },
                  { label: "Blog", href: "#blog" },
                  { label: "Careers", href: "#careers" },
                  { label: "Contact", href: "#contact" },
                  { label: "Partners", href: "#partners" }
                ]
              },
              {
                title: "Resources",
                links: [
                  { label: "Help Center", href: "#help" },
                  { label: "Community", href: "#community" },
                  { label: "Tutorials", href: "#tutorials" },
                  { label: "Webinars", href: "#webinars" },
                  { label: "Status", href: "#status" }
                ]
              },
              {
                title: "Legal",
                links: [
                  { label: "Privacy", href: "#privacy" },
                  { label: "Terms", href: "#terms" },
                  { label: "Security", href: "#security" },
                  { label: "GDPR", href: "#gdpr" },
                  { label: "Cookies", href: "#cookies" }
                ]
              }
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-900 mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        href={link.href}
                        className="text-sm text-gray-600 hover:text-[#4361EE] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Bottom Left */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-4">
                {[
                  { icon: Twitter, link: "https://x.com/sonetz_ai" },
                  { icon: Linkedin, link: "https://www.linkedin.com/company/sonetz" },
                  { icon: Youtube, link: "https://www.youtube.com/@sonetzai" }
                ].map((social, index) => (
                  <Link 
                    key={index} 
                    href={social.link}
                    className="text-gray-400 hover:text-[#4361EE] transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span className="text-sm text-gray-600">
                © {year} Sonetz Inc. All rights reserved.
              </span>
            </div>

            {/* Bottom Right */}
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                href="https://sonetz.com" 
                className="text-sm text-gray-600 hover:text-[#4361EE] transition-colors"
              >
                About Sonetz
              </Link>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-600">
                Leading Software Solutions
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};