// src/app/mycards/analytics/[cardId]/page.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import CardAnalyticsClient from "@/components/CardAnalyticsClient";
import { AppTopbar } from '@/components/navigation/AppTopbar';

interface Props {
  params: { cardId: string } | Promise<{ cardId: string }>;
}

export default async function CardAnalyticsPage(props: Props) {
  // Unwrap params if Next gives a promise
  const params = props.params instanceof Promise
    ? await props.params
    : props.params;

  const cardId = params?.cardId;

  if (!cardId) {
    redirect('/mycards');
  }

  // Get the authenticated user using createServerClient directly
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

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Verify card ownership via backend API
  // The backend requires authentication and only returns cards owned by the authenticated user
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;

  if (!token) {
    redirect('/login');
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/cards/${cardId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      // Card not found or user doesn't have access
      // Backend returns 404 if card doesn't exist or doesn't belong to user
      console.log(`Card access denied: ${response.status}`);
      redirect('/mycards');
    }

    // If we successfully fetched the card, the backend has verified ownership
    // No need to check user_id since backend already validates this

  } catch (error) {
    // Check if it's a redirect error (which is expected)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error; // Re-throw redirect errors
    }
    console.error('Error verifying card access:', error);
    redirect('/mycards');
  }

  return (
    <div>
      <AppTopbar title="Analytics" subtitle="View your card performance and insights" />
      <div className="p-6">
        <CardAnalyticsClient cardId={cardId} />
      </div>
    </div>
  );
}
