// src/components/TimelineChart.tsx
"use client";
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTheme } from "next-themes";

export default function TimelineChart({ daily }: { daily: { day: string; count: number }[] }) {
  const { resolvedTheme } = useTheme();
  // ensure sorted ascending by day
  const data = [...daily].sort((a, b) => a.day.localeCompare(b.day)).map(d => ({ day: d.day, count: d.count }));

  const isDark = resolvedTheme === 'dark';
  const gridColor = isDark ? '#333333' : '#e5e7eb';
  const textColor = isDark ? '#a3a3a3' : '#6b7280';

  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: textColor }}
            tickLine={false}
            axisLine={{ stroke: gridColor }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: textColor }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              borderColor: gridColor,
              borderRadius: '8px',
              color: isDark ? '#f3f4f6' : '#111827'
            }}
            itemStyle={{ color: isDark ? '#f3f4f6' : '#111827' }}
            labelStyle={{ color: textColor }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="var(--primary)"
            strokeOpacity={0.8}
            strokeWidth={3}
            dot={{ r: 4, fill: "var(--primary)", strokeWidth: 2, stroke: isDark ? '#000' : '#fff' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
