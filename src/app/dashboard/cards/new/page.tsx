// src/app/dashboard/cards/new/page.tsx
/**
 * Create Card Page
 * 
 * Form to create a new digital card.
 * Validates input using Zod schema before submitting.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form'; // Need to install this or use controlled inputs
import { apiClient } from '@/lib/apiClient';
import { Container } from '@/components/ui/Container';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { createCardSchema, type CreateCardFormData } from '@/lib/validators';
import type { Card as CardType } from '@/lib/api/types';

export default function CreateCardPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Simple form state management (could use react-hook-form for more complex forms)
    const [formData, setFormData] = useState<Partial<CreateCardFormData>>({
        slug: '',
        name: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Validate form data
            const validatedData = createCardSchema.pick({ slug: true, name: true }).parse(formData);

            // Submit to API
            const newCard = await apiClient.post<CardType>('/api/v1/cards', validatedData);

            // Redirect to editor
            router.push(`/dashboard/card/${newCard.id}/edit`);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to create card. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container size="sm">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Create New Card</h1>
                <p className="text-gray-600 mt-1">Start by choosing a unique link for your card.</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardBody className="space-y-6">
                        {error && (
                            <Alert variant="error" title="Error">
                                {error}
                            </Alert>
                        )}

                        <Input
                            label="Card Name"
                            placeholder="e.g. Personal, Work, Event"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            helperText="Internal name to help you identify this card."
                        />

                        <div>
                            <Input
                                label="Unique Link (Slug)"
                                placeholder="e.g. john-doe"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                                required
                                helperText="This will be your public URL: smartcard.app/your-slug"
                            />
                        </div>
                    </CardBody>

                    <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.back()}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isLoading}>
                            Create Card
                        </Button>
                    </div>
                </form>
            </Card>
        </Container>
    );
}
