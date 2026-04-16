'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { species, dogBreeds, catBreeds } from '@/utils/mock-data';

interface RegistrationStep2Props {
  ownerData: {
    name: string;
    zipcode: string;
    area: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
  };
  onSubmit: (data: {
    name: string;
    zipcode: string;
    area: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
    userType: 'buyer' | 'match' | 'sell';
    petProfile?: {
      species: string;
      breed: string;
      age: number;
      month: number;
      gender: string;
    };
  }) => void;
  onBack: () => void;
}

export function RegistrationStep2({ ownerData, onSubmit, onBack }: RegistrationStep2Props) {
  const [userType, setUserType] = useState<'buyer' | 'match' | 'sell'>('buyer');
  const [petData, setPetData] = useState({
    species: '',
    breed: '',
    age: '',
    month: '',
    gender: '',
  });
  const [petImage, setPetImage] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const getBreeds = () => {
    if (petData.species === 'Dog') return dogBreeds;
    if (petData.species === 'Cat') return catBreeds;
    return [];
  };

  const validateForm = () => {
    if (userType === 'buyer') return true;

    const newErrors: Record<string, string> = {};

    if (!petData.species) newErrors.species = 'Species is required';
    if (!petData.breed) newErrors.breed = 'Breed is required';
    if (!petData.age) newErrors.age = 'Age is required';
    else if (isNaN(Number(petData.age)) || Number(petData.age) < 0) newErrors.age = 'Age must be a valid number';
    if (!petData.month) newErrors.month = 'Month is required';
    else if (isNaN(Number(petData.month)) || Number(petData.month) < 0 || Number(petData.month) > 11) newErrors.month = 'Month must be between 0-11';
    if (!petData.gender) newErrors.gender = 'Gender is required';
    if (userType === 'match' && !petImage) newErrors.image = 'Pet image is required for matching';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const submitData: any = {
        ...ownerData,
        userType,
      };

      if (userType !== 'buyer') {
        submitData.petProfile = {
          species: petData.species,
          breed: petData.breed,
          age: Number(petData.age),
          month: Number(petData.month),
          gender: petData.gender,
          ...(petImage && { image: petImage }),
        };
      }

      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Pet Profile Setup</h2>
        <p className="text-gray-600">Step 2 of 2</p>
      </div>

      {/* User Type Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">Choose Account Type</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setUserType('buyer');
              setErrors({});
            }}
            className={`p-3 rounded-lg border-2 transition-all text-sm font-semibold ${
              userType === 'buyer'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="text-lg mb-1">👤</div>
            Buyer
          </button>

          <button
            type="button"
            onClick={() => {
              setUserType('match');
              setErrors({});
            }}
            className={`p-3 rounded-lg border-2 transition-all text-sm font-semibold ${
              userType === 'match'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="text-lg mb-1">🐾</div>
            Match Pets
          </button>

          <button
            type="button"
            onClick={() => {
              setUserType('sell');
              setErrors({});
            }}
            className={`p-3 rounded-lg border-2 transition-all text-sm font-semibold ${
              userType === 'sell'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="text-lg mb-1">💰</div>
            Sell Pet
          </button>
        </div>
      </div>

      {/* Pet Attributes - Only for Match/Sell types */}
      {userType !== 'buyer' && (
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold">Pet Details</h3>

        {/* Species Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Species</label>
          <select
            value={petData.species}
            onChange={(e) => setPetData(prev => ({ ...prev, species: e.target.value, breed: '' }))}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select species</option>
            {species.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.species && (
            <p className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" /> {errors.species}
            </p>
          )}
        </div>

        {/* Breed Selection / Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Breed</label>
          {petData.species && getBreeds().length > 0 ? (
            <select
              value={petData.breed}
              onChange={(e) => setPetData(prev => ({ ...prev, breed: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select breed</option>
              {getBreeds().map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          ) : (
            <Input
              type="text"
              placeholder="Enter breed"
              value={petData.breed}
              onChange={(e) => setPetData(prev => ({ ...prev, breed: e.target.value }))}
            />
          )}
          {errors.breed && (
            <p className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" /> {errors.breed}
            </p>
          )}
        </div>

        {/* Age and Month */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Age (years)</label>
            <Input
              type="number"
              placeholder="Enter age"
              value={petData.age}
              onChange={(e) => setPetData(prev => ({ ...prev, age: e.target.value }))}
              min="0"
              step="1"
              className={errors.age ? 'border-red-500' : ''}
            />
            {errors.age && (
              <p className="flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" /> {errors.age}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Month (0-11)</label>
            <Input
              type="number"
              placeholder="0-11"
              value={petData.month}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                if (value === '' || (Number(value) >= 0 && Number(value) <= 11)) {
                  setPetData(prev => ({ ...prev, month: value }));
                }
              }}
              min="0"
              max="11"
              step="1"
              className={errors.month ? 'border-red-500' : ''}
            />
            {errors.month && (
              <p className="flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" /> {errors.month}
              </p>
            )}
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Gender</label>
          <select
            value={petData.gender}
            onChange={(e) => setPetData(prev => ({ ...prev, gender: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && (
            <p className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" /> {errors.gender}
            </p>
          )}
        </div>

        {/* Image Upload - Only for Match type */}
        {userType === 'match' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Pet Photo (Required)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {petImage ? (
                <div className="space-y-2">
                  <div className="relative h-40 w-full rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={petImage}
                      alt="Pet preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => setPetImage('')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove Photo
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-600">Click to upload or drag & drop</span>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {errors.image && (
              <p className="flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" /> {errors.image}
              </p>
            )}
          </div>
        )}
      </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          Create Account
        </Button>
      </div>
    </form>
  );
}
