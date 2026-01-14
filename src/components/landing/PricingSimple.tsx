'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/apiClient';

export function PricingSimple() {
    const [plans, setPlans] = useState<any[]>([]);

    useEffect(() => {
        fetchPlans();
    }, []);

    async function fetchPlans() {
        try {
            const data = await apiClient.get<any[]>('/api/payments/plans');
            if (data) setPlans(data);
        } catch (err) {
            console.error(err);
        }
    }

    // Filter for display: Free and Featured (or Lifetime)
    const freePlan = plans.find(p => p.code === 'FREE') || {
        name: 'Basic plan', price_inr: 0, features: ['Profile photo', '3 links', 'Default theme', 'QR code generation']
    };

    // Choose a premium highlight. 
    const premiumPlan = plans.find(p => p.is_featured) || plans.find(p => p.price_inr > 0);

    const displayPlans = [freePlan, premiumPlan].filter(Boolean);

    return (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {displayPlans.map((plan: any, index: number) => (
                <motion.div
                    key={plan.name || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`rounded-lg p-8 relative ${plan.is_featured || plan.price_inr > 0
                        ? 'bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-white shadow-lg'
                        : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700'
                        }`}
                >
                    {/* Badge */}
                    {plan.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-semibold px-4 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 whitespace-nowrap">
                                {plan.badge}
                            </span>
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Plan name */}
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{plan.name}</h3>

                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                            {plan.original_price_inr && (
                                <span className="text-lg text-neutral-400 dark:text-neutral-500 line-through">
                                    ₹{plan.original_price_inr}
                                </span>
                            )}
                            <span className="text-5xl font-bold text-neutral-900 dark:text-white">₹{plan.price_inr}</span>
                            {plan.billing_cycle && plan.billing_cycle !== 'ONE_TIME' && plan.billing_cycle !== 'LIFETIME' && (
                                <span className="text-neutral-600 dark:text-neutral-400">/ {plan.billing_cycle === 'MONTHLY' ? 'month' : 'year'}</span>
                            )}
                            {/* Handle Lifetime display text if needed */}
                            {(plan.billing_cycle === 'ONE_TIME' || plan.billing_cycle === 'LIFETIME') && plan.price_inr > 0 && (
                                <span className="text-neutral-600 dark:text-neutral-400">/ lifetime</span>
                            )}
                        </div>

                        {/* Features */}
                        <ul className="space-y-3">
                            {(plan.features || []).map((feature: string) => (
                                <li key={feature} className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-neutral-900 dark:text-white flex-shrink-0" strokeWidth={2} />
                                    <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA Button */}
                        <Link href="/signup" className="block">
                            <button
                                className={`w-full py-3 px-6 rounded-md font-medium transition-all duration-200 ${plan.is_featured || plan.price_inr > 0
                                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:-translate-y-0.5 active:scale-98'
                                    : 'bg-transparent border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white hover:-translate-y-0.5 active:scale-98'
                                    }`}
                            >
                                {plan.is_featured ? 'Get Early Access' : 'Get Started'}
                            </button>
                        </Link>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
