'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { Input } from '@/components/molecules/Input';
import { Textarea } from '@/components/molecules/Textarea';
import { Button } from '@/components/molecules/Button';
import { apiClient } from '@/lib/apiClient';
import { CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { downloadVCard } from '@/lib/vcard';
import { createLeadSchema } from '@/lib/validators';
import type { Card } from '@/lib/api/types';
import { z } from 'zod';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    card: Card;
}

export function LeadCaptureModal({ isOpen, onClose, card }: LeadCaptureModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Real-time validation for a specific field
    const validateField = (fieldName: keyof typeof formData, value: string) => {
        try {
            // Create a partial schema for single field validation
            const fieldSchema = createLeadSchema.pick({
                [fieldName]: true,
                card_id: true, // Required for schema
            });

            fieldSchema.parse({
                [fieldName]: value,
                card_id: card.id,
            });

            // Clear error if validation passes
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        } catch (err) {
            if (err instanceof z.ZodError) {
                const fieldError = err.issues.find((e: z.ZodIssue) => e.path[0] === fieldName);
                if (fieldError) {
                    setErrors(prev => ({
                        ...prev,
                        [fieldName]: fieldError.message
                    }));
                }
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setErrors({});

        try {
            // Validate all fields
            const validatedData = createLeadSchema.parse({
                card_id: card.id,
                ...formData,
                source: 'public_card_save'
            });

            setLoading(true);

            await apiClient.post('/api/v1/leads', validatedData);

            // Generate and download vCard
            downloadVCard(card);

            setSuccess(true);
        } catch (err) {
            if (err instanceof z.ZodError) {
                // Map validation errors to form fields
                const fieldErrors: Record<string, string> = {};
                err.issues.forEach((error: z.ZodIssue) => {
                    const field = error.path[0] as string;
                    if (field && !fieldErrors[field]) {
                        fieldErrors[field] = error.message;
                    }
                });
                setErrors(fieldErrors);
                setError('Please fix the errors below');
            } else {
                console.error('Failed to submit lead', err);
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        // Reset state on close
        if (success) {
            setTimeout(() => {
                setSuccess(false);
                setFormData({ name: '', email: '', phone: '', message: '' });
            }, 300);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Connect with me" size="sm">
            {success ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-fadeIn">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Info Sent & Downloaded!</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Thanks for sharing your details. The contact card (vCard) has been downloaded to your device.
                    </p>

                    <div className="flex flex-col gap-3 w-full">
                        <Button
                            onClick={() => downloadVCard(card)}
                            className="w-full flex items-center justify-center gap-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 border-0"
                        >
                            <Download className="w-4 h-4" />
                            Download Again
                        </Button>
                        <Button onClick={handleClose} className="w-full">
                            Close
                        </Button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Share your contact info to save this card and stay connected.
                    </p>

                    <Input
                        label="Name *"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        onBlur={(e) => validateField('name', e.target.value)}
                        placeholder="John Doe"
                        error={errors.name}
                        required
                    />

                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        onBlur={(e) => validateField('email', e.target.value)}
                        placeholder="john@example.com"
                        error={errors.email}
                    />

                    <Input
                        label="Phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        onBlur={(e) => validateField('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        error={errors.phone}
                    />

                    <Textarea
                        label="Message (Optional)"
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        onBlur={(e) => validateField('message', e.target.value)}
                        placeholder="Hi, nice to meet you!"
                        rows={3}
                        error={errors.message}
                    />

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={!formData.name && !formData.email && !formData.phone}
                            isLoading={loading}
                        >
                            Share Contact Info
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
