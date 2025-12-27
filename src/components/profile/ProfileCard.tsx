'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Linkedin, Globe, Download, Share2, Edit, BarChart3, QrCode, Trash2, Github, Twitter, Instagram, Facebook, Youtube, Twitch, Disc as DiscordIcon, Figma, Code2, Link as LinkIcon, Dribbble, Palette } from 'lucide-react';
import { WaveShape } from './shapes/WaveShape';
import { GeometricShape } from './shapes/GeometricShape';
import { SoftArcShape } from './shapes/SoftArcShape';
import { LayeredWavesShape } from './shapes/LayeredWavesShape';
import { SlantShape } from './shapes/SlantShape';

interface ContactInfo {
    email: string;
    phone?: string;
    linkedin?: string;
    website?: string;
}

interface UserProfile {
    name: string;
    role: string;
    company: string;
    location: string;
    photo: string;
    about?: string;
    domain?: string;
    custom_highlights?: Array<{ label: string; value: string }>;
    cta_button?: { text: string; link: string };
    additional_links?: Array<{ label: string; url: string }>;
    contact: ContactInfo;
}

interface ProfileCardProps {
    user: UserProfile;
    theme?: 'light' | 'dark' | 'accent' | 'neutral';
    shape?: 'wave' | 'geometric' | 'soft-arc' | 'layered-waves' | 'slant';
    cardId?: string;
    disableFlip?: boolean;
    disableInteractions?: boolean;
    onEdit?: () => void;
    onAnalytics?: () => void;
    onDownloadQR?: () => void;
    onDelete?: () => void;
    onSave?: () => void;
}

