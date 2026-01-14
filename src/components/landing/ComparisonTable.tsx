import React from 'react';
import { Check, X, Minus } from 'lucide-react';

export function ComparisonTable() {
    const features = [
        { name: 'Cards', free: '1', pro: 'Unlimited', lifetime: 'Unlimited' },
        { name: 'Card Themes', free: 'Default', pro: 'All', lifetime: 'All' },
        { name: 'Custom Links', free: '1', pro: 'Unlimited', lifetime: 'Unlimited' },
        { name: 'QR Code', free: true, pro: true, lifetime: true },
        // { name: 'Username', free: 'Random', pro: 'Custom', lifetime: 'Custom' },
        { name: 'Analytics', free: 'Basic', pro: 'Complete', lifetime: 'Complete' },
        { name: 'Leads Access', free: false, pro: true, lifetime: true },
        { name: 'Branding Removal', free: false, pro: true, lifetime: true },
        { name: 'Priority Support', free: false, pro: true, lifetime: true },
        { name: 'Founder Badge', free: false, pro: false, lifetime: true, highlight: 'text-amber-500' },
    ];

    const renderCell = (value: string | boolean) => {
        if (value === true) return <Check className="w-5 h-5 text-green-500 mx-auto" />;
        if (value === false) return <X className="w-5 h-5 text-neutral-300 dark:text-neutral-700 mx-auto" />;
        return <span className="text-sm font-medium">{value}</span>;
    };

    return (
        <div className="mt-20 max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8 text-neutral-900 dark:text-white">Compare Plans</h3>

            <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                                <th className="py-4 px-6 text-left text-sm font-semibold text-neutral-600 dark:text-neutral-400 w-1/4">Feature</th>
                                <th className="py-4 px-6 text-center text-sm font-bold text-neutral-900 dark:text-white w-1/4">Free</th>
                                <th className="py-4 px-6 text-center text-sm font-bold text-blue-600 dark:text-blue-400 w-1/4">Pro</th>
                                <th className="py-4 px-6 text-center text-sm font-bold text-amber-600 dark:text-amber-400 w-1/4">Lifetime</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {features.map((feature, idx) => (
                                <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                    <td className={`py-4 px-6 text-sm font-medium text-neutral-700 dark:text-neutral-300 ${feature.highlight || ''}`}>
                                        {feature.name}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {renderCell(feature.free)}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {renderCell(feature.pro)}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {renderCell(feature.lifetime)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
