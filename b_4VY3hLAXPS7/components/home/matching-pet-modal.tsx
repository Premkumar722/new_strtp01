'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { dogBreeds, catBreeds } from '@/utils/mock-data';

interface MatchingPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (petData: {
    name: string;
    species: string;
    breed: string;
    age: number;
    month: number;
    gender: string;
    image?: string;
  }) => void;
}

export function MatchingPetModal({ isOpen, onClose, onSubmit }: MatchingPetModalProps) {
  const [petData, setPetData] = useState({
    name: '',
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
    const newErrors: Record<string, string> = {};

    if (!petData.name.trim()) newErrors.name = 'Pet name is required';
    if (!petData.species) newErrors.species = 'Species is required';
    if (!petData.breed) newErrors.breed = 'Breed is required';
    if (!petData.age) newErrors.age = 'Age is required';
    else if (isNaN(Number(petData.age)) || Number(petData.age) < 0) newErrors.age = 'Age must be a valid number';
    if (!petData.month) newErrors.month = 'Month is required';
    else if (isNaN(Number(petData.month)) || Number(petData.month) < 0 || Number(petData.month) > 11) newErrors.month = 'Month must be between 0-11';
    if (!petData.gender) newErrors.gender = 'Gender is required';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        name: petData.name,
        species: petData.species,
        breed: petData.breed,
        age: Number(petData.age),
        month: Number(petData.month),
        gender: petData.gender,
        image: petImage,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Add Your Pet Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Pet Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Pet Name</label>
            <Input
              type="text"
              placeholder="Enter your pet's name"
              value={petData.name}
              onChange={(e) => {
                setPetData(prev => ({ ...prev, name: e.target.value }));
                setErrors(prev => ({ ...prev, name: '' }));
              }}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" /> {errors.name}
              </p>
            )}
          </div>

          {/* Species */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Species</label>
            <select
              value={petData.species}
              onChange={(e) => {
                setPetData(prev => ({
                  ...prev,
                  species: e.target.value,
                  breed: '',
                }));
                setErrors(prev => ({ ...prev, species: '' }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Species</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Bird">Bird</option>
            </select>
            {errors.species && (
              <p className="flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" /> {errors.species}
              </p>
            )}
          </div>

          {/* Breed */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Breed</label>
            <select
              value={petData.breed}
              onChange={(e) => {
                setPetData(prev => ({ ...prev, breed: e.target.value }));
                setErrors(prev => ({ ...prev, breed: '' }));
              }}
              disabled={!petData.species}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
            >
              <option value="">Select Breed</option>
              {getBreeds().map(breed => (
                <option key={breed} value={breed}>{breed}</option>
              ))}
            </select>
            {errors.breed && (
              <p className="flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" /> {errors.breed}
              </p>
            )}
          </div>

          {/* Age */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Age (Years)</label>
              <Input
                type="number"
                placeholder="Age"
                value={petData.age}
                onChange={(e) => {
                  setPetData(prev => ({ ...prev, age: e.target.value }));
                  setErrors(prev => ({ ...prev, age: '' }));
                }}
                min="0"
                className="text-sm"
              />
              {errors.age && (
                <p className="text-red-500 text-xs"><AlertCircle className="w-3 h-3 inline" /> {errors.age}</p>
              )}
            </div>

            {/* Month */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Month</label>
              <Input
                type="number"
                placeholder="0-11"
                value={petData.month}
                onChange={(e) => {
                  setPetData(prev => ({ ...prev, month: e.target.value }));
                  setErrors(prev => ({ ...prev, month: '' }));
                }}
                min="0"
                max="11"
                className="text-sm"
              />
              {errors.month && (
                <p className="text-red-500 text-xs"><AlertCircle className="w-3 h-3 inline" /> {errors.month}</p>
              )}
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Gender</label>
            <select
              value={petData.gender}
              onChange={(e) => {
                setPetData(prev => ({ ...prev, gender: e.target.value }));
                setErrors(prev => ({ ...prev, gender: '' }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && (
              <p className="flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" /> {errors.gender}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Pet Photo</label>
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
                  <span className="text-sm text-gray-600">Click to upload photo</span>
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

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Save Pet Details
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
