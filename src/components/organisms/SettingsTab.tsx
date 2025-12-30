'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, CreditCard, LogOut, Check, MessageSquare } from 'lucide-react';
import { Input } from '@/components/molecules/Input';
import { Button } from '@/components/molecules/Button';
import { FeedbackModal } from '@/components/organisms/FeedbackModal';
import { apiClient } from '@/lib/apiClient';
import { signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import type { Feedback } from '@/lib/api/types';

interface SettingsTabProps {
  onLogout?: () => void;
}

const plans = [
  {
    name: 'The Basics',
    price: '₹0',
    featured: false,
    features: [
      'Profile photo',
      '3 links',
      'Default theme',
      'QR code generation',
    ],
    isCurrent: true,
  },
  {
    name: 'Professional',
    price: '₹299',
    originalPrice: '₹999',
    period: 'lifetime',
    badge: 'Most Popular',
    featured: true,
    features: [
      'Portfolio section',
      'Analytics dashboard',
      'Custom QR codes',
      'No watermark',
      'All premium themes',
      'Priority support',
    ],
    isCurrent: false,
  },
];

export function SettingsTab({ onLogout }: SettingsTabProps) {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState<Feedback[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await apiClient.get<any>('/api/v1/auth/me');
        if (user) {
          setEmail(user.email || '');
          // Backend returns flattened user object with metadata keys spread
          setName(user.name || user.full_name || '');
          setRole(user.role || 'professional');
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };
    loadUserData();
  }, []);

  // Load feedback history
  const loadFeedbackHistory = async () => {
    setLoadingFeedback(true);
    try {
      const feedback = await apiClient.get<Feedback[]>('/api/v1/feedback');
      setFeedbackHistory(feedback || []);
    } catch (error) {
      console.error('Failed to load feedback:', error);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleRoleChange = async (newRole: string) => {
    if (newRole === role) return;

    setIsSaving(true);
    try {
      await apiClient.patch('/api/v1/auth/me/role', { role: newRole });

      // Update local state and refresh session
      setRole(newRole);

      // We might need to refresh local token if claims changed, but reloading page handles app state sync
      // signOut() then re-login is ideal for pure JWT claim update, but DB role update is sufficient for API checks if API checks DB.
      // TopBar checks API.

      setSaveMessage(`✓ Role updated to ${newRole}`);
      setTimeout(() => setSaveMessage(''), 3000);

      // Force reload to update UI components that depend on role
      window.location.reload();
    } catch (err) {
      console.error('Error updating role:', err);
      setSaveMessage('✗ Failed to update role');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      await apiClient.patch('/api/v1/auth/me', { name });

      setSaveMessage('✓ Profile updated successfully');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage('✗ Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(); // Clears local session (using lib/auth)
      await apiClient.post('/api/v1/auth/logout', {}); // Notify backend
    } catch (error) {
      console.error('Logout error:', error);
    }

    if (onLogout) {
      onLogout();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="bg-white dark:bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm">
      <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-neutral-900 dark:text-white">Settings</h3>

      <div className="space-y-6 sm:space-y-8">
        {saveMessage && (
          <div className={`p-4 rounded-2xl ${saveMessage.includes('✓')
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }`}>
            {saveMessage}
          </div>
        )}

        <div>
          <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-neutral-900 dark:text-white">Profile Information</h4>
          <div className="space-y-3 sm:space-y-4">
            <Input
              label="Full Name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-5 h-5 text-muted-foreground" />}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              disabled
            />
            <p className="text-xs text-gray-500 px-1">Email cannot be changed for security reasons</p>
            <Button onClick={handleSaveProfile} isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-neutral-800 pt-6 sm:pt-8">
          <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-neutral-900 dark:text-white">Role & Experience</h4>
          <div className="p-4 sm:p-6 bg-gray-50 dark:bg-neutral-800/50 rounded-xl sm:rounded-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">Current Role</p>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">Determines your card layout and fields</p>
              </div>
              <span className={`px-4 py-2 rounded-xl text-sm font-medium ${(role || 'professional') === 'student'
                ? 'bg-neutral-100 text-neutral-700'
                : 'bg-neutral-100 text-neutral-700'
                }`}>
                {(role || 'Professional').charAt(0).toUpperCase() + (role || 'professional').slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRoleChange('student')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${role === 'student'
                  ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900 dark:bg-neutral-800 dark:border-neutral-100 dark:ring-neutral-100'
                  : 'border-gray-200 hover:border-neutral-200 hover:bg-white dark:border-neutral-700 dark:hover:bg-neutral-900 dark:hover:border-neutral-500'
                  }`}
              >
                <div className="font-semibold mb-1 text-neutral-900 dark:text-white">Student</div>
                <div className="text-xs text-neutral-700 dark:text-neutral-300">Academic focus, projects, GPA</div>
              </button>

              <button
                onClick={() => handleRoleChange('professional')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${role === 'professional'
                  ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900 dark:bg-neutral-800 dark:border-neutral-100 dark:ring-neutral-100'
                  : 'border-gray-200 hover:border-neutral-200 hover:bg-white dark:border-neutral-700 dark:hover:bg-neutral-900 dark:hover:border-neutral-500'
                  }`}
              >
                <div className="font-semibold mb-1 text-neutral-900 dark:text-white">Professional</div>
                <div className="text-xs text-neutral-700 dark:text-neutral-300">Career focus, experience, portfolio</div>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-neutral-800 pt-8">
          <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-neutral-900 dark:text-white">Subscription</h4>
          <div className="p-6 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <CreditCard className="w-6 h-6 text-yellow-700 dark:text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">Free Public Beta</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed max-w-2xl">
                  You are currently using the <span className="font-medium text-neutral-900 dark:text-white">Professional Plan</span> features for free as part of our beta program.
                  Enjoy full access to analytics, custom domains (coming soon), and premium themes without any charge.
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-500 font-medium">
                  <Check className="w-4 h-4" />
                  <span>No credit card required during beta</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-neutral-800 pt-6 sm:pt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white">Share Your Feedback</h4>
              <p className="text-sm text-muted-foreground mt-1">Help us improve by reporting bugs or suggesting features</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setShowFeedbackModal(true);
                if (feedbackHistory.length === 0) {
                  loadFeedbackHistory();
                }
              }}
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Give Feedback</span>
            </Button>
          </div>

          {/* Feedback History */}
          <div className="mt-4">
            <button
              onClick={loadFeedbackHistory}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
            >
              {feedbackHistory.length > 0 ? 'Refresh feedback history' : 'View your feedback history'}
            </button>

            {loadingFeedback ? (
              <div className="p-6 text-center text-muted-foreground">
                <div className="w-8 h-8 border-4 border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-neutral-100 rounded-full animate-spin mx-auto mb-2"></div>
                Loading feedback...
              </div>
            ) : feedbackHistory.length > 0 ? (
              <div className="space-y-3">
                {feedbackHistory.map((feedback) => {
                  const typeConfig = {
                    bug: { label: 'Bug Report', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
                    feature: { label: 'Feature Request', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' },
                    improvement: { label: 'Improvement', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
                    general: { label: 'General', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
                  };

                  const config = typeConfig[feedback.type];

                  return (
                    <div
                      key={feedback.id}
                      className="p-4 bg-muted/50 dark:bg-neutral-800/50 rounded-xl border border-border"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${config.color}`}>
                          {config.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(feedback.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mt-2">{feedback.message}</p>
                      {feedback.rating && (
                        <div className="flex items-center gap-1 mt-2">
                          {Array.from({ length: feedback.rating }).map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">({feedback.rating}/5)</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-neutral-800 pt-8">
          <Button
            variant="outline"
            onClick={handleLogout}
            fullWidth
            className="border-gray-300"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          loadFeedbackHistory(); // Reload feedback after submission
        }}
        trigger="settings"
      />
    </div >
  );
}

