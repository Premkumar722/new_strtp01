'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search } from 'lucide-react';
import { detectUserLocation, validatePINCode } from '@/utils/location-service';

interface SearchBarProps {
  onSearch: (location: string, pin: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [location, setLocation] = useState('');
  const [pin, setPin] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [pinError, setPinError] = useState('');

  const handleDetectLocation = async () => {
    setDetecting(true);
    try {
      const result = await detectUserLocation();
      if (result) {
        setLocation(result.city);
      }
    } catch (error) {
      console.error('Location detection failed:', error);
    } finally {
      setDetecting(false);
    }
  };

  const handleSearch = () => {
    if (!pin.trim()) {
      setPinError('PIN code is required');
      return;
    }

    if (!validatePINCode(pin)) {
      setPinError('PIN code must be 6 digits');
      return;
    }

    setPinError('');
    onSearch(location, pin);
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPin(value);
    setPinError('');
  };

  return (
    <div className="w-full bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
      <div className="space-y-4">
        {/* Location Section */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Enter location or use auto-detect"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pr-10"
            />
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <Button
            onClick={handleDetectLocation}
            disabled={detecting}
            variant="outline"
            className="whitespace-nowrap"
          >
            {detecting ? 'Detecting...' : 'Auto-Detect'}
          </Button>
        </div>

        {/* PIN Code Section */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter PIN code (6 digits)"
              value={pin}
              onChange={handlePinChange}
              maxLength={6}
              className={pinError ? 'border-red-500' : ''}
            />
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 whitespace-nowrap"
            >
              {isLoading ? 'Searching...' : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
          {pinError && <p className="text-sm text-red-500">{pinError}</p>}
        </div>
      </div>
    </div>
  );
}
