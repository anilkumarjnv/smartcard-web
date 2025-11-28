// src/app/[slug]/view-client.tsx (simplified)
'use client';
import { useEffect } from 'react';
import { recordView } from '@/lib/api/views';

export default function CardViewClient({ slug }: { slug: string }) {
  useEffect(() => {
    let mounted = true;
    (async () => {
      const r = await recordView({ slug, referrer: typeof document !== 'undefined' ? document.referrer : undefined });
      if (!mounted) return;
      if ('error' in r || 'skipped' in r) {
        // optional: send to your client-side monitoring
        console.warn('recordView result', r);
      } else {
        console.log('recordView ok', r);
      }
    })();
    return () => { mounted = false; };
  }, [slug]);

  return null;
}
