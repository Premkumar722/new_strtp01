'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/auth-context';
import { RegistrationStep1 } from '@/components/forms/registration-step1';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const isSeller = searchParams.get('type') === 'seller';

  const handleRegistrationComplete = (data: {
    name: string;
    zipcode: string;
    area: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
  }) => {
    register({
      ...data,
      userType: isSeller ? 'sell' : 'buyer',
    });
    router.push(isSeller ? '/sell-pet' : '/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl">🐾</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Welcome to PetMatch</h1>
          <p className="text-gray-600">Join our community of pet lovers</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <RegistrationStep1 onNext={handleRegistrationComplete} />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-3">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
              Login here
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
