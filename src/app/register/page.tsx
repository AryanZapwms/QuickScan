import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="w-full max-w-md px-4 ">
        <Link 
          href="/" 
          className="inline-flex items-center border-1 rounded-xl px-3 py-2 text-black hover:text-white hover:bg-black transition-colors duration-300 mb-8"
        >
          <FiArrowLeft className="mr-2 " />
          Back to Home
        </Link>
        
        <RegisterForm />
      </div>
    </div>
  );
}