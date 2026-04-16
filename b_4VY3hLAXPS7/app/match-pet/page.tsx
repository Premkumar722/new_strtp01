'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, Upload, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { dogBreeds, catBreeds } from '@/utils/mock-data';

interface MatchPet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  week: number;
  gender: string;
  image: string;
}

export default function MatchPetPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentPet, setCurrentPet] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    week: '',
    gender: '',
  });
  const [petImage, setPetImage] = useState<string>('');
  const [petsList, setPetsList] = useState<MatchPet[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

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
            <p className="text-gray-600 mb-4">You need to create an account to find matching pets.</p>
            <div className="space-y-3">
              <Link href="/register" className="block">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">Create Account</Button>
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

  const getBreeds = () => {
    const speciesMap: Record<string, string[]> = {
      'Dog': dogBreeds,
      'Cat': catBreeds,
    };
    return currentPet.species ? speciesMap[currentPet.species] || [] : [];
  };

  const validatePet = () => {
    const newErrors: Record<string, string> = {};
    if (!currentPet.name.trim()) newErrors.name = 'Pet name is required';
    if (!currentPet.species) newErrors.species = 'Species is required';
    if (!currentPet.breed) newErrors.breed = 'Breed is required';
    if (!currentPet.age || isNaN(Number(currentPet.age))) newErrors.age = 'Valid age is required';
    if (!currentPet.week || isNaN(Number(currentPet.week))) newErrors.week = 'Valid weeks is required';
    if (!currentPet.gender) newErrors.gender = 'Gender is required';
    if (!petImage) newErrors.image = 'Pet image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleAddPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePet()) {
      const newPet: MatchPet = {
        id: `match-pet-${Date.now()}`,
        name: currentPet.name,
        species: currentPet.species,
        breed: currentPet.breed,
        age: Number(currentPet.age),
        week: Number(currentPet.week),
        gender: currentPet.gender,
        image: petImage,
      };
      setPetsList([...petsList, newPet]);
      setCurrentPet({ name: '', species: '', breed: '', age: '', week: '', gender: '' });
      setPetImage('');
      setErrors({});
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      localStorage.setItem('match_pets', JSON.stringify([...petsList, newPet]));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={() => router.back()} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Find Matching Pets</h1>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-800">Pet Added Successfully!</p>
              <p className="text-xs text-green-700">Keep adding more pets or view your matches.</p>
            </div>
          </div>
        )}

        {/* Pet Form */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Add Your Pet Details</h2>
          
          <form onSubmit={handleAddPet} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Pet Name */}
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

              {/* Species */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Species</label>
                <select
                  value={currentPet.species}
                  onChange={(e) => setCurrentPet({...currentPet, species: e.target.value, breed: ''})}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.species ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                </select>
                {errors.species && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.species}</p>}
              </div>

              {/* Breed */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Breed</label>
                <select
                  value={currentPet.breed}
                  onChange={(e) => setCurrentPet({...currentPet, breed: e.target.value})}
                  disabled={!currentPet.species}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.breed ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Breed</option>
                  {getBreeds().map(breed => (
                    <option key={breed} value={breed}>{breed}</option>
                  ))}
                </select>
                {errors.breed && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.breed}</p>}
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Age (years)</label>
                <Input
                  type="number"
                  placeholder="Enter age"
                  value={currentPet.age}
                  onChange={(e) => setCurrentPet({...currentPet, age: e.target.value})}
                  className={errors.age ? 'border-red-500' : ''}
                />
                {errors.age && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.age}</p>}
              </div>

              {/* Weeks */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Weeks</label>
                <Input
                  type="number"
                  placeholder="Enter weeks"
                  value={currentPet.week}
                  onChange={(e) => setCurrentPet({...currentPet, week: e.target.value})}
                  className={errors.week ? 'border-red-500' : ''}
                />
                {errors.week && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.week}</p>}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Gender</label>
                <select
                  value={currentPet.gender}
                  onChange={(e) => setCurrentPet({...currentPet, gender: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.gender}</p>}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Pet Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {petImage ? (
                  <div className="relative w-32 h-32 mx-auto">
                    <Image
                      src={petImage}
                      alt="Pet preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer block mt-4">
                  <Button type="button" variant="outline">Choose Image</Button>
                </label>
              </div>
              {errors.image && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.image}</p>}
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Find Matches
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
