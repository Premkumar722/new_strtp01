'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Heart } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/app/context/auth-context';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: string;
  species: string;
  image: string;
  area: string;
  ownerPhone: string;
  ownerEmail: string;
  type: 'match' | 'sell';
  price?: number;
}

interface PetCardsProps {
  pets: Pet[];
  filterType?: 'match' | 'sell' | 'all';
}

export function PetCards({ pets, filterType = 'all' }: PetCardsProps) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showToast, setShowToast] = useState<string | null>(null);

  const filteredPets = filterType === 'all' ? pets : pets.filter(pet => pet.type === filterType);

  const toggleFavorite = (id: string) => {
    if (!isLoggedIn) {
      router.push('/register');
      return;
    }
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const handleContactDetailsClick = () => {
    if (!isLoggedIn) {
      router.push('/register');
    }
  };

  const handleGetInTouch = (petId: string) => {
    setShowToast(petId);
    setTimeout(() => {
      setShowToast(null);
      router.push('/chat');
    }, 1500);
  };

  if (filteredPets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No pets found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPets.map((pet) => (
        <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          {/* Pet Image */}
          <div className="relative h-64 w-full bg-gray-200 group">
            <Image
              src={pet.image}
              alt={pet.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
            
            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(pet.id)}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-all"
            >
              <Heart
                className={`w-5 h-5 ${
                  favorites.includes(pet.id)
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-400'
                }`}
              />
            </button>

            {/* Type Badge */}
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500">
              {pet.type === 'match' ? '🐾 Looking for Match' : '💰 For Sale'}
            </Badge>
          </div>

          {/* Pet Info */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
              <p className="text-sm text-gray-600">{pet.species}</p>
            </div>

            {/* Pet Attributes */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-purple-50 p-2 rounded">
                <p className="text-xs text-gray-600">Breed</p>
                <p className="font-semibold text-sm">{pet.breed}</p>
              </div>
              <div className="bg-pink-50 p-2 rounded">
                <p className="text-xs text-gray-600">Age</p>
                <p className="font-semibold text-sm">{pet.age} years</p>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <p className="text-xs text-gray-600">Gender</p>
                <p className="font-semibold text-sm">{pet.gender}</p>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <p className="text-xs text-gray-600">Area</p>
                <p className="font-semibold text-sm">{pet.area}</p>
              </div>
              {pet.type === 'sell' && pet.price && (
                <div className="bg-yellow-50 p-2 rounded">
                  <p className="text-xs text-gray-600">Price</p>
                  <p className="font-semibold text-sm">₹{pet.price.toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* Contact Details - Hidden for non-logged-in users, hover reveal for logged-in */}
            {isLoggedIn && (
              <div className="space-y-2 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm opacity-100 transition-opacity hover:opacity-100">
                  <Phone className="w-4 h-4 text-purple-500" />
                  <span className="font-mono text-gray-700 group-hover:text-gray-900">{pet.ownerPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm opacity-100 transition-opacity hover:opacity-100">
                  <Mail className="w-4 h-4 text-pink-500" />
                  <span className="font-mono text-gray-700 group-hover:text-gray-900">{pet.ownerEmail}</span>
                </div>
              </div>
            )}

            {!isLoggedIn && (
              <div className="bg-purple-50 p-3 rounded text-center cursor-pointer hover:bg-purple-100 transition-colors pt-3 border-t border-gray-200" onClick={handleContactDetailsClick}>
                <p className="text-xs text-gray-600 mb-2">Click to login and view contact details</p>
              </div>
            )}

            {/* Call to Action Buttons */}
            <div className="space-y-2 pt-3 border-t border-gray-200">
              {isLoggedIn && (
                <>
                  <Button 
                    onClick={() => handleGetInTouch(pet.id)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Get in Touch
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => toggleFavorite(pet.id)}
                      variant={favorites.includes(pet.id) ? "default" : "outline"}
                      className={`flex-1 ${favorites.includes(pet.id) ? 'bg-red-500 hover:bg-red-600' : ''}`}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${favorites.includes(pet.id) ? 'fill-current' : ''}`} />
                      {favorites.includes(pet.id) ? 'Unlike' : 'Like'}
                    </Button>
                  </div>
                  {showToast === pet.id && (
                    <div className="bg-green-50 p-2 rounded text-center text-sm text-green-700 animate-pulse">
                      Connecting to chat...
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
