'use client';

import Script from 'next/script';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: any) => void;
                    prompt: () => void;
                };
            };
        };
    }
}

interface GoogleOneTapProps {
    redirectTo?: string;
}

// Generate nonce for security
const generateNonce = async (): Promise<[string, string]> => {
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return [nonce, hashedNonce];
};

export function GoogleOneTap({ redirectTo = '/mycards' }: GoogleOneTapProps) {
    const supabase = createClient();
    const router = useRouter();
    const [initialized, setInitialized] = useState(false);

    const initializeGoogleOneTap = async () => {
        if (initialized) return;

        console.log('Initializing Google One Tap');
        const [nonce, hashedNonce] = await generateNonce();

        // Check if there's already an existing session
        const { data } = await supabase.auth.getSession();
        if (data.session) {
            router.push(redirectTo);
            return;
        }

        if (!window.google) {
            console.error('Google script not loaded');
            return;
        }

        try {
            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                callback: async (response: any) => {
                    try {
                        console.log('Google One Tap response received');
                        const { data, error } = await supabase.auth.signInWithIdToken({
                            provider: 'google',
                            token: response.credential,
                            nonce,
                        });

                        if (error) {
                            console.error('Error signing in with One Tap:', error);
                            return;
                        }

                        console.log('Successfully logged in with Google One Tap');
                        router.push(redirectTo);
                        router.refresh();
                    } catch (error) {
                        console.error('Error logging in with Google One Tap:', error);
                    }
                },
                nonce: hashedNonce,
                // FedCM causes CORS issues on localhost - keep disabled for development
                use_fedcm_for_prompt: false,
                auto_select: false,
                cancel_on_tap_outside: true,
            });

            window.google.accounts.id.prompt();
            setInitialized(true);
        } catch (error) {
            console.error('Failed to initialize Google One Tap:', error);
        }
    };

    useEffect(() => {
        // Small delay to ensure auth state is checked first
        const timer = setTimeout(() => {
            if (window.google && !initialized) {
                initializeGoogleOneTap();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [initialized]);

    return (
        <Script
            src="https://accounts.google.com/gsi/client"
            strategy="afterInteractive"
            onReady={() => { initializeGoogleOneTap(); }}
        />
    );
}
