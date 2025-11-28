// src/components/SummaryCards.tsx
import React from "react";

export default function SummaryCards({ total, unique }: { total: number; unique: number }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white shadow rounded p-4">
        <div className="text-xs text-muted mb-1">Total Views</div>
        <div className="text-2xl font-bold">{total}</div>
      </div>
      <div className="bg-white shadow rounded p-4">
        <div className="text-xs text-muted mb-1">Unique Views</div>
        <div className="text-2xl font-bold">{unique}</div>
      </div>
    </div>
  );
}
