'use client';
import React from 'react';
import Image from 'next/image';

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  showImageColumn?: boolean;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
  showImageColumn = true,
}) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Image/Logo column - hidden on mobile, shown on desktop */}
      {showImageColumn && (
        <div className="hidden md:flex md:w-1/2 bg-primary p-10 flex-col justify-center items-center text-white">
          <div className="mb-8">
            {/* APTIS Logo */}
            <div className="text-center">
              <h1 className="text-6xl font-bold tracking-wider text-white drop-shadow-lg">
                APTIS
              </h1>
              <div className="w-24 h-1 bg-white/60 mx-auto mt-2 rounded-full"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Learning APTIS Platform</h1>
          <p className="text-lg opacity-90 max-w-md text-center">
            Join our community of learners and educators to explore a world of knowledge.
          </p>
        </div>
      )}

      {/* Form column */}
      <div className={`flex-1 flex items-center justify-center p-6 ${!showImageColumn ? 'md:w-full' : 'md:w-1/2'}`}>
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
            {description && <p className="mt-2 text-gray-600">{description}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 