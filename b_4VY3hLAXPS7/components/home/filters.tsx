'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, ChevronDown } from 'lucide-react';
import { species as speciesList, dogBreeds, catBreeds } from '@/utils/mock-data';

interface FiltersProps {
  activeTab: 'matching' | 'marketplace';
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  species: string;
  breed: string;
  age: string;
  gender: string;
  price: string;
}

export function Filters({ activeTab, onFiltersChange }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterState>({
    species: '',
    breed: '',
    age: '',
    gender: '',
    price: '',
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    species: '',
    breed: '',
    age: '',
    gender: '',
    price: '',
  });

  const handleSpeciesChange = (newSpecies: string) => {
    const updatedFilters = {
      ...tempFilters,
      species: newSpecies,
      breed: '', // Reset breed when species changes
    };
    setTempFilters(updatedFilters);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const updatedFilters = { ...tempFilters, [key]: value };
    setTempFilters(updatedFilters);
  };

  const applyFilters = () => {
    setAppliedFilters(tempFilters);
    onFiltersChange(tempFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      species: '',
      breed: '',
      age: '',
      gender: '',
      price: '',
    };
    setTempFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getBreeds = () => {
    if (tempFilters.species === 'Dog') return dogBreeds;
    if (tempFilters.species === 'Cat') return catBreeds;
    return [];
  };

  const hasActiveFilters = Object.values(appliedFilters).some(value => value !== '');

  return (
    <div className="mb-8">
      {/* Filter Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="mb-4 flex items-center gap-2"
      >
        <span>Filters {hasActiveFilters && `(${Object.values(appliedFilters).filter(v => v).length})`}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Filter Panel */}
      {isOpen && (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Filter Pets</h3>
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* Species Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Species</label>
            <select
              value={tempFilters.species}
              onChange={(e) => handleSpeciesChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Species</option>
              {speciesList.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </div>

          {/* Breed Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Breed</label>
            <select
              value={tempFilters.breed}
              onChange={(e) => handleFilterChange('breed', e.target.value)}
              disabled={!tempFilters.species}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">All Breeds</option>
              {getBreeds().map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>

          {/* Age Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Age (years)</label>
            <Input
              type="number"
              placeholder="Max age"
              value={tempFilters.age}
              onChange={(e) => handleFilterChange('age', e.target.value)}
              min="0"
              className="text-sm"
            />
          </div>

          {/* Gender Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <select
              value={tempFilters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Price Filter - Only for Marketplace */}
          {activeTab === 'marketplace' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Max Price (₹)</label>
              <Input
                type="number"
                placeholder="Max price"
                value={tempFilters.price}
                onChange={(e) => handleFilterChange('price', e.target.value)}
                min="0"
                className="text-sm"
              />
            </div>
          )}
        </div>

        {/* Apply and Cancel Buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            onClick={applyFilters}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Apply Filters
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
      )}
    </div>
  );
}
