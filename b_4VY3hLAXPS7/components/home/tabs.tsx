'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Store } from 'lucide-react';

interface TabsProps {
  activeTab: 'match' | 'marketplace';
  onTabChange: (tab: 'match' | 'marketplace') => void;
}

export function HomeTabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex gap-2 mb-6">
      <Button
        onClick={() => onTabChange('match')}
        variant={activeTab === 'match' ? 'default' : 'outline'}
        className={`flex-1 gap-2 ${
          activeTab === 'match'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0'
            : ''
        }`}
      >
        <Heart className="w-5 h-5" />
        Match Pets
      </Button>
      <Button
        onClick={() => onTabChange('marketplace')}
        variant={activeTab === 'marketplace' ? 'default' : 'outline'}
        className={`flex-1 gap-2 ${
          activeTab === 'marketplace'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0'
            : ''
        }`}
      >
        <Store className="w-5 h-5" />
        Marketplace
      </Button>
    </div>
  );
}
