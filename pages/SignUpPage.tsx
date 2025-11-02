import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Button, Input } from '../components/common';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { createProfile } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      createProfile({ name, email });
      window.location.hash = '#/onboarding';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Create Your Account</h2>
        <p className="text-center text-gray-500 mb-8">Join us to start planning your accessible adventures.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="name"
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Jane Doe"
          />
          <Input
            id="email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="jane.doe@example.com"
          />
          <div>
            <Button type="submit" className="w-full">
              Sign Up & Continue
            </Button>
          </div>
        </form>
         <p className="text-xs text-center text-gray-500 mt-6">
            Already have an account? <a href="#/" className="font-medium text-primary-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
