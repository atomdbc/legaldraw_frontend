// src/components/landing/Footer.tsx
import { Button } from "@/components/ui/button";
import { 
  Twitter, 
  Linkedin, 
  Github,
  Mail,
  Sparkles
} from "lucide-react";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500" />
                <div className="absolute inset-0.5 rounded-[6px] bg-white dark:bg-gray-950" />
                <Sparkles className="absolute inset-1 h-6 w-6 text-blue-500" />
              </div>
              <span className="font-semibold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LegalDraw
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Transforming legal document creation with AI
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Github className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#features" className="hover:text-black">Features</a></li>
              <li><a href="#pricing" className="hover:text-black">Pricing</a></li>
              <li><a href="#" className="hover:text-black">Templates</a></li>
              <li><a href="#" className="hover:text-black">API</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-black">About</a></li>
              <li><a href="#" className="hover:text-black">Blog</a></li>
              <li><a href="#" className="hover:text-black">Careers</a></li>
              <li><a href="#" className="hover:text-black">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-black">Terms of Service</a></li>
              <li><a href="#" className="hover:text-black">Security</a></li>
              <li><a href="#" className="hover:text-black">GDPR</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-b py-8 my-8">
          <div className="max-w-md">
            <h3 className="font-semibold mb-2">Stay up to date</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get the latest updates on product features and legal tech insights.
            </p>
            <div className="flex gap-2">
              <div className="flex-grow relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <Button className="bg-black text-white hover:bg-black/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <div>
            © {year} LegalDraw. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-black">Status</a>
            <a href="#" className="hover:text-black">Sitemap</a>
            <a href="#" className="hover:text-black">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};