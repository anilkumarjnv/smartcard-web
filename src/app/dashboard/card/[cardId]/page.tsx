// src/app/dashboard/card/[cardId]/page.tsx
// import CardAnalyticsClient from "@/components/CardAnalytics.Client";
import CardAnalyticsClient from "@/components/CardAnalyticsClient";
import React from "react";


interface Props {
  params: { cardId: string } | Promise<{ cardId: string }>;
}

export default async function CardDashboard(props: Props) {
  // unwrap params if Next gives a promise (avoid the warning you saw)
  const params = props.params instanceof Promise
    ? await props.params
    : props.params;

  const cardId = params?.cardId;

  if (!cardId) {
    return <div className="p-4">Card ID missing</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Card Dashboard</h1>
      {/* Client-side analytics widget */}
      <CardAnalyticsClient cardId={cardId} />
    </div>
  );
}
