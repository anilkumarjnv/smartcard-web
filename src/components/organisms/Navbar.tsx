'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/molecules/Button';

interface NavbarProps {
  variant?: 'default' | 'dashboard';
}

export function Navbar({ variant = 'default' }: NavbarProps) {
  if (variant === 'dashboard') {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/mycards" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">S</span>
              </div>
              <span className="text-xl font-semibold hidden sm:block">SmartShare</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white cursor-pointer">
                <span className="text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl font-bold">S</span>
          </div>
          <span className="text-xl font-semibold">SmartShare</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button>
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

