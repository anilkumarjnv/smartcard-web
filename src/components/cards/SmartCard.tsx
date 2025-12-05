"use client"

import { Mail, Phone, Globe, MapPin, Linkedin, Twitter, Github } from "lucide-react"

interface SmartCardProps {
    name: string
    title?: string
    company?: string
    email?: string
    phone?: string
    website?: string
    location?: string
    avatar?: string
    category?: "personal" | "work" | "student"
    socials?: {
        linkedin?: string
        twitter?: string
        github?: string
    }
    className?: string
    showFooter?: boolean
}

export function SmartCard({
    name,
    title,
    company,
    email,
    phone,
    website,
    location,
    avatar,
    category = "work",
    socials,
    className = "",
    showFooter = true,
}: SmartCardProps) {
    const categoryColors = {
        personal: "bg-emerald-500",
        work: "bg-primary",
        student: "bg-amber-500",
    }

    const categoryLabels = {
        personal: "Personal",
        work: "Work",
        student: "Student",
    }

    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)

    return (
        <div
            className={`w-full max-w-sm bg-card rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}
        >
            {/* Wave Header */}
            <div className="relative h-28">
                <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                    <defs>
                        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="oklch(0.488 0.243 264)" />
                            <stop offset="100%" stopColor="oklch(0.55 0.28 285)" />
                        </linearGradient>
                    </defs>
                    <path d="M0,0 L400,0 L400,80 Q350,120 200,90 Q50,60 0,100 Z" fill="url(#waveGradient)" />
                </svg>

                {/* Avatar */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <div className="w-20 h-20 ring-4 ring-card shadow-lg rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-semibold overflow-hidden">
                        {avatar ? (
                            <img src={avatar} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="pt-14 pb-6 px-6 text-center">
                <h3 className="text-xl font-bold text-card-foreground">{name}</h3>
                {title && <p className="text-muted-foreground mt-1">{title}</p>}
                {company && <p className="text-sm text-primary font-medium mt-1">{company}</p>}

                {/* Contact Info */}
                <div className="mt-6 space-y-3 text-left">
                    {email && (
                        <a
                            href={`mailto:${email}`}
                            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Mail className="w-4 h-4 text-primary" />
                            {email}
                        </a>
                    )}
                    {phone && (
                        <a
                            href={`tel:${phone}`}
                            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Phone className="w-4 h-4 text-primary" />
                            {phone}
                        </a>
                    )}
                    {website && (
                        <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Globe className="w-4 h-4 text-primary" />
                            {website}
                        </a>
                    )}
                    {location && (
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 text-primary" />
                            {location}
                        </div>
                    )}
                </div>

                {/* Social Links */}
                {socials && Object.values(socials).some(Boolean) && (
                    <div className="flex justify-center gap-4 mt-6">
                        {socials.linkedin && (
                            <a
                                href={socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        )}
                        {socials.twitter && (
                            <a
                                href={socials.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        )}
                        {socials.github && (
                            <a
                                href={socials.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            {showFooter && (
                <div className="px-6 py-3 bg-muted/50 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${categoryColors[category]}`} />
                        {categoryLabels[category]}
                    </div>
                    <span>SmartCard</span>
                </div>
            )}
        </div>
    )
}
