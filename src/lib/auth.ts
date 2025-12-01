// src/lib/auth.ts
/**
 * Authentication Utilities
 * 
 * Helper functions for authentication, session management,
 * and protected route handling.
 */

import { createClient } from './supabaseClient';
import type { AuthUser } from './api/types';

/**
 * Get current authenticated user
 * 
 * @returns User object if authenticated, null otherwise
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
    try {
        const supabase = createClient();
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
            return null;
        }

        return {
            id: session.user.id,
            email: session.user.email || '',
            role: session.user.role,
            ...session.user.user_metadata,
        };
    } catch (error) {
        console.error('Failed to get current user:', error);
        return null;
    }
}

/**
 * Get access token for API calls
 * 
 * @returns Access token if available, null otherwise
 */
export async function getAccessToken(): Promise<string | null> {
    try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        return session?.access_token || null;
    } catch (error) {
        console.error('Failed to get access token:', error);
        return null;
    }
}

/**
 * Sign out user
 */
export async function signOut(): Promise<void> {
    const supabase = createClient();
    await supabase.auth.signOut();
}

/**
 * Sign in with email and password
 * 
 * @param email User email
 * @param password User password
 */
export async function signInWithEmail(
    email: string,
    password: string
): Promise<{ error: Error | null; user?: AuthUser }> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { error };
        }

        if (data.user) {
            return {
                error: null,
                user: {
                    id: data.user.id,
                    email: data.user.email || '',
                    role: data.user.role,
                    ...data.user.user_metadata,
                },
            };
        }

        return { error: null };
    } catch (error) {
        return { error: error as Error };
    }
}

/**
 * Sign up with email and password
 * 
 * @param email User email
 * @param password User password
 * @param metadata Optional user metadata
 */
export async function signUpWithEmail(
    email: string,
    password: string,
    metadata?: Record<string, unknown>
): Promise<{ error: Error | null; user?: AuthUser }> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
            },
        });

        if (error) {
            return { error };
        }

        if (data.user) {
            return {
                error: null,
                user: {
                    id: data.user.id,
                    email: data.user.email || '',
                    role: data.user.role,
                    ...data.user.user_metadata,
                },
            };
        }

        return { error: null };
    } catch (error) {
        return { error: error as Error };
    }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser();
    return user !== null;
}

/**
 * Require authentication (for use in server components)
 * Redirects to login if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
    const user = await getCurrentUser();

    if (!user) {
        // In Next.js, you'd typically use redirect() from next/navigation
        // For now, we'll throw an error that can be caught in the component
        throw new Error('UNAUTHORIZED');
    }

    return user;
}
