// src/lib/validators.ts
/**
 * Zod Validation Schemas
 * 
 * Client-side validation schemas that match backend validation.
 * Used in forms before submitting to API.
 */

import { z } from 'zod';

/**
 * Slug validation - alphanumeric, hyphens, underscores only
 */
export const slugSchema = z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be at most 50 characters')
    .regex(
        /^[a-z0-9-_]+$/,
        'Slug can only contain lowercase letters, numbers, hyphens, and underscores'
    );

/**
 * Email validation
 */
export const emailSchema = z
    .string()
    .email('Invalid email address')
    .or(z.literal(''));

/**
 * URL validation (optional)
 */
export const urlSchema = z
    .string()
    .url('Invalid URL')
    .or(z.literal(''));

/**
 * Social links schema
 */
export const socialLinksSchema = z.record(z.string(), z.string().url()).optional();

/**
 * Theme schema (flexible JSON)
 */
export const themeSchema = z.record(z.string(), z.unknown()).optional();

/**
 * Create card form validation
 */
export const createCardSchema = z.object({
    slug: slugSchema,
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    title: z.string().max(100, 'Title is too long').optional(),
    bio: z.string().max(500, 'Bio is too long').optional(),
    email: emailSchema.optional(),
    phone: z.string().max(20, 'Phone number is too long').optional(),
    website: urlSchema.optional(),
    avatar_url: urlSchema.optional(),
    cover_url: urlSchema.optional(),
    social_links: socialLinksSchema,
    theme: themeSchema,
});

/**
 * Update card form validation
 */
export const updateCardSchema = z.object({
    slug: slugSchema.optional(),
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long').optional(),
    title: z.string().max(100, 'Title is too long').optional(),
    company: z.string().max(100, 'Company is too long').optional(),
    bio: z.string().max(500, 'Bio is too long').optional(),
    about: z.string().max(500, 'About is too long').optional(),
    email: emailSchema.optional(),
    phone: z.string().max(20, 'Phone number is too long').optional(),
    website: urlSchema.optional(),
    photo_url: urlSchema.optional(),
    logo_url: urlSchema.optional(),
    avatar_url: urlSchema.optional(),
    cover_url: urlSchema.optional(),
    social_links: socialLinksSchema,
    theme: themeSchema,
    is_published: z.boolean().optional(),
});

/**
 * Phone number validation (international format)
 */
export const phoneSchema = z
    .string()
    .regex(
        /^[\d\s\-\+\(\)]+$/,
        'Phone number can only contain digits, spaces, hyphens, plus signs, and parentheses'
    )
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number is too long')
    .or(z.literal(''));

/**
 * Lead form validation (enhanced)
 */
export const createLeadSchema = z.object({
    card_id: z.string().uuid('Invalid card ID'),
    name: z
        .string()
        .min(1, 'Name is required')
        .max(100, 'Name is too long')
        .regex(/^[a-zA-Z\s\-'.]+$/, 'Name can only contain letters, spaces, hyphens, apostrophes, and periods'),
    email: z
        .string()
        .email('Please enter a valid email address')
        .max(254, 'Email is too long')
        .optional()
        .or(z.literal('')),
    phone: phoneSchema.optional(),
    message: z
        .string()
        .max(1000, 'Message is too long (max 1000 characters)')
        .optional()
        .or(z.literal(''))
        .transform(val => val?.trim() || ''), // Sanitize whitespace
    source: z.string().max(50, 'Source is too long').optional(),
}).refine(
    data => data.email || data.phone,
    {
        message: 'Please provide either an email or phone number',
        path: ['email'], // Show error on email field
    }
);

/**
 * Feedback validation
 */
export const createFeedbackSchema = z.object({
    type: z.enum(['bug', 'feature', 'improvement', 'general'], {
        message: 'Please select a feedback type'
    }),
    category: z.string().max(100, 'Category is too long').optional(),
    message: z.string()
        .min(10, 'Feedback must be at least 10 characters')
        .max(2000, 'Feedback is too long (max 2000 characters)')
        .transform(val => val.trim()),
    rating: z.number()
        .int('Rating must be a whole number')
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating must be at most 5')
        .optional(),
});

/**
 * Login form validation
 */
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
});

/**
 * Type inference helpers
 */
export type CreateCardFormData = z.infer<typeof createCardSchema>;
export type UpdateCardFormData = z.infer<typeof updateCardSchema>;
export type CreateLeadFormData = z.infer<typeof createLeadSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
