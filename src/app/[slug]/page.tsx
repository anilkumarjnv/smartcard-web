// src/app/[slug]/page.tsx
import React from "react";
import Image from "next/image";
import { getCardBySlug } from "@/lib/api/cards";
import CardViewClient from "./view-client";

export default async function PublicCardPage({
  params,
}: {
  params: Promise<{ slug: string }>; // note: params may be a Promise
}) {
  // unwrap params
  const { slug } = await params;

  // basic server-side fetch
  let card = null;
  try {
    card = await getCardBySlug(slug);
  } catch (err) {
    // handle server fetch error gracefully
    console.error("getCardBySlug error", err);
  }

  if (!card) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Card Not Found</h2>
          <p className="text-gray-500">The card you&apos;re looking for doesn&apos;t exist or is not published.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* client-only view tracker */}
      <CardViewClient slug={slug} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Main Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-32 relative">
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Profile Section */}
            <div className="px-6 pb-8 -mt-16 relative">
              {/* Avatar */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-50"></div>
                <div className="relative w-32 h-32 mx-auto">
                  <Image
                    src={card.photo_url ?? "/default-avatar.png"}
                    alt={card.name}
                    width={128}
                    height={128}
                    className="rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
                  />
                </div>
              </div>

              {/* Name and Title */}
              <div className="text-center mt-6">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {card.name}
                </h1>
                {card.title && (
                  <p className="text-xl text-gray-600 dark:text-gray-300 font-medium mb-1">
                    {card.title}
                  </p>
                )}
                {card.company && (
                  <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
                    {card.company}
                  </p>
                )}
              </div>

              {/* Contact Information */}
              <div className="mt-8 space-y-4">
                {card.email && (
                  <a
                    href={`mailto:${card.email}`}
                    className="flex items-center justify-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium flex-1 text-left">{card.email}</span>
                  </a>
                )}

                {card.phone && (
                  <a
                    href={`tel:${card.phone}`}
                    className="flex items-center justify-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium flex-1 text-left">{card.phone}</span>
                  </a>
                )}

                {card.website && (
                  <a
                    href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium flex-1 text-left break-words">{card.website}</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by{" "}
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SmartCard
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
