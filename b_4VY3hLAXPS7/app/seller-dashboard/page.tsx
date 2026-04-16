'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Edit2, Trash2, TrendingUp, Eye, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SellerListing {
  id: string;
  species: string;
  breed: string;
  age: number;
  month: number;
  gender: string;
  price: string;
  image: string;
  views: number;
  inquiries: number;
  status: 'active' | 'sold';
  listingDate: string;
}

export default function SellerDashboardPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const [listings, setListings] = useState<SellerListing[]>([
    {
      id: '1',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: 2,
      month: 3,
      gender: 'Male',
      price: '₹25,000',
      image: 'https://via.placeholder.com/150',
      views: 245,
      inquiries: 12,
      status: 'active',
      listingDate: '2024-03-10',
    },
    {
      id: '2',
      species: 'Cat',
      breed: 'Persian',
      age: 1,
      month: 6,
      gender: 'Female',
      price: '₹8,000',
      image: 'https://via.placeholder.com/150',
      views: 156,
      inquiries: 8,
      status: 'active',
      listingDate: '2024-02-28',
    },
  ]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-md mx-auto">
          <Button onClick={() => router.back()} variant="outline" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Login Required</h1>
            <p className="text-gray-600 mb-8">Please login to access your seller dashboard.</p>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500">Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user?.userType !== 'sell') {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-md mx-auto">
          <Button onClick={() => router.back()} variant="outline" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Seller Account Required</h1>
            <p className="text-gray-600 mb-8">This dashboard is only for seller accounts.</p>
            <Link href="/">
              <Button>Go to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalViews = listings.reduce((sum, listing) => sum + listing.views, 0);
  const totalInquiries = listings.reduce((sum, listing) => sum + listing.inquiries, 0);
  const activeListing = listings.filter(l => l.status === 'active').length;

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      setListings(listings.filter(l => l.id !== id));
    }
  };

  const handleStatusToggle = (id: string) => {
    setListings(listings.map(l => 
      l.id === id 
        ? { ...l, status: l.status === 'active' ? 'sold' : 'active' }
        : l
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Seller Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}! Manage your pet listings here.</p>
          </div>
          <Link href="/sell-pet">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 gap-2">
              <Plus className="w-4 h-4" /> List New Pet
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-purple-100 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Listings</p>
                <h3 className="text-3xl font-bold">{activeListing}</h3>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-100 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Views</p>
                <h3 className="text-3xl font-bold">{totalViews}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-100 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Inquiries</p>
                <h3 className="text-3xl font-bold">{totalInquiries}</h3>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-pink-100 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Conversion Rate</p>
                <h3 className="text-3xl font-bold">{totalInquiries > 0 ? Math.round((totalInquiries / totalViews) * 100) : 0}%</h3>
              </div>
              <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Listings Section */}
        <h2 className="text-2xl font-bold mb-6">Your Listings</h2>

        {listings.length > 0 ? (
          <div className="space-y-4">
            {listings.map(listing => (
              <Card key={listing.id} className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image 
                      src={listing.image} 
                      alt={listing.breed} 
                      fill 
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{listing.species} - {listing.breed}</h3>
                        <p className="text-gray-600 text-sm">
                          {listing.age} years {listing.month} months • {listing.gender} • Listed on {new Date(listing.listingDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={listing.status === 'active' ? 'bg-green-500' : 'bg-red-500'}>
                        {listing.status === 'active' ? 'Active' : 'Sold'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{listing.views} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{listing.inquiries} inquiries</span>
                      </div>
                    </div>

                    <p className="text-2xl font-bold text-purple-600 mb-4">{listing.price}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={() => handleStatusToggle(listing.id)}
                      variant={listing.status === 'active' ? 'default' : 'outline'}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {listing.status === 'active' ? 'Mark as Sold' : 'Reactivate'}
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Edit2 className="w-4 h-4" /> Edit
                    </Button>
                    <Button 
                      onClick={() => handleDelete(listing.id)}
                      variant="outline" 
                      className="gap-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-6">You haven't listed any pets yet. Start by adding your first listing!</p>
            <Link href="/sell-pet">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 gap-2">
                <Plus className="w-4 h-4" /> List Your First Pet
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
