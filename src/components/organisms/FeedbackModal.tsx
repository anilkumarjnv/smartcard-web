'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { Textarea } from '@/components/molecules/Textarea';
import { Button } from '@/components/molecules/Button';
import { apiClient } from '@/lib/apiClient';
import { createFeedbackSchema } from '@/lib/validators';
import type { CreateFeedbackDTO } from '@/lib/api/types';
import { z } from 'zod';
import { MessageSquare, Bug, Lightbulb, Sparkles, Star, CheckCircle2, AlertCircle } from 'lucide-react';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    trigger?: 'after_card_creation' | 'settings' | 'manual';
}

const feedbackTypes = [
    { value: 'bug', label: 'Bug Report', icon: Bug, color: 'red' },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'purple' },
    { value: 'improvement', label: 'Improvement', icon: Sparkles, color: 'blue' },
    { value: 'general', label: 'General Feedback', icon: MessageSquare, color: 'green' },
] as const;

export function FeedbackModal({ isOpen, onClose, trigger = 'manual' }: FeedbackModalProps) {
    const [formData, setFormData] = useState<Partial<CreateFeedbackDTO>>({
        type: undefined,
        message: '',
        rating: undefined,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            // Validate
            const validatedData = createFeedbackSchema.parse(formData);

            setLoading(true);

            await apiClient.post('/api/v1/feedback', validatedData);

            setSuccess(true);

            // Auto-close after showing success
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (err) {
            if (err instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                err.issues.forEach((issue: z.ZodIssue) => {
                    const field = issue.path[0] as string;
                    if (field && !fieldErrors[field]) {
                        fieldErrors[field] = issue.message;
                    }
                });
                setErrors(fieldErrors);
            } else {
                console.error('Failed to submit feedback', err);
                setErrors({ general: 'Failed to submit feedback. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (success) {
            setTimeout(() => {
                setSuccess(false);
                setFormData({ type: undefined, message: '', rating: undefined });
                setErrors({});
            }, 300);
        }
        onClose();
    };

    const handleRatingClick = (rating: number) => {
        setFormData(prev => ({ ...prev, rating }));
        // Clear rating error if present
        if (errors.rating) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.rating;
                return newErrors;
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Share Your Feedback" size="sm">
            {success ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-fadeIn">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Thank You!</h3>
                    <p className="text-muted-foreground">
                        Your feedback helps us improve the app for everyone.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <p className="text-sm text-muted-foreground">
                        {trigger === 'after_card_creation'
                            ? "Congratulations on creating your card! We'd love to hear about your experience."
                            : "Help us improve by sharing your thoughts, reporting bugs, or suggesting new features."
                        }
                    </p>

                    {/* Feedback Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                            What type of feedback do you have? *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {feedbackTypes.map((type) => {
                                const Icon = type.icon;
                                const isSelected = formData.type === type.value;
                                return (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, type: type.value }));
                                            if (errors.type) {
                                                setErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.type;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${isSelected
                                            ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-800'
                                            : 'border-border hover:border-neutral-400 dark:hover:border-neutral-600'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`} />
                                        <span className={`text-sm font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {type.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        {errors.type && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.type}</p>
                        )}
                    </div>

                    {/* Message */}
                    <Textarea
                        label="Your Feedback *"
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Tell us what's on your mind..."
                        rows={5}
                        error={errors.message}
                    />

                    {/* Rating (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            How would you rate your experience? (Optional)
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRatingClick(star)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-8 h-8 ${formData.rating && star <= formData.rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-neutral-300 dark:text-neutral-600'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {formData.rating && (
                            <p className="mt-2 text-sm text-muted-foreground">
                                Rating: {formData.rating} out of 5 stars
                            </p>
                        )}
                    </div>

                    {/* General Error */}
                    {errors.general && (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.general}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={loading}
                        >
                            Submit Feedback
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
