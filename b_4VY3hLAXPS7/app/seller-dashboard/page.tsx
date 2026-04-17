'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Edit2, Trash2, TrendingUp, Eye, MessageSquare, Save, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

interface SellerListing {
  id: string;
  name: string;
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

interface PaymentDetails {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
}

export default function SellerDashboardPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const [listings, setListings] = useState<SellerListing[]>([]);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPets = localStorage.getItem('seller_pets');
      const savedPayment = localStorage.getItem('seller_payment_details');

      if (savedPets) {
        try {
          const petsData = JSON.parse(savedPets);
          setListings(petsData);
        } catch (e) {
          console.error('[v0] Error loading pets:', e);
        }
      }

      if (savedPayment) {
        try {
          const paymentData = JSON.parse(savedPayment);
          setPaymentDetails(paymentData);
        } catch (e) {
          console.error('[v0] Error loading payment:', e);
        }
      }
    }
  }, []);

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
    setShowDeleteConfirm(id);
  };

  const confirmDelete = (id: string) => {
    const petName = listings.find(l => l.id === id)?.name;
    const updated = listings.filter(l => l.id !== id);
    setListings(updated);
    localStorage.setItem('seller_pets', JSON.stringify(updated));
    setShowDeleteConfirm(null);
    setSuccessMessage(`${petName} has been deleted successfully.`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleStatusToggle = (id: string) => {
    const listing = listings.find(l => l.id === id);
    const updated = listings.map(l => 
      l.id === id 
        ? { ...l, status: l.status === 'active' ? 'sold' : 'active' }
        : l
    );
    setListings(updated);
    localStorage.setItem('seller_pets', JSON.stringify(updated));
    const newStatus = listing?.status === 'active' ? 'marked as sold' : 'reactivated';
    setSuccessMessage(`${listing?.name} has been ${newStatus}.`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSaveEdit = (id: string) => {
    const listing = listings.find(l => l.id === id);
    const updated = listings.map(l =>
      l.id === id
        ? {
            ...l,
            name: editingData.name || l.name,
            breed: editingData.breed || l.breed,
            gender: editingData.gender || l.gender,
            price: editingData.price || l.price,
          }
        : l
    );
    setListings(updated);
    localStorage.setItem('seller_pets', JSON.stringify(updated));
    setEditingId(null);
    setEditingData({});
    setSuccessMessage(`${listing?.name} has been updated successfully.`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleStatusToggle = (id: string) => {
    const updated = listings.map(l => 
      l.id === id 
        ? { ...l, status: l.status === 'active' ? 'sold' : 'active' }
        : l
    );
    setListings(updated);
    localStorage.setItem('seller_pets', JSON.stringify(updated));
  };

  const handleEdit = (id: string) => {
    const listing = listings.find(l => l.id === id);
    if (editingId === id) {
      setEditingId(null);
      setEditingData({});
    } else if (listing) {
      setEditingId(id);
      setEditingData({
        name: listing.name,
        breed: listing.breed,
        gender: listing.gender,
        price: listing.price,
      });
    }
  };

  const handleSaveEdit = (id: string) => {
    const updated = listings.map(l =>
      l.id === id
        ? {
            ...l,
            name: editingData.name || l.name,
            breed: editingData.breed || l.breed,
            gender: editingData.gender || l.gender,
            price: editingData.price || l.price,
          }
        : l
    );
    setListings(updated);
    localStorage.setItem('seller_pets', JSON.stringify(updated));
    setEditingId(null);
    setEditingData({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Success Message Toast */}
        {successMessage && (
          <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 shadow-lg animate-in slide-in-from-top">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <p className="text-sm font-medium text-green-800">{successMessage}</p>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="ml-auto text-green-600 hover:text-green-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Seller Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}! Manage your pet listings here.</p>
            {paymentDetails && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <p className="text-gray-700"><span className="font-semibold">Payment Account:</span> {paymentDetails.accountHolder} • {paymentDetails.bankName}</p>
                <p className="text-gray-600 text-xs mt-1">Account ending in ••••{paymentDetails.accountNumber.slice(-4)}</p>
              </div>
            )}
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
              <Card key={listing.id} className="p-6 relative">
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
                        <h3 className="text-xl font-bold mb-1">{listing.name}</h3>
                        <p className="text-gray-600 text-sm mb-1">{listing.species} - {listing.breed}</p>
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
                    {editingId === listing.id ? (
                      <>
                        <Button 
                          onClick={() => handleSaveEdit(listing.id)}
                          className="bg-green-600 hover:bg-green-700 gap-2"
                        >
                          <Save className="w-4 h-4" /> Save
                        </Button>
                        <Button 
                          onClick={() => {
                            setEditingId(null);
                            setEditingData({});
                          }}
                          variant="outline"
                          className="gap-2"
                        >
                          <X className="w-4 h-4" /> Cancel
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => handleEdit(listing.id)}
                        variant="outline" 
                        className="gap-2"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </Button>
                    )}
                    <Button 
                      onClick={() => handleDelete(listing.id)}
                      variant="outline" 
                      className="gap-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  </div>

                  {/* Edit Form */}
                  {editingId === listing.id && (
                    <div className="mt-4 pt-4 border-t space-y-3 bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-semibold text-blue-900">Edit Pet Details</p>
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-700">Pet Name</label>
                        <Input
                          value={editingData.name || ''}
                          onChange={(e) => setEditingData({...editingData, name: e.target.value})}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-700">Breed</label>
                        <Input
                          value={editingData.breed || ''}
                          onChange={(e) => setEditingData({...editingData, breed: e.target.value})}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-700">Gender</label>
                        <select
                          value={editingData.gender || ''}
                          onChange={(e) => setEditingData({...editingData, gender: e.target.value})}
                          className="w-full px-2 py-1 border rounded text-sm"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-700">Price (₹)</label>
                        <Input
                          type="number"
                          value={editingData.price || ''}
                          onChange={(e) => setEditingData({...editingData, price: e.target.value})}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Delete Confirmation */}
                  {showDeleteConfirm === listing.id && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <Card className="p-4 max-w-sm">
                        <h4 className="font-bold text-lg mb-2">Delete Listing?</h4>
                        <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete {listing.name}? This action cannot be undone.</p>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => confirmDelete(listing.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </Button>
                          <Button 
                            onClick={() => setShowDeleteConfirm(null)}
                            variant="outline"
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )}
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
