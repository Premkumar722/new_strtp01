'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpVerified, setPhoneOtpVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  if (isLoggedIn) {
    router.push('/');
  }

  const handleSendPhoneOtp = async () => {
    setErrors({});
    if (!phone.trim() || phone.length !== 10) {
      setErrors({ phone: 'Phone must be 10 digits' });
      return;
    }
    setIsLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setPhoneOtpSent(true);
      setIsLoading(false);
    }, 500);
  };

  const handleVerifyPhoneOtp = () => {
    setErrors({});
    if (!phoneOtp.trim() || phoneOtp.length !== 4) {
      setErrors({ phoneOtp: 'OTP must be 4 digits' });
      return;
    }
    // Simulate OTP verification
    setPhoneOtpVerified(true);
  };

  const handleSendEmailOtp = async () => {
    setErrors({});
    if (!email.trim() || !email.includes('@')) {
      setErrors({ email: 'Valid email is required' });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setEmailOtpSent(true);
      setIsLoading(false);
    }, 500);
  };

  const handleVerifyEmailOtp = () => {
    setErrors({});
    if (!emailOtp.trim() || emailOtp.length !== 4) {
      setErrors({ emailOtp: 'OTP must be 4 digits' });
      return;
    }
    setEmailOtpVerified(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    let credential = '';
    if (loginMethod === 'phone' && !phoneOtpVerified) {
      setErrors({ phone: 'Please verify your phone OTP' });
      return;
    }
    if (loginMethod === 'email' && !emailOtpVerified) {
      setErrors({ email: 'Please verify your email OTP' });
      return;
    }

    setIsLoading(true);
    credential = loginMethod === 'phone' ? phone : email;

    // Retrieve user from localStorage
    const storedUser = localStorage.getItem('pet-platform-user');
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if ((loginMethod === 'phone' && user.phone === phone) || (loginMethod === 'email' && user.email === email)) {
          login(user);
          router.push('/');
        } else {
          setErrors({ [loginMethod]: `No account found with this ${loginMethod}. Please register first.` });
        }
      } catch {
        setErrors({ [loginMethod]: 'Error retrieving account. Please try again.' });
      }
    } else {
      setErrors({ [loginMethod]: `No account found. Please register first.` });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl">🐾</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-600">Login to your PetMatch account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Login Method Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setLoginMethod('phone');
                setEmail('');
                setEmailOtp('');
                setEmailOtpSent(false);
                setEmailOtpVerified(false);
                setErrors({});
              }}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                loginMethod === 'phone'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Phone
            </button>
            <button
              onClick={() => {
                setLoginMethod('email');
                setPhone('');
                setPhoneOtp('');
                setPhoneOtpSent(false);
                setPhoneOtpVerified(false);
                setErrors({});
              }}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                loginMethod === 'email'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Email
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Login */}
            {loginMethod === 'phone' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Mobile Number (with OTP)</label>
                  <div className="flex gap-2">
                    <Input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                        setErrors(prev => ({ ...prev, phone: '' }));
                      }}
                      disabled={phoneOtpVerified}
                      maxLength={10}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    <Button
                      type="button"
                      onClick={handleSendPhoneOtp}
                      disabled={phoneOtpSent || phoneOtpVerified || isLoading}
                      variant="outline"
                      className="whitespace-nowrap"
                    >
                      {phoneOtpVerified ? 'Verified ✓' : phoneOtpSent ? 'Resend' : 'Send OTP'}
                    </Button>
                  </div>
                  {errors.phone && (
                    <p className="flex items-center gap-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" /> {errors.phone}
                    </p>
                  )}
                </div>

                {phoneOtpSent && !phoneOtpVerified && (
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="4-digit OTP"
                      value={phoneOtp}
                      onChange={(e) => {
                        setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 4));
                        setErrors(prev => ({ ...prev, phoneOtp: '' }));
                      }}
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

                {phoneOtpVerified && (
                  <p className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Phone verified
                  </p>
                )}

                {errors.phoneOtp && (
                  <p className="flex items-center gap-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" /> {errors.phoneOtp}
                  </p>
                )}
              </div>
            )}

            {/* Email Login */}
            {loginMethod === 'email' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Email (with OTP)</label>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors(prev => ({ ...prev, email: '' }));
                      }}
                      disabled={emailOtpVerified}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    <Button
                      type="button"
                      onClick={handleSendEmailOtp}
                      disabled={emailOtpSent || emailOtpVerified || isLoading}
                      variant="outline"
                      className="whitespace-nowrap"
                    >
                      {emailOtpVerified ? 'Verified ✓' : emailOtpSent ? 'Resend' : 'Send OTP'}
                    </Button>
                  </div>
                  {errors.email && (
                    <p className="flex items-center gap-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" /> {errors.email}
                    </p>
                  )}
                </div>

                {emailOtpSent && !emailOtpVerified && (
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="4-digit OTP"
                      value={emailOtp}
                      onChange={(e) => {
                        setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 4));
                        setErrors(prev => ({ ...prev, emailOtp: '' }));
                      }}
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

                {emailOtpVerified && (
                  <p className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Email verified
                  </p>
                )}

                {errors.emailOtp && (
                  <p className="flex items-center gap-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" /> {errors.emailOtp}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={
                isLoading ||
                (loginMethod === 'phone' ? !phoneOtpVerified : !emailOtpVerified)
              }
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 rounded-lg"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-3">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-purple-600 hover:text-purple-700 font-semibold">
              Sign up here
            </Link>
          </p>
          <p className="text-gray-600 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Go back home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
