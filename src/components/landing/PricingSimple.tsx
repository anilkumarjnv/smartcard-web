'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
    {
        name: 'The Basics',
        price: '₹0',
        featured: false,
        features: [
            'Profile photo',
            '3 links',
            'Default theme',
            'QR code generation',
        ],
    },
    {
        name: 'Professional',
        price: '₹299',
        originalPrice: '₹799',
        period: 'lifetime',
        badge: 'Most Popular',
        featured: true,
        features: [
            'Portfolio section',
            'Analytics dashboard',
            'Custom QR codes',
            'No watermark',
            'All premium themes',
            'Priority support',
        ],
    },
];

export function PricingSimple() {
    return (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
                <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`rounded-lg p-8 relative ${plan.featured
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
                            {plan.originalPrice && (
                                <span className="text-lg text-neutral-400 dark:text-neutral-500 line-through">
                                    {plan.originalPrice}
                                </span>
                            )}
                            <span className="text-5xl font-bold text-neutral-900 dark:text-white">{plan.price}</span>
                            {plan.period && (
                                <span className="text-neutral-600 dark:text-neutral-400">/ {plan.period}</span>
                            )}
                        </div>

                        {/* Features */}
                        <ul className="space-y-3">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-neutral-900 dark:text-white flex-shrink-0" strokeWidth={2} />
                                    <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA Button */}
                        <Link href="/signup" className="block">
                            <button
                                className={`w-full py-3 px-6 rounded-md font-medium transition-all duration-200 ${plan.featured
                                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:-translate-y-0.5 active:scale-98'
                                    : 'bg-transparent border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white hover:-translate-y-0.5 active:scale-98'
                                    }`}
                            >
                                {plan.featured ? 'Get Early Access' : 'Get Started'}
                            </button>
                        </Link>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
