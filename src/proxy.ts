import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected routes
    if (request.nextUrl.pathname.startsWith('/mycards') ||
        request.nextUrl.pathname.startsWith('/settings') ||
        request.nextUrl.pathname.startsWith('/leads')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Check for role
        const role = user.user_metadata?.role;
        if (!role && !request.nextUrl.pathname.startsWith('/onboarding')) {
            return NextResponse.redirect(new URL('/onboarding', request.url));
        }
    }

    // Auth routes (redirect to mycards if already logged in)
    if (request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup') ||
        request.nextUrl.pathname.startsWith('/register')) {
        if (user) {
            // If user has no role, go to onboarding, else mycards
            const role = user.user_metadata?.role;
            if (!role) {
                return NextResponse.redirect(new URL('/onboarding', request.url));
            }
            return NextResponse.redirect(new URL('/mycards', request.url));
        }
    }

    // Onboarding route protection
    if (request.nextUrl.pathname.startsWith('/onboarding')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        // If already has role, redirect to mycards
        if (user.user_metadata?.role) {
            return NextResponse.redirect(new URL('/mycards', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
