// src/components/auth/Testimonials.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const testimonials = [
  {
    content: "LegalDraw has completely transformed how we handle document creation. The AI features are incredible.",
    author: "Sarah Chen",
    role: "Senior Partner",
    company: "Chen & Associates",
    image: "/cta/arab.jpg"
  },
  {
    content: "The most intuitive legal document platform I've ever used. It's been a game-changer for our firm.",
    author: "Michael Rodriguez",
    role: "Legal Director",
    company: "Rodriguez Legal",
    image: "/cta/man1.jpg"
  },
  {
    content: "The AI suggestions and automated compliance checks save us countless hours every week.",
    author: "David Thompson",
    role: "Managing Partner",
    company: "Thompson Law LLC",
    image: "/cta/man2.jpg"
  }
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((current) => 
        current === testimonials.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {testimonials.map((testimonial, idx) => (
        <div
          key={idx}
          className={`transition-all duration-500 ${
            idx === currentIndex 
              ? "opacity-100 transform translate-y-0" 
              : "opacity-0 absolute transform -translate-y-4"
          }`}
        >
          <blockquote className="text-lg text-zinc-200 mb-6">
            "{testimonial.content}"
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src={testimonial.image}
                alt={testimonial.author}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium text-white">{testimonial.author}</div>
              <div className="text-sm text-zinc-400">{testimonial.role}</div>
            </div>
          </div>
        </div>
      ))}

      {/* Indicators */}
      <div className="flex gap-2 mt-8">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex 
                ? "bg-white w-4" 
                : "bg-zinc-600 hover:bg-zinc-500"
            }`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
};