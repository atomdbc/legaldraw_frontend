"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ArrowLeft, ArrowRight, Quote } from "lucide-react";

const testimonials = [
  {
    content: "Docwelo has completely transformed how we handle document creation. The AI features are incredible.",
    author: "Sarah Chen",
    role: "Senior Partner",
    company: "Chen & Associates",
    image: "/cta/arab.jpg",
    rating: 5
  },
  {
    content: "The most intuitive legal document platform I've ever used. It's been a game-changer for our firm.",
    author: "Michael Rodriguez",
    role: "Legal Director",
    company: "Rodriguez Legal",
    image: "/cta/man1.jpg",
    rating: 5
  },
  {
    content: "The AI suggestions and automated compliance checks save us countless hours every week.",
    author: "David Thompson",
    role: "Managing Partner",
    company: "Thompson Law LLC",
    image: "/cta/man2.jpg",
    rating: 5
  }
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToNext = () => {
    setCurrentIndex((current) =>
      current === testimonials.length - 1 ? 0 : current + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((current) =>
      current === 0 ? testimonials.length - 1 : current - 1
    );
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  return (
    <div className="relative">
      {/* Quote icon */}
      <div className="absolute -top-6 -left-2 text-[#4361EE]/10">
        <Quote size={80} />
      </div>

      {/* Testimonial Content */}
      <div className="relative min-h-[280px]">
        {testimonials.map((testimonial, idx) => (
          <div
            key={idx}
            className={`absolute top-0 left-0 w-full transition-all duration-500 ease-in-out ${
              idx === currentIndex
                ? "opacity-100 translate-x-0"
                : idx < currentIndex
                ? "opacity-0 -translate-x-8"
                : "opacity-0 translate-x-8"
            }`}
            style={{ display: idx === currentIndex ? 'block' : 'none' }}
          >
            <div className="relative z-10">
              <blockquote className="text-lg text-gray-300 mb-8 leading-relaxed">
                {testimonial.content}
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    fill
                    className="rounded-full object-cover border-2 border-[#4361EE]/20"
                  />
                </div>
                <div>
                  <div className="font-medium text-white mb-1">{testimonial.author}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                  <div className="text-sm text-gray-400">{testimonial.company}</div>
                </div>
                <div className="ml-auto">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className="fill-[#4361EE] text-[#4361EE]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex
                  ? "w-6 bg-[#4361EE]"
                  : "w-2 bg-gray-600 hover:bg-gray-500"
              }`}
              onClick={() => {
                setCurrentIndex(idx);
                setIsAutoPlaying(false);
              }}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              goToPrevious();
              setIsAutoPlaying(false);
            }}
            className="p-2 rounded-full hover:bg-white/5 transition-colors"
            aria-label="Previous testimonial"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <button
            onClick={() => {
              goToNext();
              setIsAutoPlaying(false);
            }}
            className="p-2 rounded-full hover:bg-white/5 transition-colors"
            aria-label="Next testimonial"
          >
            <ArrowRight size={20} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};