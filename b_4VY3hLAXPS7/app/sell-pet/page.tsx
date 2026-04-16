'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Upload, X, Plus, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { dogBreeds, catBreeds } from '@/utils/mock-data';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  month: number;
  gender: string;
  price: string;
  image: string;
}

interface PaymentDetails {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
}

export default function SellPetPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState<'payment' | 'pets'>('payment');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
  });
  const [pets, setPets] = useState<Pet[]>([]);
  const [currentPet, setCurrentPet] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    month: '',
    gender: '',
    price: '',
  });
  const [petImage, setPetImage] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load saved data from localStorage on mount
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Save payment details to localStorage
  useEffect(() => {
    if (paymentSubmitted && typeof window !== 'undefined') {
      localStorage.setItem('seller_payment_details', JSON.stringify(paymentDetails));
    }
  }, [paymentDetails, paymentSubmitted]);

  // Save pets to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && pets.length > 0) {
      localStorage.setItem('seller_pets', JSON.stringify(pets));
    }
  }, [pets]);

  // Load data on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && isLoggedIn && user) {
      const savedPayment = localStorage.getItem('seller_payment_details');
      const savedPets = localStorage.getItem('seller_pets');

      if (savedPayment) {
        try {
          setPaymentDetails(JSON.parse(savedPayment));
          setPaymentSubmitted(true);
          setStep('pets');
        } catch (e) {
          console.error('[v0] Error loading payment details:', e);
        }
      }

      if (savedPets) {
        try {
          setPets(JSON.parse(savedPets));
        } catch (e) {
          console.error('[v0] Error loading pets:', e);
        }
      }
    }
    setIsLoading(false);
  }, [isLoggedIn, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-md mx-auto">
          <Button onClick={() => router.back()} variant="outline" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Login Required</h1>
            <p className="text-gray-600 mb-4">You need to create a seller account to list pets.</p>
            <div className="space-y-3">
              <Link href="/register?type=seller" className="block">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">Create Seller Account</Button>
              </Link>
              <Link href="/login" className="block">
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
            </div>
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
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Seller Account Required</h1>
            <p className="text-gray-600 mb-8">Your account is not set up as a seller yet. You can update your account type from your profile settings.</p>
            <Link href="/profile">
              <Button>Go to Profile</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getBreeds = () => {
    if (currentPet.species === 'Dog') return dogBreeds;
    if (currentPet.species === 'Cat') return catBreeds;
    return [];
  };

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};
    if (!paymentDetails.bankName.trim()) newErrors.bankName = 'Bank name is required';
    if (!paymentDetails.accountHolder.trim()) newErrors.accountHolder = 'Account holder name is required';
    if (!paymentDetails.accountNumber.trim() || paymentDetails.accountNumber.length < 8) newErrors.accountNumber = 'Valid account number is required';
    if (!paymentDetails.ifscCode.trim() || paymentDetails.ifscCode.length !== 11) newErrors.ifscCode = 'Valid IFSC code required';
    if (!paymentDetails.upiId.trim()) newErrors.upiId = 'UPI ID is required';
    else if (!paymentDetails.upiId.includes('@')) newErrors.upiId = 'Valid UPI ID required (e.g., user@upi)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePet = () => {
    const newErrors: Record<string, string> = {};
    if (!currentPet.name.trim()) newErrors.name = 'Pet name is required';
    if (!currentPet.species) newErrors.species = 'Species is required';
    if (!currentPet.breed) newErrors.breed = 'Breed is required';
    if (!currentPet.age || isNaN(Number(currentPet.age))) newErrors.age = 'Valid age is required';
    if (!currentPet.month || isNaN(Number(currentPet.month))) newErrors.month = 'Valid month is required';
    if (!currentPet.gender) newErrors.gender = 'Gender is required';
    if (!currentPet.price || isNaN(Number(currentPet.price))) newErrors.price = 'Valid price is required';
    if (!petImage) newErrors.image = 'Pet image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePayment()) {
      setPaymentSubmitted(true);
      setStep('pets');
    }
  };

  const handleAddPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePet()) {
      const newPet: Pet = {
        id: `pet-${Date.now()}`,
        name: currentPet.name,
        species: currentPet.species,
        breed: currentPet.breed,
        age: Number(currentPet.age),
        month: Number(currentPet.month),
        gender: currentPet.gender,
        price: currentPet.price,
        image: petImage,
      };
      setPets([...pets, newPet]);
      setCurrentPet({ name: '', species: '', breed: '', age: '', month: '', gender: '', price: '' });
      setPetImage('');
      setErrors({});
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleRemovePet = (id: string) => {
    setPets(pets.filter(p => p.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPetImage(reader.result as string);
        setErrors(prev => ({ ...prev, image: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = () => {
    if (pets.length > 0) {
      alert(`Successfully added ${pets.length} pet(s) for sale!`);
      router.push('/seller-dashboard');
    } else {
      setErrors({ pets: 'Please add at least one pet' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Steps */}
          <div className="md:col-span-1">
            <div className="space-y-4">
              <div className={`p-4 rounded-lg cursor-pointer transition-all ${paymentSubmitted ? 'bg-green-100' : 'bg-purple-100'}`}>
                <div className="flex items-center gap-3 font-semibold">
                  {paymentSubmitted ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <div className="w-5 h-5 bg-purple-600 rounded-full text-white flex items-center justify-center text-sm">1</div>}
                  Payment Details
                </div>
              </div>
              <div className={`p-4 rounded-lg transition-all ${step === 'pets' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                <div className="flex items-center gap-3 font-semibold">
                  <div className="w-5 h-5 bg-purple-600 rounded-full text-white flex items-center justify-center text-sm">2</div>
                  Pet Listings
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <Card className="p-8">
              {step === 'payment' && !paymentSubmitted ? (
                <>
                  <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
                  <form onSubmit={handleSubmitPayment} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Bank Name</label>
                      <Input
                        placeholder="Enter bank name"
                        value={paymentDetails.bankName}
                        onChange={(e) => setPaymentDetails({...paymentDetails, bankName: e.target.value})}
                        className={errors.bankName ? 'border-red-500' : ''}
                      />
                      {errors.bankName && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.bankName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Account Holder Name</label>
                      <Input
                        placeholder="Enter account holder name"
                        value={paymentDetails.accountHolder}
                        onChange={(e) => setPaymentDetails({...paymentDetails, accountHolder: e.target.value})}
                        className={errors.accountHolder ? 'border-red-500' : ''}
                      />
                      {errors.accountHolder && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.accountHolder}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Account Number</label>
                      <Input
                        placeholder="Enter account number"
                        value={paymentDetails.accountNumber}
                        onChange={(e) => setPaymentDetails({...paymentDetails, accountNumber: e.target.value})}
                        className={errors.accountNumber ? 'border-red-500' : ''}
                      />
                      {errors.accountNumber && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.accountNumber}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">IFSC Code</label>
                      <Input
                        placeholder="Enter IFSC code (11 characters)"
                        value={paymentDetails.ifscCode}
                        onChange={(e) => setPaymentDetails({...paymentDetails, ifscCode: e.target.value.toUpperCase()})}
                        maxLength={11}
                        className={errors.ifscCode ? 'border-red-500' : ''}
                      />
                      {errors.ifscCode && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.ifscCode}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">UPI ID</label>
                      <Input
                        placeholder="Enter UPI ID (e.g., user@upi)"
                        value={paymentDetails.upiId}
                        onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})}
                        className={errors.upiId ? 'border-red-500' : ''}
                      />
                      {errors.upiId && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.upiId}</p>}
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Continue to Pet Listings
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6">Add Pet Listings</h2>

                  {showSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-semibold text-green-800">Pet Added Successfully!</p>
                        <p className="text-xs text-green-700">You can add another pet or proceed to your dashboard.</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Current Pet Form */}
                  <form onSubmit={handleAddPet} className="space-y-4 mb-8 pb-8 border-b">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Pet Name</label>
                      <Input
                        placeholder="Enter pet name"
                        value={currentPet.name}
                        onChange={(e) => setCurrentPet({...currentPet, name: e.target.value})}
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.name}</p>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Species</label>
                        <select
                          value={currentPet.species}
                          onChange={(e) => setCurrentPet({...currentPet, species: e.target.value, breed: ''})}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="">Select Species</option>
                          <option value="Dog">Dog</option>
                          <option value="Cat">Cat</option>
                          <option value="Rabbit">Rabbit</option>
                          <option value="Bird">Bird</option>
                        </select>
                        {errors.species && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.species}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Breed</label>
                        <select
                          value={currentPet.breed}
                          onChange={(e) => setCurrentPet({...currentPet, breed: e.target.value})}
                          disabled={!currentPet.species}
                          className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                        >
                          <option value="">Select Breed</option>
                          {getBreeds().map(breed => (
                            <option key={breed} value={breed}>{breed}</option>
                          ))}
                        </select>
                        {errors.breed && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.breed}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Age (Years)</label>
                        <Input
                          type="number"
                          placeholder="Age"
                          value={currentPet.age}
                          onChange={(e) => setCurrentPet({...currentPet, age: e.target.value})}
                          min="0"
                        />
                        {errors.age && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.age}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Month (0-11)</label>
                        <Input
                          type="number"
                          placeholder="Month"
                          value={currentPet.month}
                          onChange={(e) => setCurrentPet({...currentPet, month: e.target.value})}
                          min="0"
                          max="11"
                        />
                        {errors.month && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.month}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Gender</label>
                        <select
                          value={currentPet.gender}
                          onChange={(e) => setCurrentPet({...currentPet, gender: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.gender}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Price (₹)</label>
                        <Input
                          type="number"
                          placeholder="Price"
                          value={currentPet.price}
                          onChange={(e) => setCurrentPet({...currentPet, price: e.target.value})}
                          min="0"
                        />
                        {errors.price && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.price}</p>}
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Pet Photo</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        {petImage ? (
                          <div className="space-y-2">
                            <div className="relative h-40 w-full rounded-lg overflow-hidden">
                              <Image src={petImage} alt="preview" fill className="object-cover" />
                            </div>
                            <Button type="button" onClick={() => setPetImage('')} variant="outline" size="sm" className="w-full">
                              <X className="w-4 h-4 mr-2" /> Remove
                            </Button>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center gap-2">
                            <Upload className="w-6 h-6 text-gray-400" />
                            <span className="text-sm text-gray-600">Click to upload</span>
                            <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          </label>
                        )}
                      </div>
                      {errors.image && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.image}</p>}
                    </div>

                    <Button type="submit" className="w-full gap-2">
                      <Plus className="w-4 h-4" /> Add Pet to Listing
                    </Button>
                  </form>

                  {/* Listed Pets */}
                  {pets.length > 0 && (
                    <>
                      <h3 className="text-xl font-bold mb-4">Listed Pets ({pets.length})</h3>
                      <div className="grid gap-4 mb-8">
                        {pets.map(pet => (
                          <Card key={pet.id} className="p-4 flex gap-4">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <Image src={pet.image} alt={pet.breed} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-lg">{pet.name}</h4>
                              <p className="text-sm text-gray-600 mb-1">{pet.species} - {pet.breed}</p>
                              <p className="text-sm text-gray-600">{pet.age} years {pet.month} months • {pet.gender}</p>
                              <p className="text-lg font-bold text-purple-600 mt-2">₹{pet.price}</p>
                            </div>
                            <Button onClick={() => handleRemovePet(pet.id)} variant="outline" size="sm">
                              <X className="w-4 h-4" />
                            </Button>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={handleFinish} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">
                      Finish & Go to Dashboard
                    </Button>
                    <Button onClick={() => setStep('payment')} variant="outline" className="flex-1">
                      Back to Payment
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
