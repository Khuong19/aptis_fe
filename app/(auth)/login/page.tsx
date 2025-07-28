import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log In | Learning APTIS Platform',
  description: 'Log in to access your learning account',
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      description="Log in to continue your learning journey"
    >
      <LoginForm />
    </AuthLayout>
  );
} 