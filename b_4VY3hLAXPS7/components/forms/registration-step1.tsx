'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validatePhoneNumber, detectUserLocation, LocationDetails } from '@/utils/location-service';
import { AlertCircle, CheckCircle2, MapPin } from 'lucide-react';

interface RegistrationStep1Props {
  onNext: (data: {
    name: string;
    zipcode: string;
    area: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
  }) => void;
}

export function RegistrationStep1({ onNext }: RegistrationStep1Props) {
  const [formData, setFormData] = useState({
    name: '',
    zipcode: '',
    area: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
  });
  const [purpose, setPurpose] = useState('');
  const [otherPurpose, setOtherPurpose] = useState('');

  const [otpState, setOtpState] = useState({
    phoneOtpSent: false,
    phoneOtpVerified: false,
    emailOtpSent: false,
    emailOtpVerified: false,
    phoneOtp: '',
    emailOtp: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!validatePhoneNumber(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!formData.email.includes('@')) newErrors.email = 'Invalid email format';
    if (!purpose) newErrors.purpose = 'Please select a purpose';
    if (purpose === 'other' && !otherPurpose.trim()) newErrors.otherPurpose = 'Please describe your purpose';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDetectLocation = async () => {
    setIsLoading(true);
    try {
      if (!navigator.geolocation) {
        setErrors(prev => ({ ...prev, city: 'Geolocation not supported. Please enter city manually.' }));
        setIsLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          
          const location = await detectUserLocation();
          if (location) {
            setFormData(prev => ({
              ...prev,
              city: location.city,
              state: location.state,
              country: location.country,
            }));
            setLocationDetected(true);
            setErrors(prev => ({ ...prev, city: '', state: '', country: '' }));
          } else {
            setErrors(prev => ({ ...prev, city: 'Unable to detect location. Please enter city manually.' }));
          }
          setIsLoading(false);
        },
        () => {
          setErrors(prev => ({ ...prev, city: 'Unable to detect location. Please enter city manually.' }));
          setIsLoading(false);
        }
      );
    } catch (error) {
      setErrors(prev => ({ ...prev, city: 'Failed to detect location. Please try again.' }));
      setIsLoading(false);
    }
  };

  const handleSendPhoneOtp = async () => {
    if (!formData.phone.trim()) {
      setErrors(prev => ({ ...prev, phone: 'Phone is required' }));
      return;
    }
    if (!validatePhoneNumber(formData.phone)) {
      setErrors(prev => ({ ...prev, phone: 'Phone must be 10 digits' }));
      return;
    }
    setIsLoading(true);
    // Simulate OTP send
    setTimeout(() => {
      setOtpState(prev => ({ ...prev, phoneOtpSent: true }));
      setIsLoading(false);
    }, 1000);
  };

  const handleVerifyPhoneOtp = () => {
    if (otpState.phoneOtp.length !== 4) {
      setErrors(prev => ({ ...prev, phoneOtp: 'OTP must be 4 digits' }));
      return;
    }
    // Mock verification - in real app, verify with backend
    setOtpState(prev => ({ ...prev, phoneOtpVerified: true }));
    setErrors(prev => ({ ...prev, phoneOtp: '' }));
  };

  const handleSendEmailOtp = async () => {
    if (!formData.email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      return;
    }
    if (!formData.email.includes('@')) {
      setErrors(prev => ({ ...prev, email: 'Invalid email format' }));
      return;
    }
    setIsLoading(true);
    // Simulate OTP send
    setTimeout(() => {
      setOtpState(prev => ({ ...prev, emailOtpSent: true }));
      setIsLoading(false);
    }, 1000);
  };

  const handleVerifyEmailOtp = () => {
    if (otpState.emailOtp.length !== 4) {
      setErrors(prev => ({ ...prev, emailOtp: 'OTP must be 4 digits' }));
      return;
    }
    // Mock verification - in real app, verify with backend
    setOtpState(prev => ({ ...prev, emailOtpVerified: true }));
    setErrors(prev => ({ ...prev, emailOtp: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Owner Details</h2>
        <p className="text-gray-600">Step 1 of 2</p>
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Full Name</label>
        <Input
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, name: e.target.value }));
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

      {/* Location Detection / City */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">City</label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter your city"
            value={formData.city}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, city: e.target.value }));
              setErrors(prev => ({ ...prev, city: '' }));
            }}
            className={errors.city ? 'border-red-500' : ''}
          />
          <Button
            type="button"
            onClick={handleDetectLocation}
            disabled={isLoading || locationDetected}
            variant="outline"
            className="whitespace-nowrap"
          >
            {isLoading ? 'Detecting...' : locationDetected ? <MapPin className="w-4 h-4" /> : 'Detect'}
          </Button>
        </div>
        {errors.city && (
          <p className="flex items-center gap-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" /> {errors.city}
          </p>
        )}
      </div>

      {/* Auto-filled Location Details */}
      {locationDetected && (
        <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
          {coordinates && (
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-green-300">
              <div>
                <p className="text-xs text-gray-600 font-medium">Latitude</p>
                <p className="text-sm font-semibold">{coordinates.lat.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Longitude</p>
                <p className="text-sm font-semibold">{coordinates.lng.toFixed(4)}</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-600 font-medium">City</p>
              <p className="text-sm font-semibold">{formData.city}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">State</p>
              <p className="text-sm font-semibold">{formData.state}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-600 font-medium">Country</p>
              <p className="text-sm font-semibold">{formData.country}</p>
            </div>
          </div>
        </div>
      )}

      {/* Phone */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Phone</label>
        <Input
          type="tel"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, phone: e.target.value }));
            setErrors(prev => ({ ...prev, phone: '' }));
          }}
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && (
          <p className="flex items-center gap-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" /> {errors.phone}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Email</label>
        <Input
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, email: e.target.value }));
            setErrors(prev => ({ ...prev, email: '' }));
          }}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="flex items-center gap-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" /> {errors.email}
          </p>
        )}
      </div>

        {otpState.phoneOtpSent && !otpState.phoneOtpVerified && (
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="4-digit OTP"
              value={otpState.phoneOtp}
              onChange={(e) => setOtpState(prev => ({ ...prev, phoneOtp: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
              maxLength={4}
            />
            <Button
              type="button"
              onClick={handleVerifyPhoneOtp}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 whitespace-nowrap"
            >
              Verify OTP
            </Button>
          </div>
        )}

        {otpState.phoneOtpVerified && (
          <p className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" /> Phone verified
          </p>
        )}

        {errors.phone && (
          <p className="flex items-center gap-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" /> {errors.phone}
          </p>
        )}
      </div>

      {/* Email with OTP */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">Email (with OTP)</label>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, email: e.target.value }));
              setErrors(prev => ({ ...prev, email: '' }));
            }}
            disabled={otpState.emailOtpVerified}
            className={errors.email ? 'border-red-500' : ''}
          />
          <Button
            type="button"
            onClick={handleSendEmailOtp}
            disabled={otpState.emailOtpSent || otpState.emailOtpVerified || isLoading}
            variant="outline"
            className="whitespace-nowrap"
          >
            {otpState.emailOtpVerified ? 'Verified ✓' : otpState.emailOtpSent ? 'Resend' : 'Send OTP'}
          </Button>
        </div>

        {otpState.emailOtpSent && !otpState.emailOtpVerified && (
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="4-digit OTP"
              value={otpState.emailOtp}
              onChange={(e) => setOtpState(prev => ({ ...prev, emailOtp: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
              maxLength={4}
            />
            <Button
              type="button"
              onClick={handleVerifyEmailOtp}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 whitespace-nowrap"
            >
              Verify OTP
            </Button>
          </div>
        )}

        {otpState.emailOtpVerified && (
          <p className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" /> Email verified
          </p>
        )}

        {errors.email && (
          <p className="flex items-center gap-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" /> {errors.email}
          </p>
        )}
      </div>

      {/* Purpose of Creating Account */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">Purpose of Creating Account</label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all" 
            style={{ borderColor: purpose === 'buy' ? '#a855f7' : '#e5e7eb' }}>
            <input
              type="radio"
              name="purpose"
              value="buy"
              checked={purpose === 'buy'}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-4 h-4"
            />
            <span className="font-medium">To buy pet</span>
          </label>

          <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all"
            style={{ borderColor: purpose === 'match' ? '#a855f7' : '#e5e7eb' }}>
            <input
              type="radio"
              name="purpose"
              value="match"
              checked={purpose === 'match'}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-4 h-4"
            />
            <span className="font-medium">To match pet</span>
          </label>

          <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all"
            style={{ borderColor: purpose === 'other' ? '#a855f7' : '#e5e7eb' }}>
            <input
              type="radio"
              name="purpose"
              value="other"
              checked={purpose === 'other'}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-4 h-4"
            />
            <span className="font-medium">Other</span>
          </label>
        </div>

        {purpose === 'other' && (
                      <div className="hidden space-y-2">
            <label className="block text-sm font-medium">Please describe your purpose</label>
            <textarea
              placeholder="Tell us why you're creating an account..."
              value={otherPurpose}
              onChange={(e) => {
                setOtherPurpose(e.target.value);
                setErrors(prev => ({ ...prev, otherPurpose: '' }));
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.otherPurpose ? 'border-red-500' : 'border-gray-300'}`}
              rows={3}
            />
            {errors.otherPurpose && (
              <p className="flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" /> {errors.otherPurpose}
              </p>
            )}
          </div>
        )}

        {errors.purpose && (
          <p className="flex items-center gap-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" /> {errors.purpose}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!otpState.phoneOtpVerified || !otpState.emailOtpVerified}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        Create Account
      </Button>
    </form>
  );
}
