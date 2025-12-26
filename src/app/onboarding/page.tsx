'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
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
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('No user found');

            // Call the RPC function to update role in both profiles and auth.users
            const { error } = await supabase.rpc('update_user_role', {
                user_id: user.id,
                new_role: selectedRole
            });

            if (error) throw error;

            // Force refresh session to get new metadata
            await supabase.auth.refreshSession();

            router.push('/mycards');
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to update role. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-4">Welcome to SmartCard!</h1>
                    <p className="text-muted-foreground text-lg">
                        To get started, please tell us how you plan to use SmartCard.
                        <br />
                        This helps us customize your experience.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            onClick={() => handleRoleSelect(role.id)}
                            className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all hover:border-primary/50 hover:bg-accent/50 ${selectedRole === role.id
                                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                    : 'border-border bg-card'
                                }`}
                        >
                            {selectedRole === role.id && (
                                <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}

                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${role.id === 'student' ? 'bg-neutral-100 text-neutral-900' : 'bg-neutral-100 text-neutral-900'
                                }`}>
                                {role.id === 'student' ? <GraduationCap /> : <Briefcase />}
                            </div>

                            <h3 className="text-xl font-semibold mb-2">{role.name}</h3>
                            <p className="text-muted-foreground text-sm">{role.description}</p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center">
                    <Button
                        size="lg"
                        onClick={handleSubmit}
                        disabled={!selectedRole || loading}
                        className="w-full md:w-auto min-w-[200px]"
                    >
                        {loading ? 'Setting up...' : 'Continue'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
