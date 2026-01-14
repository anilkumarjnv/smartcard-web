'use client';

import React from 'react';
import { Modal } from '@/components/molecules/Modal';
import { Button } from '@/components/molecules/Button';
import { Check, Zap, Lock } from 'lucide-react';
import Link from 'next/link';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName?: string;
}

export function UpgradeModal({ isOpen, onClose, featureName }: UpgradeModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Unlock Pro Features" size="sm">
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">
                        {featureName ? `Upgrade to use ${featureName}` : "Upgrade to Pro"}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                        Get unlimited access to all features and remove limits.
                    </p>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Unlimited Cards</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Custom Themes & Fonts</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Unlimited Links</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Advanced Analytics & Leads</span>
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1" onClick={onClose}>
                        Maybe Later
                    </Button>
                    <Link href="/subscription" className="flex-1 block w-full" onClick={onClose}>
                        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 shadow-lg shadow-orange-500/20">
                            Upgrade Now <Zap className="w-4 h-4 ml-2 fill-current" />
                        </Button>
                    </Link>
                </div>
            </div>
        </Modal>
    );
}
