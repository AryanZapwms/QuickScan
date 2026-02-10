'use client';

import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { toast } from 'react-hot-toast';

function LoginContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const reason = searchParams.get('reason');
    if (reason === 'booking') {
      toast.error("To create a booking, you must be logged in.", {
        duration: 5000,
        icon: '🔒',
      });
    }
  }, [searchParams]);

  return (
    <div className="w-full max-w-md px-4">
      <Link 
        href="/" 
        className="inline-flex items-center border-1 rounded-xl px-3 py-2 text-black hover:text-white hover:bg-black transition-colors duration-300 mb-8"
      >
        <FiArrowLeft className="mr-2" />
        Back to Home
      </Link>
      
      <LoginForm />
      
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          For demo: Use <strong>demo@quickscan.com</strong> / <strong>demo123</strong>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}