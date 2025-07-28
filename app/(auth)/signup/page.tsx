import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import SignUpForm from '../../components/auth/SignUpForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | Learning APTIS Platform',
  description: 'Create a new account to start learning',
};

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create Account"
      description="Join our learning APTIS platform today"
    >
      <SignUpForm />
    </AuthLayout>
  );
} 