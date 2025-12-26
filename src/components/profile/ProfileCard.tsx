'use client';

import React from 'react';
import { Mail, Phone, Linkedin, Globe, Download, Share2 } from 'lucide-react';
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
    contact: ContactInfo;
}

interface ProfileCardProps {
    user: UserProfile;
    theme?: 'light' | 'dark' | 'accent';
    shape?: 'wave' | 'geometric' | 'soft-arc' | 'layered-waves' | 'slant';
}

export function ProfileCard({ user, theme = 'light', shape = 'wave' }: ProfileCardProps) {
    const themeClasses = {
        light: {
            bg: 'bg-white',
            text: 'text-neutral-900',
            secondary: 'text-neutral-600',
            accent: 'text-indigo-600',
            border: 'border-neutral-200',
            hover: 'hover:bg-neutral-50',
            shapeColor: '#4F46E5',
        },
        dark: {
            bg: 'bg-neutral-900',
            text: 'text-neutral-100',
            secondary: 'text-neutral-400',
            accent: 'text-white',
            border: 'border-neutral-700',
            hover: 'hover:bg-neutral-800',
            shapeColor: '#FFFFFF',
        },
        accent: {
            bg: 'bg-white',
            text: 'text-neutral-900',
            secondary: 'text-neutral-600',
            accent: 'text-violet-600',
            border: 'border-violet-200',
            hover: 'hover:bg-violet-50',
            shapeColor: '#8B5CF6',
        },
    };

    const currentTheme = themeClasses[theme];

    return (
        <div className={`max-w-md mx-auto ${currentTheme.bg} rounded-2xl overflow-hidden shadow-lg`}>
            {/* Identity Header - Background Image Section */}
            <div className="relative h-80 overflow-visible">
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
                    <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">
                        {user.name}
                    </h1>
                    <p className="text-lg text-white font-medium">
                        {user.role}
                    </p>
                </div>

                {/* Shape Divider - Overlaid at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-16 z-20">
                    {shape === 'wave' && <WaveShape color={currentTheme.shapeColor} />}
                    {shape === 'geometric' && <GeometricShape color={currentTheme.shapeColor} />}
                    {shape === 'soft-arc' && <SoftArcShape color={currentTheme.shapeColor} />}
                    {shape === 'layered-waves' && <LayeredWavesShape color={currentTheme.shapeColor} />}
                    {shape === 'slant' && <SlantShape color={currentTheme.shapeColor} />}
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

                {/* Contact Actions */}
                <div className="space-y-1 mb-6">
                    {user.contact.email && (
                        <a
                            href={`mailto:${user.contact.email}`}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.hover} transition-colors`}
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
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.hover} transition-colors`}
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
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.hover} transition-colors`}
                        >
                            <Linkedin className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />
                            <span className={`text-sm font-medium ${currentTheme.text}`}>
                                LinkedIn Profile
                            </span>
                        </a>
                    )}

                    {user.contact.website && (
                        <a
                            href={user.contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg border ${currentTheme.border} ${currentTheme.hover} transition-colors`}
                        >
                            <Globe className={`w-5 h-5 ${currentTheme.accent}`} strokeWidth={2} />
                            <span className={`text-sm font-medium ${currentTheme.text}`}>
                                {user.contact.website.replace(/^https?:\/\//, '')}
                            </span>
                        </a>
                    )}
                </div>

                {/* Action Buttons */}
                <div className={`flex gap-3 pt-4 border-t ${currentTheme.border}`}>
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border ${currentTheme.border} ${currentTheme.hover} transition-colors`}
                    >
                        <Download className={`w-4 h-4 ${currentTheme.accent}`} strokeWidth={2} />
                        <span className={`text-sm font-medium ${currentTheme.text}`}>
                            Save Contact
                        </span>
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border ${currentTheme.border} ${currentTheme.hover} transition-colors`}
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
