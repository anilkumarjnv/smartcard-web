'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { getAvailableRoles, UserRole } from '@/lib/roles';
import { Button } from '@/components/molecules/Button';
import { Check, GraduationCap, Briefcase } from 'lucide-react';

export default function OnboardingPage() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(false);
    const roles = getAvailableRoles();

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
    };

    const handleSubmit = async () => {
        if (!selectedRole) return;

        setLoading(true);
        try {
            // Update role via API
            await apiClient.patch('/api/v1/auth/me/role', { role: selectedRole });

            // Refresh the Supabase session to get updated user metadata
            // This is critical because the middleware checks user_metadata.role
            const supabase = (await import('@/lib/supabaseClient')).createClient();

            // Refresh session and verify the role is updated
            const { data, error } = await supabase.auth.refreshSession();

            if (error) {
                console.error('Error refreshing session:', error);
                throw new Error('Failed to refresh session after role update');
            }

            // Verify role is in the session (may take a moment to propagate)
            const updatedRole = data?.session?.user?.user_metadata?.role;
            if (!updatedRole) {
                console.warn('Role not yet in session, waiting...');
                // Wait a bit and try one more time
                await new Promise(resolve => setTimeout(resolve, 500));
                const { data: retryData } = await supabase.auth.refreshSession();
                const retryRole = retryData?.session?.user?.user_metadata?.role;

                if (!retryRole) {
                    console.error('Role still not in session after retry');
                    // Still navigate - role was updated in DB, session will catch up
                }
            }

            // Navigate to mycards - middleware will check the role
            router.push('/mycards');
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to update role. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4 md:p-6 py-8 sm:py-10">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-6 sm:mb-8 md:mb-12">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Welcome to SmartCard!</h1>
                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-2 sm:px-0">
                        To get started, please tell us how you plan to use SmartCard.
                        <br className="hidden sm:block" />
                        This helps us customize your experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            onClick={() => handleRoleSelect(role.id)}
                            className={`relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-1 cursor-pointer transition-all hover:border-primary hover:shadow-lg ${selectedRole === role.id
                                ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-md'
                                : 'border-border bg-card'
                                }`}
                        >
                            {selectedRole === role.id && (
                                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                </div>
                            )}

                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4 transition-colors ${role.id === 'student'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                }`}>
                                {role.id === 'student' ? <GraduationCap /> : <Briefcase />}
                            </div>

                            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-foreground">{role.name}</h3>
                            <p className="text-muted-foreground text-xs sm:text-sm">{role.description}</p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center">
                    <Button
                        size="lg"
                        onClick={handleSubmit}
                        disabled={!selectedRole || loading}
                        className="w-full sm:w-auto min-w-[200px]"
                    >
                        {loading ? 'Setting up...' : 'Continue'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
