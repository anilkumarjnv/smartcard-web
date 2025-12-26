'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/molecules/Button';
import { createClient } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { LogOut, User as UserIcon, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

interface NavbarProps {
  variant?: 'default' | 'dashboard';
  isLandingPage?: boolean;
}

export function Navbar({ variant = 'default', isLandingPage = false }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (variant === 'dashboard') {
    return (
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/mycards" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-neutral-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">S</span>
              </div>
              <span className="text-lg font-semibold text-neutral-900 tracking-tight hidden sm:block">SmartShare</span>
            </Link>

            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-foreground">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                  <div className="w-9 h-9 bg-neutral-900 rounded-full flex items-center justify-center text-white overflow-hidden">
                    {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                      <img
                        src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                        alt={user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {(user.user_metadata?.full_name || user.email?.split('@')[0] || 'U').substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-20">
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-100 transition-colors text-neutral-900"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Settings</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-neutral-100 transition-colors text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-neutral-900 dark:bg-white rounded-lg flex items-center justify-center">
            <span className="text-white dark:text-neutral-900 text-lg font-bold">S</span>
          </div>
          <span className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">SmartShare</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle - Only on Landing Page */}
          {isLandingPage && mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-neutral-900 dark:text-neutral-100" strokeWidth={2} />
              ) : (
                <Moon className="w-4 h-4 text-neutral-900 dark:text-neutral-100" strokeWidth={2} />
              )}
            </button>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-foreground dark:text-white">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                  <span className="text-xs text-muted-foreground dark:text-neutral-400">{user.email}</span>
                </div>
                <div className="w-9 h-9 bg-neutral-900 dark:bg-neutral-100 rounded-full flex items-center justify-center text-white dark:text-neutral-900 overflow-hidden">
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <img
                      src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                      alt={user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium">
                      {(user.user_metadata?.full_name || user.email?.split('@')[0] || 'U').substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                    <Link
                      href="/mycards"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <UserIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">My Cards</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <button className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-4 py-2 text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

