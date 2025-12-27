'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Crown, Trash2, Share2, Copy, Check, Mail, X, Linkedin, Twitter, Facebook } from 'lucide-react';
import { ProfileCard } from '@/components/profile/ProfileCard';
import type { Card as CardType } from '@/lib/api/types';
import { apiClient } from '@/lib/apiClient';
import { mutate } from 'swr';

interface ProfileCardsGridProps {
    cards: CardType[];
}

export function ProfileCardsGrid({ cards }: ProfileCardsGridProps) {
    const [showProBanner, setShowProBanner] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [shareCardId, setShareCardId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const getShareUrl = (slug: string) => {
        if (typeof window === 'undefined') return '';
        return `${window.location.origin}/${slug}`;
    };

    const getShareText = (card: CardType) => {
        const url = getShareUrl(card.slug);
        return `Hey! Check out my digital business card.\n\n${card.name}\n${card.title} @ ${card.company || 'Freelance'}\n\n${url}`;
    };

    const handleCopyLink = async (card: CardType) => {
        const text = getShareText(card);
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(card.id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handleDeleteWrapper = async (cardId: string) => {
        setIsDeleting(cardId);
        try {
            await apiClient.delete(`/api/v1/cards/${cardId}`);
            // Refresh the cards list
            mutate('/api/v1/cards/user');
        } catch (error) {
            console.error('Failed to delete card:', error);
            alert('Failed to delete card. Please try again.');
        } finally {
            setIsDeleting(null);
            setConfirmDeleteId(null);
        }
    };

    // Transform card data to ProfileCard user format
    const transformToUserProfile = (card: CardType) => ({
        name: card.name || 'Your Name',
        role: card.title || 'Your Title',
        company: card.company || 'Your Company',
        location: '', // Can be added later
        photo: card.photo_url || card.avatar_url || '',
        about: card.about,
        contact: {
            email: card.email || '',
            phone: card.phone,
            linkedin: (card.social_links as Record<string, string>)?.linkedin,
            website: card.website,
        },
    });

    return (
        <div className="space-y-6">
            {/* Header with Create Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">My Cards</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your digital business cards
                    </p>
                </div>
                <Link href="/mycards?tab=card&mode=create">
                    <button className="px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-sm">
                        <Plus className="w-5 h-5" />
                        Create New Card
                    </button>
                </Link>
            </div>

            {/* Compact Pro Banner */}
            {showProBanner && (
                <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-neutral-800 dark:to-neutral-700 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                            <Crown className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                            <span className="text-sm text-white">
                                Upgrade to Pro for unlimited cards, custom domains, and analytics
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="px-4 py-2 bg-white text-neutral-900 rounded-lg text-sm font-semibold hover:bg-neutral-100 transition-colors"
                            >
                                Upgrade
                            </button>
                            <button
                                onClick={() => setShowProBanner(false)}
                                className="px-3 py-2 text-white/80 hover:text-white text-sm transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cards Grid */}
            {cards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-4">
                        <Plus className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                        No cards yet
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                        Create your first digital business card to start sharing your professional profile
                    </p>
                    <Link href="/mycards?tab=card&mode=create">
                        <button className="px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Create Your First Card
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {cards.map((card) => {
                        const userProfile = transformToUserProfile(card);
                        const theme = (card.theme as Record<string, unknown>)?.profileTheme as 'light' | 'dark' | 'accent' | 'neutral' || 'light';
                        const shape = (card.theme as Record<string, unknown>)?.shape as 'wave' | 'geometric' | 'soft-arc' | 'layered-waves' | 'slant' || 'wave';

                        return (
                            <div
                                key={card.id}
                                className="relative group"
                                style={{ perspective: '1000px' }}
                            >
                                {/* 3D Flip Card Container */}
                                <div
                                    className="relative w-full transition-transform duration-700 preserve-3d group-hover:rotate-y-180"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                    }}
                                >
                                    {/* Front Face - ProfileCard */}
                                    <div
                                        className="w-full backface-hidden"
                                        style={{
                                            backfaceVisibility: 'hidden',
                                            WebkitBackfaceVisibility: 'hidden',
                                        }}
                                    >
                                        <div className="transform scale-90 origin-top">
                                            <ProfileCard
                                                user={userProfile}
                                                theme={theme}
                                                shape={shape}
                                                cardId={card.id}
                                                disableFlip={true}
                                            />
                                        </div>
                                    </div>

                                    {/* Back Face - Action Buttons */}
                                    <div
                                        className="absolute inset-0 w-full h-full backface-hidden"
                                        style={{
                                            backfaceVisibility: 'hidden',
                                            WebkitBackfaceVisibility: 'hidden',
                                            transform: 'rotateY(180deg)',
                                        }}
                                    >
                                        <div className="transform scale-90 origin-top h-full">
                                            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-100 dark:to-neutral-200 rounded-2xl shadow-lg h-full flex flex-col items-center justify-center p-8 space-y-4">
                                                {/* In-Card Delete Confirmation */}
                                                {confirmDeleteId === card.id ? (
                                                    <div className="flex flex-col items-center justify-center space-y-4 w-full h-full animate-in fade-in zoom-in duration-200">
                                                        <div className="text-center">
                                                            <h4 className="text-lg font-bold text-white mb-1">Delete Card?</h4>
                                                            <p className="text-sm text-neutral-300 px-4">
                                                                click <strong>DELETE</strong> to confirm.
                                                                <br />
                                                                This action cannot be undone.
                                                            </p>
                                                        </div>

                                                        {/* Optional: Input for extra safety, or just simple buttons. User asked for "alert msg in a modal", let's keep it simple first but professional. */}
                                                        {/* Let's stick to simple buttons for now to match the "alert msg" request. */}

                                                        <div className="flex flex-col gap-3 w-full">
                                                            <button
                                                                onClick={() => handleDeleteWrapper(card.id)}
                                                                disabled={isDeleting === card.id}
                                                                className="w-full px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                                                            >
                                                                {isDeleting === card.id ? (
                                                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                                ) : (
                                                                    <Trash2 className="w-4 h-4" />
                                                                )}
                                                                {isDeleting === card.id ? 'Deleting...' : 'Yes, Delete'}
                                                            </button>
                                                            <button
                                                                onClick={() => setConfirmDeleteId(null)}
                                                                disabled={isDeleting === card.id}
                                                                className="w-full px-6 py-3 bg-neutral-700 text-white rounded-xl font-medium hover:bg-neutral-600 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : shareCardId === card.id ? (
                                                    <div className="flex flex-col items-center justify-center w-full h-full animate-in fade-in zoom-in duration-200 text-white p-2">
                                                        <div className="flex items-center justify-between w-full mb-4">
                                                            <h4 className="text-lg font-bold">Share Card</h4>
                                                            <button
                                                                onClick={() => setShareCardId(null)}
                                                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                                            >
                                                                <X className="w-5 h-5" />
                                                            </button>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2 w-full">
                                                            <button
                                                                onClick={() => handleCopyLink(card)}
                                                                className="col-span-2 px-4 py-2 bg-white text-neutral-900 rounded-lg font-bold hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2 text-sm"
                                                            >
                                                                {copiedId === card.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                                                {copiedId === card.id ? 'Copied!' : 'Copy Link'}
                                                            </button>

                                                            <a
                                                                href={`https://wa.me/?text=${encodeURIComponent(getShareText(card))}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="px-3 py-2 bg-[#25D366] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-xs"
                                                            >
                                                                WhatsApp
                                                            </a>
                                                            <a
                                                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl(card.slug))}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="px-3 py-2 bg-[#0077b5] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-xs"
                                                            >
                                                                <Linkedin className="w-3 h-3" /> LinkedIn
                                                            </a>
                                                            <a
                                                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText(card))}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="px-3 py-2 bg-black text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-xs"
                                                            >
                                                                <Twitter className="w-3 h-3" /> Twitter
                                                            </a>
                                                            <a
                                                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl(card.slug))}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="px-3 py-2 bg-[#1877F2] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-xs"
                                                            >
                                                                <Facebook className="w-3 h-3" /> Facebook
                                                            </a>
                                                            <a
                                                                href={`mailto:?subject=${encodeURIComponent(`Business Card: ${card.name}`)}&body=${encodeURIComponent(getShareText(card))}`}
                                                                className="col-span-2 px-3 py-2 bg-neutral-700 text-white rounded-lg font-semibold hover:bg-neutral-600 transition-colors flex items-center justify-center gap-2 text-xs"
                                                            >
                                                                <Mail className="w-3 h-3" /> Email
                                                            </a>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // Standard Action Buttons
                                                    <>
                                                        {/* Edit Card */}
                                                        <Link
                                                            href={`/mycards?tab=card&cardId=${card.id}`}
                                                            className="w-full"
                                                        >
                                                            <button className="w-full px-6 py-4 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-3">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                                Edit Card
                                                            </button>
                                                        </Link>

                                                        {/* Share Card */}
                                                        <button
                                                            onClick={() => setShareCardId(card.id)}
                                                            className="w-full px-6 py-4 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-3"
                                                        >
                                                            <Share2 className="w-5 h-5" />
                                                            Share Card
                                                        </button>

                                                        {/* Analytics */}
                                                        <Link
                                                            href={`/mycards/analytics/${card.id}`}
                                                            className="w-full"
                                                        >
                                                            <button className="w-full px-6 py-4 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-3">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                                </svg>
                                                                Analytics
                                                            </button>
                                                        </Link>

                                                        {/* Download QR Code */}
                                                        <button className="w-full px-6 py-4 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-3">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                                            </svg>
                                                            Download QR
                                                        </button>

                                                        {/* Delete Card Button */}
                                                        <button
                                                            onClick={() => setConfirmDeleteId(card.id)}
                                                            className="w-full px-6 py-4 bg-red-500 dark:bg-red-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-3"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                            Delete Card
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
