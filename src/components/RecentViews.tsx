// src/components/RecentViews.tsx
import React from "react";

export default function RecentViews({ rows }: { rows: Array<{ id: string; referrer: string | null; viewed_at: string; user_agent: string }> }) {
  return (
    <div className="text-sm">
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.id} className="flex justify-between">
            <div className="truncate pr-2">
              <div className="text-xs text-muted">{new Date(r.viewed_at).toLocaleString()}</div>
              <div className="text-sm truncate">{r.user_agent}</div>
            </div>
            <div className="text-right ml-2 text-sm font-medium">{r.referrer || "direct"}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
