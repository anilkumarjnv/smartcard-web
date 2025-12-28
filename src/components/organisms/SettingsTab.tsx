'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, CreditCard, LogOut, Check } from 'lucide-react';
import { Input } from '@/components/molecules/Input';
import { Button } from '@/components/molecules/Button';
import { apiClient } from '@/lib/apiClient';
import { signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';

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
    price: '₹199',
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
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative rounded-xl p-6 ${plan.featured
                  ? 'bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-white shadow-lg'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800'
                  }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-semibold px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 whitespace-nowrap">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Plan name */}
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{plan.name}</h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    {plan.originalPrice && (
                      <span className="text-sm text-neutral-400 dark:text-neutral-500 line-through">
                        {plan.originalPrice}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-neutral-900 dark:text-white">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">/ {plan.period}</span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-neutral-900 dark:text-white flex-shrink-0" strokeWidth={2} />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    disabled={plan.isCurrent}
                    className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${plan.isCurrent
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-default'
                      : plan.featured
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 active:scale-95'
                        : 'bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                      }`}
                  >
                    {plan.isCurrent ? 'Current Plan' : 'Upgrade'}
                  </button>
                </div>
              </div>
            ))}
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
    </div >
  );
}

