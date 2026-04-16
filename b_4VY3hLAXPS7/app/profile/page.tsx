'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth-context';
import { mockPets } from '@/utils/mock-data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const mockOrders = [
  { id: '1', petName: 'Max', breed: 'Golden Retriever', orderDate: '2024-03-20', status: 'Completed' },
  { id: '2', petName: 'Luna', breed: 'Siamese', orderDate: '2024-02-15', status: 'Completed' },
  { id: '3', petName: 'Charlie', breed: 'Dachshund', orderDate: '2024-01-10', status: 'Pending' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Please Login</h1>
            <p className="text-gray-600 mb-8">You need to be logged in to view your profile.</p>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get seller's pets or buyer's orders
  const sellerPets = user?.userType === 'sell' 
    ? mockPets.filter(p => p.type === 'sell')
    : [];

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg border border-purple-200">
            <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
            <div className="space-y-1 text-gray-600">
              <p>Email: {user?.email}</p>
              <p>Phone: {user?.phone}</p>
              <p>Location: {user?.city}, {user?.state}</p>
              <p>Account Type: <Badge className="ml-2 bg-purple-600">{user?.userType === 'buyer' ? 'Buyer' : user?.userType === 'match' ? 'Matcher' : 'Seller'}</Badge></p>
            </div>
          </div>
        </div>

        {/* Seller's Listed Pets */}
        {user?.userType === 'sell' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">My Listed Pets</h2>
              {sellerPets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sellerPets.map(pet => (
                    <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48 w-full">
                        <Image
                          src={pet.image}
                          alt={pet.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg">{pet.name}</h3>
                        <div className="space-y-2 mb-3">
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline">{pet.species}</Badge>
                            <Badge variant="outline">{pet.breed}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Age: {pet.age} years • {pet.gender}
                          </p>
                          {pet.price && (
                            <p className="font-semibold text-lg text-purple-600">₹{pet.price.toLocaleString()}</p>
                          )}
                        </div>
                        <Button className="w-full text-sm">Edit Listing</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-4">You haven't listed any pets yet.</p>
                  <Link href="/?action=list">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      List Your First Pet
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Matcher/Match Pets Profile */}
        {user?.userType === 'match' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Pet Profile</h2>
            {user.petProfile ? (
              <Card className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  {user.petProfile.image && (
                    <div className="relative h-64 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={user.petProfile.image}
                        alt="My pet"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Species</p>
                        <p className="font-semibold">{user.petProfile.species}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Breed</p>
                        <p className="font-semibold">{user.petProfile.breed}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Age</p>
                        <p className="font-semibold">{user.petProfile.age} years, {user.petProfile.month} months</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Gender</p>
                        <p className="font-semibold">{user.petProfile.gender}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">Pet profile not set up yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Buyer Profile - Orders */}
        {user?.userType === 'buyer' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Orders</h2>
            {mockOrders.length > 0 ? (
              <div className="space-y-3">
                {mockOrders.map(order => (
                  <Card key={order.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{order.petName}</h3>
                        <p className="text-sm text-gray-600 mb-2">{order.breed}</p>
                        <p className="text-xs text-gray-500">Order Date: {order.orderDate}</p>
                      </div>
                      <Badge className={order.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {order.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">You haven't ordered any pets yet.</p>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Browse Pets
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