export function ProfileCard({
    user,
    theme = 'light',
    shape = 'wave',
    cardId,
    disableFlip = false,
    disableInteractions = false,
    onEdit,
    onAnalytics,
    onDownloadQR,
    onDelete,
    onSave
}: ProfileCardProps) {
    // ... (keep state and handlers as is)
    const [isFlipped, setIsFlipped] = useState(false);
    const router = useRouter();

    const interactionClass = disableInteractions ? 'pointer-events-none' : '';

    // Action handlers - use provided callbacks or default navigation
    const handleEdit = () => {
        if (disableInteractions) return;
        if (onEdit) {
            onEdit();
        } else if (cardId) {
            router.push(`/mycards?tab=card&cardId=${cardId}`);
        }
    };

    const handleAnalytics = () => {
        if (disableInteractions) return;
        if (onAnalytics) {
            onAnalytics();
        } else if (cardId) {
            router.push(`/mycards/analytics/${cardId}`);
        }
    };

    const handleDownloadQR = () => {
        if (disableInteractions) return;
        if (onDownloadQR) {
            onDownloadQR();
        } else {
            // Default QR download logic can be added here
            console.log('Download QR code for card:', cardId);
        }
    };

    const handleDelete = () => {
        if (disableInteractions) return;
        if (onDelete) {
            onDelete();
        } else {
            // Default delete logic can be added here
            console.log('Delete card:', cardId);
        }
    };

    const runOnSave = () => {
        if (disableInteractions) return;
        onSave?.();
    };

    const themeClasses = {
        // ... (keep themeClasses as is)
        light: {
            bg: 'bg-white',
            text: 'text-neutral-900',
            secondary: 'text-neutral-600',
            accent: 'text-indigo-600',
            border: 'border-neutral-200',
            hover: disableInteractions ? '' : 'hover:bg-neutral-50',
            shapeColor: '#4F46E5',
            highlightBg: 'bg-indigo-50',
            dividerColor: '#FFFFFF',
            buttonTextColor: 'text-white',
        },
        dark: {
            bg: 'bg-neutral-900',
            text: 'text-neutral-100',
            secondary: 'text-neutral-400',
            accent: 'text-white',
            border: 'border-neutral-700',
            hover: disableInteractions ? '' : 'hover:bg-neutral-800',
            shapeColor: '#FFFFFF',
            highlightBg: 'bg-neutral-800',
            dividerColor: '#171717', // Matching bg-neutral-900
            buttonTextColor: 'text-neutral-900',
        },
        accent: {
            bg: 'bg-white',
            text: 'text-neutral-900',
            secondary: 'text-neutral-600',
            accent: 'text-violet-600',
            border: 'border-violet-200',
            hover: disableInteractions ? '' : 'hover:bg-violet-50',
            shapeColor: '#8B5CF6',
            highlightBg: 'bg-violet-50',
            dividerColor: '#FFFFFF',
            buttonTextColor: 'text-white',
        },
        neutral: {
            bg: 'bg-white',
            text: 'text-neutral-900',
            secondary: 'text-neutral-600',
            accent: 'text-neutral-900',
            border: 'border-neutral-200',
            hover: disableInteractions ? '' : 'hover:bg-neutral-50',
            shapeColor: '#111111',
            highlightBg: 'bg-neutral-100',
            dividerColor: '#FFFFFF',
            buttonTextColor: 'text-white',
        },
    };

    const currentTheme = themeClasses[theme];

    // ... (keep getPlatformIcon and cardContent setup)
    const getPlatformIcon = (label: string) => {
        // ... (keep implementation)
        const normalizedLabel = label.toLowerCase();
        switch (normalizedLabel) {
            case 'github': return <Github className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />;
            case 'twitter': return <Twitter className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />;
            case 'instagram': return <Instagram className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />;
            case 'facebook': return <Facebook className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />;
            case 'youtube': return <Youtube className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />;
            case 'twitch': return <Twitch className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />;
            case 'discord': return <DiscordIcon className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />;
            case 'linkedin': return <Linkedin className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />;
            case 'dribbble': return <Dribbble className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />;
            case 'behance': return <Palette className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />;
            case 'figma': return <Figma className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />; // Using Figma icon if available or fallback
            case 'stackoverflow': return <Code2 className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />;
            case 'gitlab': return <Code2 className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />;
            case 'dev.to': return <Code2 className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />;
            case 'portfolio': return <Globe className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />;
            case 'website': return <Globe className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />;
            default: return <LinkIcon className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />; // Generic Link icon fallback
        }
    };

    // Card content component (reusable for both flip and non-flip versions)
    const cardContent = (
        <div className={`${currentTheme.bg} rounded-2xl overflow-hidden shadow-lg`}>
            {/* Identity Header - Background Image Section */}
            <div className="relative h-96 overflow-visible">
                {/* Background Image or Gradient Fallback */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: user.photo
                            ? `url(${user.photo})`
                            : `linear-gradient(135deg, ${currentTheme.shapeColor}, ${currentTheme.shapeColor}DD)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                />

                {/* Gradient Overlay for text readability */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: theme === 'dark'
                            ? 'linear-gradient(to top, rgba(255,255,255,0.8) 0%, transparent 60%)'
                            : theme === 'accent'
                                ? `linear-gradient(to top, ${currentTheme.shapeColor}CC 0%, transparent 60%)`
                                : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)'
                    }}
                />

                {/* Name and Role - overlaid on image */}
                <div className="absolute bottom-20 left-6 z-10">
                    <h1 className={`text-3xl font-bold mb-1 tracking-tight ${theme === 'dark' ? 'text-neutral-900' : 'text-white'}`}>
                        {user.name}
                    </h1>
                    <p className={`text-lg font-medium ${theme === 'dark' ? 'text-neutral-900' : 'text-white'}`}>
                        {user.role}
                    </p>
                    {user.domain && (
                        <p className={`text-sm font-medium mt-1 ${theme === 'dark' ? 'text-neutral-700' : 'text-white/90'}`}>
                            {user.domain}
                        </p>
                    )}
                </div>

                {/* Shape Divider - Overlaid at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-16 z-20">
                    {shape === 'wave' && <WaveShape color={currentTheme.dividerColor} />}
                    {shape === 'geometric' && <GeometricShape color={currentTheme.dividerColor} />}
                    {shape === 'soft-arc' && <SoftArcShape color={currentTheme.dividerColor} />}
                    {shape === 'layered-waves' && <LayeredWavesShape color={currentTheme.dividerColor} />}
                    {shape === 'slant' && <SlantShape color={currentTheme.dividerColor} />}
                </div>
            </div>

            {/* Professional Details Section */}
            <div className={`px-8 pb-6 ${currentTheme.bg}`}>
                <div className="mb-6">
                    <h2 className={`text-xl font-semibold ${currentTheme.text} mb-1`}>
                        {user.company}
                    </h2>
                    <p className={`text-sm ${currentTheme.secondary}`}>
                        {user.location}
                    </p>
                    {user.about && (
                        <p className={`text-sm ${currentTheme.secondary} mt-3 leading-relaxed`}>
                            {user.about}
                        </p>
                    )}
                </div>

                {/* Custom Highlights */}
                {user.custom_highlights && user.custom_highlights.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {user.custom_highlights.map((highlight, idx) => (
                            <div key={idx} className={`p-3 rounded-xl border ${currentTheme.border} ${currentTheme.highlightBg} text-center`}>
                                <div className={`text-xs font-medium uppercase tracking-wider ${currentTheme.secondary} mb-1`}>
                                    {highlight.label}
                                </div>
                                <div className={`text-sm font-bold ${currentTheme.text} truncate`}>
                                    {highlight.value}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Primary Call to Action */}
                {user.cta_button && user.cta_button.text && (
                    <div className="mb-6">
                        <a
                            href={user.cta_button.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center w-full py-3 px-6 rounded-xl font-bold ${currentTheme.buttonTextColor} shadow-md transition-transform active:scale-95 ${interactionClass}`}
                            style={{ backgroundColor: currentTheme.shapeColor }}
                        >
                            {user.cta_button.text}
                        </a>
                    </div>
                )}

                {/* Contact Actions */}
                <div className="space-y-2 mb-6">
                    {user.contact.email && (
                        <a
                            href={`mailto:${user.contact.email}`}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.hover} transition-colors ${interactionClass}`}
                        >
                            <Mail className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />
                            <span className={`text-sm font-medium ${currentTheme.text}`}>
                                {user.contact.email}
                            </span>
                        </a>
                    )}

                    {user.contact.phone && (
                        <a
                            href={`tel:${user.contact.phone}`}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.hover} transition-colors ${interactionClass}`}
                        >
                            <Phone className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />
                            <span className={`text-sm font-medium ${currentTheme.text}`}>
                                {user.contact.phone}
                            </span>
                        </a>
                    )}

                    {user.contact.linkedin && (
                        <a
                            href={user.contact.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.hover} transition-colors ${interactionClass}`}
                        >
                            <Linkedin className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />
                            <span className={`text-sm font-medium ${currentTheme.text}`}>
                                LinkedIn
                            </span>
                        </a>
                    )}

                    {user.contact.website && (
                        <a
                            href={user.contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.hover} transition-colors ${interactionClass}`}
                        >
                            <Globe className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />
                            <span className={`text-sm font-medium ${currentTheme.text}`}>
                                Website
                            </span>
                        </a>
                    )}

                    {/* Additional Links */}
                    {user.additional_links?.map((link, idx) => (
                        <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.hover} transition-colors ${interactionClass}`}
                        >
                            {getPlatformIcon(link.label)}
                            <span className={`text-sm font-medium ${currentTheme.text}`}>
                                {link.label}
                            </span>
                        </a>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className={`flex gap-3 pt-4 border-t ${currentTheme.border}`}>
                    <button
                        onClick={runOnSave}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border ${currentTheme.border} ${currentTheme.hover} transition-colors ${interactionClass}`}
                    >
                        <Download className={`w-4 h-4 ${currentTheme.accent}`} strokeWidth={2} />
                        <span className={`text-sm font-medium ${currentTheme.text}`}>
                            Save
                        </span>
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border ${currentTheme.border} ${currentTheme.hover} transition-colors ${interactionClass}`}
                    >
                        <Share2 className={`w-4 h-4 ${currentTheme.accent}`} strokeWidth={2} />
                        <span className={`text-sm font-medium ${currentTheme.text}`}>
                            Share
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );

    // If flip is disabled, return just the card content
    if (disableFlip) {
        return <div className="max-w-md mx-auto">{cardContent}</div>;
    }

    // Otherwise, return with flip animation
    return (
        <div
            className="max-w-md mx-auto perspective-1000"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <div
                className="relative w-full h-full transition-transform duration-700 transform-style-3d"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* FRONT FACE */}
                <div
                    className="backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {cardContent}
                </div>

                {/* BACK FACE */}
                <div
                    className="absolute inset-0 backface-hidden"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    <div className={`${currentTheme.bg} rounded-2xl overflow-hidden shadow-lg h-full`}>
                        <div className={`px-8 py-8 h-full flex flex-col justify-center`}>
                            <h2 className={`text-2xl font-bold ${currentTheme.text} mb-8 text-center`}>
                                Quick Actions
                            </h2>

                            {/* Action Buttons Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleEdit}
                                    className={`flex flex-col items-center justify-center gap-3 px-6 py-8 rounded-xl border-2 ${currentTheme.border} ${currentTheme.hover} transition-all duration-200 hover:scale-105 hover:shadow-md`}
                                >
                                    <Edit className={`w-8 h-8 ${currentTheme.accent}`} strokeWidth={2} />
                                    <span className={`text-sm font-semibold ${currentTheme.text}`}>
                                        Edit Card
                                    </span>
                                </button>

                                <button
                                    onClick={handleAnalytics}
                                    className={`flex flex-col items-center justify-center gap-3 px-6 py-8 rounded-xl border-2 ${currentTheme.border} ${currentTheme.hover} transition-all duration-200 hover:scale-105 hover:shadow-md`}
                                >
                                    <BarChart3 className={`w-8 h-8 ${currentTheme.accent}`} strokeWidth={2} />
                                    <span className={`text-sm font-semibold ${currentTheme.text}`}>
                                        Analytics
                                    </span>
                                </button>

                                <button
                                    onClick={handleDownloadQR}
                                    className={`flex flex-col items-center justify-center gap-3 px-6 py-8 rounded-xl border-2 ${currentTheme.border} ${currentTheme.hover} transition-all duration-200 hover:scale-105 hover:shadow-md`}
                                >
                                    <QrCode className={`w-8 h-8 ${currentTheme.accent}`} strokeWidth={2} />
                                    <span className={`text-sm font-semibold ${currentTheme.text}`}>
                                        Download QR
                                    </span>
                                </button>

                                <button
                                    onClick={handleDelete}
                                    className={`flex flex-col items-center justify-center gap-3 px-6 py-8 rounded-xl border-2 ${currentTheme.border} ${currentTheme.hover} transition-all duration-200 hover:scale-105 hover:shadow-md`}
                                >
                                    <Trash2 className={`w-8 h-8 text-red-500`} strokeWidth={2} />
                                    <span className={`text-sm font-semibold ${currentTheme.text}`}>
                                        Delete Card
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Example usage:
export function ProfileCardExample() {
    const exampleUser: UserProfile = {
        name: 'Alex Morgan',
        role: 'Product Designer',
        company: 'Design Studio',
        location: 'San Francisco, CA',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
        about: 'Creating delightful digital experiences with a focus on user-centered design and accessibility.',
        contact: {
            email: 'alex@designstudio.com',
            phone: '+1 (555) 123-4567',
            linkedin: 'https://linkedin.com/in/alexmorgan',
            website: 'https://alexmorgan.design',
        },
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-12 text-neutral-900 dark:text-white">
                    Profile Card Theme Variations
                </h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Light Theme */}
                    <div>
                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3 text-center">
                            Light Theme
                        </p>
                        <ProfileCard user={exampleUser} theme="light" />
                    </div>

                    {/* Dark Theme */}
                    <div>
                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3 text-center">
                            Dark Theme
                        </p>
                        <ProfileCard user={exampleUser} theme="dark" />
                    </div>

                    {/* Accent Theme */}
                    <div>
                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3 text-center">
                            Brand Accent
                        </p>
                        <ProfileCard user={exampleUser} theme="accent" />
                    </div>
                </div>
            </div>
        </div>
    );
}
