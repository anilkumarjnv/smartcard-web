'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, CreditCard, AlertTriangle, LogOut } from 'lucide-react';
import { Input } from '@/components/molecules/Input';
import { Button } from '@/components/molecules/Button';
import { Modal } from '@/components/molecules/Modal';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface SettingsTabProps {
  onLogout?: () => void;
}

export function SettingsTab({ onLogout }: SettingsTabProps) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        setName(user.user_metadata?.name || '');
        setRole(user.user_metadata?.role || 'professional');
      }
    };
    loadUserData();
  }, [supabase]);

  const handleRoleChange = async (newRole: string) => {
    if (newRole === role) return;

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase.rpc('update_user_role', {
        user_id: user.id,
        new_role: newRole
      });

      if (error) throw error;

      // Update local state and refresh session
      setRole(newRole);
      await supabase.auth.refreshSession();

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
      const { error } = await supabase.auth.updateUser({
        data: { name }
      });

      if (error) throw error;

      setSaveMessage('✓ Profile updated successfully');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage('✗ Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Note: Supabase doesn't provide a direct user deletion API for security reasons
      // This would typically be handled by a backend service
      console.log('Account deletion requested');
      setShowDeleteModal(false);

      // Sign out after deletion request
      await supabase.auth.signOut();
      if (onLogout) {
        onLogout();
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Error deleting account:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (onLogout) {
      onLogout();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
      <h3 className="text-2xl font-bold mb-8">Settings</h3>

      <div className="space-y-8">
        {saveMessage && (
          <div className={`p-4 rounded-2xl ${saveMessage.includes('✓')
            ? 'bg-green-50 text-green-700'
            : 'bg-red-50 text-red-700'
            }`}>
            {saveMessage}
          </div>
        )}

        <div>
          <h4 className="text-lg font-semibold mb-4">Profile Information</h4>
          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-5 h-5" />}
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

        <div className="border-t border-gray-200 pt-8">
          <h4 className="text-lg font-semibold mb-4">Role & Experience</h4>
          <div className="p-6 bg-gray-50 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-medium">Current Role</p>
                <p className="text-sm text-gray-600 mt-1">Determines your card layout and fields</p>
              </div>
              <span className={`px-4 py-2 rounded-xl text-sm font-medium ${(role || 'professional') === 'student'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-indigo-100 text-indigo-700'
                }`}>
                {(role || 'Professional').charAt(0).toUpperCase() + (role || 'professional').slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRoleChange('student')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${role === 'student'
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                  : 'border-gray-200 hover:border-blue-200 hover:bg-white'
                  }`}
              >
                <div className="font-semibold mb-1 text-blue-900">Student</div>
                <div className="text-xs text-blue-700">Academic focus, projects, GPA</div>
              </button>

              <button
                onClick={() => handleRoleChange('professional')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${role === 'professional'
                  ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                  : 'border-gray-200 hover:border-indigo-200 hover:bg-white'
                  }`}
              >
                <div className="font-semibold mb-1 text-indigo-900">Professional</div>
                <div className="text-xs text-indigo-700">Career focus, experience, portfolio</div>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h4 className="text-lg font-semibold mb-4">Subscription</h4>
          <div className="p-6 bg-gray-50 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium">Free Plan</p>
                <p className="text-sm text-gray-600 mt-1">Limited features</p>
              </div>
              <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-sm font-medium">Current</span>
            </div>
            <Button variant="primary" fullWidth>
              <CreditCard className="w-5 h-5 mr-2" />
              {role === 'student' ? 'Upgrade to Student Pro ($3/mo)' : 'Upgrade to Pro ($9/mo)'}
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h4 className="text-lg font-semibold mb-4">Password</h4>
          <Button variant="outline" onClick={() => {
            // This would open a password change modal or redirect to a password change page
            alert('Password change functionality would be implemented here');
          }}>
            Change Password
          </Button>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h4 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h4>
          <div className="p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="font-medium mb-2">Delete Account</p>
                <p className="text-sm text-gray-600 mb-4">
                  Once you delete your account, there is no going back. All your data will be permanently removed.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(true)}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
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

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h4 className="text-lg font-semibold mb-2">Are you sure?</h4>
          <p className="text-gray-600 mb-6">
            This action cannot be undone. All your data will be permanently deleted.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              fullWidth
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div >
  );
}

