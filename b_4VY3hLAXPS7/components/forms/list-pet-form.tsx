'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Upload, AlertCircle, MapPin, Loader2 } from 'lucide-react';
import { detectUserLocation } from '@/utils/location-service';
import { species, dogBreeds, catBreeds } from '@/utils/mock-data';

interface ListPetFormProps {
  onSubmit?: (data: any) => void;
}

export function ListPetForm({ onSubmit }: ListPetFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    petName: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    area: '',
    description: '',
    price: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetectLocation = async () => {
    setDetectingLocation(true);
    try {
      const location = await detectUserLocation();
      if (location) {
        setFormData(prev => ({ ...prev, area: location.city }));
      } else {
        setErrors(prev => ({ ...prev, area: 'Could not detect location. Please enter manually.' }));
      }
    } catch (error) {
      console.error('Location detection failed:', error);
      setErrors(prev => ({ ...prev, area: 'Location detection failed. Please enter manually.' }));
    } finally {
      setDetectingLocation(false);
    }
  };

  const getBreeds = () => {
    if (formData.species === 'Dog') return dogBreeds;
    if (formData.species === 'Cat') return catBreeds;
    return [];
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.petName.trim()) newErrors.petName = 'Pet name is required';
    if (!formData.species) newErrors.species = 'Species is required';
    if (!formData.breed) newErrors.breed = 'Breed is required';
    if (!formData.age) newErrors.age = 'Age is required';
    else if (isNaN(Number(formData.age)) || Number(formData.age) < 0) newErrors.age = 'Age must be valid';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.area.trim()) newErrors.area = 'Area is required';
    if (!preview) newErrors.image = 'Pet image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      if (onSubmit) {
        onSubmit(formData);
      }
      // Show success message
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ petName: '', species: '', breed: '', age: '', gender: '', area: '', description: '', price: '' });
        setPreview('');
        setFileName('');
        setSubmitted(false);
      }, 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">List Your Pet</h2>
        <p className="text-gray-600">Fill in the details to get started</p>
      </div>

      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-center">
          ✓ Pet listing created successfully!
        </div>
      )}

      {/* Image Upload Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold">Pet Image</label>
        
        {preview ? (
          <div className="space-y-3">
            <div className="relative h-64 w-full rounded-lg overflow-hidden bg-gray-200">
              <Image
                src={preview}
                alt="Pet preview"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex-1"
              >
                Change Image
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setPreview('');
                  setFileName('');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                variant="outline"
                className="flex-1"
              >
                Remove Image
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center cursor-pointer hover:bg-purple-50 transition-colors"
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="font-medium text-gray-700 mb-1">Upload pet image</p>
            <p className="text-sm text-gray-500">JPG, PNG up to 5MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {errors.image && (
          <p className="flex items-center gap-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" /> {errors.image}
          </p>
        )}
      </div>

      {/* Pet Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pet Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Pet Name</label>
          <Input
            type="text"
            placeholder="e.g., Buddy"
            value={formData.petName}
            onChange={(e) => setFormData(prev => ({ ...prev, petName: e.target.value }))}
            className={errors.petName ? 'border-red-500' : ''}
          />
          {errors.petName && (
            <p className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" /> {errors.petName}
            </p>
          )}
        </div>

        {/* Species */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Species</label>
          <select
            value={formData.species}
            onChange={(e) => setFormData(prev => ({ ...prev, species: e.target.value, breed: '' }))}
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

        {/* Breed */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Breed</label>
          {formData.species && getBreeds().length > 0 ? (
            <select
              value={formData.breed}
              onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
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
              value={formData.breed}
              onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
            />
          )}
          {errors.breed && (
            <p className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" /> {errors.breed}
            </p>
          )}
        </div>

        {/* Age */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Age (years)</label>
          <Input
            type="number"
            placeholder="e.g., 3"
            value={formData.age}
            onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
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

        {/* Gender */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
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

        {/* Area with Auto-Detect */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Area / Location</label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter your area"
              value={formData.area}
              onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
              className={errors.area ? 'border-red-500' : ''}
            />
            <Button
              type="button"
              onClick={handleDetectLocation}
              disabled={detectingLocation}
              variant="outline"
              className="whitespace-nowrap"
            >
              {detectingLocation ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  Detecting...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 mr-1" />
                  Auto-Detect
                </>
              )}
            </Button>
          </div>
          {errors.area && (
            <p className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" /> {errors.area}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Price (Optional)</label>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">₹</span>
            <Input
              type="number"
              placeholder="Enter price"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Description</label>
        <textarea
          placeholder="Tell us about your pet (temperament, health, training, etc.)"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-2 h-auto"
      >
        List Pet for Sale
      </Button>
    </form>
  );
}
