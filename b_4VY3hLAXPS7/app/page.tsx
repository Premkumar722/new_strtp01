'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useMemo, useEffect } from 'react';
import { PetCards } from '@/components/home/pet-cards';
import { ListPetForm } from '@/components/forms/list-pet-form';
import { Filters, FilterState } from '@/components/home/filters';
import { AdCarousel } from '@/components/home/ad-carousel';
import { MatchingPetModal } from '@/components/home/matching-pet-modal';
import { useAuth } from '@/app/context/auth-context';
import { mockPets } from '@/utils/mock-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function HomeContent() {
  const searchParams = useSearchParams();
  const { isLoggedIn, user, updateUser } = useAuth();
  const action = searchParams.get('action');
  const [activeTab, setActiveTab] = useState<'matching' | 'marketplace'>('matching');
  const [filters, setFilters] = useState<FilterState>({
    species: '',
    breed: '',
    age: '',
    gender: '',
    price: '',
  });
  const [showMatchingPetModal, setShowMatchingPetModal] = useState(false);
  const [matchingPetModalShown, setMatchingPetModalShown] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user?.userType === 'match' && !user?.petProfile && !matchingPetModalShown) {
      setShowMatchingPetModal(true);
      setMatchingPetModalShown(true);
    }
  }, [isLoggedIn, user?.userType, user?.petProfile, matchingPetModalShown]);

  // Filter pets based on active tab and filters
  const filteredPets = useMemo(() => {
    let pets = mockPets.filter(pet => {
      if (activeTab === 'matching') {
        return pet.type === 'match';
      } else {
        return pet.type === 'sell';
      }
    });

    // Apply filters
    if (filters.species) {
      pets = pets.filter(pet => pet.species === filters.species);
    }
    if (filters.breed) {
      pets = pets.filter(pet => pet.breed === filters.breed);
    }
    if (filters.age) {
      pets = pets.filter(pet => pet.age <= parseInt(filters.age));
    }
    if (filters.gender) {
      pets = pets.filter(pet => pet.gender === filters.gender);
    }
    if (filters.price && activeTab === 'marketplace') {
      pets = pets.filter(pet => pet.price && pet.price <= parseInt(filters.price));
    }

    return pets;
  }, [activeTab, filters]);

  // If user is not logged in and tries to access list form, show message
  if (action === 'list' && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Register to List Your Pet</h1>
          <p className="text-gray-600 mb-8">Create an account to start listing your pets for sale</p>
          <Link href="/register">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-2 h-auto">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Show list form if action is 'list' and user is logged in as seller
  if (action === 'list' && isLoggedIn && user?.userType === 'sell') {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <ListPetForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          {/* Tabs - Right below navbar */}
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('matching')}
              className={`py-4 px-2 font-semibold transition-colors border-b-2 ${
                activeTab === 'matching'
                  ? 'text-purple-600 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900 border-transparent'
              }`}
            >
              Matching Pets
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`py-4 px-2 font-semibold transition-colors border-b-2 ${
                activeTab === 'marketplace'
                  ? 'text-purple-600 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900 border-transparent'
              }`}
            >
              Marketplace
            </button>
            <Link href={isLoggedIn && user?.userType === 'sell' ? '/sell-pet' : '/register'}>
              <button className={`py-4 px-2 font-semibold transition-colors border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-400`}>
                Sell Pets
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Advertisement Carousel */}
          <div className="mb-12">
            <AdCarousel />
          </div>

          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-3">Welcome to PetMatch</h1>
            <p className="text-gray-600 text-lg">
              {isLoggedIn 
                ? `Welcome back, ${user?.name}! Browse all available pets in your area.`
                : 'Discover adorable pets available for adoption and matching.'}
            </p>
          </div>

          {/* Filters */}
          <Filters activeTab={activeTab} onFiltersChange={setFilters} />

          {/* Pets Grid */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">
                {activeTab === 'matching' ? 'Matching Pets' : 'Pets for Sale'}
              </h2>
              {isLoggedIn && user?.userType === 'sell' && activeTab === 'marketplace' && (
                <Link href="/?action=list">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    + List Your Pet
                  </Button>
                </Link>
              )}
            </div>
            {filteredPets.length > 0 ? (
              <PetCards pets={filteredPets} filterType={activeTab === 'matching' ? 'match' : 'sell'} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No pets found matching your filters.</p>
              </div>
            )}
          </div>

          {/* Additional Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-bold text-lg mb-2">Find Your Match</h3>
              <p className="text-gray-600 text-sm">
                Browse pets looking for their perfect match. Use the search bar above to filter by location.
              </p>
            </div>
            <div className="bg-pink-50 p-6 rounded-lg">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-bold text-lg mb-2">Connect Directly</h3>
              <p className="text-gray-600 text-sm">
                Message pet owners directly through our secure chat system. Build relationships within our community.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-4xl mb-3">📍</div>
              <h3 className="font-bold text-lg mb-2">Location-Based Search</h3>
              <p className="text-gray-600 text-sm">
                Find pets near you using the city search in the navigation with one-click location detection.
              </p>
            </div>
          </div>

          {/* Matching Pet Modal */}
          <MatchingPetModal
            isOpen={showMatchingPetModal}
            onClose={() => setShowMatchingPetModal(false)}
            onSubmit={(petData) => {
              if (user) {
                updateUser({
                  ...user,
                  petProfile: petData,
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
