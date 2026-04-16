'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Advertisement {
  id: number;
  title: string;
  subtitle: string;
  bgGradient: string;
  icon: string;
}

const advertisements: Advertisement[] = [
  {
    id: 1,
    title: 'Find Your Perfect Pet Match',
    subtitle: 'Connect with pets that match your lifestyle and preferences',
    bgGradient: 'from-purple-500 to-pink-500',
    icon: '🐾',
  },
  {
    id: 2,
    title: 'Discover Adorable Pets for Adoption',
    subtitle: 'Browse hundreds of pets waiting for their forever homes',
    bgGradient: 'from-blue-500 to-cyan-500',
    icon: '🐶',
  },
  {
    id: 3,
    title: 'Join Our Pet Lover Community',
    subtitle: 'Connect with other pet enthusiasts and share experiences',
    bgGradient: 'from-green-500 to-emerald-500',
    icon: '🐱',
  },
  {
    id: 4,
    title: 'List Your Pet with Confidence',
    subtitle: 'Reach thousands of potential owners in your area',
    bgGradient: 'from-orange-500 to-red-500',
    icon: '🦋',
  },
  {
    id: 5,
    title: 'Chat Securely with Pet Owners',
    subtitle: 'Direct messaging to discuss pets and arrange meetings',
    bgGradient: 'from-pink-500 to-rose-500',
    icon: '💬',
  },
];

export function AdCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % advertisements.length);
    }, 5000); // Change ad every 5 seconds

    return () => clearInterval(interval);
  }, [autoPlay]);

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + advertisements.length) % advertisements.length);
    setAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % advertisements.length);
    setAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAutoPlay(false);
  };

  const currentAd = advertisements[currentIndex];

  return (
    <div
      className={`relative w-full h-64 sm:h-80 bg-gradient-to-r ${currentAd.bgGradient} rounded-xl overflow-hidden shadow-lg transition-all duration-500`}
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4">
        <div className="text-5xl sm:text-6xl mb-4">{currentAd.icon}</div>
        <h2 className="text-2xl sm:text-4xl font-bold text-center mb-2">{currentAd.title}</h2>
        <p className="text-sm sm:text-lg text-white/90 text-center max-w-2xl">{currentAd.subtitle}</p>
      </div>

      {/* Navigation Buttons */}
      <Button
        onClick={goToPrevious}
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white rounded-full"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        onClick={goToNext}
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white rounded-full"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {advertisements.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
