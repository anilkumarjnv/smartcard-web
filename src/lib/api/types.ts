// src/lib/api/types.ts
/**
 * Backend API Type Definitions
 * 
 * Matches the TypeScript interfaces from the Express backend.
 * Keep in sync with backend types for type safety across the stack.
 */

/**
 * Card entity from database
 */
export interface Card {
    id: string;
    user_id: string;
    slug: string;
    name: string;
    title?: string;
    company?: string;
    about?: string;
    email?: string;
    phone?: string;
    phone_public?: boolean;
    website?: string;
    photo_url?: string;
    logo_url?: string;
    avatar_url?: string;  // Keep for backward compatibility
    cover_url?: string;   // Keep for backward compatibility
    social_links?: Record<string, string>;
    theme?: Record<string, unknown>;
    // Role-specific fields
    school?: string;
    major?: string;
    graduation_year?: string;
    skills?: string;
    projects?: string;
    experience?: string;
    certifications?: string;
    views_count?: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    usage_intent?: 'professional' | 'student' | 'business' | 'personal';
    custom_data?: Record<string, any>;
    // Joined Profile Fields
    plan_type?: string;
    is_founder?: boolean;
    founder_since?: string;
    founder_number?: number;
}


/**
 * Create card DTO
 */
export interface CreateCardDTO {
    slug: string;
    name: string;
    title?: string;
    company?: string;
    about?: string;
    email?: string;
    phone?: string;
    phone_public?: boolean;
    website?: string;
    photo_url?: string;
    logo_url?: string;
    avatar_url?: string;
    cover_url?: string;
    social_links?: Record<string, string>;
    theme?: Record<string, unknown>;
    // Role-specific fields
    school?: string;
    major?: string;
    graduation_year?: string;
    skills?: string;
    projects?: string;
    experience?: string;
    certifications?: string;
    usage_intent?: 'professional' | 'student' | 'business' | 'personal';
}

/**
 * Update card DTO
 */
export interface UpdateCardDTO {
    slug?: string;
    name?: string;
    title?: string;
    company?: string;
    about?: string;
    email?: string;
    phone?: string;
    phone_public?: boolean;
    website?: string;
    photo_url?: string;
    logo_url?: string;
    avatar_url?: string;
    cover_url?: string;
    social_links?: Record<string, string>;
    theme?: Record<string, unknown>;
    is_published?: boolean;
    // Role-specific fields
    school?: string;
    major?: string;
    graduation_year?: string;
    skills?: string;
    projects?: string;
    experience?: string;
    certifications?: string;
    usage_intent?: 'professional' | 'student' | 'business' | 'personal';
}

/**
 * Record view request
 */
export interface RecordViewDTO {
    slug?: string;
    card_id?: string;
    referrer?: string;
    rate_seconds?: number;
}

/**
 * Analytics response
 */
export interface AnalyticsResponse {
    total_views: number;
    unique_views: number;
    daily_views: DailyView[];
    referrers: Referrer[];
    recent_views: RecentView[];
    device_breakdown?: DeviceBreakdown;
}

export interface DailyView {
    date: string;
    count: number;
}

export interface Referrer {
    referrer: string;
    count: number;
}

export interface RecentView {
    created_at: string;
    referrer: string | null;
    user_agent: string | null;
}

export interface DeviceBreakdown {
    mobile: number;
    tablet: number;
    desktop: number;
    unknown: number;
}

/**
 * Lead entity
 */
export interface Lead {
    id: string;
    card_id: string;
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    source?: string;
    created_at: string;
}

/**
 * Create lead DTO
 */
export interface CreateLeadDTO {
    card_id: string;
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    source?: string;
}

/**
 * NFC Tag entity
 */
export interface NFCTag {
    id: string;
    tag_id: string;
    card_id: string;
    user_id: string;
    created_at: string;
}

/**
 * Feedback entity
 */
export interface Feedback {
    id: string;
    user_id: string;
    type: 'bug' | 'feature' | 'improvement' | 'general';
    category?: string;
    message: string;
    rating?: number;
    created_at: string;
    updated_at: string;
}

/**
 * Create feedback DTO
 */
export interface CreateFeedbackDTO {
    type: 'bug' | 'feature' | 'improvement' | 'general';
    category?: string;
    message: string;
    rating?: number;
}

/**
 * User profile from Supabase Auth
 */
export interface AuthUser {
    id: string;
    email: string;
    role?: string;
    plan_type?: string;
    is_founder?: boolean;
    founder_since?: string;
    founder_number?: number;
    user_metadata?: {
        role?: string;
        full_name?: string;
        avatar_url?: string;
        [key: string]: any;
    };
    [key: string]: unknown;
}
