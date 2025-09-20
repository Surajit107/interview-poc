import { SignupForm } from '@/components/forms/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Retailer Panel</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create your retailer account
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
