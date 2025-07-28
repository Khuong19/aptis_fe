'use client';

import React from 'react';
import ToastContainer from '../components/ui/ToastContainer';

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
