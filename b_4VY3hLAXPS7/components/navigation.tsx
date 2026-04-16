'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/app/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, Home, MessageSquare, Plus, Search, MapPin, User } from 'lucide-react';
import { detectUserLocation } from '@/utils/location-service';

export function Navigation() {
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();
  const [city, setCity] = useState('');
  const [cityError, setCityError] = useState('');
  const [detecting, setDetecting] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSearch = () => {
    if (!city.trim()) {
      setCityError('City is required');
      return;
    }

    setCityError('');
    // Search handled through local state
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
    setCityError('');
  };

  const handleDetectLocation = async () => {
    setDetecting(true);
    try {
      if (!navigator.geolocation) {
        setCityError('Geolocation not supported');
        setDetecting(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const location = await detectUserLocation();
          if (location) {
            setCity(location.city);
            setCityError('');
          } else {
            setCityError('Unable to detect location');
          }
          setDetecting(false);
        },
        () => {
          setCityError('Unable to access location');
          setDetecting(false);
        }
      );
    } catch (error) {
      setCityError('Location detection failed');
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

          {/* Navigation Links - Center to Left */}
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

          {/* Location Detection - Right Side Corner */}
          <div className="flex gap-2 items-start ml-auto">
            <Button
              onClick={handleDetectLocation}
              disabled={detecting}
              variant="outline"
              size="sm"
              className="whitespace-nowrap h-9"
              title="Detect location"
            >
              {detecting ? <span className="animate-spin">🔄</span> : <MapPin className="w-4 h-4" />}
            </Button>
            <Input
              type="text"
              placeholder="City"
              value={city}
              onChange={handleCityChange}
              className={`text-sm h-9 w-24 ${cityError ? 'border-red-500' : ''}`}
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
        {cityError && <p className="text-xs text-red-500 px-4 py-2">{cityError}</p>}
      </div>
    </nav>
  );
}
