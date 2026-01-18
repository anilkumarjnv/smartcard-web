// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/mycards';

    if (code) {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    },
                },
            }
        );

        const { error, data: { session } } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && session) {
            // Check if user has a profile (successful signup)
            const user = session.user;

            if (user) {
                // Check if profile was created
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('id, welcome_email_sent')
                    .eq('id', user.id)
                    .single();

                // If no profile exists, beta limit was likely reached
                if (!profile) {
                    // Clean up the auth user since profile creation failed
                    await supabase.auth.signOut();
                    return NextResponse.redirect(`${origin}/beta-limit?reason=signup`);
                }

                // Send welcome email if not already sent (fire and forget)
                if (!profile.welcome_email_sent && session?.access_token) {
                    // Call the backend welcome endpoint - don't await to avoid blocking redirect
                    fetch(`${API_BASE}/api/v1/auth/welcome`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${session.access_token}`,
                            'Content-Type': 'application/json',
                        },
                    }).catch((err) => {
                        console.error('Failed to trigger welcome email:', err);
                    });
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host');
            const isLocalEnv = process.env.NODE_ENV === 'development';

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}`);
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`);
            } else {
                return NextResponse.redirect(`${origin}${next}`);
            }
        }
    }

    // Return to error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
