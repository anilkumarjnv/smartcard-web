// src/components/RecentViews.tsx
import React from "react";

// Helper to get simplified device name from UA string
function getSimplifiedDeviceName(ua: string | null): string {
  if (!ua) return "Unknown Device";

  // Check for common devices/OS
  const lowerUA = ua.toLowerCase();

  if (lowerUA.includes("iphone")) return "iPhone";
  if (lowerUA.includes("ipad")) return "iPad";
  if (lowerUA.includes("android")) return "Android Device";
  if (lowerUA.includes("macintosh") || lowerUA.includes("mac os")) return "Mac";
  if (lowerUA.includes("windows")) return "Windows PC";
  if (lowerUA.includes("linux")) return "Linux";

  // Fallback if no OS matched but it's a browser
  if (lowerUA.includes("chrome")) return "Chrome";
  if (lowerUA.includes("safari")) return "Safari";
  if (lowerUA.includes("firefox")) return "Firefox";

  return "Other Device";
}

export default function RecentViews({ rows }: { rows: Array<{ id: string; referrer: string | null; viewed_at: string; user_agent: string; city?: string | null; country?: string | null; }> }) {
  if (rows.length === 0) {
    return <div className="text-sm text-muted-foreground">No recent views</div>;
  }
  return (
    <div className="text-sm">
      <ul className="space-y-4">
        {rows.map((r) => (
          <li key={r.id} className="flex justify-between items-start">
            <div className="truncate pr-2 overflow-hidden w-full">
              <div className="text-sm truncate text-foreground font-medium">
                {[r.city, r.country].filter(Boolean).join(", ")}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                <span>{new Date(r.viewed_at).toLocaleString()}</span>
                {(r.city || r.country) && (
                  <>
                    <span className="opacity-40">•</span>
                    <span className="truncate">

                      {getSimplifiedDeviceName(r.user_agent)}
                    </span>
                  </>
                )}
                {r.referrer?.includes('/mycards') && (
                  <span className="ml-2 flex-shrink-0 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-300 font-medium">
                    Preview
                  </span>
                )}
              </div>
            </div>
            <div className="text-right ml-2 text-sm font-medium text-foreground whitespace-nowrap">
              {r.referrer || "Direct"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
