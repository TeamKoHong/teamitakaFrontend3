import React, { useState } from 'react';
import { SmsAuthForm } from '../components/auth/SmsAuthForm';

const SignupPageExample: React.FC = () => {
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);

    const handleVerificationSuccess = () => {
        console.log('Phone verified successfully!');
        setIsPhoneVerified(true);
    };

    const handleSignup = () => {
        alert('Signup Process Initiated!');
        // Proceed with signup logic...
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    We need to verify your phone number first.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-6">

                    {/* SMS Authentication Component */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            Step 1: Phone Verification
                        </h3>
                        <SmsAuthForm onVerificationSuccess={handleVerificationSuccess} />
                    </div>

                    {/* Registration Form (Mock) */}
                    <div className={!isPhoneVerified ? 'opacity-50 pointer-events-none filter blur-[1px] transition-all' : 'transition-all'}>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            Step 2: Account Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email address</label>
                                <input type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="you@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSignup}
                        disabled={!isPhoneVerified}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${isPhoneVerified
                                ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                : 'bg-gray-300 cursor-not-allowed'}`}
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignupPageExample;
