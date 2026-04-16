'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/app/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, Home, MessageSquare, Plus, Search, MapPin, User } from 'lucide-react';
import { validatePINCode, detectUserLocation } from '@/utils/location-service';

export function Navigation() {
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [address, setAddress] = useState('');
  const [pinError, setPinError] = useState('');
  const [detecting, setDetecting] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
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
    // Search handled through local state
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPin(value);
    setPinError('');
  };

  const handleDetectLocation = async () => {
    setDetecting(true);
    try {
      const location = await detectUserLocation();
      if (location) {
        const fullAddress = `${location.area}, ${location.city}, ${location.state}`;
        setAddress(fullAddress);
        setPin('');
        setPinError('');
      } else {
        setPinError('Unable to detect location');
      }
    } catch (error) {
      setPinError('Location detection failed');
    } finally {
      setDetecting(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navbar Row: Logo + Search + Navigation Links */}
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🐾</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">PetMatch</span>
          </Link>

          {/* Search Bar - Center */}
          <div className="flex-1 flex justify-center">
            <div className="flex gap-2 max-w-sm w-full items-start">
              <Button
                onClick={handleDetectLocation}
                disabled={detecting}
                variant="outline"
                size="sm"
                className="whitespace-nowrap h-9"
              >
                <MapPin className="w-4 h-4" />
              </Button>
              <Input
                type="text"
                placeholder={address || "PIN code or address"}
                value={address || pin}
                onChange={(e) => {
                  if (address) {
                    setAddress('');
                  } else {
                    handlePinChange(e);
                  }
                }}
                maxLength={address ? 50 : 6}
                className={`text-sm h-9 ${pinError ? 'border-red-500' : ''}`}
              />
              <Button
                onClick={handleSearch}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 whitespace-nowrap h-9"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <>
                <Link href="/">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Home className="w-4 h-4" />
                    <span className="hidden sm:inline">Home</span>
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">Chat</span>
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                </Link>
                {user?.userType === 'sell' && (
                  <>
                    <Link href="/sell-pet">
                      <Button variant="ghost" size="sm" className="gap-2 text-purple-600 hover:text-purple-700">
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Sell Pet</span>
                      </Button>
                    </Link>
                    <Link href="/seller-dashboard">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <span className="hidden sm:inline">Dashboard</span>
                      </Button>
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="text-sm hidden sm:block">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-gray-500 text-xs">
                      {user?.userType === 'buyer' ? 'Buyer' : user?.userType === 'match' ? 'Matcher' : 'Seller'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
            {!isLoggedIn && (
              <Link href="/register">
                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
        {pinError && <p className="text-xs text-red-500 px-4 py-2">{pinError}</p>}
      </div>
    </nav>
  );
}
